
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Brain, Apple, Activity, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaitlistForm from '@/components/WaitlistForm';
import TestimonialCard from '@/components/TestimonialCard';

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter">
                Your Personal 
                <span className="text-primary"> Health Guardian</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                Track, analyze, and improve your health habits with our AI-powered assistant. Take control of your wellness journey today.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <Button asChild size="lg" className="font-medium">
                  <Link to="/login">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/features">
                    Learn More
                  </Link>
                </Button>
              </div>
              <div className="flex items-center pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-primary font-medium">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Trusted by 1,000+ users</p>
                  <p className="text-xs text-muted-foreground">Join our community today</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80" 
                  alt="Health tracking app" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold">Smart Health Tracking</h3>
                    <p className="text-white/80">Personalized insights and AI recommendations</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-5 -right-5 bg-primary text-white p-4 rounded-lg shadow-lg">
                <span className="font-bold">New!</span> AI Meal Analysis
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 md:px-6 bg-accent/10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to take control of your health journey in one seamless experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart className="h-8 w-8 text-red-500" />,
                title: "Health Tracking",
                description: "Monitor vital stats, exercise, and sleep patterns",
              },
              {
                icon: <Apple className="h-8 w-8 text-green-500" />,
                title: "Nutrition Analysis",
                description: "AI-powered food scanning and meal recommendations",
              },
              {
                icon: <Activity className="h-8 w-8 text-blue-500" />,
                title: "Workout Plans",
                description: "Personalized exercise routines for your goals",
              },
              {
                icon: <Brain className="h-8 w-8 text-purple-500" />,
                title: "Mental Wellness",
                description: "Track mood, stress, and mindfulness practices",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white/80 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-5">
                      {feature.icon}
                    </div>
                    <CardTitle className="mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, intuitive process that delivers powerful results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Take a Photo",
                description: "Snap a picture of your meal or scan a barcode",
                icon: <Camera className="h-8 w-8 text-primary" />,
                image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
              },
              {
                step: 2,
                title: "AI Analysis",
                description: "Our AI identifies food and calculates nutritional content",
                icon: <Sparkles className="h-8 w-8 text-primary" />,
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              },
              {
                step: 3,
                title: "Get Insights",
                description: "Receive personalized recommendations and track your progress",
                icon: <LineChart className="h-8 w-8 text-primary" />,
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold mb-2 mt-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-4 md:px-6 bg-primary/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't take our word for it - hear from our satisfied users
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="Health Guardian has completely transformed my approach to nutrition. The AI food scanner is incredibly accurate!"
              author="Sarah Johnson"
              role="Fitness Enthusiast"
              rating={5}
            />
            <TestimonialCard 
              quote="I've tried many health apps, but this one actually helps me stay consistent with my goals. Love the personalized recommendations."
              author="Michael Chen"
              role="Software Developer"
              rating={5}
            />
            <TestimonialCard 
              quote="The meal tracking feature is so easy to use. I can quickly log my food and get instant nutritional feedback."
              author="Emily Rodriguez"
              role="Nutritionist"
              rating={4}
            />
          </div>
        </div>
      </section>
      
      {/* Waitlist Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Waitlist</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Be among the first to experience our revolutionary health tracking app
            </p>
          </div>
          
          <WaitlistForm />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Add missing component imports
const Camera = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const Sparkles = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const LineChart = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

export default IndexPage;
