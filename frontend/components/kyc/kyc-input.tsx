'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { validatePAN, validateAadhaar } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KYCInputProps {
  pan: string;
  aadhaar: string;
  onPanChange: (pan: string) => void;
  onAadhaarChange: (aadhaar: string) => void;
  disabled?: boolean;
}

export function KYCInput({
  pan,
  aadhaar,
  onPanChange,
  onAadhaarChange,
  disabled,
}: KYCInputProps) {
  const [panValid, setPanValid] = useState<boolean | null>(null);
  const [aadhaarValid, setAadhaarValid] = useState<boolean | null>(null);

  const handlePANChange = (value: string) => {
    const upperValue = value.toUpperCase().replace(/\s/g, '');
    onPanChange(upperValue);
    
    if (upperValue.length === 10) {
      setPanValid(validatePAN(upperValue));
    } else {
      setPanValid(null);
    }
  };

  const handleAadhaarChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    onAadhaarChange(numericValue);
    
    if (numericValue.length === 12) {
      setAadhaarValid(validateAadhaar(numericValue));
    } else {
      setAadhaarValid(null);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <div className="space-y-2">
        <label htmlFor="pan" className="text-sm font-medium flex items-center gap-2">
          PAN Card Number <span className="text-red-500">*</span>
          {panValid !== null && (
            panValid ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )
          )}
        </label>
        <Input
          id="pan"
          maxLength={10}
          placeholder="ABCDE1234F"
          value={pan}
          onChange={(e) => handlePANChange(e.target.value)}
          className={cn(
            'uppercase',
            panValid === true && 'border-green-500 focus-visible:ring-green-500',
            panValid === false && 'border-red-500 focus-visible:ring-red-500'
          )}
          disabled={disabled}
          required
        />
        <p className="text-xs text-muted-foreground">
          Format: ABCDE1234F (5 letters, 4 digits, 1 letter)
        </p>
        {panValid === false && pan.length === 10 && (
          <p className="text-xs text-red-500">Invalid PAN format</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="aadhaar" className="text-sm font-medium flex items-center gap-2">
          Aadhaar Card Number <span className="text-red-500">*</span>
          {aadhaarValid !== null && (
            aadhaarValid ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )
          )}
        </label>
        <Input
          id="aadhaar"
          maxLength={12}
          placeholder="123456789012"
          value={aadhaar}
          onChange={(e) => handleAadhaarChange(e.target.value)}
          className={cn(
            panValid === true && 'border-green-500 focus-visible:ring-green-500',
            aadhaarValid === false && 'border-red-500 focus-visible:ring-red-500'
          )}
          disabled={disabled}
          required
        />
        <p className="text-xs text-muted-foreground">
          12 digits only (cannot start with 0 or 1)
        </p>
        {aadhaarValid === false && aadhaar.length === 12 && (
          <p className="text-xs text-red-500">
            Invalid Aadhaar. Must be 12 digits and cannot start with 0 or 1.
          </p>
        )}
      </div>
    </div>
  );
}
