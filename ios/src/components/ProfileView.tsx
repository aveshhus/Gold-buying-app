import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/client';
import { validatePAN, validateAadhaar, maskPAN, maskAadhaar } from '../utils';
import Toast from 'react-native-toast-message';
import TaglineMarquee from './TaglineMarquee';

export default function ProfileView() {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [kycData, setKycData] = useState({ pan: '', aadhaar: '' });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.data) {
        updateUser(response.data);
        if (response.data.profilePhoto) {
          setProfilePhoto(response.data.profilePhoto.startsWith('http') 
            ? response.data.profilePhoto 
            : `http://10.0.2.2:3001${response.data.profilePhoto}`);
        }
        setKycData({
          pan: response.data.pan || '',
          aadhaar: response.data.aadhaar || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Please allow access to photos' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIsLoading(true);
      try {
        const response = await api.uploadProfilePhoto(result.assets[0].uri);
        if (response.error) {
          Toast.show({ type: 'error', text1: 'Upload Failed', text2: response.error });
          return;
        }
        if (response.data?.profilePhoto) {
          setProfilePhoto(response.data.profilePhoto.startsWith('http') 
            ? response.data.profilePhoto 
            : `http://10.0.2.2:3001${response.data.profilePhoto}`);
          Toast.show({ type: 'success', text1: 'Success', text2: 'Profile photo updated!' });
        }
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to upload photo' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateKYC = async () => {
    if (!validatePAN(kycData.pan)) {
      Toast.show({ type: 'error', text1: 'Invalid PAN', text2: 'Please enter a valid PAN card number' });
      return;
    }
    if (!validateAadhaar(kycData.aadhaar)) {
      Toast.show({ type: 'error', text1: 'Invalid Aadhaar', text2: 'Please enter a valid Aadhaar card number' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.updateKYC(kycData.pan, kycData.aadhaar);
      if (response.error) {
        Toast.show({ type: 'error', text1: 'Update Failed', text2: response.error });
        return;
      }
      Toast.show({ type: 'success', text1: 'Success', text2: 'KYC updated successfully!' });
      loadProfile();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update KYC' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TaglineMarquee />
      <View style={styles.content}>
        <View style={styles.photoSection}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>👤</Text>
            </View>
          )}
          <TouchableOpacity style={styles.photoButton} onPress={handleImagePick} disabled={isLoading}>
            <Text style={styles.photoButtonText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{user?.name}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{user?.phone}</Text>
        </View>

        <View style={styles.kycSection}>
          <Text style={styles.sectionTitle}>KYC Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PAN Card</Text>
            <TextInput
              style={styles.input}
              placeholder="ABCDE1234F"
              value={kycData.pan}
              onChangeText={(text) => setKycData({ ...kycData, pan: text.toUpperCase().slice(0, 10) })}
              maxLength={10}
              autoCapitalize="characters"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Aadhaar Card</Text>
            <TextInput
              style={styles.input}
              placeholder="123456789012"
              value={kycData.aadhaar}
              onChangeText={(text) => setKycData({ ...kycData, aadhaar: text.replace(/\D/g, '').slice(0, 12) })}
              keyboardType="number-pad"
              maxLength={12}
            />
          </View>
          <TouchableOpacity
            style={[styles.updateButton, isLoading && styles.updateButtonDisabled]}
            onPress={handleUpdateKYC}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Update KYC</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D5BAA7' },
  header: { padding: 20, backgroundColor: '#681412' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  content: { padding: 16 },
  photoSection: { alignItems: 'center', marginBottom: 24 },
  photo: { width: 120, height: 120, borderRadius: 60, marginBottom: 12 },
  photoPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#92422B', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  photoPlaceholderText: { fontSize: 60 },
  photoButton: { backgroundColor: '#681412', padding: 12, borderRadius: 8 },
  photoButtonText: { color: '#fff', fontWeight: '600' },
  infoSection: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12 },
  infoLabel: { fontSize: 12, color: '#92422B', marginBottom: 4 },
  infoValue: { fontSize: 16, color: '#681412', fontWeight: '500' },
  kycSection: { marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#681412', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#681412', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#E79A66', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff' },
  updateButton: { backgroundColor: '#681412', padding: 16, borderRadius: 8, alignItems: 'center' },
  updateButtonDisabled: { opacity: 0.6 },
  updateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

