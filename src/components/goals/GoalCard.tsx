import React from 'react';
import { Goal } from '@/services/goalService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { Award, Target, Trash2, Edit, Check } from 'lucide-react';
import { format, differenceInDays, isAfter } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onComplete: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onComplete }) => {
  const getGoalStatusBadge = () => {
    if (goal.isCompleted) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <Award className="h-3 w-3" /> Completed
        </Badge>
      );
    }

    if (goal.targetDate && isAfter(new Date(), goal.targetDate)) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          Overdue
        </Badge>
      );
    }

    if (goal.progress && goal.progress > 75) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          Almost There
        </Badge>
      );
    }

    if (goal.targetDate) {
      const daysLeft = differenceInDays(goal.targetDate, new Date());
      if (daysLeft < 7) {
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
          </Badge>
        );
      }
    }

    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Target className="h-3 w-3" /> In Progress
      </Badge>
    );
  };

  const getCategoryColor = () => {
    switch (goal.category) {
      case 'weight': return 'border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900';
      case 'nutrition': return 'border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900';
      case 'exercise': return 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900';
      case 'water': return 'border-cyan-200 bg-cyan-50 dark:bg-cyan-950 dark:border-cyan-900';
      case 'sleep': return 'border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-900';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  return (
    <Card className={`overflow-hidden ${getCategoryColor()}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg line-clamp-1 mb-1">{goal.title}</CardTitle>
            <CardDescription className="line-clamp-2">{goal.description}</CardDescription>
          </div>
          <ProgressCircle value={goal.progress || 0} size="small" showValue />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
          {goal.currentValue !== null && goal.targetValue !== null && (
            <>
              <div>
                <span className="text-muted-foreground">Current:</span>{' '}
                <span className="font-medium">{goal.currentValue} {goal.unit}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Target:</span>{' '}
                <span className="font-medium">{goal.targetValue} {goal.unit}</span>
              </div>
            </>
          )}
          <div>
            <span className="text-muted-foreground">Started:</span>{' '}
            <span className="font-medium">{format(goal.startDate, 'MMM d, yyyy')}</span>
          </div>
          {goal.targetDate && (
            <div>
              <span className="text-muted-foreground">Target Date:</span>{' '}
              <span className="font-medium">{format(goal.targetDate, 'MMM d, yyyy')}</span>
            </div>
          )}
          {goal.streakDays !== undefined && goal.streakDays > 0 && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Current Streak:</span>{' '}
              <span className="font-medium">{goal.streakDays} {goal.streakDays === 1 ? 'day' : 'days'}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {getGoalStatusBadge()}
          <Badge variant="outline">{goal.category}</Badge>
          {goal.type !== 'general_health' && <Badge variant="outline">{goal.type.replace('_', ' ')}</Badge>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-end gap-2">
        {!goal.isCompleted && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onComplete(goal.id!)}
            className="flex items-center gap-1"
          >
            <Check className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Complete</span>
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(goal)}
          className="flex items-center gap-1"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">Edit</span>
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(goal.id!)}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GoalCard; 