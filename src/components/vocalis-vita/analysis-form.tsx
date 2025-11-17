"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import {
  Mic,
  StopCircle,
  BrainCircuit,
  Loader2,
  RefreshCcw,
  Upload,
  FileImage,
  Video,
  Camera,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { analyzeHealth, type AnalysisState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import ResultsDisplay from './results-display';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: AnalysisState = {
  success: false,
};

const diseaseOptions = [
    'ALS (Amyotrophic Lateral Sclerosis)', 'ADHD (Attention-Deficit/Hyperactivity Disorder)', "Alzheimer's Disease", 'Anxiety Disorders', 'Asthma', 'Ataxia', 'Autism Spectrum Disorder', "Bell's Palsy", 'Bipolar Disorder', 'Bronchitis', 'COPD (Chronic Obstructive Pulmonary Disease)', 'Cerebral Palsy', 'Coronary Artery Disease', "Cushing's Syndrome", 'Cystic Fibrosis', 'Depression', 'Diabetes', 'Down Syndrome', 'Dysarthria', 'Dystonia', 'Epilepsy', 'Essential Tremor', 'Fibromyalgia', 'Fragile X Syndrome', "Guillain-Barré Syndrome", "Huntington's Disease", 'Hyperthyroidism', 'Hypothyroidism', 'Laryngeal Cancer', 'Lupus', 'Lyme Disease', 'Multiple Sclerosis', 'Muscular Dystrophy', 'Myasthenia Gravis', 'Narcolepsy', 'OCD (Obsessive-Compulsive Disorder)', 'PTSD (Post-Traumatic Stress Disorder)', "Parkinson's Disease", 'Pneumonia', 'Prader-Willi Syndrome', 'Respiratory Issues', 'Rheumatoid Arthritis', 'Schizophrenia', 'Sleep Apnea', 'Spasmodic Dysphonia', 'Stroke', 'Tourette Syndrome', 'Traumatic Brain Injury', 'Vocal Cord Paralysis', 'Williams Syndrome', 'Acoustic Neuroma', 'Aphonia', 'Asperger Syndrome', 'Blepharospasm', 'CADASIL', 'Cerebellar Ataxia', 'Chronic Fatigue Syndrome', 'Conversion Disorder', 'Cortical Basal Degeneration', 'Creutzfeldt-Jakob Disease', 'Dementia with Lewy Bodies', 'Dysphonia', 'Frontotemporal Dementia', 'Hashimoto\'s Thyroiditis', 'Kennedy\'s Disease', 'Laryngeal Dystonia', 'Machado-Joseph Disease', 'Meige Syndrome', 'Mitochondrial Disease', 'Motor Neuron Disease', 'Multiple System Atrophy', 'Oral Cancer', 'Oromandibular Dystonia', 'Palilalia', 'Paraneoplastic Syndromes', 'Pick\'s Disease', 'Post-Polio Syndrome', 'Primary Lateral Sclerosis', 'Progressive Supranuclear Palsy', 'Rett Syndrome', 'Sarcoidosis', 'Sjögren\'s Syndrome', 'Spinocerebellar Ataxia', 'Stiff Person Syndrome', 'Tardive Dyskinesia', 'Thyroid Eye Disease', 'Torticollis', 'Toxic Brain Injury', 'Vascular Dementia', 'Wilson\'s Disease'
];

const FormContext = React.createContext<{ faceDataUri: string; voiceDataUri: string; } | null>(null);

function useFormContext() {
    const context = React.useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const { faceDataUri, voiceDataUri } = useFormContext();
  
  return (
    <Button type="submit" disabled={pending || !faceDataUri || !voiceDataUri} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <BrainCircuit className="mr-2 h-4 w-4" />
          Run Analysis
        </>
      )}
    </Button>
  );
}


export function AnalysisForm({ onNewAnalysis }: { onNewAnalysis: () => void }) {
  const [state, formAction] = useActionState(analyzeHealth, initialState);
  const { toast } = useToast();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [faceDataUri, setFaceDataUri] = useState('');
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [voiceDataUri, setVoiceDataUri] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [diseaseContext, setDiseaseContext] = useState("Parkinson's Disease");
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  // Request camera permission
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    getCameraPermission();
    
    // Cleanup function to stop video stream
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFaceDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAudioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setVoiceDataUri(reader.result as string);
            setAudioURL(URL.createObjectURL(file));
        };
        reader.readAsDataURL(file);
    }
  };

  const captureFace = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUri = canvas.toDataURL('image/jpeg');
            setImagePreview(dataUri);
            setFaceDataUri(dataUri);
        }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setAudioURL(null);
      setVoiceDataUri('');

      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const audioChunks: Blob[] = [];
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setVoiceDataUri(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop the media stream tracks
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: 'destructive',
        title: 'Microphone Error',
        description: 'Could not access the microphone. Please check your browser permissions.',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  if (state.success) {
    return (
        <ResultsDisplay results={state} onNewAnalysis={onNewAnalysis} />
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>New Health Analysis</CardTitle>
        <CardDescription>
          Provide a facial image and a voice sample to begin the analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <FormContext.Provider value={{faceDataUri, voiceDataUri}}>
          <form action={formAction} className="flex-grow flex flex-col gap-4">
            <input type="hidden" name="faceDataUri" value={faceDataUri} />
            <input type="hidden" name="voiceDataUri" value={voiceDataUri} />
            <input type="hidden" name="diseaseContext" value={diseaseContext} />

            <div className="grid gap-2">
              <Label htmlFor="disease">Disease Context</Label>
              <Select name="diseaseContextSelect" onValueChange={setDiseaseContext} defaultValue={diseaseContext}>
                <SelectTrigger id="disease">
                  <SelectValue placeholder="Select a disease to analyze" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-72">
                    {diseaseOptions.map((disease) => (
                      <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Facial Analysis</Label>
                 <Tabs defaultValue="live" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="live"><Video className="mr-2"/>Live</TabsTrigger>
                    <TabsTrigger value="upload"><Upload className="mr-2"/>Upload</TabsTrigger>
                  </TabsList>
                  <TabsContent value="live">
                    <div className="relative aspect-square w-full bg-muted rounded-lg flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-border transition-colors p-2 gap-2">
                      <video ref={videoRef} className="w-full h-full object-cover rounded-md" autoPlay muted playsInline />
                      <canvas ref={canvasRef} className="hidden" />
                      { hasCameraPermission === false && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Alert variant="destructive" className="w-4/5">
                              <AlertTitle>Camera Access Required</AlertTitle>
                              <AlertDescription>Please allow camera access.</AlertDescription>
                          </Alert>
                        </div>
                      )}
                       {imagePreview && <Image src={imagePreview} alt="Capture preview" fill objectFit="cover" className={cn("absolute", faceDataUri !== imagePreview && "opacity-50")} />}
                      <Button type="button" onClick={captureFace} disabled={!hasCameraPermission} className="absolute bottom-4 z-10">
                          <Camera className="mr-2" /> Capture Face
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="upload">
                      <div 
                        className="relative aspect-square w-full bg-muted rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        {imagePreview ? (
                          <Image src={imagePreview} alt="Face preview" fill objectFit="cover" />
                        ) : (
                          <div className="text-center text-muted-foreground p-4">
                            <FileImage className="mx-auto h-12 w-12" />
                            <p className="mt-2 text-sm">Click to upload photo</p>
                          </div>
                        )}
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="grid gap-2">
                <Label>Vocal Analysis</Label>
                 <Tabs defaultValue="live" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="live"><Mic className="mr-2"/>Record</TabsTrigger>
                    <TabsTrigger value="upload"><Upload className="mr-2"/>Upload</TabsTrigger>
                  </TabsList>
                  <TabsContent value="live">
                    <div className="relative aspect-square w-full bg-muted rounded-lg flex flex-col items-center justify-center gap-4 p-4">
                      {audioURL ? (
                          <audio src={audioURL} controls className="w-full" />
                      ) : (
                          <div className={cn("text-center text-muted-foreground", isRecording && 'text-primary')}>
                              <Mic className="mx-auto h-12 w-12" />
                              <p className="mt-2 text-sm">{isRecording ? "Recording..." : "Ready to record"}</p>
                          </div>
                      )}
                      
                      {isRecording ? (
                        <Button type="button" onClick={stopRecording} variant="destructive">
                          <StopCircle className="mr-2 h-4 w-4" />
                          Stop Recording
                        </Button>
                      ) : (
                        <Button type="button" onClick={startRecording}>
                          <Mic className="mr-2 h-4 w-4" />
                          Start Recording
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="upload">
                      <div 
                        className="relative aspect-square w-full bg-muted rounded-lg flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors p-4 gap-4"
                        onClick={() => audioInputRef.current?.click()}
                      >
                       {audioURL ? (
                          <div className="text-center">
                              <audio src={audioURL} controls className="w-full" />
                               <p className="mt-2 text-sm text-muted-foreground">Click to upload another file</p>
                          </div>
                      ) : (
                          <div className="text-center text-muted-foreground p-4">
                            <Upload className="mx-auto h-12 w-12" />
                            <p className="mt-2 text-sm">Click to upload audio file</p>
                          </div>
                        )}
                        <input
                          ref={audioInputRef}
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioFileChange}
                          className="hidden"
                        />
                      </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="mt-auto pt-4">
              <SubmitButton />
            </div>
          </form>
        </FormContext.Provider>
      </CardContent>
    </Card>
  );
}
