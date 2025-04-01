
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How accurate is the AI food recognition?",
    answer: "Our AI food recognition technology has a 98% accuracy rate for most common foods and dishes. The system continuously learns and improves with each use, becoming even more accurate over time. For any items it doesn't recognize with high confidence, you can easily make manual adjustments."
  },
  {
    question: "Do I need to take photos of everything I eat?",
    answer: "While the photo recognition is a core feature, Track AI provides multiple ways to log your meals. You can scan barcodes, search our extensive food database, use voice input, or create custom meals. We designed the app to be flexible for all situations."
  },
  {
    question: "How does Track AI handle dietary restrictions?",
    answer: "During onboarding, you can specify dietary preferences and restrictions such as vegetarian, vegan, gluten-free, or allergies. Our AI will consider these when providing meal recommendations and will flag any foods that don't align with your dietary needs."
  },
  {
    question: "Can Track AI sync with my fitness tracker or smartwatch?",
    answer: "Yes, Track AI integrates with popular fitness platforms including Apple Health, Google Fit, Fitbit, and Garmin. This allows for a comprehensive view of your nutrition alongside your activity levels and exercise data."
  },
  {
    question: "What's the difference between free and premium plans?",
    answer: "The free plan includes basic food logging, calorie tracking, and limited AI photo recognition. Premium unlocks unlimited food scanning, detailed nutritional insights, personalized meal planning, progress analytics, and access to our AI nutrition coach."
  },
  {
    question: "Is my personal health data secure?",
    answer: "Absolutely. We take data privacy extremely seriously. All your personal health information is encrypted and stored securely. We never sell your data to third parties, and you have complete control over your privacy settings and data sharing preferences."
  }
];

const FaqSection = () => {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="font-bold mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Find answers to common questions about Track AI
          </p>
        </div>

        <div className="max-w-3xl mx-auto animate-fade-in">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
                <AccordionTrigger className="text-left py-6 hover:no-underline hover:text-primary transition-colors">
                  <span className="font-medium text-lg">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center max-w-3xl mx-auto animate-fade-in">
          <h3 className="text-2xl font-semibold mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-8">
            Our support team is here to help with any other questions you might have.
          </p>
          <a 
            href="mailto:support@trackai.com" 
            className="inline-flex items-center text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
