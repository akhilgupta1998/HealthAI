import React, { useState, useEffect } from 'react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { reminderService, ReminderSettings } from '@/services/reminderService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HydrationReminderSettings from '@/components/hydration/HydrationReminderSettings';
import { toast } from 'react-hot-toast';
import { 
  BellRing, 
  Mail, 
  CalendarClock, 
  Utensils, 
  Activity, 
  Bell, 
  BadgeAlert,
  InfoIcon
} from 'lucide-react';

const RemindersPage: React.FC = () => {
  const { user } = useFirebaseContext();
  const [settings, setSettings] = useState<ReminderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadReminderSettings();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const loadReminderSettings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userSettings = await reminderService.getUserReminderSettings(user.uid);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading reminder settings:', error);
      toast.error('Failed to load reminder settings');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateSettings = async (settingUpdates: Partial<ReminderSettings>) => {
    if (!user || !settings) return;
    
    try {
      setSaveLoading(true);
      await reminderService.updateReminderSettings(user.uid, settingUpdates);
      
      setSettings({
        ...settings,
        ...settingUpdates
      });
      
      toast.success('Settings updated');
    } catch (error) {
      console.error('Error updating reminder settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaveLoading(false);
    }
  };
  
  const requestNotificationPermission = async () => {
    try {
      const granted = await reminderService.requestNotificationPermission();
      if (granted) {
        toast.success('Notification permission granted');
      } else {
        toast.error('Please enable notifications in your browser settings');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!settings) {
    return (
      <div className="text-center p-8">
        <p>Sign in to configure reminders and notifications</p>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-5xl">
      <div className="flex flex-col items-center space-y-2 text-center mb-8">
        <BellRing className="h-12 w-12 text-blue-500" />
        <h1 className="text-3xl font-bold">Reminders & Notifications</h1>
        <p className="text-muted-foreground max-w-2xl">
          Configure reminders to help you stay on track with your health goals.
        </p>
      </div>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-500" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Control how and when you receive notifications from Health Guardian
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BadgeAlert className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive browser notifications for reminders and updates</p>
                </div>
              </div>
              <Switch 
                checked={settings.pushNotifications} 
                onCheckedChange={(enabled) => {
                  if (enabled) {
                    requestNotificationPermission();
                  }
                  handleUpdateSettings({ pushNotifications: enabled });
                }}
                disabled={saveLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Email Reports</p>
                  <p className="text-sm text-gray-500">Receive monthly email summaries of your health progress</p>
                </div>
              </div>
              <Switch 
                checked={settings.emailReports} 
                onCheckedChange={(enabled) => handleUpdateSettings({ emailReports: enabled })}
                disabled={saveLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <HydrationReminderSettings />
      </div>
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Other Reminders</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Utensils className="h-5 w-5 text-orange-500" />
                  Meal Reminders
                </CardTitle>
                <Switch 
                  checked={settings.mealReminders} 
                  onCheckedChange={(enabled) => handleUpdateSettings({ mealReminders: enabled })}
                  disabled={saveLoading}
                />
              </div>
            </CardHeader>
            <CardContent className="text-sm text-gray-500">
              Get reminders for breakfast, lunch, and dinner at your preferred times
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-green-500" />
                  Exercise Reminders
                </CardTitle>
                <Switch 
                  checked={settings.exerciseReminders} 
                  onCheckedChange={(enabled) => handleUpdateSettings({ exerciseReminders: enabled })}
                  disabled={saveLoading}
                />
              </div>
            </CardHeader>
            <CardContent className="text-sm text-gray-500">
              Get reminders to exercise based on your schedule and goals
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Medical Disclaimer */}
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 mt-8">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <InfoIcon className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium mb-1">Health Reminder Notice</h3>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                While reminders can be helpful for maintaining health habits, they are not a substitute for medical advice.
                For specific health concerns or medical conditions, please consult with a healthcare professional.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RemindersPage; 