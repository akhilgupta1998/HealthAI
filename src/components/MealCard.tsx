
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface MealCardProps {
  mealType: string;
  foodName: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  imageUrl?: string;
  time?: string;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ 
  mealType, 
  foodName, 
  calories, 
  protein, 
  carbs, 
  fat, 
  imageUrl, 
  time,
  className = '',
  onEdit,
  onDelete
}) => {
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-24 h-24 bg-muted">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={foodName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <span className="text-xs text-muted-foreground">{mealType}</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium leading-tight">{foodName}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {mealType}{time ? ` • ${time}` : ''}
                </p>
              </div>
              <span className="font-bold text-primary">{calories} kcal</span>
            </div>
            
            <div className="flex space-x-3 text-xs">
              <div>
                <span className="text-muted-foreground">Protein</span>
                <p className="font-medium">{protein}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Carbs</span>
                <p className="font-medium">{carbs}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Fat</span>
                <p className="font-medium">{fat}</p>
              </div>
            </div>
            
            {(onEdit || onDelete) && (
              <div className="flex justify-end mt-2">
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealCard;
