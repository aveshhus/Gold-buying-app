'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Shield,
  Smartphone,
  Monitor,
  MapPin,
  Clock,
  LogOut,
  Download,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Device {
  _id: string;
  deviceInfo: {
    type: 'mobile' | 'desktop' | 'tablet' | 'unknown';
    name: string;
    os: string;
    browser: string;
  };
  ipAddress: string;
  lastActive: string;
  loginTime: string;
  current?: boolean;
}

interface Activity {
  _id: string;
  action: string;
  description: string;
  ipAddress: string;
  deviceInfo: {
    type: string;
    name: string;
    os: string;
    browser: string;
  };
  createdAt: string;
}

export default function SecurityCenter() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    loadSecurityData();
    // Get current token for comparison
    if (typeof window !== 'undefined') {
      setCurrentToken(localStorage.getItem('token'));
    }
  }, []);

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading security data...');
      
      const [summaryResponse, activityResponse] = await Promise.all([
        api.getSecuritySummary(),
        api.getActivityLog(50),
      ]);

      console.log('📥 Security summary response:', summaryResponse);
      console.log('📥 Activity log response:', activityResponse);

      if (summaryResponse.error) {
        console.error('❌ Security summary error:', summaryResponse.error);
        toast.error(summaryResponse.error);
        return;
      }

      if (activityResponse.error) {
        console.error('❌ Activity log error:', activityResponse.error);
        // Don't return here - we can still show sessions even if activity log fails
        toast.error(activityResponse.error);
      }

      if (summaryResponse.data) {
        // Map sessions to devices format
        const mappedDevices = summaryResponse.data.sessions.map((session: any) => ({
          ...session,
          current: session.token === currentToken,
        }));
        console.log('✅ Mapped devices:', mappedDevices);
        setDevices(mappedDevices);
      } else {
        console.warn('⚠️ No data in security summary response');
        setDevices([]);
      }

      if (activityResponse.data) {
        setActivities(activityResponse.data);
      } else {
        setActivities([]);
      }
    } catch (error: any) {
      console.error('❌ Error loading security data:', error);
      toast.error(error?.message || 'Failed to load security data. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const response = await api.endSession(sessionId);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success('Session ended successfully');
      loadSecurityData();
    } catch (error: any) {
      toast.error('Failed to end session');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await api.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success('Password changed successfully');
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      loadSecurityData();
    } catch (error: any) {
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDownloadActivityLog = () => {
    // Generate CSV
    const csvContent = [
      ['Action', 'Description', 'IP Address', 'Device', 'Date/Time'].join(','),
      ...activities.map(activity => [
        activity.action,
        `"${activity.description}"`,
        activity.ipAddress,
        `${activity.deviceInfo.name} (${activity.deviceInfo.os})`,
        new Date(activity.createdAt).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Activity log downloaded');
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'desktop':
        return <Monitor className="h-5 w-5" />;
      case 'tablet':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const formatAction = (action: string) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Security Center</h2>
        <p className="text-muted-foreground">
          Manage your account security and privacy settings
        </p>
      </div>

      {/* Security Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Last changed: {activities.find(a => a.action === 'password_change') 
                    ? new Date(activities.find(a => a.action === 'password_change')!.createdAt).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
              <Button
                variant="default"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Sessions:</span>
                <Badge variant="default">{devices.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Recent Logins:</span>
                <Badge variant="outline">
                  {activities.filter(a => a.action === 'login').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Sessions</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadSecurityData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading sessions...
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active sessions
            </div>
          ) : (
            <div className="space-y-4">
              {devices.map((device) => (
                <motion.div
                  key={device._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    {getDeviceIcon(device.deviceInfo.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {device.deviceInfo.name} ({device.deviceInfo.os})
                        </span>
                        {device.current && (
                          <Badge variant="default">Current Device</Badge>
                        )}
                        <Badge variant="outline">{device.deviceInfo.browser}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last active: {new Date(device.lastActive).toLocaleString()}
                        </span>
                        <span>IP: {device.ipAddress}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Logged in: {new Date(device.loginTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {!device.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(device._id)}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      End Session
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Activity Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Account Activity Log</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadActivityLog}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            View and download your complete account activity history
          </p>
          <Button
            variant="outline"
            onClick={() => setShowActivityLog(true)}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Activity Log
          </Button>
        </CardContent>
      </Card>

      {/* Activity Log Dialog */}
      <Dialog open={showActivityLog} onOpenChange={setShowActivityLog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Account Activity Log</DialogTitle>
            <DialogDescription>
              Complete history of your account activities
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No activity recorded
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatAction(activity.action)}</span>
                      <Badge variant="outline" className="text-xs">
                        {activity.deviceInfo.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.createdAt).toLocaleString()} • IP: {activity.ipAddress} • {activity.deviceInfo.name} ({activity.deviceInfo.os})
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Current Password</label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">New Password</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                required
                minLength={6}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
