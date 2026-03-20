'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Gold & Silver Platform! 🎉',
    description:
      'Let\'s take a quick tour to help you get started. You can skip this anytime.',
  },
  {
    id: 'portfolio',
    title: 'Track Your Portfolio',
    description:
      'View all your gold and silver holdings in one place. See real-time values and track your investments.',
  },
  {
    id: 'prices',
    title: 'Live Price Charts',
    description:
      'Monitor price trends with interactive charts. View historical data and analyze market movements.',
  },
  {
    id: 'alerts',
    title: 'Price Alerts',
    description:
      'Set alerts to get notified when prices reach your target. Never miss a buying opportunity.',
  },
  {
    id: 'purchase',
    title: 'Easy Purchasing',
    description:
      'Buy gold and silver at live market prices. Complete KYC verification and make secure purchases.',
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    description:
      'Start exploring the platform. If you need help, check the help section or contact support.',
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if user has seen tour before
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenTour', 'true');
    setShowTour(false);
    onComplete();
  };

  if (!showTour) return null;

  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={handleSkip}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="relative shadow-2xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleSkip}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                {!isFirstStep && (
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentStep + 1) / tourSteps.length) * 100}%`,
                      }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{step.description}</p>
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <div className="flex gap-2">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-primary'
                          : index < currentStep
                          ? 'bg-primary/50'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <Button onClick={handleNext}>
                  {isLastStep ? (
                    <>
                      Get Started
                      <Check className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
