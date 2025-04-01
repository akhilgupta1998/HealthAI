
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  rating?: number;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  rating = 5,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className={cn("h-full", className)}>
        <CardContent className="p-6">
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => {
              if (i < Math.floor(rating)) {
                return <Star key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" />;
              } else if (i === Math.floor(rating) && rating % 1 !== 0) {
                return <StarHalf key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" />;
              } else {
                return <Star key={i} className="h-5 w-5 text-muted" />;
              }
            })}
          </div>
          
          <div className="mb-6">
            <p className="text-lg font-medium italic">"{quote}"</p>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg mr-3">
              {author.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{author}</p>
              {role && <p className="text-sm text-muted-foreground">{role}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
