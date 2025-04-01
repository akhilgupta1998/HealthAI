import React, { useState, useEffect } from 'react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { wearableService, WearableDevice } from '@/services/wearableService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Watch,
  Smartphone,
  Activity,
  Heart,
  Moon,
  Footprints,
  RefreshCw,
  Plus,
  Check,
  X,
  ArrowRight,
  Settings,
  Trash2,
  InfoIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const DeviceIcon = ({ type }: { type: WearableDevice['deviceType'] }) => {
  switch (type) {
    case 'apple_health':
      return <Watch className="h-5 w-5 text-slate-600" />;
    case 'fitbit':
      return <Activity className="h-5 w-5 text-indigo-600" />;
    case 'google_fit':
      return <Footprints className="h-5 w-5 text-green-600" />;
    case 'samsung_health':
      return <Heart className="h-5 w-5 text-blue-600" />;
    default:
      return <Smartphone className="h-5 w-5 text-gray-600" />;
  }
};

const WearableDeviceConnector: React.FC = () => {
  const { user } = useFirebaseContext();
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('devices');
  
  useEffect(() => {
    if (user) {
      loadUserDevices();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const loadUserDevices = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userDevices = await wearableService.getUserDevices(user.uid);
      setDevices(userDevices);
    } catch (error) {
      console.error('Error loading wearable devices:', error);
      toast.error('Failed to load connected devices');
    } finally {
      setLoading(false);
    }
  };
  
  const handleConnectAppleHealth = async () => {
    if (!user) {
      toast.error('Please sign in to connect devices');
      return;
    }
    
    try {
      const device = await wearableService.connectAppleHealth(user.uid);
      if (device) {
        toast.success('Apple Health connected successfully');
        setDevices([...devices, device]);
      } else {
        toast.error('Failed to connect Apple Health');
      }
    } catch (error) {
      console.error('Error connecting Apple Health:', error);
      toast.error('Failed to connect Apple Health');
    }
  };
  
  const handleConnectGoogleFit = async () => {
    if (!user) {
      toast.error('Please sign in to connect devices');
      return;
    }
    
    try {
      // In a real app, we would initiate OAuth flow here
      const authCode = 'simulated-auth-code';
      
      const device = await wearableService.connectGoogleFit(user.uid, authCode);
      if (device) {
        toast.success('Google Fit connected successfully');
        setDevices([...devices, device]);
      } else {
        toast.error('Failed to connect Google Fit');
      }
    } catch (error) {
      console.error('Error connecting Google Fit:', error);
      toast.error('Failed to connect Google Fit');
    }
  };
  
  const handleConnectFitbit = async () => {
    if (!user) {
      toast.error('Please sign in to connect devices');
      return;
    }
    
    try {
      // In a real app, we would initiate OAuth flow here
      const authCode = 'simulated-auth-code';
      
      const device = await wearableService.connectFitbit(user.uid, authCode);
      if (device) {
        toast.success('Fitbit connected successfully');
        setDevices([...devices, device]);
      } else {
        toast.error('Failed to connect Fitbit');
      }
    } catch (error) {
      console.error('Error connecting Fitbit:', error);
      toast.error('Failed to connect Fitbit');
    }
  };
  
  const handleDisconnectDevice = async (deviceId: string) => {
    try {
      await wearableService.disconnectDevice(deviceId);
      
      // Update local state
      setDevices(devices.map(device => 
        device.id === deviceId ? { ...device, isConnected: false } : device
      ));
      
      toast.success('Device disconnected');
    } catch (error) {
      console.error('Error disconnecting device:', error);
      toast.error('Failed to disconnect device');
    }
  };
  
  const handleUpdateDeviceSettings = async (deviceId: string, settings: Partial<WearableDevice['settings']>) => {
    try {
      const deviceToUpdate = devices.find(d => d.id === deviceId);
      if (!deviceToUpdate) return;
      
      await wearableService.updateDevice(deviceId, {
        settings: {
          ...deviceToUpdate.settings,
          ...settings
        }
      });
      
      // Update local state
      setDevices(devices.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              settings: {
                ...device.settings,
                ...settings
              }
            } 
          : device
      ));
      
      toast.success('Device settings updated');
    } catch (error) {
      console.error('Error updating device settings:', error);
      toast.error('Failed to update device settings');
    }
  };
  
  const handleSyncDevices = async () => {
    if (!user) return;
    
    try {
      setSyncing(true);
      const synced = await wearableService.syncWearableData(user.uid);
      
      if (synced) {
        toast.success('Device data synced successfully');
        // Reload devices to get updated lastSynced timestamps
        await loadUserDevices();
      } else {
        toast.error('No connected devices to sync');
      }
    } catch (error) {
      console.error('Error syncing devices:', error);
      toast.error('Failed to sync device data');
    } finally {
      setSyncing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="devices">Connected Devices</TabsTrigger>
          <TabsTrigger value="connect">Connect New Device</TabsTrigger>
        </TabsList>
        
        {/* Connected Devices Tab */}
        <TabsContent value="devices" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Connected Devices</h2>
            <Button 
              variant="outline" 
              onClick={handleSyncDevices}
              disabled={syncing || devices.filter(d => d.isConnected).length === 0}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
          
          {devices.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 pb-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                  <Watch className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No devices connected</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your fitness devices or health apps to sync your activity data.
                </p>
                <Button onClick={() => setActiveTab('connect')}>
                  Connect a Device
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.map(device => (
                <motion.div 
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={!device.isConnected ? 'opacity-60' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                          <div className="p-2 rounded-full bg-gray-100">
                            <DeviceIcon type={device.deviceType} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{device.deviceName}</CardTitle>
                            <CardDescription>
                              {device.isConnected ? 'Connected' : 'Disconnected'}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={device.isConnected ? 'default' : 'outline'}>
                          {device.isConnected ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="text-sm mb-4">
                        <p className="text-gray-500">
                          Last synced: {device.lastSynced 
                            ? formatDistanceToNow(device.lastSynced, { addSuffix: true }) 
                            : 'Never'}
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Footprints className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">Sync Steps</span>
                            </div>
                            <Switch 
                              checked={device.settings.syncSteps}
                              disabled={!device.isConnected}
                              onCheckedChange={(checked) => 
                                handleUpdateDeviceSettings(device.id!, { syncSteps: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">Sync Heart Rate</span>
                            </div>
                            <Switch 
                              checked={device.settings.syncHeartRate}
                              disabled={!device.isConnected}
                              onCheckedChange={(checked) => 
                                handleUpdateDeviceSettings(device.id!, { syncHeartRate: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Moon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">Sync Sleep</span>
                            </div>
                            <Switch 
                              checked={device.settings.syncSleep}
                              disabled={!device.isConnected}
                              onCheckedChange={(checked) => 
                                handleUpdateDeviceSettings(device.id!, { syncSleep: checked })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">Sync Workouts</span>
                            </div>
                            <Switch 
                              checked={device.settings.syncWorkouts}
                              disabled={!device.isConnected}
                              onCheckedChange={(checked) => 
                                handleUpdateDeviceSettings(device.id!, { syncWorkouts: checked })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline"
                        className="text-red-500"
                        onClick={() => handleDisconnectDevice(device.id!)}
                        disabled={!device.isConnected}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Disconnect
                      </Button>
                      
                      <Button 
                        variant={device.isConnected ? "outline" : "default"}
                        onClick={() => {
                          if (device.isConnected) {
                            handleSyncDevices();
                          } else {
                            // Reconnect logic would go here in a real app
                            toast.success('This would reconnect the device in a real app');
                          }
                        }}
                      >
                        {device.isConnected ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reconnect
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Data Privacy Notice */}
          <Card className="bg-slate-50 dark:bg-slate-900 mt-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Privacy Information</h3>
                  <p className="text-sm text-gray-500">
                    Your health data is stored securely and is only used to provide you with insights and recommendations.
                    We never share your health data with third parties without your explicit consent.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Connect New Device Tab */}
        <TabsContent value="connect" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Connect a Health Device or App</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Apple Health */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-black"></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Watch className="h-5 w-5" />
                    Apple Health
                  </CardTitle>
                </div>
                <CardDescription>
                  Connect to Apple Health on your iPhone or Apple Watch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Sync your steps, workouts, heart rate, and sleep data from Apple Health.
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="bg-slate-50">Steps</Badge>
                  <Badge variant="outline" className="bg-slate-50">Heart Rate</Badge>
                  <Badge variant="outline" className="bg-slate-50">Sleep</Badge>
                  <Badge variant="outline" className="bg-slate-50">Workouts</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleConnectAppleHealth}
                  disabled={devices.some(d => d.deviceType === 'apple_health' && d.isConnected)}
                  className="w-full"
                >
                  {devices.some(d => d.deviceType === 'apple_health' && d.isConnected) 
                    ? 'Already Connected' 
                    : 'Connect Apple Health'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Google Fit */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-blue-500"></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Footprints className="h-5 w-5 text-blue-500" />
                    Google Fit
                  </CardTitle>
                </div>
                <CardDescription>
                  Connect to Google Fit on your Android device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Sync your activity, heart points, and health data from Google Fit.
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="bg-slate-50">Steps</Badge>
                  <Badge variant="outline" className="bg-slate-50">Heart Points</Badge>
                  <Badge variant="outline" className="bg-slate-50">Activities</Badge>
                  <Badge variant="outline" className="bg-slate-50">Calories</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleConnectGoogleFit}
                  disabled={devices.some(d => d.deviceType === 'google_fit' && d.isConnected)}
                  className="w-full"
                >
                  {devices.some(d => d.deviceType === 'google_fit' && d.isConnected) 
                    ? 'Already Connected' 
                    : 'Connect Google Fit'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Fitbit */}
            <Card className="overflow-hidden">
              <div className="h-2 bg-indigo-500"></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-indigo-500" />
                    Fitbit
                  </CardTitle>
                </div>
                <CardDescription>
                  Connect your Fitbit device or account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Sync your activity, sleep, heart rate and more from your Fitbit device.
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="bg-slate-50">Steps</Badge>
                  <Badge variant="outline" className="bg-slate-50">Sleep</Badge>
                  <Badge variant="outline" className="bg-slate-50">Heart Rate</Badge>
                  <Badge variant="outline" className="bg-slate-50">Workouts</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleConnectFitbit}
                  disabled={devices.some(d => d.deviceType === 'fitbit' && d.isConnected)}
                  className="w-full"
                >
                  {devices.some(d => d.deviceType === 'fitbit' && d.isConnected) 
                    ? 'Already Connected' 
                    : 'Connect Fitbit'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Medical Disclaimer */}
          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 mt-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <InfoIcon className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium mb-1">Medical Disclaimer</h3>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    Health Guardian is designed for personal health tracking and is not a substitute for professional medical advice, 
                    diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any 
                    questions you may have regarding a medical condition.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WearableDeviceConnector; 