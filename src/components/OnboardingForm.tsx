
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useFirebaseContext } from '@/contexts/FirebaseContext';

const onboardingFormSchema = z.object({
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender.',
  }),
  age: z.coerce.number().min(12, "Age must be at least 12 years").max(100, "Age must be less than 100 years"),
  height: z.coerce.number().min(100, "Height must be at least 100 cm").max(250, "Height must be less than 250 cm"),
  weight: z.coerce.number().min(30, "Weight must be at least 30 kg").max(200, "Weight must be less than 200 kg"),
  goal: z.enum(['lose_weight', 'maintain_weight', 'gain_muscle', 'improve_health'], {
    required_error: 'Please select your fitness goal.',
  }),
  activity_level: z.enum(['sedentary', 'light', 'moderate', 'very_active', 'extremely_active'], {
    required_error: 'Please select your activity level.',
  }),
  dietary_preference: z.enum(['none', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo'], {
    required_error: 'Please select your dietary preference.',
  }),
  target_weight: z.coerce.number().min(30, "Target weight must be at least 30 kg").max(200, "Target weight must be less than 200 kg").optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

const OnboardingForm: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { user, syncUserWithSupabase } = useFirebaseContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      gender: undefined,
      age: 30,
      height: 170,
      weight: 70,
      goal: undefined,
      activity_level: undefined,
      dietary_preference: 'none',
      target_weight: 65,
    },
  });
  
  const selectedGoal = form.watch('goal');
  const currentWeight = form.watch('weight');
  
  async function onSubmit(data: OnboardingFormValues) {
    if (!user) {
      toast.error('You must be logged in to complete onboarding');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          gender: data.gender,
          age: data.age,
          height_cm: data.height,
          weight_kg: data.weight,
          fitness_goal: data.goal,
          activity_level: data.activity_level,
          dietary_preference: data.dietary_preference,
          target_weight_kg: data.target_weight,
          has_completed_onboarding: true,
        })
        .eq('id', user.uid);
        
      if (error) {
        throw error;
      }
      
      await syncUserWithSupabase();
      
      toast.success('Profile setup complete!');
      onComplete();
    } catch (error: any) {
      console.error('Error saving profile data:', error);
      toast.error('Failed to save your profile data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-wrap gap-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="other" />
                      </FormControl>
                      <FormLabel className="font-normal">Other</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (years)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Your age"
                    min="12"
                    max="100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Your height in cm"
                    min="100"
                    max="250"
                    {...field}
                  />
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
                <FormLabel>Current Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Your weight in kg"
                    min="30"
                    max="200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your primary fitness goal?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your fitness goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="maintain_weight">Maintain Weight</SelectItem>
                    <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                    <SelectItem value="improve_health">Improve Overall Health</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedGoal === "lose_weight" && (
            <FormField
              control={form.control}
              name="target_weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Your target weight in kg"
                      min={30}
                      max={currentWeight < 200 ? currentWeight - 1 : 199}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedGoal === "gain_muscle" && (
            <FormField
              control={form.control}
              name="target_weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Your target weight in kg"
                      min={currentWeight > 30 ? currentWeight + 1 : 31}
                      max={200}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="activity_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How active are you?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="extremely_active">Extremely active (very hard exercise & physical job)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dietary_preference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dietary Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your dietary preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No specific diet</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="keto">Ketogenic</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Complete Profile"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default OnboardingForm;
