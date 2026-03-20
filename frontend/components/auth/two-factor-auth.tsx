'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Smartphone, Key, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TwoFactorAuthProps {
  onComplete: () => void;
}

export default function TwoFactorAuth({ onComplete }: TwoFactorAuthProps) {
  const [step, setStep] = useState<'method' | 'otp' | 'authenticator' | 'complete'>('method');
  const [method, setMethod] = useState<'sms' | 'email' | 'authenticator' | null>(null);
  const [otp, setOtp] = useState('');
  const [authenticatorCode, setAuthenticatorCode] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleMethodSelect = (selectedMethod: 'sms' | 'email' | 'authenticator') => {
    setMethod(selectedMethod);
    if (selectedMethod === 'authenticator') {
      // Generate QR code for authenticator
      setQrCode('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UVJDb2RlPC90ZXh0Pjwvc3ZnPg==');
      setStep('authenticator');
    } else {
      // Send OTP
      toast.success(`OTP sent to your ${selectedMethod === 'sms' ? 'phone' : 'email'}`);
      setStep('otp');
    }
  };

  const handleOTPVerify = () => {
    if (otp.length === 6) {
      toast.success('2FA enabled successfully!');
      setStep('complete');
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      toast.error('Please enter a valid 6-digit OTP');
    }
  };

  const handleAuthenticatorVerify = () => {
    if (authenticatorCode.length === 6) {
      toast.success('Authenticator verified successfully!');
      setStep('complete');
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      toast.error('Please enter a valid 6-digit code');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-primary-600" />
          <CardTitle>Enable Two-Factor Authentication</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {step === 'method' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Add an extra layer of security to your account
            </p>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
                onClick={() => handleMethodSelect('sms')}
              >
                <Smartphone className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">SMS (OTP)</div>
                  <div className="text-xs text-muted-foreground">
                    Receive code via text message
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
                onClick={() => handleMethodSelect('email')}
              >
                <Key className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Email (OTP)</div>
                  <div className="text-xs text-muted-foreground">
                    Receive code via email
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
                onClick={() => handleMethodSelect('authenticator')}
              >
                <Shield className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Authenticator App</div>
                  <div className="text-xs text-muted-foreground">
                    Use Google Authenticator or similar
                  </div>
                </div>
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to your {method === 'sms' ? 'phone' : 'email'}
            </p>
            <Input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl font-mono tracking-widest"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setStep('method');
                  setOtp('');
                }}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleOTPVerify}
                disabled={otp.length !== 6}
              >
                Verify
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => toast.info('OTP resent!')}
            >
              Resend OTP
            </Button>
          </motion.div>
        )}

        {step === 'authenticator' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Scan this QR code with your authenticator app
            </p>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-lg border-2 border-dashed">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mb-4">
              Or enter this code manually: <code className="font-mono">JBSWY3DPEHPK3PXP</code>
            </p>
            <Input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={authenticatorCode}
              onChange={(e) => setAuthenticatorCode(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl font-mono tracking-widest"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setStep('method');
                  setAuthenticatorCode('');
                }}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleAuthenticatorVerify}
                disabled={authenticatorCode.length !== 6}
              >
                Verify
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">2FA Enabled!</h3>
            <p className="text-sm text-muted-foreground">
              Your account is now protected with two-factor authentication
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
