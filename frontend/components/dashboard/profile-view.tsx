'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { InfoCard } from '@/components/ui/info-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { maskPAN, maskAadhaar, formatDate, validatePAN, validateAadhaar } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { User, Mail, Phone, Shield, Award, Calendar, Edit, CheckCircle2, Clock, Info, Camera, Upload, X, Image as ImageIcon, Crop } from 'lucide-react';
import { toast } from 'sonner';
import { componentStyles, decorative, animations, gradients } from '@/lib/design-system';
import Image from 'next/image';
import Cropper, { Area } from 'react-easy-crop';

export default function ProfileView() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [kycForm, setKycForm] = useState({ pan: '', aadhaar: '' });
  const [kycErrors, setKycErrors] = useState({ pan: '', aadhaar: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.5); // Start with lower zoom to show full image
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  // Stop camera when modal closes
  useEffect(() => {
    if (!showCameraModal && cameraStream) {
      stopCamera();
    }
  }, [showCameraModal]);

  const loadProfile = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.data) {
        // Add cache busting to profile photo URL to force reload
        const profileData = { ...response.data };
        if (profileData.profilePhoto) {
          // Convert relative URL to absolute if needed
          let photoUrl = profileData.profilePhoto;
          if (photoUrl.startsWith('/uploads/')) {
            photoUrl = `http://localhost:3001${photoUrl}`;
          }
          
          // Remove existing cache busting parameters and add fresh ones
          const baseUrl = photoUrl.split('?')[0];
          const timestamp = Date.now();
          const random = Math.random();
          profileData.profilePhoto = `${baseUrl}?t=${timestamp}&v=${random}`;
        }
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleKYCSubmit = async () => {
    console.log('handleKYCSubmit called', { pan: kycForm.pan, aadhaar: kycForm.aadhaar });
    
    // Reset errors
    setKycErrors({ pan: '', aadhaar: '' });

    // Validate PAN
    if (!kycForm.pan || kycForm.pan.trim() === '') {
      setKycErrors(prev => ({ ...prev, pan: 'PAN card number is required' }));
      toast.error('Please enter PAN card number');
      return;
    }
    if (!validatePAN(kycForm.pan)) {
      setKycErrors(prev => ({ ...prev, pan: 'Invalid PAN format. Use: ABCDE1234F' }));
      toast.error('Invalid PAN format. Format: ABCDE1234F');
      return;
    }

    // Validate Aadhaar
    if (!kycForm.aadhaar || kycForm.aadhaar.trim() === '') {
      setKycErrors(prev => ({ ...prev, aadhaar: 'Aadhaar card number is required' }));
      toast.error('Please enter Aadhaar card number');
      return;
    }
    if (!validateAadhaar(kycForm.aadhaar)) {
      setKycErrors(prev => ({ ...prev, aadhaar: 'Invalid Aadhaar. Must be 12 digits, cannot start with 0 or 1' }));
      toast.error('Invalid Aadhaar format. Must be 12 digits, cannot start with 0 or 1');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Calling api.updateKYC', { pan: kycForm.pan, aadhaar: kycForm.aadhaar });
      const response = await api.updateKYC(kycForm.pan, kycForm.aadhaar);
      console.log('API response:', response);
      
      if (response.error) {
        toast.error(response.error);
        // If it's a server connection error, show more details
        if (response.error.includes('backend server') || response.error.includes('404')) {
          console.error('Backend connection issue. Make sure the server is running on port 3001.');
        }
        return;
      }
      
      if (response.data) {
        toast.success(response.data.message || 'KYC documents submitted successfully!');
        setIsKYCModalOpen(false);
        setKycForm({ pan: '', aadhaar: '' });
        setKycErrors({ pan: '', aadhaar: '' });
        loadProfile();
      } else {
        toast.error('Unexpected response from server. Please try again.');
      }
    } catch (error: any) {
      console.error('Error submitting KYC:', error);
      toast.error(error?.message || error?.error || 'Failed to update KYC documents. Please check if the backend server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePANChange = (value: string) => {
    const upperValue = value.toUpperCase().replace(/\s/g, '');
    setKycForm(prev => ({ ...prev, pan: upperValue }));
    if (upperValue.length === 10 && !validatePAN(upperValue)) {
      setKycErrors(prev => ({ ...prev, pan: 'Invalid PAN format' }));
    } else {
      setKycErrors(prev => ({ ...prev, pan: '' }));
    }
  };

  const handleAadhaarChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setKycForm(prev => ({ ...prev, aadhaar: numericValue }));
    if (numericValue.length === 12 && !validateAadhaar(numericValue)) {
      setKycErrors(prev => ({ ...prev, aadhaar: 'Invalid Aadhaar format' }));
    } else {
      setKycErrors(prev => ({ ...prev, aadhaar: '' }));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Create image preview for cropping
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result) {
        setImageToCrop(result);
        setShowCropModal(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      } else {
        toast.error('Failed to load image');
      }
    };
    reader.onerror = () => {
      toast.error('Error reading image file');
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (file: File) => {
    try {
      const response = await api.uploadProfilePhoto(file);
      if (response.error) {
        toast.error(response.error);
        setIsUploadingPhoto(false);
        return;
      }
      
      // Force reload profile to get new image URL
      await loadProfile();
      
      // Add cache busting to ensure new image loads
      if (response.data?.profilePhoto) {
        // Convert relative URL to absolute if needed
        let photoUrl = response.data.profilePhoto;
        if (photoUrl.startsWith('/uploads/')) {
          photoUrl = `http://localhost:3001${photoUrl}`;
        }
        
        // Force browser to reload image by adding unique timestamp and random
        const timestamp = Date.now();
        const random = Math.random();
        const newImageUrl = `${photoUrl}?t=${timestamp}&v=${random}`;
        
        // Update profile state immediately with cache-busted URL
        setProfile((prev: any) => ({
          ...prev,
          profilePhoto: newImageUrl
        }));
      }
      
      toast.success('Profile photo uploaded successfully!');
      
      // Dispatch event to update header profile photo
      window.dispatchEvent(new CustomEvent('profilePhotoUpdated'));
    } catch (error: any) {
      toast.error(error?.message || 'Failed to upload photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!confirm('Are you sure you want to delete your profile photo?')) return;

    try {
      const response = await api.deleteProfilePhoto();
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success('Profile photo deleted successfully!');
      loadProfile();
      
      // Dispatch event to update header profile photo
      window.dispatchEvent(new CustomEvent('profilePhotoUpdated'));
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete photo');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setCameraStream(stream);
      setShowCameraModal(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (blob) {
        // Show crop modal for camera photo too
        const imageUrl = URL.createObjectURL(blob);
        setImageToCrop(imageUrl);
        setShowCropModal(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const image = new window.Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Ensure square output - use the smaller dimension to make it perfectly square
        const size = Math.min(pixelCrop.width, pixelCrop.height);
        canvas.width = size;
        canvas.height = size;

        // Calculate center crop if needed
        const sourceX = pixelCrop.x + (pixelCrop.width - size) / 2;
        const sourceY = pixelCrop.y + (pixelCrop.height - size) / 2;

        // Draw cropped image (square)
        ctx.drawImage(
          image,
          sourceX,
          sourceY,
          size,
          size,
          0,
          0,
          size,
          size
        );

        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/jpeg', 0.9);
      };
      image.onerror = () => reject(new Error('Failed to load image'));
    });
  };

  const handleCropComplete = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    try {
      setIsUploadingPhoto(true);
      const croppedBlob = await createCroppedImage(imageToCrop, croppedAreaPixels);
      const file = new File([croppedBlob], 'profile-photo.jpg', { type: 'image/jpeg' });
      
      // Close crop modal and clear image state
      setShowCropModal(false);
      const tempImageUrl = imageToCrop;
      setImageToCrop(null);
      setCroppedAreaPixels(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      
      // Clean up object URL if it was from camera
      if (tempImageUrl && tempImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(tempImageUrl);
      }
      
      // Upload the cropped image
      await uploadPhoto(file);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to crop image');
      setIsUploadingPhoto(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop(null);
    setCroppedAreaPixels(null);
    // Clean up object URL if it was from camera
    if (imageToCrop && imageToCrop.startsWith('blob:')) {
      URL.revokeObjectURL(imageToCrop);
    }
  };

  const accountAge = profile?.createdAt
    ? Math.floor((new Date().getTime() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-10">
      <PageHeader
        title="My Profile"
        description="View and manage your account information, KYC status, and preferences"
        badge={{
          label: 'Account Status',
          value: profile?.kycVerified ? 'Verified' : 'Pending',
          icon: profile?.kycVerified ? CheckCircle2 : Clock,
        }}
      />

      {/* Account Summary */}
      <div>
        <SectionHeader title="Account Summary" />
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            title="Member Since"
            value={profile?.createdAt ? formatDate(profile.createdAt) : '--'}
            description={accountAge > 0 ? `${accountAge} day${accountAge !== 1 ? 's' : ''} ago` : 'New member'}
            icon={Calendar}
            index={0}
          />
          <StatCard
            title="Account Status"
            value={profile?.kycVerified ? 'Verified' : 'Pending'}
            description="KYC Status"
            icon={profile?.kycVerified ? CheckCircle2 : Clock}
            index={1}
            showPulseDot={profile?.kycVerified}
            pulseDotColor={profile?.kycVerified ? 'green' : 'white'}
          />
          <StatCard
            title="Security Level"
            value="Standard"
            description="Enable 2FA for enhanced security"
            icon={Shield}
            index={2}
          />
        </div>
      </div>

      {/* Profile Photo */}
      <div>
        <SectionHeader title="Profile Photo" />
        <Card className={componentStyles.table.container}>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                {profile?.profilePhoto ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#92422B]/20 shadow-lg bg-gray-100">
                    <img
                      key={`photo-${profile.profilePhoto}`} // Force re-render when URL changes
                      src={profile.profilePhoto}
                      alt="Profile Photo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('❌ Image load error:', profile.profilePhoto);
                        // Try reloading with fresh cache bust
                        const baseUrl = profile.profilePhoto.split('?')[0];
                        (e.target as HTMLImageElement).src = `${baseUrl}?retry=${Date.now()}`;
                      }}
                      onLoad={() => {
                        console.log('✅ Image loaded:', profile.profilePhoto);
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#681412] to-[#92422B] flex items-center justify-center border-4 border-[#92422B]/20 shadow-lg">
                    <User className="h-16 w-16 text-white" />
                  </div>
                )}
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className={`${gradients.button} ${gradients.buttonHover} text-white border-0 min-h-[44px] touch-manipulation`}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                <Button
                  onClick={startCamera}
                  disabled={isUploadingPhoto}
                  variant="outline"
                  className="bg-white/80 hover:bg-white border-[#92422B]/20 text-[#681412] min-h-[44px] touch-manipulation"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                {profile?.profilePhoto && (
                  <Button
                    onClick={handleDeletePhoto}
                    disabled={isUploadingPhoto}
                    variant="outline"
                    className="bg-red-50 hover:bg-red-100 border-red-200 text-red-600 min-h-[44px] touch-manipulation"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center sm:text-left">
              Upload a profile photo or take one with your camera. Maximum file size: 5MB
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Personal Information */}
      <div>
        <SectionHeader title="Personal Information" />
        <Card className={componentStyles.table.container}>
          <CardHeader className={componentStyles.table.header}>
            <div className="flex items-center justify-between">
              <CardTitle className={componentStyles.table.headerTitle}>
                <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
                Account Details
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/80 hover:bg-white border-[#92422B]/20 text-[#681412]"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="text-sm font-medium text-[#681412] flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                <p className="text-base md:text-lg font-semibold text-gray-700">{profile?.name || user?.name || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#681412] flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <p className="text-base md:text-lg text-gray-700 break-all">{profile?.email || user?.email || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#681412] flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>
                <p className="text-base md:text-lg text-gray-700">{profile?.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#681412] flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  Account Created
                </label>
                <p className="text-base md:text-lg text-gray-700">
                  {profile?.createdAt ? formatDate(profile.createdAt) : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KYC Documents */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <SectionHeader title="KYC Documents" />
          {(!profile?.pan || !profile?.aadhaar || !profile?.kycVerified) && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsKYCModalOpen(true)}
              className={`${gradients.button} ${gradients.buttonHover} text-white border-0 min-h-[44px] touch-manipulation`}
            >
              {profile?.pan && profile?.aadhaar ? 'Update KYC' : 'Complete KYC'}
            </Button>
          )}
        </div>
        <Card className={componentStyles.table.container}>
          <CardHeader className={componentStyles.table.header}>
            <CardTitle className={componentStyles.table.headerTitle}>
              <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
              Verification Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="text-sm font-medium text-[#681412] mb-2 block">
                  PAN Card Number
                </label>
                <p className="text-base md:text-lg font-mono text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">
                  {profile?.pan ? maskPAN(profile.pan) : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#681412] mb-2 block">
                  Aadhaar Card Number
                </label>
                <p className="text-base md:text-lg font-mono text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 break-all">
                  {profile?.aadhaar ? maskAadhaar(profile.aadhaar) : 'Not provided'}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#681412] mb-3 block">
                KYC Verification Status
              </label>
              <div className="flex items-center gap-3">
                {profile?.kycVerified ? (
                  <>
                    <Badge className="bg-green-100 text-green-800 border border-green-200 px-3 py-1.5">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Your KYC is complete. You can make unlimited purchases.
                    </p>
                  </>
                ) : (
                  <>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-700 px-3 py-1.5">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending Verification
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Complete KYC to unlock all features and higher purchase limits.
                    </p>
                  </>
                )}
              </div>
            </div>
            {!profile?.kycVerified && (
              <InfoCard
                title="Why Complete KYC?"
                icon={Info}
                items={[
                  { text: 'Higher purchase limits' },
                  { text: 'Faster transaction processing' },
                  { text: 'Access to all platform features' },
                  { text: 'Enhanced security and compliance' },
                ]}
                delay={0.2}
                hoverDirection="left"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* KYC Update Modal */}
      <Dialog open={isKYCModalOpen} onOpenChange={setIsKYCModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {profile?.pan && profile?.aadhaar ? 'Update KYC Documents' : 'Complete KYC Verification'}
            </DialogTitle>
            <DialogDescription>
              Enter your PAN and Aadhaar card numbers. These documents will be verified by our admin team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#681412] mb-2 block">
                PAN Card Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="ABCDE1234F"
                value={kycForm.pan}
                onChange={(e) => handlePANChange(e.target.value)}
                maxLength={10}
                className={kycErrors.pan ? 'border-red-500' : ''}
              />
              {kycErrors.pan && (
                <p className="text-sm text-red-500 mt-1">{kycErrors.pan}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Format: ABCDE1234F (10 characters)
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#681412] mb-2 block">
                Aadhaar Card Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="123456789012"
                value={kycForm.aadhaar}
                onChange={(e) => handleAadhaarChange(e.target.value)}
                maxLength={12}
                className={kycErrors.aadhaar ? 'border-red-500' : ''}
              />
              {kycErrors.aadhaar && (
                <p className="text-sm text-red-500 mt-1">{kycErrors.aadhaar}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                12 digits only, cannot start with 0 or 1
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <Info className="h-4 w-4 inline mr-1" />
                <strong>Note:</strong> Your KYC documents will be reviewed by our admin team. 
                You'll be notified once verification is complete.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsKYCModalOpen(false);
                  setKycForm({ pan: '', aadhaar: '' });
                  setKycErrors({ pan: '', aadhaar: '' });
                }}
                disabled={isSubmitting}
                className="bg-white/80 hover:bg-white border-[#92422B]/20 text-[#681412]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleKYCSubmit();
                }}
                disabled={isSubmitting || !kycForm.pan || !kycForm.aadhaar}
                className={`${gradients.button} ${gradients.buttonHover} text-white shadow-lg`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit KYC'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Modal */}
      <Dialog open={showCameraModal} onOpenChange={setShowCameraModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Take Profile Photo</DialogTitle>
            <DialogDescription>
              Position yourself in the frame and click capture
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={capturePhoto}
                className={`${gradients.button} ${gradients.buttonHover} text-white flex-1`}
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Crop Modal */}
      <Dialog open={showCropModal} onOpenChange={handleCropCancel}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Crop Your Profile Photo
            </DialogTitle>
            <DialogDescription>
              Adjust the image to create a perfect square profile photo
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ width: '100%', height: '500px', minHeight: '400px', position: 'relative' }}>
              {imageToCrop ? (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                  <Cropper
                    image={imageToCrop}
                    crop={crop}
                    zoom={zoom}
                    aspect={1} // Square crop (1:1 ratio)
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape="rect"
                    showGrid={true}
                    restrictPosition={true}
                    onMediaLoaded={(mediaSize) => {
                      // Auto-adjust zoom to show full image in container
                      const containerSize = 500; // Container height
                      const imageSize = Math.max(mediaSize.width, mediaSize.height);
                      
                      // Calculate zoom to fit the entire image in the container
                      if (imageSize > containerSize) {
                        // Image is larger than container - zoom out to fit
                        const fitZoom = (containerSize / imageSize) * 0.9; // 90% to add some padding
                        setZoom(Math.max(0.3, Math.min(fitZoom, 1))); // Clamp between 0.3 and 1
                      } else {
                        // Image is smaller than container - use normal zoom
                        setZoom(1);
                      }
                    }}
                    style={{
                      containerStyle: {
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                      },
                      cropAreaStyle: {
                        border: '2px solid rgba(255, 255, 255, 0.8)',
                      },
                      mediaStyle: {
                        maxWidth: 'none',
                        maxHeight: 'none',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Loading image...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 min-w-[60px]">
                  Zoom:
                </label>
                <input
                  type="range"
                  min={0.3}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#681412]"
                />
                <span className="text-sm text-gray-600 min-w-[40px] text-right">
                  {zoom.toFixed(1)}x
                </span>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleCropCancel}
                  variant="outline"
                  className="flex-1"
                  disabled={isUploadingPhoto}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleCropComplete}
                  className={`${gradients.button} ${gradients.buttonHover} text-white flex-1`}
                  disabled={isUploadingPhoto || !croppedAreaPixels}
                >
                  {isUploadingPhoto ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Crop className="h-4 w-4 mr-2" />
                      Save & Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
