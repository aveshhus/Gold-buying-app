import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { api } from '../api/client';
import Toast from 'react-native-toast-message';
import TaglineMarquee from './TaglineMarquee';

export default function SecurityView() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sessionsRes, activitiesRes] = await Promise.all([
        api.getSessions(),
        api.getActivityLog(10),
      ]);
      if (sessionsRes.data) setSessions(sessionsRes.data);
      if (activitiesRes.data) setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new.length < 6) {
      Toast.show({ type: 'error', text1: 'Weak Password', text2: 'Password must be at least 6 characters' });
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      Toast.show({ type: 'error', text1: 'Mismatch', text2: 'Passwords do not match' });
      return;
    }

    try {
      const response = await api.changePassword(passwordData.current, passwordData.new);
      if (response.error) {
        Toast.show({ type: 'error', text1: 'Failed', text2: response.error });
        return;
      }
      Toast.show({ type: 'success', text1: 'Success', text2: 'Password changed successfully!' });
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to change password' });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#681412" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TaglineMarquee />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
          value={passwordData.current}
          onChangeText={(text) => setPasswordData({ ...passwordData, current: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={passwordData.new}
          onChangeText={(text) => setPasswordData({ ...passwordData, new: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={passwordData.confirm}
          onChangeText={(text) => setPasswordData({ ...passwordData, confirm: text })}
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Sessions ({sessions.length})</Text>
        {sessions.map((session) => (
          <View key={session._id} style={styles.sessionCard}>
            <Text style={styles.sessionDevice}>{session.deviceInfo?.name || 'Unknown Device'}</Text>
            <Text style={styles.sessionInfo}>{session.deviceInfo?.os || 'Unknown OS'}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {activities.map((activity, index) => (
          <View key={index} style={styles.activityCard}>
            <Text style={styles.activityAction}>{activity.action}</Text>
            <Text style={styles.activityDesc}>{activity.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D5BAA7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#681412' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  section: { padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#681412', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#E79A66', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff', marginBottom: 12 },
  button: { backgroundColor: '#681412', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sessionCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  sessionDevice: { fontSize: 16, fontWeight: '600', color: '#681412' },
  sessionInfo: { fontSize: 12, color: '#92422B' },
  activityCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  activityAction: { fontSize: 14, fontWeight: '600', color: '#681412' },
  activityDesc: { fontSize: 12, color: '#92422B' },
});

