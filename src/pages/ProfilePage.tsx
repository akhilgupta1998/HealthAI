import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dumbbell, 
  Heart, 
  User, 
  Mail, 
  Calendar, 
  Ruler, 
  Weight, 
  AlertCircle,
  Check,
<<<<<<< HEAD
  Loader2,
  SunMoon,
  Palette
} from 'lucide-react';
import { toast } from 'sonner';
=======
  Loader2
} from 'lucide-react';
import { useClerkContext } from '@/contexts/ClerkContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
<<<<<<< HEAD
import { Switch } from "@/components/ui/switch";
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const formSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional(),
  bio: z.string().optional(),
  age: z.number().min(1).max(120).optional(),
  gender: z.string().optional(),
  height: z.number().min(1).max(300).optional(),
  weight: z.number().min(1).max(500).optional(),
  activityLevel: z.string().optional(),
  uiMode: z.enum(["classic", "modern"]).default("modern"),
  targetWeight: z.number().min(1).max(500).optional(),
  targetCalories: z.number().min(1).max(10000).optional(),
  fitnessGoals: z.array(z.string()).optional(),
  goalDescription: z.string().optional(),
  targetDate: z.string().optional(),
});

const ProfilePage = () => {
  const { user, updateProfile, userProfile } = useFirebaseContext();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [uiMode, setUiMode] = useState<string>("modern");
=======

const formSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  bio: z.string().optional(),
  age: z.coerce.number().int().min(10).max(120).optional().nullable(),
  gender: z.string().optional(),
  height: z.coerce.number().min(50).max(300).optional().nullable(),
  weight: z.coerce.number().min(20).max(500).optional().nullable(),
  activityLevel: z.string().optional(),
});

const ProfilePage = () => {
  const { userMetadata, userId } = useClerkContext();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      email: "",
      bio: "",
      age: null,
      gender: "",
      height: null,
      weight: null,
      activityLevel: "",
<<<<<<< HEAD
      uiMode: "modern",
      targetWeight: null,
      targetCalories: null,
      fitnessGoals: [],
      goalDescription: "",
      targetDate: "",
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    },
  });
  
  const fetchProfileData = async () => {
<<<<<<< HEAD
    if (!user?.uid) return;
    
    try {
      setIsLoading(true);
      
      // Get user profile data from Firebase
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfileData(userData);
        
        // Try to get UI preferences
        const uiPrefs = userData.uiPreferences || { mode: 'modern' };
        if (uiPrefs && uiPrefs.mode) {
          setUiMode(uiPrefs.mode);
          form.setValue('uiMode', uiPrefs.mode);
        }
        
        // Update form with fetched data
        form.reset({
          displayName: userData.displayName || user.displayName || "",
          email: user.email || "",
          bio: userData.bio || "",
          age: userData.age || null,
          gender: userData.gender || "",
          height: userData.height || null,
          weight: userData.weight || null,
          activityLevel: userData.activityLevel || "",
          uiMode: uiPrefs.mode || "modern",
          targetWeight: userData.targetWeight || null,
          targetCalories: userData.targetCalories || null,
          fitnessGoals: userData.fitnessGoals || [],
          goalDescription: userData.goalDescription || "",
          targetDate: userData.targetDate || "",
=======
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setProfileData(data);
        
        // Update form with fetched data
        form.reset({
          displayName: data.display_name || "",
          email: userMetadata?.email || "",
          bio: data.bio || "",
          age: data.age || null,
          gender: data.gender || "",
          height: data.height || null,
          weight: data.weight || null,
          activityLevel: data.activity_level || "",
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
        });
      } else {
        // Set default values if no profile exists
        form.reset({
<<<<<<< HEAD
          displayName: user.displayName || "",
          email: user.email || "",
=======
          displayName: userMetadata?.fullName || "",
          email: userMetadata?.email || "",
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
          bio: "",
          age: null,
          gender: "",
          height: null,
          weight: null,
          activityLevel: "",
<<<<<<< HEAD
          uiMode: "modern",
          targetWeight: null,
          targetCalories: null,
          fitnessGoals: [],
          goalDescription: "",
          targetDate: "",
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load your profile data');
<<<<<<< HEAD
    } finally {
      setIsLoading(false);
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    }
  };
  
  useEffect(() => {
    fetchProfileData();
<<<<<<< HEAD
  }, [user]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.uid) {
=======
  }, [userId, userMetadata]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) {
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
      toast.error('User not authenticated');
      return;
    }
    
    setIsLoading(true);
    
    try {
<<<<<<< HEAD
      // Prepare profile data
      const profileUpdates = {
        displayName: values.displayName,
        bio: values.bio || null,
        age: values.age || null,
        gender: values.gender || null,
        height: values.height || null,
        weight: values.weight || null,
        activityLevel: values.activityLevel || null,
        targetWeight: values.targetWeight || null,
        targetCalories: values.targetCalories || null,
        fitnessGoals: values.fitnessGoals || null,
        goalDescription: values.goalDescription || null,
        targetDate: values.targetDate || null,
        uiPreferences: { 
          mode: values.uiMode,
          updatedAt: new Date()
        },
        updatedAt: new Date(),
      };
      
      // Update profile in Firebase
      await updateProfile(profileUpdates);
      
      // Update UI mode if it changed
      if (values.uiMode !== uiMode) {
        setUiMode(values.uiMode);
        // Apply UI changes immediately
        document.body.classList.toggle('classic-mode', values.uiMode === 'classic');
      }
      
      toast.success('Profile updated successfully!', {
        description: 'Your changes have been saved.',
        action: {
          label: 'Dismiss',
          onClick: () => {},
        },
      });
      
      await fetchProfileData();
=======
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          display_name: values.displayName,
          bio: values.bio || null,
          age: values.age || null,
          gender: values.gender || null,
          height: values.height || null,
          weight: values.weight || null,
          activity_level: values.activityLevel || null,
          updated_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
      fetchProfileData();
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'lightly-active', label: 'Lightly Active (light exercise 1-3 days/week)' },
    { value: 'moderately-active', label: 'Moderately Active (moderate exercise 3-5 days/week)' },
    { value: 'very-active', label: 'Very Active (hard exercise 6-7 days/week)' },
    { value: 'extra-active', label: 'Extra Active (very hard exercise & physical job)' },
  ];
  
  const calculateBMI = () => {
    const height = form.getValues('height');
    const weight = form.getValues('weight');
    
    if (!height || !weight) return null;
    
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    return bmi.toFixed(1);
  };
  
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' };
    return { category: 'Obese', color: 'text-red-500' };
  };
  
  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;
  
<<<<<<< HEAD
  // Add effect to apply UI mode when component mounts
  useEffect(() => {
    document.body.classList.toggle('classic-mode', uiMode === 'classic');
    
    return () => {
      // Clean up on unmount
      document.body.classList.remove('classic-mode');
    };
  }, [uiMode]);
  
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  return (
    <div className="container mx-auto p-4 md:p-6 pt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-10" placeholder="Your name" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-10" 
<<<<<<< HEAD
                                placeholder={user?.email || "your@email.com"} 
=======
                                placeholder="your@email.com" 
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
                                {...field} 
                                disabled 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Email cannot be changed
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us a little about yourself" 
                            className="resize-none" 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="number" 
                                className="pl-10" 
                                placeholder="Age" 
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => {
                                  const value = e.target.value ? parseInt(e.target.value) : null;
                                  field.onChange(value);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non-binary">Non-binary</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Level</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select activity level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {activityLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="number" 
                                className="pl-10" 
                                placeholder="Height in cm" 
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => {
                                  const value = e.target.value ? parseInt(e.target.value) : null;
                                  field.onChange(value);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Weight className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="number" 
                                className="pl-10" 
                                placeholder="Weight in kg" 
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => {
                                  const value = e.target.value ? parseInt(e.target.value) : null;
                                  field.onChange(value);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
<<<<<<< HEAD
                  {/* UI Mode Preferences */}
                  <FormField
                    control={form.control}
                    name="uiMode"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Interface Style</FormLabel>
                          <FormDescription>
                            Choose between a modern interface with animations or a classic, simpler interface
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div 
                            className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${field.value === 'modern' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/20'}`}
                            onClick={() => field.onChange('modern')}
                          >
                            <Palette className="h-6 w-6 mb-2 text-primary" />
                            <div className="font-medium">Modern</div>
                            <div className="text-xs text-muted-foreground text-center mt-1">
                              Feature-rich with animations and visual effects
                            </div>
                            {field.value === 'modern' && (
                              <div className="w-4 h-4 mt-2 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div 
                            className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${field.value === 'classic' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/20'}`}
                            onClick={() => field.onChange('classic')}
                          >
                            <SunMoon className="h-6 w-6 mb-2 text-primary" />
                            <div className="font-medium">Classic</div>
                            <div className="text-xs text-muted-foreground text-center mt-1">
                              Simplified interface with better accessibility
                            </div>
                            {field.value === 'classic' && (
                              <div className="w-4 h-4 mt-2 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Accordion type="single" collapsible className="w-full mb-6">
                    <AccordionItem value="goals">
                      <AccordionTrigger className="text-lg font-semibold">Health Goals</AccordionTrigger>
                      <AccordionContent className="pt-4 pb-2">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                              <Input
                                id="targetWeight"
                                type="number"
                                placeholder="Target weight in kg"
                                value={form.getValues('targetWeight') || ''}
                                onChange={(e) => form.setValue('targetWeight', parseFloat(e.target.value) || undefined)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="targetCalories">Daily Calorie Goal</Label>
                              <Input
                                id="targetCalories"
                                type="number"
                                placeholder="Daily calorie target"
                                value={form.getValues('targetCalories') || ''}
                                onChange={(e) => form.setValue('targetCalories', parseFloat(e.target.value) || undefined)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Fitness Goals</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'Overall Health', 'Sports Performance'].map((goal) => (
                                <div key={goal} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={goal.toLowerCase().replace(/\s+/g, '-')}
                                    checked={(form.getValues('fitnessGoals') || []).includes(goal)}
                                    onCheckedChange={(checked) => {
                                      const currentGoals = form.getValues('fitnessGoals') || [];
                                      form.setValue('fitnessGoals', checked 
                                        ? [...currentGoals, goal]
                                        : currentGoals.filter(g => g !== goal));
                                    }}
                                  />
                                  <Label 
                                    htmlFor={goal.toLowerCase().replace(/\s+/g, '-')}
                                    className="text-sm font-normal"
                                  >
                                    {goal}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="goalDescription">Personal Goal Statement</Label>
                            <Textarea
                              id="goalDescription"
                              placeholder="Describe your personal health and fitness goals..."
                              value={form.getValues('goalDescription') || ''}
                              onChange={(e) => form.setValue('goalDescription', e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Target Date</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input
                                type="date"
                                value={form.getValues('targetDate') || ''}
                                onChange={(e) => form.setValue('targetDate', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics</CardTitle>
              <CardDescription>Your current health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              {bmi ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold">{bmi}</div>
                    <div className={`text-sm ${bmiCategory?.color}`}>
                      {bmiCategory?.category}
                    </div>
                    <div className="text-xs text-muted-foreground">Body Mass Index</div>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${Math.min(parseFloat(bmi) / 40 * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                  
                  <Alert className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>BMI Information</AlertTitle>
                    <AlertDescription>
                      BMI is a screening tool but doesn't diagnose body fatness or health. Consult a healthcare provider for proper assessment.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">No metrics available</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your height and weight to see your BMI and other health metrics
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
              <CardDescription>Your fitness profile</CardDescription>
            </CardHeader>
            <CardContent>
              {form.getValues('activityLevel') ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Dumbbell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Activity Level</p>
                      <p className="text-sm text-muted-foreground">
                        {activityLevels.find(level => level.value === form.getValues('activityLevel'))?.label}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Recommended daily water intake</span>
                      <span className="text-sm font-medium">8 glasses</span>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Recommended weekly activity</span>
                      <span className="text-sm font-medium">150 minutes</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-2">No activity data</h3>
                  <p className="text-muted-foreground mb-4">
                    Set your activity level to get personalized recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
