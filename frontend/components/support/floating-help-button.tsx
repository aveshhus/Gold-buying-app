'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, MessageCircle, Phone, Mail, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface FloatingHelpButtonProps {
  currentSection?: string;
}

export default function FloatingHelpButton({ currentSection }: FloatingHelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickHelp, setShowQuickHelp] = useState(false);
  const router = useRouter();

  const quickHelpItems = [
    {
      icon: BookOpen,
      label: 'Help Center',
      action: () => {
        router.push('/dashboard?section=support');
        setIsOpen(false);
      },
    },
    {
      icon: MessageCircle,
      label: 'Live Chat',
      action: () => {
        toast.info('Live chat coming soon! Use callback or email for now.');
        setIsOpen(false);
      },
    },
    {
      icon: Phone,
      label: 'Request Callback',
      action: () => {
        toast.success('Callback requested! Our team will call you within 30 minutes.');
        setIsOpen(false);
      },
    },
    {
      icon: Mail,
      label: 'Email Support',
      action: () => {
        window.location.href = 'mailto:support@goldsilver.com';
        setIsOpen(false);
      },
    },
  ];

  const contextualHelp: Record<string, string> = {
    portfolio: 'View your gold and silver holdings, current values, and purchase history in the Portfolio section.',
    purchase: 'Buy gold or silver by selecting the metal type, quantity, and completing KYC verification.',
    charts: 'Monitor price trends with interactive charts. Switch between different timeframes to analyze market movements.',
    alerts: 'Set price alerts to get notified when gold or silver prices reach your target. Create alerts for any metal type.',
    analytics: 'View detailed analytics including total invested, holdings, monthly trends, and portfolio distribution.',
    payments: 'Track all your payment transactions, mark payments as completed, and view payment history.',
    transactions: 'View complete transaction ledger with search and filter options. Export your transactions as CSV or PDF.',
    deliveries: 'Get delivery of your purchased gold/silver. Use OTP verification when picking up from the store.',
    security: 'Manage your account security including 2FA, device management, sessions, and activity logs.',
    profile: 'View and update your profile information, KYC status, and account details.',
  };

  const currentHelp = currentSection ? contextualHelp[currentSection] : null;

  return (
    <>
      {/* Floating Help Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.5 }}
      >
        <AnimatePresence>
          {!isOpen ? (
            <motion.button
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
            >
              <HelpCircle className="h-6 w-6" />
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-background border rounded-lg shadow-2xl p-4 w-80"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Need Help?</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {currentHelp && (
                <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground">{currentHelp}</p>
                </div>
              )}

              <div className="space-y-2">
                {quickHelpItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={item.action}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors text-left"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  router.push('/dashboard?section=support');
                  setIsOpen(false);
                }}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View Full Help Center
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>
    </>
  );
}
