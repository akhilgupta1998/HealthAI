
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Helmet } from 'react-helmet';

const recipes = [
  {
    id: 1,
    title: 'Mediterranean Quinoa Bowl',
    description: 'A protein-rich bowl with quinoa, chickpeas, cucumber, tomatoes, and feta cheese.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    calories: 420,
    protein: '15g',
    carbs: '45g',
    fat: '22g',
  },
  {
    id: 2,
    title: 'Green Smoothie Bowl',
    description: 'Packed with spinach, banana, almond milk, and topped with seeds and berries.',
    image: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    calories: 320,
    protein: '8g',
    carbs: '56g',
    fat: '10g',
  },
  {
    id: 3,
    title: 'Baked Salmon with Asparagus',
    description: 'Omega-3 rich salmon with roasted asparagus and lemon.',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    calories: 380,
    protein: '32g',
    carbs: '12g',
    fat: '24g',
  },
  {
    id: 4,
    title: 'Avocado Chicken Wrap',
    description: 'Grilled chicken breast with avocado, greens, and whole grain wrap.',
    image: 'https://images.unsplash.com/photo-1479832281992-3a79a3a893ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    calories: 450,
    protein: '28g',
    carbs: '32g',
    fat: '26g',
  },
];

const HealthyRecipes = () => {
  return (
    <>
      <Helmet>
        <title>Healthy Recipes | Health Guardian</title>
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Healthy Recipes</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover nutritious and delicious meals designed to support your health goals. Our recipes are carefully crafted to provide optimal nutrition without sacrificing flavor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                  <p className="text-muted-foreground mb-4">{recipe.description}</p>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="text-center p-2 bg-secondary rounded">
                      <div className="font-medium">{recipe.calories}</div>
                      <div className="text-muted-foreground">cals</div>
                    </div>
                    <div className="text-center p-2 bg-secondary rounded">
                      <div className="font-medium">{recipe.protein}</div>
                      <div className="text-muted-foreground">protein</div>
                    </div>
                    <div className="text-center p-2 bg-secondary rounded">
                      <div className="font-medium">{recipe.carbs}</div>
                      <div className="text-muted-foreground">carbs</div>
                    </div>
                    <div className="text-center p-2 bg-secondary rounded">
                      <div className="font-medium">{recipe.fat}</div>
                      <div className="text-muted-foreground">fat</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HealthyRecipes;
