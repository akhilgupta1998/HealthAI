
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BackgroundBeamsDemo } from '@/components/ui/background-beams';
import { GlobeDemo } from '@/components/ui/globe';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Shield, Award, Users, Clock, Star } from 'lucide-react';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>About Us | Health Guardian</title>
        <meta name="description" content="Learn about Health Guardian's mission and team." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-16">
        <BackgroundBeamsDemo />
        
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-3xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                At Health Guardian, we believe that everyone deserves access to personalized health insights.
                Our AI-powered platform makes nutrition tracking effortless and provides actionable recommendations
                to help you build healthier habits and achieve your wellness goals.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <Heart className="w-10 h-10 text-primary" />,
                  title: "Personalized Health",
                  description: "Tailored insights based on your unique health profile and goals."
                },
                {
                  icon: <Shield className="w-10 h-10 text-primary" />,
                  title: "Privacy First",
                  description: "Your health data is secured with enterprise-grade encryption and privacy controls."
                },
                {
                  icon: <Award className="w-10 h-10 text-primary" />,
                  title: "Science-Backed",
                  description: "Our recommendations are based on the latest nutrition and health research."
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
          </div>
        </section>
        
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div 
                className="md:w-1/2 mb-12 md:mb-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Technology</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  We leverage cutting-edge AI and machine learning to make health tracking effortless.
                  Our platform can identify foods from images, provide precise nutritional information,
                  and offer personalized health recommendations.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: <Users className="h-5 w-5" />, text: "Used by 15,000+ people" },
                    { icon: <Clock className="h-5 w-5" />, text: "Save 5+ hours weekly" },
                    { icon: <Star className="h-5 w-5" />, text: "98% accuracy rate" },
                    { icon: <Shield className="h-5 w-5" />, text: "GDPR Compliant" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center">
                      <div className="flex-shrink-0 mr-3 text-primary">{item.icon}</div>
                      <p className="text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1581092921461-39b9d08a9b76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="AI Technology" 
                  className="rounded-2xl shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Global Impact</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                We're helping people across the globe improve their health and wellness.
                Join our growing community of health enthusiasts worldwide.
              </p>
            </motion.div>
            
            <GlobeDemo />
          </div>
        </section>
        
        <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Journey</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                We're on a mission to revolutionize how people understand and manage their health.
                Join us and take control of your wellness journey today.
              </p>
              <a 
                href="/login?signup=true" 
                className="inline-block premium-button"
              >
                Get Started for Free
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
