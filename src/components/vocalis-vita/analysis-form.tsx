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
  HeartPulse,

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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { analyzeHealth, type AnalysisState, type PerformanceMetric } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import ResultsDisplay from './results-display';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: AnalysisState = {
  success: false,
};

const diseaseOptions = [
  'None',
  'Acoustic Neuroma',
  'Acromegaly',
  'Acute Flaccid Myelitis',
  'Acute Lymphoblastic Leukemia (ALL)',
  'Acute Myeloid Leukemia (AML)',
  'ADHD (Attention-Deficit/Hyperactivity Disorder)',
  'Adrenal Cancer',
  'Adrenoleukodystrophy',
  'Agoraphobia',
  'Alagille Syndrome',
  'ALS (Amyotrophic Lateral Sclerosis)',
  "Alzheimer's Disease",
  'Amnesia',
  'Anemia',
  'Angelman Syndrome',
  'Ankylosing Spondylitis',
  'Anorexia Nervosa',
  'Anxiety Disorders',
  'Aphasia',
  'Aphonia',
  'Apraxia',
  'Arachnoiditis',
  'Arnold-Chiari Malformation',
  'Asperger Syndrome',
  'Asthma',
  'Astrocytoma',
  'Ataxia',
  'Atrial Fibrillation',
  'Autism Spectrum Disorder',
  'Autoimmune Hepatitis',
  'Autoimmune Pancreatitis',
  'B-cell Lymphoma',
  "Behcet's Disease",
  "Bell's Palsy",
  'Bile Duct Cancer',
  'Binge Eating Disorder',
  'Bipolar Disorder',
  'Bladder Cancer',
  'Blepharospasm',
  'Bone Cancer',
  'Brain Aneurysm',
  'Brain Cancer',
  'Breast Cancer',
  'Bronchiectasis',
  'Bronchitis',
  'Bruxism',
  'Bulimia Nervosa',
  'CADASIL',
  'Cancer',
  'Candidiasis',
  'Cardiomyopathy',
  'Carpal Tunnel Syndrome',
  'Celiac Disease',
  'Cerebellar Ataxia',
  'Cerebral Palsy',
  'Cervical Cancer',
  'Cervical Dystonia',
  'Charcot-Marie-Tooth Disease',
  'Chest Pain',
  'Chiari Malformation',
  'Chickenpox',
  'Chlamydia',
  'Cholangiocarcinoma',
  'Cholecystitis',
  'Cholera',
  'Cholesteatoma',
  'Chondrosarcoma',
  'Chordoma',
  'Chorea',
  'Chronic Fatigue Syndrome',
  'Chronic Inflammatory Demyelinating Polyneuropathy (CIDP)',
  'Chronic Kidney Disease',
  'Chronic Lymphocytic Leukemia (CLL)',
  'Chronic Myeloid Leukemia (CML)',
  'Chronic Pain',
  'Cirrhosis',
  'Cluster Headaches',
  'Coarctation of the Aorta',
  'Cognitive Dysfunction',
  'Cold Sore',
  'Colitis',
  'Colon Cancer',
  'Common Cold',
  'Congenital Heart Disease',
  'Congestive Heart Failure',
  'Conversion Disorder',
  'COPD (Chronic Obstructive Pulmonary Disease)',
  'Coronary Artery Disease',
  'Cortical Basal Degeneration',
  "Creutzfeldt-Jakob Disease",
  "Crohn's Disease",
  'Croup',
  "Cushing's Syndrome",
  'Cyclothymic Disorder',
  'Cystic Fibrosis',
  'Cystitis',
  'Cytomegalovirus (CMV) Infection',
  'Dementia',
  'Dementia with Lewy Bodies',
  'Dengue Fever',
  'Depression',
  'Dermatitis',
  'Dermatomyositis',
  'Diabetes',
  'Diabetic Ketoacidosis',
  'Diabetic Nephropathy',
  'Diabetic Neuropathy',
  'Diabetic Retinopathy',
  'Diphtheria',
  'Disruptive Mood Dysregulation Disorder',
  'Dissociative Identity Disorder',
  'Diverticulitis',
  'Down Syndrome',
  'Dry Mouth',
  'Dupuytren\'s Contracture',
  'Dysarthria',
  'Dysautonomia',
  'Dyslexia',
  'Dysphagia',
  'Dysphonia',
  'Dystonia',
  'Ear Infection',
  'Eating Disorders',
  'Ebola',
  'Eczema',
  'Edema',
  'Ehlers-Danlos Syndrome',
  'Eisenmenger Syndrome',
  'Emphysema',
  'Encephalitis',
  'Endocarditis',
  'Endometrial Cancer',
  'Endometriosis',
  'Eosinophilic Esophagitis',
  'Ependymoma',
  'Epidermolysis Bullosa',
  'Epilepsy',
  'Erectile Dysfunction',
  'Erythromelalgia',
  'Esophageal Cancer',
  'Essential Tremor',
  'Ewing Sarcoma',
  'Excoriation (Skin-Picking) Disorder',
  'Eye Cancer',
  'Fabry Disease',
  'Factor V Leiden',
  'Familial Adenomatous Polyposis',
  'Fatty Liver Disease',
  'Febrile Seizures',
  'Fecal Incontinence',
  'Female Infertility',
  'Fetal Alcohol Syndrome',
  'Fibrocystic Breast Disease',
  'Fibromyalgia',
  'Fibrosarcoma',
  'Fifth Disease',
  'Food Allergy',
  'Food Poisoning',
  'Foot Drop',
  'Fragile X Syndrome',
  'Frontotemporal Dementia',
  'Frozen Shoulder',
  'Fuchs\' Dystrophy',
  'Galactorrhea',
  'Gallbladder Cancer',
  'Gallstones',
  'Ganglion Cyst',
  'Gangliosidosis',
  'Gas',
  'Gastritis',
  'Gastroenteritis',
  'Gastroesophageal Reflux Disease (GERD)',
  'Gastroparesis',
  'Gaucher Disease',
  'Generalized Anxiety Disorder (GAD)',
  'Genital Herpes',
  'Genital Warts',
  'Gestational Diabetes',
  'Giant Cell Arteritis',
  'Giardiasis',
  'Gilbert Syndrome',
  'Gingivitis',
  'Glaucoma',
  'Glioblastoma',
  'Glomerulonephritis',
  'Glossopharyngeal Neuralgia',
  'Goiter',
  'Gonorrhea',
  'Goodpasture Syndrome',
  'Gout',
  'Grand Mal Seizure',
  'Granulomatosis with Polyangiitis',
  "Graves' Disease",
  'Greenstick Fracture',
  "Guillain-Barré Syndrome",
  'H1N1 Flu (Swine Flu)',
  'HIV/AIDS',
  'Hairy Cell Leukemia',
  'Hand, Foot, and Mouth Disease',
  'Hantavirus Pulmonary Syndrome',
  'Hashimoto\'s Thyroiditis',
  'Hay Fever',
  'Head and Neck Cancer',
  'Head Lice',
  'Headaches',
  'Hearing Loss',
  'Heart Attack',
  'Heart Block',
  'Heart Disease',
  'Heart Failure',
  'Heart Murmur',
  'Heart Palpitations',
  'Heat Stroke',
  'Hemangioma',
  'Hemochromatosis',
  'Hemophilia',
  'Hemorrhoids',
  'Henoch-Schonlein Purpura',
  'Hepatitis A',
  'Hepatitis B',
  'Hepatitis C',
  'Hepatitis D',
  'Hepatitis E',
  'Hepatocellular Carcinoma',
  'Hereditary Hemorrhagic Telangiectasia',
  'Hernia',
  'Herniated Disk',
  'Herpes Simplex Virus',
  'Hiatal Hernia',
  'Hidradenitis Suppurativa',
  'High Blood Pressure',
  'High Cholesterol',
  'Hirschsprung\'s Disease',
  'Histoplasmosis',
  'Hoarding Disorder',
  "Hodgkin's Lymphoma",
  'Holoprosencephaly',
  'Hormone Imbalance',
  'Horner Syndrome',
  'Human Papillomavirus (HPV) Infection',
  "Huntington's Disease",
  'Hydrocephalus',
  'Hydronephrosis',
  'Hypercalcemia',
  'Hyperemesis Gravidarum',
  'Hyperglycemia',
  'Hyperhidrosis',
  'Hyperkalemia',
  'Hypernatremia',
  'Hyperparathyroidism',
  'Hypersomnia',
  'Hypertension',
  'Hyperthyroidism',
  'Hypertrophic Cardiomyopathy',
  'Hyperventilation Syndrome',
  'Hypoactive Sexual Desire Disorder',
  'Hypocalcemia',
  'Hypochondriasis',
  'Hypoglycemia',
  'Hypokalemia',
  'Hyponatremia',
  'Hypoparathyroidism',
  'Hypopituitarism',
  'Hypotension',
  'Hypothermia',
  'Hypothyroidism',
  'Hypovolemic Shock',
  'Hypoxia',
  'Hysteria',
  'Ichthyosis',
  'Idiopathic Hypersomnia',
  'Idiopathic Pulmonary Fibrosis',
  'IgA Nephropathy',
  'Illness Anxiety Disorder',
  'Immune Thrombocytopenia (ITP)',
  'Impetigo',
  'Impotence',
  'Inattention',
  'Inclusion Body Myositis',
  'Incontinence',
  'Indigestion',
  'Infantile Spasms',
  'Infectious Mononucleosis',
  'Infertility',
  'Inflammatory Bowel Disease (IBD)',
  'Influenza (Flu)',
  'Ingrown Hair',
  'Ingrown Toenails',
  'Inguinal Hernia',
  'Insomnia',
  'Insulin Resistance',
  'Intellectual Disability',
  'Interstitial Cystitis',
  'Interstitial Lung Disease',
  'Intestinal Obstruction',
  'Intracranial Hypertension',
  'Intussusception',
  'Iritis',
  'Iron Deficiency Anemia',
  'Irritable Bowel Syndrome (IBS)',
  'Ischemic Colitis',
  'Jaundice',
  'Jaw Pain',
  'Jellyfish Stings',
  'Jet Lag',
  'Jock Itch',
  'Joint Pain',
  'Joubert Syndrome',
  'Juvenile Idiopathic Arthritis',
  'Kaposi Sarcoma',
  'Kawasaki Disease',
  'Keloids',
  'Kennedy\'s Disease',
  'Keratitis',
  'Keratoconus',
  'Keratosis Pilaris',
  'Kidney Cancer',
  'Kidney Failure',
  'Kidney Stones',
  'Kleine-Levin Syndrome',
  'Klinefelter Syndrome',
  'Klippel-Trenaunay Syndrome',
  'Knee Pain',
  'Krabbe Disease',
  'Kyphosis',
  "L'hermitte's Sign",
  'Labyrinthitis',
  'Lactose Intolerance',
  'Lambert-Eaton Myasthenic Syndrome',
  'Landau-Kleffner Syndrome',
  'Language Disorders',
  'Laryngeal Cancer',
  'Laryngeal Dystonia',
  'Laryngitis',
  'Laryngomalacia',
  'Larynx Cancer',
  'Latex Allergy',
  'Lead Poisoning',
  'Learning Disabilities',
  'Left Ventricular Hypertrophy',
  'Legg-Calve-Perthes Disease',
  'Legionnaires\' Disease',
  'Leigh Syndrome',
  'Leiomyosarcoma',
  'Leishmaniasis',
  'Lennox-Gastaut Syndrome',
  'Leprosy',
  'Leptospirosis',
  'Lesch-Nyhan Syndrome',
  'Leukemia',
  'Leukocytoclastic Vasculitis',
  'Leukodystrophy',
  'Leukoplakia',
  'Lewy Body Dementia',
  'Lice',
  'Lichen Planus',
  'Lichen Sclerosus',
  'Lissencephaly',
  'Listeriosis',
  'Liver Cancer',
  'Liver Disease',
  'Lockjaw',
  'Long QT Syndrome',
  'Loose Anagen Syndrome',
  'Low Blood Pressure (Hypotension)',
  'Low Blood Sugar (Hypoglycemia)',
  'Low Sex Drive in Women',
  'Lumbar Spinal Stenosis',
  'Lung Cancer',
  'Lupus',
  'Lyme Disease',
  'Lymphedema',
  'Lymphocytic Colitis',
  'Lymphoma',
  'Lynch Syndrome',
  'Machado-Joseph Disease',
  'Macular Degeneration',
  'Macular Edema',
  'Macular Hole',
  'Macular Pucker',
  'Mad Cow Disease',
  'Major Depressive Disorder',
  'Malaria',
  'Male Infertility',
  'Malignant Hyperthermia',
  'Malignant Mesothelioma',
  'Mallory-Weiss Tear',
  'Malnutrition',
  'Mania',
  'Marfan Syndrome',
  'Mastitis',
  'Mastocytosis',
  'Mastoiditis',
  'Measles',
  'Meconium Aspiration Syndrome',
  'Median Arcuate Ligament Syndrome (MALS)',
  'Mediterranean Fever',
  'Medulloblastoma',
  'Megaloblastic Anemia',
  'Meige Syndrome',
  'Meigs Syndrome',
  'Melanoma',
  'Melasma',
  'Membranous Nephropathy',
  'Meniere\'s Disease',
  'Meningioma',
  'Meningitis',
  'Menopause',
  'Menorrhagia',
  'Meralgia Paresthetica',
  'Merkel Cell Carcinoma',
  'Mesenteric Ischemia',
  'Mesenteric Lymphadenitis',
  'Mesothelioma',
  'Metabolic Syndrome',
  'Metachromatic Leukodystrophy',
  'Metatarsalgia',
  'Methicillin-resistant Staphylococcus aureus (MRSA)',
  'Microcephaly',
  'Microscopic Colitis',
  'Migraine',
  'Mild Cognitive Impairment (MCI)',
  'Milia',
  'Milk Allergy',
  'Minimal Change Disease',
  'Miscarriage',
  'Mitochondrial Disease',
  'Mitral Valve Prolapse',
  'Mitral Valve Regurgitation',
  'Mitral Valve Stenosis',
  'Mixed Connective Tissue Disease',
  'Moebius Syndrome',
  'Molar Pregnancy',
  'Mold Allergy',
  'Molluscum Contagiosum',
  'Mononucleosis',
  'Mood Disorders',
  'Morning Sickness',
  'Morphea',
  'Morton\'s Neuroma',
  'Motor Neuron Disease',
  'Mountain Sickness',
  'Mouth Cancer',
  'Moyamoya Disease',
  'Mucositis',
  'Multifocal Motor Neuropathy',
  'Multiple Endocrine Neoplasia, type 1 (MEN 1)',
  'Multiple Endocrine Neoplasia, type 2 (MEN 2)',
  'Multiple Myeloma',
  'Multiple Sclerosis',
  'Multiple System Atrophy',
  'Mumps',
  'Munchausen Syndrome',
  'Muscle Cramps',
  'Muscle Strain',
  'Muscular Dystrophy',
  'Myasthenia Gravis',
  'Mycosis Fungoides',
  'Myelodysplastic Syndromes',
  'Myelofibrosis',
  'Myeloma',
  'Myocarditis',
  'Myoclonus',
  'Myofascial Pain Syndrome',
  'Myopathy',
  'Myositis',
  'Myotonia Congenita',
  'Narcolepsy',
  'Nasal Polyps',
  'Nasopharyngeal Carcinoma',
  'Neck Pain',
  'Necrotizing Fasciitis',
  'Nephritic Syndrome',
  'Nephrogenic Systemic Fibrosis',
  'Nephrotic Syndrome',
  'Neuroblastoma',
  'Neurocardiogenic Syncope',
  'Neurodermatitis',
  'Neuroendocrine Tumors',
  'Neurofibromatosis',
  'Neurogenic Bladder',
  'Neuromyelitis Optica',
  'Neuropathy',
  'Neutropenia',
  'Niemann-Pick Disease',
  'Night blindness',
  'Nightmare Disorder',
  'Nocturia',
  'Nonalcoholic Fatty Liver Disease (NAFLD)',
  'Non-Hodgkin\'s Lymphoma',
  'Noonan Syndrome',
  'Norovirus Infection',
  'Nosebleed',
  'OCD (Obsessive-Compulsive Disorder)',
  'Obesity',
  'Obsessive-Compulsive Personality Disorder',
  'Obstructive Sleep Apnea',
  'Occupational Asthma',
  'Ocular Hypertension',
  'Ocular Melanoma',
  'Ocular Rosacea',
  'Odontoid Fracture',
  'Oligodendroglioma',
  'Onychomycosis',
  'Oppositional Defiant Disorder (ODD)',
  'Optic Neuritis',
  'Oral Cancer',
  'Oral Thrush',
  'Orbital Cellulitis',
  'Orchitis',
  'Oromandibular Dystonia',
  'Orthostatic Hypotension',
  'Osgood-Schlatter Disease',
  'Osteoarthritis',
  'Osteochondritis Dissecans',
  'Osteogenesis Imperfecta',
  'Osteoma',
  'Osteomalacia',
  'Osteomyelitis',
  'Osteonecrosis',
  'Osteopenia',
  'Osteopetrosis',
  'Osteoporosis',
  'Osteosarcoma',
  'Otitis Externa',
  'Otitis Media',
  'Otosclerosis',
  'Ovarian Cancer',
  'Ovarian Cysts',
  'Overactive Bladder',
  'Paget\'s Disease of Bone',
  'Paget\'s Disease of the Breast',
  'Pain',
  'Palilalia',
  'Pancreatic Cancer',
  'Pancreatitis',
  'Panic Attacks',
  'Panic Disorder',
  'Panniculitis',
  'Papilledema',
  'Paraganglioma',
  'Paralysis',
  'Paraneoplastic Syndromes',
  'Paranoid Personality Disorder',
  'Paraphilia',
  'Paraplegia',
  'Parasomnia',
  'Parathyroid Cancer',
  'Paresthesia',
  "Parkinson's Disease",
  'Paronychia',
  'Parotid Tumors',
  'Paroxysmal Supraventricular Tachycardia (PSVT)',
  'Parry-Romberg Syndrome',
  'Patellofemoral Pain Syndrome',
  'Patent Ductus Arteriosus (PDA)',
  'Patent Foramen Ovale',
  'Peanut Allergy',
  'Pectus Carinatum',
  'Pectus Excavatum',
  'Pediculosis',
  'Pedophilia',
  'Pelvic Inflammatory Disease (PID)',
  'Pemphigus',
  'Peyronie\'s Disease',
  'Plantar Fasciitis',
  'Pneumonia',
  'Post-Traumatic Stress Disorder (PTSD)',
  'Prader-Willi Syndrome',
  'Primary Lateral Sclerosis',
  'Progressive Supranuclear Palsy',
  'PTSD (Post-Traumatic Stress Disorder)',
  'Rett Syndrome',
  'Respiratory Issues',
  'Rheumatoid Arthritis',
  'Schizophrenia',
  'Sleep Apnea',
  'Spasmodic Dysphonia',
  'Spinocerebellar Ataxia',
  'Stiff Person Syndrome',
  'Stroke',
  'Tardive Dyskinesia',
  'Tourette Syndrome',
  'Traumatic Brain Injury',
  'Vocal Cord Paralysis',
  'Williams Syndrome',
  'Wilson\'s Disease'
];

const FormContext = React.createContext<{ faceDataUri: string; voiceDataUri: string; diseaseContext: string } | null>(null);


function useFormContext() {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

function SubmitButton() {

  const { pending } = useFormStatus();
  const { faceDataUri, voiceDataUri, diseaseContext } = useFormContext();

  const isGeneralCheckup = diseaseContext === 'None';
  const icon = isGeneralCheckup ? <HeartPulse className="mr-2 h-4 w-4" /> : <BrainCircuit className="mr-2 h-4 w-4" />;
  const text = isGeneralCheckup ? 'General Checkup' : 'Run Analysis';

  return (
    <Button type="submit" disabled={pending || !faceDataUri || !voiceDataUri} className="w-full">

      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          {icon}
          {text}
        </>
      )}
    </Button>
  );
}


export function AnalysisForm({ onNewAnalysis, onAnalysisSuccess }: { onNewAnalysis: () => void, onAnalysisSuccess: (metrics: PerformanceMetric[]) => void }) {
  const [state, formAction] = useActionState(analyzeHealth, initialState);
  const { toast } = useToast();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [faceDataUri, setFaceDataUri] = useState('');
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [voiceDataUri, setVoiceDataUri] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [diseaseContext, setDiseaseContext] = useState("None");
  const [open, setOpen] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const [cameraError, setCameraError] = useState<string | null>(null);
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
    if (state?.success && state.performanceMetrics) {
      // Save to history
      const historyItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        diseaseContext: state.prediction === 'Healthy' ? 'General Checkup' : (state.prediction || diseaseContext),
        prediction: state.prediction,
        metrics: state.performanceMetrics
      };

      const stored = localStorage.getItem('analysis_history');
      const history = stored ? JSON.parse(stored) : [];
      localStorage.setItem('analysis_history', JSON.stringify([...history, historyItem]));

      onAnalysisSuccess(state.performanceMetrics);
    }
  }, [state, toast, onAnalysisSuccess]);

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      setCameraError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      setCameraError(error instanceof Error ? error.message : 'Unknown camera error');
    }
  };

  // Request camera permission
  useEffect(() => {
    enableCamera();

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
      <ResultsDisplay results={state} onNewAnalysis={onNewAnalysis} diseaseContext={diseaseContext} />
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle> Health Analysis</CardTitle>
        <CardDescription>
          Provide a facial image and a voice sample to begin the analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <FormContext.Provider value={{ faceDataUri, voiceDataUri, diseaseContext }}>
          <form action={formAction} className="flex-grow flex flex-col gap-4">
            <input type="hidden" name="faceDataUri" value={faceDataUri} />
            <input type="hidden" name="voiceDataUri" value={voiceDataUri} />
            <input type="hidden" name="diseaseContext" value={diseaseContext} />

            <div className="grid gap-2">
              <Label htmlFor="disease">Disease Context</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {diseaseContext
                      ? diseaseOptions.find((disease) => disease === diseaseContext)
                      : "Select a disease to analyze"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="Search disease..." />
                    <CommandList>
                      <CommandEmpty>No disease by that name found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-72">
                          {diseaseOptions.map((disease) => (
                            <CommandItem
                              key={disease}
                              value={disease}
                              onSelect={(currentValue) => {
                                setDiseaseContext(currentValue === diseaseContext ? "None" : currentValue)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  diseaseContext === disease ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {disease}
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Facial Analysis</Label>
                <Tabs defaultValue="live" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="live"><Video className="mr-2" />Live</TabsTrigger>
                    <TabsTrigger value="upload"><Upload className="mr-2" />Upload</TabsTrigger>
                  </TabsList>
                  <TabsContent value="live">
                    <div className="relative aspect-square w-full bg-muted rounded-lg flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-border transition-colors p-2 gap-2">
                      <video ref={videoRef} className="w-full h-full object-cover rounded-md" autoPlay muted playsInline />
                      <canvas ref={canvasRef} className="hidden" />
                      {hasCameraPermission === false && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                          <Alert variant="destructive" className="w-4/5 max-w-md">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription className="flex flex-col gap-2 mt-2">
                              <p>Please allow camera access to use this feature.</p>
                              {cameraError && <p className="text-xs font-mono bg-black/20 p-1 rounded text-red-200">Error: {cameraError}</p>}
                              <Button size="sm" variant="outline" onClick={enableCamera} className="w-full mt-2 bg-background/20 hover:bg-background/40 border-white/20 text-white">
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Retry Camera
                              </Button>
                            </AlertDescription>
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
                    <TabsTrigger value="live"><Mic className="mr-2" />Record</TabsTrigger>
                    <TabsTrigger value="upload"><Upload className="mr-2" />Upload</TabsTrigger>
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
