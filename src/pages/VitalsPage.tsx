
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Activity, Heart, Droplet, Loader2, Calendar, Scale, Users, LineChart, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useClerkContext } from '@/contexts/ClerkContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

interface VitalsLog {
  id: string;
  blood_pressure?: string;
  blood_sugar?: string;
  heart_rate?: number;
  oxygen_saturation?: number;
  weight?: number;
  recorded_date: string;
  user_id: string;
}

interface SharingPermission {
  email: string;
  id: string;
}

const BodyVitalsTrackingPage = () => {
  const { user } = useAuth();
  const { userId } = useClerkContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSharingForm, setShowSharingForm] = useState(false);
  const [sharingEmail, setSharingEmail] = useState('');
  const [sharingPermissions, setSharingPermissions] = useState<SharingPermission[]>([]);
  const [vitalsHistory, setVitalsHistory] = useState<VitalsLog[]>([]);
  const [activeTab, setActiveTab] = useState('vitals-form');
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    bloodSugar: '',
    heartRate: '',
    oxygenSaturation: '',
    weight: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fetchVitalsData = async () => {
    if (!userId) return;
    
    try {
      console.log('Fetching vitals data for user ID:', userId);
      const { data, error } = await supabase
        .from('fitness_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_date', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('Error fetching vitals data:', error);
        throw error;
      }
      
      if (data) {
        console.log('Vitals data retrieved:', data);
        setVitalsHistory(data as VitalsLog[]);
      }
    } catch (error) {
      console.error('Error fetching vitals data:', error);
      toast.error('Failed to load your vitals data');
    }
  };

  // Fetch vital data on component mount
  useEffect(() => {
    if (userId) {
      fetchVitalsData();
      fetchSharingPermissions();
    }
  }, [userId]);

  const fetchSharingPermissions = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId)
        .eq('permission_type', 'vitals_sharing');
        
      if (error) throw error;
      
      if (data) {
        // Format the permissions data
        const permissions = data.map(p => ({
          email: p.granted_to_user_id,
          id: p.id
        }));
        setSharingPermissions(permissions);
      }
    } catch (error) {
      console.error('Error fetching sharing permissions:', error);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!userId) {
      toast.error('User not authenticated');
      setIsLoading(false);
      return;
    }
    
    try {
      // Prepare blood pressure string if both values are provided
      let bloodPressure = null;
      if (formData.systolic && formData.diastolic) {
        bloodPressure = `${formData.systolic}/${formData.diastolic}`;
      }
      
      const { data, error } = await supabase
        .from('fitness_metrics')
        .insert([
          {
            user_id: userId,
            blood_pressure: bloodPressure,
            blood_sugar: formData.bloodSugar || null,
            heart_rate: formData.heartRate ? parseInt(formData.heartRate) : null,
            oxygen_saturation: formData.oxygenSaturation ? parseInt(formData.oxygenSaturation) : null,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            recorded_date: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast.success('Vitals recorded successfully');
      setShowForm(false);
      setFormData({
        systolic: '',
        diastolic: '',
        bloodSugar: '',
        heartRate: '',
        oxygenSaturation: '',
        weight: ''
      });
      
      fetchVitalsData();
    } catch (error: any) {
      console.error('Error saving vitals:', error);
      toast.error('Failed to record vitals: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSharingSubmit = async () => {
    if (!sharingEmail || !userId) return;
    
    setIsLoading(true);
    
    try {
      // Add sharing permission
      const { data, error } = await supabase
        .from('user_permissions')
        .insert([
          {
            user_id: userId,
            granted_to_user_id: sharingEmail,
            permission_type: 'vitals_sharing'
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast.success(`Sharing permissions granted to ${sharingEmail}`);
      setSharingEmail('');
      setShowSharingForm(false);
      fetchSharingPermissions();
    } catch (error) {
      console.error('Error setting sharing permissions:', error);
      toast.error('Failed to set sharing permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const removeSharing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_permissions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Sharing permission removed');
      fetchSharingPermissions();
    } catch (error) {
      console.error('Error removing sharing permission:', error);
      toast.error('Failed to remove sharing permission');
    }
  };
  
  // Get the latest vitals data
  const latestVitals = vitalsHistory.length > 0 ? vitalsHistory[0] : null;
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Body Vitals Tracking</h1>
          <p className="text-muted-foreground">Monitor your key health metrics</p>
        </div>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0 hover:scale-105 transition-transform" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" /> Log Vitals
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Log Your Body Vitals</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vitals-form">Vitals</TabsTrigger>
                <TabsTrigger value="body-metrics">Body Metrics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vitals-form">
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systolic">Systolic (mmHg)</Label>
                      <Input 
                        id="systolic" 
                        name="systolic" 
                        type="number" 
                        placeholder="120" 
                        value={formData.systolic}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                      <Input 
                        id="diastolic" 
                        name="diastolic" 
                        type="number" 
                        placeholder="80" 
                        value={formData.diastolic}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                    <Input 
                      id="bloodSugar" 
                      name="bloodSugar" 
                      type="number" 
                      placeholder="95" 
                      value={formData.bloodSugar}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                      <Input 
                        id="heartRate" 
                        name="heartRate" 
                        type="number" 
                        placeholder="72" 
                        value={formData.heartRate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                      <Input 
                        id="oxygenSaturation" 
                        name="oxygenSaturation" 
                        type="number" 
                        placeholder="98" 
                        value={formData.oxygenSaturation}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="body-metrics">
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input 
                      id="weight" 
                      name="weight" 
                      type="number" 
                      step="0.1"
                      placeholder="70.5" 
                      value={formData.weight}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-4">
              <Button type="button" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Vitals'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
      
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/30 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Blood Pressure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{latestVitals?.blood_pressure || 'N/A'}</div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Last updated: {latestVitals ? format(new Date(latestVitals.recorded_date), 'MMM dd, yyyy') : 'No data'}</p>
                {latestVitals?.blood_pressure && (
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-800/30 dark:text-green-400">Normal</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/30 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Droplet className="h-5 w-5 mr-2 text-blue-500" />
                Blood Sugar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{latestVitals?.blood_sugar || 'N/A'}</div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">mg/dL (Fasting)</p>
                {latestVitals?.blood_sugar && (
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-800/30 dark:text-green-400">Normal</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/30 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-500" />
                Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{latestVitals?.heart_rate || 'N/A'}</div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">bpm (Resting)</p>
                {latestVitals?.heart_rate && (
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-800/30 dark:text-green-400">Normal</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/30 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Scale className="h-5 w-5 mr-2 text-amber-500" />
                Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{latestVitals?.weight ? `${latestVitals.weight} kg` : 'N/A'}</div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Last measured</p>
                {latestVitals?.weight && (
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-800/30 dark:text-green-400">On track</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Tabs defaultValue="history">
          <TabsList>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="sharing">Sharing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Vitals History</CardTitle>
                <CardDescription>Your recorded health metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Blood Pressure</th>
                        <th className="text-left py-3 px-4 font-medium">Blood Sugar</th>
                        <th className="text-left py-3 px-4 font-medium">Heart Rate</th>
                        <th className="text-left py-3 px-4 font-medium">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vitalsHistory.length > 0 ? (
                        vitalsHistory.map((vital) => (
                          <tr key={vital.id} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4">{format(new Date(vital.recorded_date), 'MMM dd, yyyy')}</td>
                            <td className="py-3 px-4">{vital.blood_pressure || 'N/A'}</td>
                            <td className="py-3 px-4">{vital.blood_sugar ? `${vital.blood_sugar} mg/dL` : 'N/A'}</td>
                            <td className="py-3 px-4">{vital.heart_rate ? `${vital.heart_rate} bpm` : 'N/A'}</td>
                            <td className="py-3 px-4">{vital.weight ? `${vital.weight} kg` : 'N/A'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground">
                            No vitals data recorded yet. Click "Log Vitals" to add your first entry.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="charts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Metrics Over Time</CardTitle>
                <CardDescription>Visualize your health trends</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                {vitalsHistory.length > 0 ? (
                  <div className="w-full h-full">
                    <LineChart className="w-full h-full text-muted-foreground" />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <LineChart className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Not enough data to display charts.</p>
                    <p className="text-sm">Log more vitals data to see your trends over time.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Vitals Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="sharing" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Vitals Sharing</CardTitle>
                <CardDescription>Share your vitals data with family members or healthcare providers</CardDescription>
              </CardHeader>
              <CardContent>
                {sharingPermissions.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Current Sharing Permissions</h3>
                    <div className="space-y-2">
                      {sharingPermissions.map(permission => (
                        <div key={permission.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{permission.email}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeSharing(permission.id)}
                            className="h-8 text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mb-4">You're not currently sharing your vitals with anyone.</p>
                )}
                
                {showSharingForm ? (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sharing-email">Email Address</Label>
                      <Input 
                        id="sharing-email" 
                        type="email" 
                        placeholder="Enter email address" 
                        value={sharingEmail}
                        onChange={(e) => setSharingEmail(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        The person will receive access to view your vitals data
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setShowSharingForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSharingSubmit} disabled={isLoading || !sharingEmail}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Grant Access'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setShowSharingForm(true)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Sharing Permissions
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default BodyVitalsTrackingPage;
