import React, { useState, useEffect } from 'react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { reminderService, ReminderSettings, formatTimeString } from '@/services/reminderService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Droplet, Clock, Bell, BellOff, BellRing } from 'lucide-react';

const HydrationReminderSettings: React.FC = () => {
  const { user } = useFirebaseContext();
  const [settings, setSettings] = useState<ReminderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
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
  
  const handleToggleHydrationReminders = async (enabled: boolean) => {
    if (!user || !settings) return;
    
    try {
      setSaving(true);
      await reminderService.updateReminderSettings(user.uid, {
        hydrationReminders: enabled
      });
      
      setSettings({
        ...settings,
        hydrationReminders: enabled
      });
      
      toast.success(enabled ? 'Hydration reminders enabled' : 'Hydration reminders disabled');
      
      // Request notification permission if enabling reminders
      if (enabled) {
        const granted = await reminderService.requestNotificationPermission();
        if (!granted) {
          toast.error('Please enable notifications in your browser to receive reminders');
        } else {
          // Start sending reminders
          reminderService.scheduleHydrationReminder(user.uid);
        }
      }
    } catch (error) {
      console.error('Error updating hydration reminder settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };
  
  const handleFrequencyChange = async (value: number) => {
    if (!user || !settings) return;
    
    try {
      setSaving(true);
      await reminderService.updateReminderSettings(user.uid, {
        hydrationFrequency: value
      });
      
      setSettings({
        ...settings,
        hydrationFrequency: value
      });
      
      toast.success(`Reminder frequency updated to every ${value} minutes`);
    } catch (error) {
      console.error('Error updating reminder frequency:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };
  
  const handleTimeChange = async (field: 'hydrationStart' | 'hydrationEnd', time: string) => {
    if (!user || !settings) return;
    
    try {
      setSaving(true);
      await reminderService.updateReminderSettings(user.uid, {
        [field]: time
      });
      
      setSettings({
        ...settings,
        [field]: time
      });
      
      toast.success('Reminder time updated');
    } catch (error) {
      console.error('Error updating reminder time:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };
  
  // Generate time options in 30-minute increments
  const generateTimeOptions = () => {
    const options = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        const timeString = `${h}:${m}`;
        const displayTime = formatTimeString(timeString);
        
        options.push(
          <SelectItem key={timeString} value={timeString}>
            {displayTime}
          </SelectItem>
        );
      }
    }
    
    return options;
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
        <p>Sign in to configure reminders</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-500" />
          Hydration Reminders
        </CardTitle>
        <CardDescription>
          Set up reminders to help you stay hydrated throughout the day
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${settings.hydrationReminders ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              {settings.hydrationReminders ? <BellRing className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
            </div>
            <div>
              <p className="font-medium">Enable Hydration Reminders</p>
              <p className="text-sm text-gray-500">Get notifications to drink water regularly</p>
            </div>
          </div>
          <Switch 
            checked={settings.hydrationReminders} 
            onCheckedChange={handleToggleHydrationReminders}
            disabled={saving}
          />
        </div>
        
        <div className={settings.hydrationReminders ? '' : 'opacity-50 pointer-events-none'}>
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">Reminder Frequency</Label>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Every {settings.hydrationFrequency} minutes</span>
                </div>
                <Slider 
                  value={[settings.hydrationFrequency]} 
                  min={15}
                  max={120}
                  step={15}
                  onValueCommit={(value) => handleFrequencyChange(value[0])}
                  disabled={!settings.hydrationReminders || saving}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>15 min</span>
                  <span>30 min</span>
                  <span>60 min</span>
                  <span>90 min</span>
                  <span>120 min</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time" className="mb-2 block">Start Time</Label>
                <Select 
                  value={settings.hydrationStart}
                  onValueChange={(value) => handleTimeChange('hydrationStart', value)}
                  disabled={!settings.hydrationReminders || saving}
                >
                  <SelectTrigger id="start-time" className="w-full">
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions()}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Reminders will start at this time
                </p>
              </div>
              
              <div>
                <Label htmlFor="end-time" className="mb-2 block">End Time</Label>
                <Select 
                  value={settings.hydrationEnd}
                  onValueChange={(value) => handleTimeChange('hydrationEnd', value)}
                  disabled={!settings.hydrationReminders || saving}
                >
                  <SelectTrigger id="end-time" className="w-full">
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions()}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Reminders will stop at this time
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 text-sm text-gray-500 flex items-start gap-2 px-6">
        <Clock className="h-4 w-4 mt-0.5" />
        <p>
          Reminders will only be sent when you have the app open in your browser.
          For continuous reminders, consider enabling notifications in your device settings.
        </p>
      </CardFooter>
    </Card>
  );
};

export default HydrationReminderSettings; 