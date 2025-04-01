
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChevronRight } from 'lucide-react';

const emailSchema = z.string().email({ message: "Please enter a valid email address" });

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate email
      emailSchema.parse(email);
      setError(null);
      setIsLoading(true);
      
      // Check if email already exists
      const { data: existingEmails } = await supabase
        .from('waitlist')
        .select('email')
        .eq('email', email)
        .single();
      
      if (existingEmails) {
        toast.info("You're already on our waitlist!");
        setEmail('');
        return;
      }
      
      // Add to waitlist
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([{ email }]);
      
      if (insertError) throw insertError;
      
      toast.success("You've been added to our waitlist!");
      setEmail('');
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error("Failed to join waitlist. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-0 shadow-lg max-w-3xl mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl md:text-3xl">Join our waitlist</CardTitle>
            <CardDescription className="text-base">
              Be among the first to experience our revolutionary health tracking app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`bg-white/50 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              <Button 
                type="submit" 
                className="w-full font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Joining...' : 'Join Waitlist'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </div>
        <div className="hidden md:block md:w-1/2 bg-gradient-to-b from-primary/30 to-accent/30 p-8">
          <div className="h-full flex flex-col justify-center">
            <h3 className="font-bold text-xl mb-4">Why join our waitlist?</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary text-sm font-bold">1</span>
                </div>
                <span>Early access to our premium features</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary text-sm font-bold">2</span>
                </div>
                <span>Exclusive discounts for early adopters</span>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary text-sm font-bold">3</span>
                </div>
                <span>Priority support and personalized guidance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WaitlistForm;
