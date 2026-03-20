// React Native Utils - Converted from frontend/lib/utils.ts

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function validatePAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
}

export function validateAadhaar(aadhaar: string): boolean {
  const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
  return /^\d{12}$/.test(aadhaar) && aadhaarRegex.test(aadhaar);
}

export function maskPAN(pan: string): string {
  if (!pan || pan.length < 10) return pan;
  return pan.substring(0, 2) + '****' + pan.substring(8);
}

export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar || aadhaar.length < 12) return aadhaar;
  return aadhaar.substring(0, 4) + '****' + aadhaar.substring(8);
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  } else {
    return formatDate(date);
  }
}







