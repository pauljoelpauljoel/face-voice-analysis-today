"use client";

import React, { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History, Trash2, Clock, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export type HistoryItem = {
    id: string;
    timestamp: number;
    diseaseContext: string;
    prediction: string;
    metrics: { metric: string; value: number }[];
};

export function HistorySheet() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const stored = localStorage.getItem('analysis_history');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    // Sort by newest first
                    setHistory(parsed.sort((a: HistoryItem, b: HistoryItem) => b.timestamp - a.timestamp));
                } catch (e) {
                    console.error("Failed to parse history", e);
                }
            }
        }
    }, [isOpen]);

    const clearHistory = () => {
        localStorage.removeItem('analysis_history');
        setHistory([]);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                    <History className="mr-2 h-4 w-4" />
                    History
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <div className="flex items-center justify-between">
                        <SheetTitle>Analysis History</SheetTitle>
                        {history.length > 0 && (
                            <Button variant="ghost" size="icon" onClick={clearHistory} title="Clear History">
                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                        )}
                    </div>
                    <SheetDescription>
                        View your past analysis reports and predictions.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-100px)] pr-4 mt-4">
                    <div className="flex flex-col gap-4">
                        {history.length === 0 ? (
                            <div className="text-center text-muted-foreground py-10">
                                <History className="mx-auto h-12 w-12 opacity-20 mb-2" />
                                <p>No history found.</p>
                            </div>
                        ) : (
                            history.map((item) => (
                                <Card key={item.id} className="bg-muted/50">
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-base font-medium text-primary">
                                                {item.diseaseContext}
                                            </CardTitle>
                                            <span className="text-xs text-muted-foreground flex items-center bg-background px-2 py-1 rounded-full border">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                {format(item.timestamp, 'MMM d, yyyy HH:mm')}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2">
                                        <div className="grid gap-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium">Prediction:</span>
                                                <span className="text-sm">{item.prediction}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {item.metrics.slice(0, 2).map((m) => (
                                                    <div key={m.metric} className="bg-background p-2 rounded text-xs border">
                                                        <span className="text-muted-foreground block">{m.metric}</span>
                                                        <span className="font-mono font-bold">{m.value}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
