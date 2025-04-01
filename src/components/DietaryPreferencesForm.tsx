
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'eggetarian', label: 'Eggetarian' },
  { id: 'nonveg', label: 'Non-Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'keto', label: 'Ketogenic' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'lowcarb', label: 'Low Carb' },
  { id: 'glutenfree', label: 'Gluten Free' },
  { id: 'dairyfree', label: 'Dairy Free' },
];

const DietaryPreferencesForm = () => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleTogglePreference = (id: string) => {
    setSelectedPreferences(current => 
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    );
  };

  const handleSavePreferences = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your preferences",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          dietary_preferences: selectedPreferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Preferences saved",
        description: "Your dietary preferences have been updated",
      });
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Failed to save preferences",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dietary Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dietaryOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={selectedPreferences.includes(option.id)}
                onCheckedChange={() => handleTogglePreference(option.id)}
              />
              <Label htmlFor={option.id} className="font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        
        <Button 
          className="mt-6 w-full" 
          onClick={handleSavePreferences}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DietaryPreferencesForm;
