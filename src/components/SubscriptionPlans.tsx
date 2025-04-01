
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Plan {
  id: string;
  title: string;
  price: number;
  currency: string;
  period: 'month' | 'year';
  features: string[];
  popularTag?: boolean;
  trialDays: number;
}

const SubscriptionPlans = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');
  const [isIndia, setIsIndia] = useState(false);
  
  useEffect(() => {
    // Detect if user is from India based on browser language
    const isIndianUser = navigator.language.includes('en-IN') || 
                         navigator.language.includes('hi-IN') ||
                         window.location.hostname.endsWith('.in');
    setIsIndia(isIndianUser);
  }, []);

  const getPlans = (): Plan[] => {
    if (isIndia) {
      return [
        {
          id: 'basic',
          title: 'Basic Plan',
          price: selectedPeriod === 'month' ? 49 : 499,
          currency: 'INR',
          period: selectedPeriod,
          trialDays: 15,
          features: [
            'Personalized nutrition tracking',
            'Basic workout plans',
            'Water intake tracking',
            'Weight progress monitoring',
            'Daily habit tracking',
            'Limited AI recommendations',
            '15-day free trial'
          ]
        },
        {
          id: 'pro',
          title: 'Pro Plan',
          price: selectedPeriod === 'month' ? 199 : 1999,
          currency: 'INR',
          period: selectedPeriod,
          trialDays: 15,
          features: [
            'All Basic Plan features',
            'Advanced AI-powered meal recommendations',
            'Unlimited food scanning',
            'Premium workout plans',
            'Advanced health analytics',
            'Priority customer support',
            'Offline access',
            '15-day free trial'
          ],
          popularTag: true
        }
      ];
    } else {
      // International pricing
      return [
        {
          id: 'basic',
          title: 'Basic Plan',
          price: selectedPeriod === 'month' ? 4.99 : 49.99,
          currency: 'USD',
          period: selectedPeriod,
          trialDays: 15,
          features: [
            'Personalized nutrition tracking',
            'Basic workout plans',
            'Water intake tracking',
            'Weight progress monitoring',
            'Daily habit tracking',
            'Limited AI recommendations',
            '15-day free trial'
          ]
        },
        {
          id: 'pro',
          title: 'Pro Plan',
          price: selectedPeriod === 'month' ? 14.99 : 149.99,
          currency: 'USD',
          period: selectedPeriod,
          trialDays: 15,
          features: [
            'All Basic Plan features',
            'Advanced AI-powered meal recommendations',
            'Unlimited food scanning',
            'Premium workout plans',
            'Advanced health analytics',
            'Priority customer support',
            'Offline access',
            '15-day free trial'
          ],
          popularTag: true
        }
      ];
    }
  };

  const handleSubscribe = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // In a real application, this would redirect to a payment gateway
      alert('Coming soon! This feature will be available shortly.');
    }, 1000);
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'INR') {
      return `₹${amount}`;
    }
    return `$${amount}`;
  };

  const plans = getPlans();

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
          <p className="text-muted-foreground">
            Unlock premium features to supercharge your health journey
          </p>
          
          <div className="flex items-center justify-center mt-6">
            <div className="bg-muted p-1 rounded-full flex">
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPeriod === 'month' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPeriod('year')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedPeriod === 'year' 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Annually
                <span className="ml-1 text-xs text-accent bg-accent/20 px-2 py-0.5 rounded-full">
                  Save 16%
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative overflow-hidden ${plan.popularTag ? 'border-primary shadow-md' : ''}`}>
              {plan.popularTag && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{plan.title}</CardTitle>
                <CardDescription>
                  {plan.period === 'month' ? 'Billed monthly' : 'Billed annually'}
                </CardDescription>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">
                    {formatCurrency(plan.price, plan.currency)}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    /{plan.period === 'month' ? 'mo' : 'yr'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="mb-4 mt-1">
                  <span className="text-sm text-primary font-medium inline-block bg-primary/10 rounded-full px-2 py-0.5">
                    {plan.trialDays}-day free trial
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span className="text-sm">{feature}</span>
                      {feature.includes('AI') && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">
                                Our AI-powered features help you get personalized recommendations based on your health data.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full transition-all" 
                  variant={plan.popularTag ? "default" : "outline"}
                  onClick={handleSubscribe}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Start Free Trial'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>All plans include a {plans[0].trialDays}-day free trial. Cancel anytime.</p>
          <p className="mt-1">By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
