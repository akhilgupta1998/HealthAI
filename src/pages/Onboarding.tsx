
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { Check, Loader2, ArrowRight } from 'lucide-react';
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
import { motion } from 'framer-motion';

// Define validation schema with reasonable min/max values
const profileSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }).max(50, {
    message: "Display name must not exceed 50 characters."
  }),
  age: z.coerce.number().int()
    .min(13, { message: "Age must be at least 13 years" })
    .max(120, { message: "Age must be less than 120 years" })
    .optional().nullable(),
  gender: z.string().optional(),
  height: z.coerce.number()
    .min(50, { message: "Height must be at least 50 cm" })
    .max(300, { message: "Height must be less than 300 cm" })
    .optional().nullable(),
  weight: z.coerce.number()
    .min(20, { message: "Weight must be at least 20 kg" })
    .max(500, { message: "Weight must be less than 500 kg" })
    .optional().nullable(),
  goalWeight: z.coerce.number()
    .min(20, { message: "Goal weight must be at least 20 kg" })
    .max(500, { message: "Goal weight must be less than 500 kg" })
    .optional().nullable(),
  activityLevel: z.string().optional(),
  dietaryPreferences: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { userMetadata, userId, syncUserWithSupabase, isAuthenticated, user } = useFirebaseContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Create form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: userMetadata?.fullName || '',
      age: null,
      gender: undefined,
      height: null,
      weight: null,
      goalWeight: null,
      activityLevel: undefined,
      dietaryPreferences: [],
    },
    mode: "onBlur",
  });

  useEffect(() => {
    // Populate form with user data if available
    if (userMetadata) {
      form.setValue('displayName', userMetadata.fullName || userMetadata.display_name || '');
      
      if (userMetadata.age) form.setValue('age', userMetadata.age);
      if (userMetadata.gender) form.setValue('gender', userMetadata.gender);
      if (userMetadata.height) form.setValue('height', userMetadata.height);
      if (userMetadata.weight) form.setValue('weight', userMetadata.weight);
      if (userMetadata.goal_weight) form.setValue('goalWeight', userMetadata.goal_weight);
      if (userMetadata.activity_level) form.setValue('activityLevel', userMetadata.activity_level);
      
      // Set dietary preferences if available
      if (userMetadata.dietary_preferences && Array.isArray(userMetadata.dietary_preferences)) {
        setDietaryPreferences(userMetadata.dietary_preferences);
      }
    }
    
    // Debug user authentication state
    console.log("Auth State in Onboarding:", { 
      isAuthenticated, 
      userId, 
      user: user?.uid,
      userMetadata
    });
    
    setAuthInitialized(true);
  }, [userMetadata, form, isAuthenticated, userId, user]);

  const handleToggleDietaryPreference = (preference: string) => {
    setDietaryPreferences(prev => {
      if (prev.includes(preference)) {
        return prev.filter(p => p !== preference);
      } else {
        return [...prev, preference];
      }
    });
  };

  const handleSubmit = async (values: ProfileFormValues) => {
    setSubmitAttempted(true);
    setSubmitError(null);
    console.log("Submit clicked with values:", values);
    console.log("Current auth state:", { isAuthenticated, userId, user });
    
    // Get user ID from Firebase context first, fallback to userMetadata
    const currentUserId = user?.uid || userId || userMetadata?.id;
    
    if (!currentUserId) {
      const errorMsg = 'User not authenticated. Please sign in again.';
      setSubmitError(errorMsg);
      toast.error(errorMsg);
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    console.log("Submitting profile with user ID:", currentUserId);

    try {
      // Sync with Supabase to ensure user exists
      await syncUserWithSupabase();
      
      console.log("Updating profile in Supabase:", {
        id: currentUserId,
        display_name: values.displayName,
        ...values
      });
      
      // Update user profile in Supabase using upsert to create if not exists
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: currentUserId,
          display_name: values.displayName,
          age: values.age,
          gender: values.gender,
          height: values.height,
          weight: values.weight,
          goal_weight: values.goalWeight,
          activity_level: values.activityLevel,
          dietary_preferences: dietaryPreferences,
          has_completed_onboarding: true,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error updating profile:', error);
        setSubmitError('Failed to update your profile. Please try again.');
        throw error;
      }
      
      console.log("Profile updated successfully");
      
      // Sync with Supabase again to update context
      await syncUserWithSupabase();
      
      toast.success('Profile set up successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMsg = 'Failed to update your profile. Please try again.';
      setSubmitError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate first page fields
      form.trigger(['displayName', 'age', 'gender']).then(isValid => {
        if (isValid) {
          setCurrentStep(2);
        }
      });
    }
    
    else if (currentStep === 2) {
      // Validate second page fields
      form.trigger(['height', 'weight', 'goalWeight', 'activityLevel']).then(isValid => {
        if (isValid) {
          setCurrentStep(3);
        }
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Age" 
                        {...field}
                        value={field.value || ''}
                        min={13}
                        max={120}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (isNaN(value)) {
                            field.onChange(null);
                          } else if (value < 13) {
                            field.onChange(13);
                          } else if (value > 120) {
                            field.onChange(120);
                          } else {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">Must be between 13 and 120</FormDescription>
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
            </div>
            
            <div className="flex justify-end">
              <Button onClick={nextStep} type="button">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Physical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Height in cm" 
                        {...field}
                        value={field.value || ''}
                        min={50}
                        max={300}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (isNaN(value)) {
                            field.onChange(null);
                          } else if (value < 50) {
                            field.onChange(50);
                          } else if (value > 300) {
                            field.onChange(300);
                          } else {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">Must be between 50cm and 300cm</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Weight (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Weight in kg" 
                        {...field}
                        value={field.value || ''}
                        min={20}
                        max={500}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (isNaN(value)) {
                            field.onChange(null);
                          } else if (value < 20) {
                            field.onChange(20);
                          } else if (value > 500) {
                            field.onChange(500);
                          } else {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">Must be between 20kg and 500kg</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="goalWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Weight (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Goal weight in kg" 
                        {...field}
                        value={field.value || ''}
                        min={20}
                        max={500}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (isNaN(value)) {
                            field.onChange(null);
                          } else if (value < 20) {
                            field.onChange(20);
                          } else if (value > 500) {
                            field.onChange(500);
                          } else {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">Must be between 20kg and 500kg</FormDescription>
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
                        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                        <SelectItem value="lightly-active">Lightly Active (1-3 days/week)</SelectItem>
                        <SelectItem value="moderately-active">Moderately Active (3-5 days/week)</SelectItem>
                        <SelectItem value="very-active">Very Active (6-7 days/week)</SelectItem>
                        <SelectItem value="extra-active">Extra Active (physical job or 2x training)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline" type="button">
                Back
              </Button>
              <Button onClick={nextStep} type="button">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Dietary Preferences</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Vegan", "Vegetarian", "Pescatarian", "Keto", "Paleo", "Gluten-Free", 
                "Dairy-Free", "Low-Carb", "Mediterranean", "High-Protein"].map((diet) => (
                <Button
                  key={diet}
                  type="button"
                  variant={dietaryPreferences.includes(diet) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleToggleDietaryPreference(diet)}
                >
                  {dietaryPreferences.includes(diet) && <Check className="mr-2 h-4 w-4" />}
                  {diet}
                </Button>
              ))}
            </div>
            
            {submitError && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
                Error: {submitError}. Please try again or refresh the page.
              </div>
            )}
            
            <div className="flex justify-between">
              <Button onClick={prevStep} variant="outline" type="button">
                Back
              </Button>
              <Button 
                onClick={form.handleSubmit(handleSubmit)} 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Setup <Check className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Show loading while waiting for auth
  if (!authInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <span className="text-xl font-medium">Loading your profile...</span>
          <p className="text-sm text-muted-foreground mt-2">Please wait while we prepare your experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 pt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Health Guardian!</h1>
          <p className="text-muted-foreground">Let's set up your profile to get started</p>
        </div>
      </div>
      
      <Card className="md:w-2/3 lg:w-1/2 mx-auto">
        <CardHeader>
          <CardTitle>Profile Setup</CardTitle>
          <CardDescription>
            Tell us about yourself so we can personalize your experience
          </CardDescription>
          <div className="flex justify-between mt-4">
            {[1, 2, 3].map((step) => (
              <div 
                key={step} 
                className={`flex flex-col items-center ${currentStep === step ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 
                    ${currentStep === step 
                      ? 'bg-primary text-primary-foreground' 
                      : currentStep > step 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'}`}
                >
                  {currentStep > step ? <Check className="h-5 w-5" /> : step}
                </div>
                <span className="text-xs">
                  {step === 1 ? 'Basic Info' : step === 2 ? 'Physical Info' : 'Preferences'}
                </span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Form {...form}>
              <form>{getStepContent()}</form>
            </Form>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
