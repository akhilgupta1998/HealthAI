import React, { useState, useEffect } from 'react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { goalService, Goal } from '@/services/goalService';
import GoalEditor from '@/components/goals/GoalEditor';
import GoalCard from '@/components/goals/GoalCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, PlusCircle, Sliders, ArrowUpDown, Filter, Award, Target } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format, differenceInDays, isAfter } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressCircle } from '@/components/ui/progress-circle';
import { EmptyPlaceholder } from '@/components/ui/empty-placeholder';

type GoalCategory = 'all' | Goal['category'];

const GoalsPage = () => {
  const { user, isAuthenticated } = useFirebaseContext();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeCategory, setActiveCategory] = useState<GoalCategory>('all');
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false);
  const [showEditGoalDialog, setShowEditGoalDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Goal['category']>('weight');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'progress' | 'date' | 'title'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchGoals();
    }
  }, [isAuthenticated, user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const userGoals = await goalService.getUserGoals(user!.uid);
      setGoals(userGoals);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setError('Failed to load your goals. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...goals];

    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(goal => goal.category === activeCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        goal => 
          goal.title.toLowerCase().includes(query) || 
          goal.description.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter(goal => !goal.isCompleted);
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter(goal => goal.isCompleted);
    }

    // Apply show/hide completed
    if (!showCompleted) {
      filtered = filtered.filter(goal => !goal.isCompleted);
    }

    // Apply sort
    switch (sortBy) {
      case 'progress':
        filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0));
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.createdAt?.toDate() || 0).getTime() - new Date(a.createdAt?.toDate() || 0).getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredGoals(filtered);
  }, [goals, activeCategory, searchQuery, sortBy, filterStatus, showCompleted]);

  const handleCreateGoal = (goal: Goal) => {
    setGoals(prev => [goal, ...prev]);
    setShowNewGoalDialog(false);
    toast.success('Goal created successfully!');
  };

  const handleUpdateGoal = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
    setShowEditGoalDialog(false);
    setSelectedGoal(null);
    toast.success('Goal updated successfully!');
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await goalService.deleteGoal(goalId);
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      toast.success('Goal deleted successfully!');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal. Please try again.');
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      await goalService.completeGoal(goalId);
      setGoals(prev => prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, isCompleted: true, completedDate: new Date(), progress: 100 } 
          : goal
      ));
      toast.success('Goal marked as complete!');
    } catch (error) {
      console.error('Error completing goal:', error);
      toast.error('Failed to complete goal. Please try again.');
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowEditGoalDialog(true);
  };

  const getGoalStatusBadge = (goal: Goal) => {
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

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'weight': return 'border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900';
      case 'nutrition': return 'border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900';
      case 'exercise': return 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900';
      case 'water': return 'border-cyan-200 bg-cyan-50 dark:bg-cyan-950 dark:border-cyan-900';
      case 'sleep': return 'border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-900';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Goals & Progress</h1>
          <p className="text-muted-foreground mt-1">
            Track your health and fitness goals
          </p>
        </div>
        <Button onClick={() => setShowNewGoalDialog(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> Create New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-1 md:col-span-4">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-1 w-full max-w-sm items-center space-x-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search goals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <span>Sort By</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date Created</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Status</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Goals</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="completed">Completed Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setActiveCategory(value as GoalCategory)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Goals</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
          <TabsTrigger value="water">Water</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderGoalsList(filteredGoals)}
        </TabsContent>
        
        <TabsContent value="weight" className="space-y-4">
          {renderGoalsList(filteredGoals.filter(g => g.category === 'weight'))}
        </TabsContent>
        
        <TabsContent value="nutrition" className="space-y-4">
          {renderGoalsList(filteredGoals.filter(g => g.category === 'nutrition'))}
        </TabsContent>
        
        <TabsContent value="exercise" className="space-y-4">
          {renderGoalsList(filteredGoals.filter(g => g.category === 'exercise'))}
        </TabsContent>
        
        <TabsContent value="water" className="space-y-4">
          {renderGoalsList(filteredGoals.filter(g => g.category === 'water'))}
        </TabsContent>
        
        <TabsContent value="sleep" className="space-y-4">
          {renderGoalsList(filteredGoals.filter(g => g.category === 'sleep'))}
        </TabsContent>
        
        <TabsContent value="other" className="space-y-4">
          {renderGoalsList(filteredGoals.filter(g => g.category === 'other'))}
        </TabsContent>
      </Tabs>

      {/* New Goal Dialog */}
      <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              Set a new health or fitness goal to track your progress
            </DialogDescription>
          </DialogHeader>
          {showNewGoalDialog && (
            <GoalEditor
              category={selectedCategory}
              onSave={handleCreateGoal}
              onCancel={() => setShowNewGoalDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={showEditGoalDialog} onOpenChange={setShowEditGoalDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>
              Update your goal details and tracking information
            </DialogDescription>
          </DialogHeader>
          {showEditGoalDialog && selectedGoal && (
            <GoalEditor
              existingGoal={selectedGoal}
              onSave={handleUpdateGoal}
              onCancel={() => {
                setShowEditGoalDialog(false);
                setSelectedGoal(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  function renderGoalsList(goals: Goal[]) {
    if (loading) {
      return (
        <div className="flex justify-center p-8">
          <div className="animate-pulse text-center">
            <p>Loading your goals...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchGoals}>
            Try Again
          </Button>
        </div>
      );
    }

    if (goals.length === 0) {
      return (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon>
            <Target className="h-8 w-8" />
          </EmptyPlaceholder.Icon>
          <EmptyPlaceholder.Title>No goals found</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {searchQuery 
              ? "No goals match your search criteria. Try a different search term."
              : activeCategory !== 'all' 
                ? `You don't have any ${activeCategory} goals yet.`
                : "You haven't created any goals yet. Create your first goal to start tracking your progress."}
          </EmptyPlaceholder.Description>
          <Button onClick={() => setShowNewGoalDialog(true)}>
            Create New Goal
          </Button>
        </EmptyPlaceholder>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={handleEditGoal}
            onDelete={handleDeleteGoal}
            onComplete={handleCompleteGoal}
          />
        ))}
      </div>
    );
  }
};

export default GoalsPage; 