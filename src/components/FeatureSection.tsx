
import React from 'react';
import { Camera, BarChart2, Weight, MessageSquare, Calendar, Database } from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'AI Food Recognition',
    description: 'Take a photo of your meal and our AI instantly identifies foods and provides nutritional information.'
  },
  {
    icon: BarChart2,
    title: 'Nutritional Analytics',
    description: 'Get detailed breakdown of macros, micros, and personalized recommendations based on your goals.'
  },
  {
    icon: Weight,
    title: 'Progress Tracking',
    description: 'Monitor your weight, BMI, and body metrics with easy-to-understand visualizations and trends.'
  },
  {
    icon: MessageSquare,
    title: 'AI Nutrition Coach',
    description: 'Get personalized meal recommendations and answers to your nutrition questions from our AI assistant.'
  },
  {
    icon: Calendar,
    title: 'Meal Planning',
    description: 'Generate custom meal plans based on your dietary preferences, restrictions, and nutrition goals.'
  },
  {
    icon: Database,
    title: 'Extensive Food Database',
    description: 'Access millions of food items with accurate nutritional data, including restaurant meals and packaged foods.'
  }
];

const FeatureSection = () => {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="font-bold mb-4">
            Innovative <span className="text-gradient">AI-Powered</span> Features
          </h2>
          <p className="text-muted-foreground text-lg">
            Track AI combines cutting-edge technology with nutrition science to deliver a seamless experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-card p-6 flex flex-col items-start hover:translate-y-[-5px] transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="feature-icon-container">
                <feature.icon className="feature-icon" />
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-subtle"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* App Process Flow */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h3 className="font-bold mb-4">How It Works</h3>
            <p className="text-muted-foreground text-lg">
              A simple, intuitive process that delivers powerful results
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 transform -translate-y-1/2 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border-4 border-primary z-10 mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Take a Photo</h4>
                <p className="text-muted-foreground">Snap a picture of your meal or scan a barcode</p>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '150ms' }}>
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border-4 border-accent z-10 mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">AI Analysis</h4>
                <p className="text-muted-foreground">Our AI identifies food and calculates nutritional content</p>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border-4 border-primary z-10 mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Get Insights</h4>
                <p className="text-muted-foreground">Receive personalized recommendations and track your progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
