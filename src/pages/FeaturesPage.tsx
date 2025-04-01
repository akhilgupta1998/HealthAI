<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ArrowLeft, Zap, Utensils, Activity, Droplets, BrainCircuit, CalendarClock, BarChart3, Smartphone, ShieldCheck, Users, MessageSquare, Salad, Dumbbell, Brain, CheckCircle, Calendar, BarChart, Settings } from 'lucide-react';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-purple-950 flex flex-col">
      {/* Header */}
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

      <div className="flex-1 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features for Your Health Journey</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover all the ways Health Guardian helps you track, monitor, and improve your overall wellness
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-2 gap-12 mb-24 max-w-6xl mx-auto">
          <FeatureCard
            title="Smart Food Recognition"
            description="Just take a photo of your meal, and our AI instantly identifies foods, portion sizes, and nutritional content. Track your calorie intake effortlessly with cutting-edge machine learning technology."
            icon={<Salad />}
            color="green"
            image="/assets/features/food-recognition.jpg"
            imageAlt="AI food recognition technology"
            imageFallback="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
          />
          
          <FeatureCard
            title="Personalized Meal Plans"
            description="Receive custom meal plans based on your goals, preferences, and dietary restrictions. Our intelligent system adapts to your progress and provides delicious, nutritious recipes tailored just for you."
            icon={<Zap />}
            color="yellow"
            image="/assets/features/meal-planning.jpg"
            imageAlt="Personalized meal planning"
            imageFallback="https://images.unsplash.com/photo-1494390248081-4e521a5940db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
          />
          
          <FeatureCard
            title="Comprehensive Activity Tracking"
            description="Monitor your workouts, daily steps, and active minutes. Integrate with your favorite fitness devices for a complete picture of your physical activity. Set goals and earn achievements as you progress."
            icon={<Activity />}
            color="orange"
            image="/assets/features/activity-tracking.jpg"
            imageAlt="Fitness and activity tracking"
            imageFallback="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
          />
          
          <FeatureCard
            title="Hydration Monitoring"
            description="Stay properly hydrated with smart water tracking. Receive personalized recommendations based on your activity level, climate, and body metrics. Set reminders to drink water throughout the day."
            icon={<Droplets />}
            color="blue"
            image="/assets/features/hydration.jpg"
            imageAlt="Water intake and hydration tracking"
            imageFallback="https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
          />
        </div>

        {/* Feature Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 mb-24 shadow-sm">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need in One App</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <CompactFeature 
              icon={<Brain />}
              title="Mental Wellness"
              description="Track your mood, stress levels, and sleep patterns. Get personalized recommendations for improving mental health."
            />
            
            <CompactFeature 
              icon={<Calendar />}
              title="Health Calendar"
              description="Schedule workouts, meal plans, doctor appointments, and reminders for medications or supplements."
            />
            
            <CompactFeature 
              icon={<BarChart />}
              title="Advanced Analytics"
              description="Visualize your health data with intuitive charts and reports. Identify trends and track your progress over time."
            />
            
            <CompactFeature 
              icon={<Smartphone />}
              title="Cross-Device Sync"
              description="Access your health data from any device. Seamless synchronization keeps everything up-to-date."
            />
            
            <CompactFeature 
              icon={<ShieldCheck />}
              title="Data Privacy"
              description="Your health data is encrypted and secure. You control what you share and with whom."
            />
            
            <CompactFeature 
              icon={<Users />}
              title="Community Challenges"
              description="Join challenges with friends or the Health Guardian community. Stay motivated and accountable."
            />
            
            <CompactFeature 
              icon={<MessageSquare />}
              title="Health Coaching"
              description="Connect with certified health coaches for personalized guidance and support when needed."
            />
            
            <CompactFeature 
              icon={<Activity />}
              title="Fitness Library"
              description="Access hundreds of workouts with video instructions, from beginner to advanced levels."
            />
            
            <CompactFeature 
              icon={<Heart />}
              title="Vitals Tracking"
              description="Monitor important health metrics like blood pressure, heart rate, blood glucose, and more."
            />
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto mb-24">
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-28 h-28 bg-purple-100 dark:bg-purple-900/30 rounded-full z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-purple-100 dark:bg-purple-900/30 rounded-full z-0"></div>
              <img 
                src="/assets/features/ai-assistant.jpg" 
                alt="AI Health Assistant" 
                className="rounded-xl shadow-lg relative z-10"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white inline-block rounded-lg px-4 py-1 text-sm font-medium mb-4">
              EXCLUSIVE FEATURE
            </div>
            <h2 className="text-3xl font-bold mb-4">Meet Mia, Your Health AI Assistant</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Mia is more than just an assistant—she's your personal health companion. Using advanced AI technology, 
              Mia provides real-time guidance, answers your health questions, and helps you stay on track with your goals.
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>Get nutritional advice based on your dietary preferences</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>Receive personalized workout suggestions tailored to your fitness level</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>Ask health-related questions and get evidence-based answers</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>Receive intelligent reminders and motivational messages</span>
              </li>
            </ul>
            
            <Link to="/signup">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Try Mia Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Testimonial 
              quote="Health Guardian has completely transformed the way I approach nutrition. The food recognition feature is incredibly accurate, and I love how easy it is to track everything."
              name="Sarah Johnson"
              title="Fitness Enthusiast"
              image="https://randomuser.me/api/portraits/women/32.jpg"
            />
            
            <Testimonial 
              quote="As a busy professional, I never had time to properly track my health. Health Guardian makes it effortless. The AI assistant has been a game changer for keeping me on track."
              name="Michael Chen"
              title="Software Engineer"
              image="https://randomuser.me/api/portraits/men/46.jpg"
            />
            
            <Testimonial 
              quote="The comprehensive tracking features have helped me lose 15 pounds in 3 months. I especially love the personalized meal suggestions and workout plans!"
              name="Emily Rodriguez"
              title="Marketing Manager"
              image="https://randomuser.me/api/portraits/women/63.jpg"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already experiencing the benefits of Health Guardian.
            Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="container mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Health Guardian. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  image: string;
  imageAlt: string;
  imageFallback: string;
};

const FeatureCard = ({ title, description, icon, color, image, imageAlt, imageFallback }: FeatureCardProps) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="relative rounded-xl overflow-hidden">
        <img 
          src={image} 
          alt={imageAlt} 
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.currentTarget.src = imageFallback;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
        </div>
      </div>
      
      <div className="flex items-start">
        <div className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mr-4 border-t-4 border-${color}-500`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
=======

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Camera, 
  Utensils, 
  BarChart2, 
  Zap, 
  MessageCircle, 
  Brain, 
  Heart, 
  Droplets, 
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeatureSection = ({ icon, title, description, image, reversed = false }) => {
  return (
    <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 py-16`}>
      <motion.div 
        className="md:w-1/2"
        initial={{ opacity: 0, x: reversed ? 20 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full mb-4">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-4">{description.heading}</h3>
        <p className="text-muted-foreground mb-6">{description.subheading}</p>
        
        <ul className="space-y-3">
          {description.points.map((point, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </motion.div>
      
      <motion.div 
        className="md:w-1/2"
        initial={{ opacity: 0, x: reversed ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <img 
          src={image} 
          alt={title} 
          className="rounded-2xl shadow-xl w-full object-cover"
          style={{ maxHeight: '500px' }}
        />
      </motion.div>
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    </div>
  );
};

<<<<<<< HEAD
type CompactFeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const CompactFeature = ({ icon, title, description }: CompactFeatureProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg inline-block mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

type TestimonialProps = {
  quote: string;
  name: string;
  title: string;
  image: string;
};

const Testimonial = ({ quote, name, title, image }: TestimonialProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="mb-6">
          <svg width="45" height="36" className="text-gray-300 dark:text-gray-600 mb-2" viewBox="0 0 45 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 0C6.04416 0 0 6.04416 0 13.5C0 20.9558 6.04416 27 13.5 27H18V36H9C4.02944 36 0 31.9706 0 27V13.5C0 6.04416 6.04416 0 13.5 0ZM40.5 0C33.0442 0 27 6.04416 27 13.5C27 20.9558 33.0442 27 40.5 27H45V36H36C31.0294 36 27 31.9706 27 27V13.5C27 6.04416 33.0442 0 40.5 0Z" fill="currentColor" />
          </svg>
          <p className="text-gray-600 dark:text-gray-300">{quote}</p>
        </div>
        <div className="flex items-center">
          <img src={image} alt={name} className="h-12 w-12 rounded-full mr-4" />
          <div>
            <h4 className="font-bold">{name}</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
=======
const FeaturesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <Camera className="h-4 w-4" />,
      title: "AI Food Recognition",
      description: {
        heading: "Scan & Track Food Instantly",
        subheading: "Take a photo of your meal and get detailed nutritional information instantly with our advanced AI recognition technology.",
        points: [
          "Accurate food identification from images",
          "Detailed nutritional breakdown",
          "Save your favorite meals for quick logging",
          "Works with home-cooked meals and restaurant food"
        ]
      },
      image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      icon: <Brain className="h-4 w-4" />,
      title: "Personalized Insights",
      description: {
        heading: "AI-Driven Health Recommendations",
        subheading: "Receive personalized insights and recommendations based on your unique health profile and goals.",
        points: [
          "Custom nutrition recommendations",
          "Personalized meal suggestions",
          "Goal-based progress tracking",
          "Identify nutrient deficiencies and improvements"
        ]
      },
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
      reversed: true
    },
    {
      icon: <MessageCircle className="h-4 w-4" />,
      title: "AI Health Assistant",
      description: {
        heading: "Meet Mia, Your Personal Health Coach",
        subheading: "Get instant answers to your health questions and receive guidance from our AI-powered health assistant.",
        points: [
          "24/7 nutrition and fitness guidance",
          "Answers to health and wellness questions",
          "Meal planning assistance",
          "Motivation and accountability support"
        ]
      },
      image: "https://images.unsplash.com/photo-1565895405227-31cffbe0cf86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      icon: <BarChart2 className="h-4 w-4" />,
      title: "Comprehensive Tracking",
      description: {
        heading: "Track All Your Health Metrics",
        subheading: "Monitor your nutrition, exercise, water intake, sleep, and vitals in one unified platform.",
        points: [
          "Nutrition and calorie tracking",
          "Exercise and activity logging",
          "Water intake monitoring",
          "Sleep quality tracking",
          "Vital signs recording (weight, BP, etc.)"
        ]
      },
      image: "https://images.unsplash.com/photo-1553508978-314fe7d3d89f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      reversed: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Features | Health Guardian</title>
        <meta name="description" content="Explore the powerful features of Health Guardian." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-16">
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features for Your Health Journey</h1>
              <p className="text-xl text-muted-foreground mb-10">
                Discover how Health Guardian can transform your approach to nutrition and wellness
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <a href="/login?signup=true">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <a href="/pricing">View Pricing</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        <section className="py-10 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            {features.map((feature, index) => (
              <FeatureSection 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                image={feature.image}
                reversed={feature.reversed}
              />
            ))}
          </div>
        </section>
        
        <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">More Amazing Features</h2>
              <p className="text-lg text-muted-foreground">
                Beyond our core features, Health Guardian offers a complete ecosystem for your wellness journey.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <Zap className="h-10 w-10 text-yellow-500" />,
                  title: "Habit Tracking",
                  description: "Build better health habits with reminders and streak tracking."
                },
                {
                  icon: <Heart className="h-10 w-10 text-red-500" />,
                  title: "Vitals Monitoring",
                  description: "Track blood pressure, heart rate, and other vital health metrics."
                },
                {
                  icon: <Droplets className="h-10 w-10 text-blue-500" />,
                  title: "Water Intake",
                  description: "Set hydration goals and track your daily water consumption."
                },
                {
                  icon: <Utensils className="h-10 w-10 text-green-500" />,
                  title: "Meal Planning",
                  description: "Plan your meals ahead with AI-generated suggestions."
                },
                {
                  icon: <BarChart2 className="h-10 w-10 text-purple-500" />,
                  title: "Progress Analytics",
                  description: "Visualize your health journey with detailed charts and insights."
                },
                {
                  icon: <Award className="h-10 w-10 text-amber-500" />,
                  title: "Achievement System",
                  description: "Stay motivated with badges and rewards for reaching milestones."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="premium-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <Button asChild size="lg">
                <a href="/login?signup=true">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  );
};

export default FeaturesPage;
