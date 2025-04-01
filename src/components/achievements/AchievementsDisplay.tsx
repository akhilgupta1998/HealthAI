import React, { useState, useEffect } from 'react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { streaksService, Achievement, UserProgressData } from '@/services/streaksService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Calendar, 
  Droplet, 
  Activity, 
  Utensils, 
  Trophy, 
  Target, 
  CheckCircle2,
  Lock,
  CalendarClock,
  Share2,
  Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

// Map achievement icon names to Lucide icons
const getIcon = (iconName: string, className: string = "h-6 w-6") => {
  const icons: Record<string, React.ReactNode> = {
    'award': <Award className={className} />,
    'calendar-check': <Calendar className={className} />,
    'droplet': <Droplet className={className} />,
    'activity': <Activity className={className} />,
    'utensils': <Utensils className={className} />,
    'trophy': <Trophy className={className} />,
    'target': <Target className={className} />,
    'check': <CheckCircle2 className={className} />,
    'lock': <Lock className={className} />,
    'clock': <CalendarClock className={className} />,
    'scale': <Scale className={className} />
  };
  return icons[iconName] || <Award className={className} />;
};

const AchievementsDisplay: React.FC = () => {
  const { user } = useFirebaseContext();
  const [userProgress, setUserProgress] = useState<UserProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('achievements');
  
  useEffect(() => {
    if (user) {
      loadUserProgress();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const loadUserProgress = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const progress = await streaksService.getUserProgress(user.uid);
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };
  
  const shareAchievement = (achievement: Achievement) => {
    if (!achievement.unlockedAt) return;
    
    // Create share text
    const shareText = `I just earned the "${achievement.title}" achievement in Health Guardian! ${achievement.description} 🎉 #HealthGuardian`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Health Achievement',
        text: shareText,
        url: window.location.origin
      }).catch(() => {
        // Fallback if sharing fails
        navigator.clipboard.writeText(shareText);
        toast.success('Copied to clipboard! Share your achievement 🎉');
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard! Share your achievement 🎉');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!userProgress) {
    return (
      <div className="text-center p-8">
        <p>Sign in to track your achievements and progress</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>
        
        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {userProgress.achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`
                    h-full transition-all duration-300 
                    ${achievement.unlockedAt ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : ''}
                  `}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                          <div className={`
                            p-2 rounded-full 
                            ${achievement.unlockedAt 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                              : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                            }
                          `}>
                            {getIcon(achievement.icon)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{achievement.title}</CardTitle>
                            <CardDescription>{achievement.description}</CardDescription>
                          </div>
                        </div>
                        {achievement.unlockedAt && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => shareAchievement(achievement)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.progress} / {achievement.target}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.target) * 100} 
                          className={`
                            h-2 
                            ${achievement.unlockedAt ? 'bg-green-100' : 'bg-gray-100'}`
                          }
                        />
                        {achievement.unlockedAt && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                            Unlocked {formatDistanceToNow(achievement.unlockedAt, { addSuffix: true })}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
        
        {/* Streaks Tab */}
        <TabsContent value="streaks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(userProgress.streaks).map(([key, streak]) => {
              // Determine icon and color based on streak type
              const streakInfo = {
                water: { 
                  icon: <Droplet className="h-5 w-5" />, 
                  color: 'bg-blue-500',
                  title: 'Water Streak'
                },
                food: { 
                  icon: <Utensils className="h-5 w-5" />, 
                  color: 'bg-orange-500',
                  title: 'Food Logging Streak' 
                },
                exercise: { 
                  icon: <Activity className="h-5 w-5" />, 
                  color: 'bg-green-500',
                  title: 'Exercise Streak'
                },
                weight: { 
                  icon: <Scale className="h-5 w-5" />, 
                  color: 'bg-purple-500',
                  title: 'Weight Tracking Streak'
                },
                login: { 
                  icon: <Calendar className="h-5 w-5" />, 
                  color: 'bg-indigo-500',
                  title: 'Login Streak'
                }
              }[key as keyof typeof userProgress.streaks];
              
              return (
                <Card key={key} className="overflow-hidden">
                  <div className={`${streakInfo.color} h-2`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-gray-500">{streakInfo.icon}</span>
                        {streakInfo.title}
                      </CardTitle>
                      <Badge variant="outline" className="font-bold">
                        {streak.currentCount} days
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium mb-1">Current Streak</div>
                        <Progress 
                          value={Math.min(100, streak.currentCount * 10)} 
                          className="h-2" 
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Longest Streak</div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{streak.longestCount} days</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Last activity: {formatDistanceToNow(streak.lastUpdated, { addSuffix: true })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Health Journey</CardTitle>
              <CardDescription>
                A summary of your health progress so far
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                        <Droplet className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                      </div>
                      <div>
                        <h3 className="font-medium">Total Water Intake</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Keeping hydrated</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">{userProgress.milestones.waterIntakeTotal} ml</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                        <Activity className="h-5 w-5 text-green-500 dark:text-green-300" />
                      </div>
                      <div>
                        <h3 className="font-medium">Exercise Time</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Staying active</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">{userProgress.milestones.exerciseMinutesTotal} min</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-full">
                        <CheckCircle2 className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                      </div>
                      <div>
                        <h3 className="font-medium">Perfect Days</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">All daily goals met</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">{userProgress.milestones.perfectDays}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full">
                        <CalendarClock className="h-5 w-5 text-amber-500 dark:text-amber-300" />
                      </div>
                      <div>
                        <h3 className="font-medium">Days Tracked</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your health journey</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">{userProgress.milestones.daysTracked}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementsDisplay; 