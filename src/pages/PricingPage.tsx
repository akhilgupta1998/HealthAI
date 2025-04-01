<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, X, Sparkles, Shield, Users, Building, Star, ArrowRight, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const PricingPage = () => {
  const navigate = useNavigate();
  const [companyEmail, setCompanyEmail] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

=======

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PricingPage = () => {
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

<<<<<<< HEAD
  const handleB2BSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Thank you! Our team will contact you shortly');
      setCompanyEmail('');
      setCompanySize('');
      setIsSubmitting(false);
    }, 1500);
  };

  const plans = [
    {
      name: 'Basic Plan',
      price: '29',
      period: 'per month',
      description: 'Perfect for individuals starting their health journey',
      features: [
        '15-day free trial',
        'Meal tracking & nutrition analysis',
        'Exercise logging & tracking',
        'Basic health vitals monitoring',
        'Weight & body metrics tracking',
        'Daily water intake tracker',
        'Weekly health reports',
        'Mobile app access',
      ],
      cta: 'Start Free Trial',
      url: '/login?signup=true',
      popular: false,
      highlight: false,
      badge: '15-DAY FREE TRIAL'
    },
    {
      name: 'Pro Plan',
      price: '99',
      period: 'per month',
      description: 'Advanced features for health enthusiasts',
      features: [
        'Everything in Basic plan',
        'AI food recognition',
        'Personalized meal recommendations',
        'Custom workout plans',
        'Advanced health analytics',
        'Voice-based AI assistant',
        'Unlimited chat with Mia (AI Health Expert)',
        'Premium content & guides',
        'Priority customer support',
      ],
      cta: 'Start Free Trial',
      url: '/login?signup=true&plan=pro',
      popular: true,
      highlight: true,
      badge: 'MOST POPULAR'
=======
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Basic features for personal use',
      features: [
        'Basic meal tracking',
        'Limited food database access',
        'Weight tracking',
        'Basic progress reports',
        'Mobile app access',
      ],
      notIncluded: [
        'AI food recognition',
        'Advanced analytics',
        'Meal recommendations',
        'Personalized meal plans',
        'Priority support',
      ],
      cta: 'Get Started',
      url: '/login?signup=true',
      popular: false,
      disabled: false
    },
    {
      name: 'Premium Monthly',
      price: '0.99',
      priceIndia: '₹49',
      period: 'per month',
      description: 'Advanced features for health enthusiasts',
      features: [
        'Unlimited meal tracking',
        'Full food database access',
        'AI food recognition',
        'Advanced analytics',
        'Custom meal plans',
        'Personalized recommendations',
        'Priority support',
      ],
      cta: 'Coming Soon',
      url: '#',
      popular: true,
      disabled: true
    },
    {
      name: 'Premium Annual',
      price: '9.99',
      priceIndia: '₹499',
      period: 'per year',
      description: 'Best value for dedicated users',
      features: [
        'All Premium Monthly features',
        'Save 15% vs monthly plan',
        'Exclusive content access',
        'Advanced health analytics',
        'Export data to CSV/PDF',
      ],
      cta: 'Coming Soon',
      url: '#',
      popular: false,
      disabled: true
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    },
  ];

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-purple-950 flex flex-col">
      <Helmet>
        <title>Pricing | Health Guardian</title>
        <meta name="description" content="Choose the right plan for your health journey with Health Guardian." />
      </Helmet>
      
      <header className="w-full py-4 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <Link to="/" className="flex items-center">
          <Heart className="h-8 w-8 text-purple-600 mr-2" />
          <h1 className="text-2xl font-bold">Health Guardian</h1>
        </Link>
        
        <Link 
          to="/" 
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </header>

      <main className="flex-grow pt-16">
        <div className="flex-1 container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Health Journey</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Select the plan that fits your health and wellness goals
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm inline-flex">
              <button className="px-6 py-2 rounded-full bg-purple-600 text-white font-medium">
                Monthly
              </button>
              <button className="px-6 py-2 rounded-full text-gray-700 dark:text-gray-300 font-medium">
                Annual
              </button>
            </div>
            <div className="ml-4 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              Save 20%
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div 
                key={index}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                  plan.highlight 
                    ? 'border-2 border-primary shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15 hover:-translate-y-1' 
                    : 'border border-border hover:border-primary/50 hover:shadow-md hover:-translate-y-1'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.badge && (
                  <div className={`absolute top-0 left-0 right-0 ${plan.highlight ? 'bg-primary' : 'bg-secondary'} text-${plan.highlight ? 'primary-foreground' : 'secondary-foreground'} text-center py-1 text-xs font-bold`}>
                    {plan.badge}
                  </div>
                )}
                
                <div className={`p-6 ${plan.badge ? 'pt-10' : 'pt-6'} bg-card`}>
                  <div className="flex items-center mb-4">
                    {plan.highlight ? 
                      <Star className="h-6 w-6 text-primary mr-2 flex-shrink-0" /> : 
                      <Shield className="h-6 w-6 text-muted-foreground mr-2 flex-shrink-0" />
                    }
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 text-sm">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-end">
                      <span className="text-sm mr-1">₹</span>
                      <div className="text-4xl font-bold">{plan.price}</div>
                      <div className="text-muted-foreground ml-2 pb-1">{plan.period}</div>
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full mb-6 ${plan.highlight ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.highlight ? 'default' : 'outline'}
                    onClick={() => navigate(plan.url)}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <FaqItem 
                question="How does the free trial work?" 
                answer="Our free trials last for 14 days, giving you full access to all premium features. No credit card required to start. You'll receive a reminder 3 days before your trial ends, so you can decide if you want to continue with a paid plan."
              />
              <FaqItem 
                question="Can I switch between plans?" 
                answer="Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to additional features and will be charged the prorated difference. When downgrading, changes will take effect at the start of your next billing cycle."
              />
              <FaqItem 
                question="Is my health data secure?" 
                answer="Absolutely. We use industry-leading encryption and security protocols to protect your personal health data. We never share your information with third parties without your explicit consent, and you retain full ownership of your data."
              />
              <FaqItem 
                question="How do I cancel my subscription?" 
                answer="You can cancel your subscription anytime from your account settings. After cancellation, you'll continue to have access to your paid features until the end of your current billing period. We don't offer refunds for partial subscription periods."
              />
            </div>
          </div>

          <div className="mt-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Health Journey Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who are transforming their health with Health Guardian
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
=======
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Pricing | Health Guardian</title>
        <meta name="description" content="Choose the right plan for your health journey." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-16">
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              className="max-w-3xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
              <p className="text-xl text-muted-foreground">
                Choose the plan that fits your health journey
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div 
                  key={index}
                  className={`relative rounded-2xl overflow-hidden ${
                    plan.popular 
                      ? 'border-2 border-primary shadow-lg shadow-primary/10' 
                      : 'border border-border'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`p-6 ${plan.popular ? 'pt-10' : 'pt-6'} bg-card`}>
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{plan.description}</p>
                    
                    <div className="mb-6">
                      {plan.price === '0' ? (
                        <div className="text-4xl font-bold">Free</div>
                      ) : (
                        <div className="flex items-end">
                          <div className="text-4xl font-bold">
                            {navigator.language.includes('en-IN') 
                              ? plan.priceIndia 
                              : `$${plan.price}`}
                          </div>
                          {plan.period && (
                            <div className="text-muted-foreground ml-2 pb-1">{plan.period}</div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className={`w-full mb-6 ${plan.popular ? 'bg-primary' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      disabled={plan.disabled}
                      asChild={!plan.disabled}
                    >
                      {!plan.disabled ? (
                        <a href={plan.url}>{plan.cta}</a>
                      ) : (
                        <span>{plan.cta}</span>
                      )}
                    </Button>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.notIncluded && plan.notIncluded.map((feature, i) => (
                        <div key={i} className="flex items-start text-muted-foreground">
                          <X className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Subscription FAQs</h3>
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h4 className="font-bold mb-2">What's included in the free plan?</h4>
                  <p className="text-muted-foreground">
                    The free plan gives you access to basic meal tracking, weight logging, and progress monitoring.
                    Perfect for getting started with your health journey.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Can I cancel anytime?</h4>
                  <p className="text-muted-foreground">
                    Yes, you can cancel your subscription at any time. Your premium features will remain
                    active until the end of your billing period.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Is there a refund policy?</h4>
                  <p className="text-muted-foreground">
                    We offer a 7-day money-back guarantee for all new premium subscriptions. 
                    If you're not satisfied, contact our support team.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">When will premium plans be available?</h4>
                  <p className="text-muted-foreground">
                    Premium plans will be launching soon! We're currently finalizing our payment system.
                    Sign up for our free plan to get notified when premium features are available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
      </main>
      
      <Footer />
    </div>
  );
};

<<<<<<< HEAD
type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem = ({ question, answer }: FaqItemProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-2">{question}</h3>
      <p className="text-gray-600 dark:text-gray-400">{answer}</p>
    </div>
  );
};

=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
export default PricingPage;
