
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    content: "Track AI has completely changed how I approach nutrition. The AI photo recognition is incredibly accurate and saves me so much time logging meals.",
    author: "Sarah Johnson",
    role: "Fitness Enthusiast",
    rating: 5
  },
  {
    content: "As a nutrition coach, I recommend Track AI to all my clients. The detailed analytics and personalized recommendations are exactly what people need.",
    author: "Michael Chen",
    role: "Nutritionist",
    rating: 5
  },
  {
    content: "I've tried many nutrition apps, but none compare to Track AI's ease of use and accuracy. The AI coach actually gives helpful suggestions I can use.",
    author: "Emily Rodriguez",
    role: "Weight Loss Journey",
    rating: 5
  }
];

const TestimonialSection = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="font-bold mb-4">
            Loved by <span className="text-gradient">Thousands</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            See what our users have to say about their experience with Track AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="glass-card p-6 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Stars */}
              <div className="flex mb-4">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              
              {/* Content */}
              <p className="mb-6 italic">{testimonial.content}</p>
              
              {/* Author */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold mr-3">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-24 glass-card p-10 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">98%</div>
              <p className="text-muted-foreground">Food Recognition Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">15K+</div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">4.8</div>
              <p className="text-muted-foreground">App Store Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">92%</div>
              <p className="text-muted-foreground">Goal Achievement Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
