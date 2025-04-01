import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  Timestamp, 
  increment,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../firebase';

// Types for streaks and achievements
export interface Streak {
  type: string;
  currentCount: number;
  longestCount: number;
  lastUpdated: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
  progress: number;
  target: number;
  category: string;
}

export interface UserProgressData {
  userId: string;
  streaks: {
    water: Streak;
    food: Streak;
    exercise: Streak;
    weight: Streak;
    login: Streak;
  };
  achievements: Achievement[];
  milestones: {
    waterIntakeTotal: number;
    exerciseMinutesTotal: number;
    daysTracked: number;
    perfectDays: number;
  };
  goals: {
    weightGoal: number | null;
    calorieGoal: number | null;
    waterGoal: number | null;
    exerciseGoal: number | null;
    type: 'loss' | 'gain' | 'maintenance';
  };
  lastActive: Date;
}

// Predefined achievements
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'login-streak-7',
    title: 'Consistency Champion',
    description: 'Log in for 7 days in a row',
    icon: 'calendar-check',
    unlockedAt: null,
    progress: 0,
    target: 7,
    category: 'login'
  },
  {
    id: 'water-daily-goal-30',
    title: 'Hydration Hero',
    description: 'Reach your daily water goal 30 times',
    icon: 'droplet',
    unlockedAt: null,
    progress: 0,
    target: 30,
    category: 'water'
  },
  {
    id: 'exercise-minutes-1000',
    title: 'Exercise Enthusiast',
    description: 'Complete 1000 minutes of exercise',
    icon: 'activity',
    unlockedAt: null,
    progress: 0,
    target: 1000,
    category: 'exercise'
  },
  {
    id: 'perfect-day-10',
    title: 'Perfect Streak',
    description: 'Complete all daily goals for 10 days',
    icon: 'award',
    unlockedAt: null,
    progress: 0,
    target: 10,
    category: 'perfect'
  },
  {
    id: 'food-logging-50',
    title: 'Nutrition Tracker',
    description: 'Log your meals for 50 days',
    icon: 'utensils',
    unlockedAt: null,
    progress: 0,
    target: 50,
    category: 'food'
  },
  {
    id: 'weight-goal-achieved',
    title: 'Goal Crusher',
    description: 'Reach your weight goal',
    icon: 'target',
    unlockedAt: null,
    progress: 0,
    target: 100, // percentage
    category: 'weight'
  }
];

// Initialize with default values
const getDefaultProgressData = (userId: string): UserProgressData => ({
  userId,
  streaks: {
    water: { type: 'water', currentCount: 0, longestCount: 0, lastUpdated: new Date() },
    food: { type: 'food', currentCount: 0, longestCount: 0, lastUpdated: new Date() },
    exercise: { type: 'exercise', currentCount: 0, longestCount: 0, lastUpdated: new Date() },
    weight: { type: 'weight', currentCount: 0, longestCount: 0, lastUpdated: new Date() },
    login: { type: 'login', currentCount: 0, longestCount: 0, lastUpdated: new Date() },
  },
  achievements: [...DEFAULT_ACHIEVEMENTS],
  milestones: {
    waterIntakeTotal: 0,
    exerciseMinutesTotal: 0,
    daysTracked: 0,
    perfectDays: 0,
  },
  goals: {
    weightGoal: null,
    calorieGoal: null,
    waterGoal: null,
    exerciseGoal: null,
    type: 'maintenance',
  },
  lastActive: new Date(),
});

// Helper to check if a streak is broken (more than 24 hours since last update)
const isStreakBroken = (lastUpdated: Date): boolean => {
  const now = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  return now.getTime() - lastUpdated.getTime() > oneDayInMs;
};

export const streaksService = {
  /**
   * Initialize or get user progress data
   */
  async getUserProgress(userId: string): Promise<UserProgressData> {
    try {
      const progressRef = doc(db, 'user_progress', userId);
      const progressDoc = await getDoc(progressRef);
      
      if (progressDoc.exists()) {
        const data = progressDoc.data() as UserProgressData;
        
        // Convert Firestore timestamps to Date objects
        data.lastActive = data.lastActive instanceof Timestamp 
          ? data.lastActive.toDate() 
          : new Date(data.lastActive);
          
        Object.values(data.streaks).forEach(streak => {
          streak.lastUpdated = streak.lastUpdated instanceof Timestamp 
            ? streak.lastUpdated.toDate() 
            : new Date(streak.lastUpdated);
        });
        
        data.achievements.forEach(achievement => {
          if (achievement.unlockedAt) {
            achievement.unlockedAt = achievement.unlockedAt instanceof Timestamp 
              ? achievement.unlockedAt.toDate() 
              : new Date(achievement.unlockedAt);
          }
        });
        
        return data;
      }
      
      // If no progress data exists, create and return default
      const defaultData = getDefaultProgressData(userId);
      await setDoc(progressRef, defaultData);
      return defaultData;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  },
  
  /**
   * Update user goals
   */
  async updateGoals(userId: string, goals: Partial<UserProgressData['goals']>): Promise<void> {
    try {
      const progressRef = doc(db, 'user_progress', userId);
      await updateDoc(progressRef, {
        'goals': { ...goals },
        'lastActive': new Date()
      });
    } catch (error) {
      console.error('Error updating goals:', error);
      throw error;
    }
  },
  
  /**
   * Update a streak
   */
  async updateStreak(userId: string, streakType: keyof UserProgressData['streaks']): Promise<void> {
    try {
      const progressData = await this.getUserProgress(userId);
      const streak = progressData.streaks[streakType];
      
      // Check if streak is broken
      if (isStreakBroken(streak.lastUpdated)) {
        // Reset streak but keep the longest record
        await updateDoc(doc(db, 'user_progress', userId), {
          [`streaks.${streakType}.currentCount`]: 1,
          [`streaks.${streakType}.lastUpdated`]: new Date(),
          'lastActive': new Date()
        });
      } else {
        // Increment streak
        const newCount = streak.currentCount + 1;
        const updates: Record<string, any> = {
          [`streaks.${streakType}.currentCount`]: newCount,
          [`streaks.${streakType}.lastUpdated`]: new Date(),
          'lastActive': new Date()
        };
        
        // Update longest streak if current is longer
        if (newCount > streak.longestCount) {
          updates[`streaks.${streakType}.longestCount`] = newCount;
        }
        
        await updateDoc(doc(db, 'user_progress', userId), updates);
        
        // Check and update achievement progress
        this.checkAchievements(userId, progressData);
      }
    } catch (error) {
      console.error(`Error updating ${streakType} streak:`, error);
      throw error;
    }
  },
  
  /**
   * Add to a milestone counter
   */
  async incrementMilestone(
    userId: string, 
    milestoneType: keyof UserProgressData['milestones'], 
    amount: number = 1
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'user_progress', userId), {
        [`milestones.${milestoneType}`]: increment(amount),
        'lastActive': new Date()
      });
      
      // Update achievements after incrementing milestone
      const progressData = await this.getUserProgress(userId);
      this.checkAchievements(userId, progressData);
    } catch (error) {
      console.error(`Error incrementing ${milestoneType}:`, error);
      throw error;
    }
  },
  
  /**
   * Record a perfect day (all goals met)
   */
  async recordPerfectDay(userId: string): Promise<void> {
    try {
      await this.incrementMilestone(userId, 'perfectDays');
    } catch (error) {
      console.error('Error recording perfect day:', error);
      throw error;
    }
  },
  
  /**
   * Check and update achievements
   */
  async checkAchievements(userId: string, progressData?: UserProgressData): Promise<void> {
    try {
      const data = progressData || await this.getUserProgress(userId);
      const updates: { achievements: Achievement[] } = { achievements: [] };
      let achievementsUpdated = false;
      
      data.achievements.forEach(achievement => {
        // Skip already unlocked achievements
        if (achievement.unlockedAt) return;
        
        let newProgress = achievement.progress;
        
        // Update progress based on achievement category
        switch (achievement.category) {
          case 'login':
            newProgress = data.streaks.login.currentCount;
            break;
          case 'water':
            // Assuming we track this separately when water goal is met
            break;
          case 'exercise':
            newProgress = data.milestones.exerciseMinutesTotal;
            break;
          case 'perfect':
            newProgress = data.milestones.perfectDays;
            break;
          case 'food':
            newProgress = data.streaks.food.longestCount;
            break;
          case 'weight':
            // Weight goal progress is calculated when weight is updated
            break;
        }
        
        // Check if progress has changed
        if (newProgress !== achievement.progress) {
          achievement.progress = newProgress;
          achievementsUpdated = true;
        }
        
        // Check if achievement should be unlocked
        if (newProgress >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
          achievement.progress = achievement.target; // Cap at 100%
          achievementsUpdated = true;
        }
        
        updates.achievements.push(achievement);
      });
      
      // Only update Firestore if something changed
      if (achievementsUpdated) {
        await updateDoc(doc(db, 'user_progress', userId), {
          'achievements': updates.achievements,
          'lastActive': new Date()
        });
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  },
  
  /**
   * Update weight goal progress
   */
  async updateWeightGoalProgress(userId: string, currentWeight: number): Promise<void> {
    try {
      const progressData = await this.getUserProgress(userId);
      const { weightGoal, type } = progressData.goals;
      
      if (!weightGoal) return; // No goal set
      
      // Find the weight goal achievement
      const weightAchievement = progressData.achievements.find(a => a.id === 'weight-goal-achieved');
      if (!weightAchievement) return;
      
      // Calculate progress percentage based on goal type
      let progress = 0;
      if (type === 'loss') {
        // For weight loss, calculate how close they are to their target
        const initialWeight = progressData.milestones.daysTracked > 0 ? 
          (progressData.milestones as any).initialWeight || currentWeight + 10 : 
          currentWeight + 10;
          
        // Save initial weight if not set
        if (!(progressData.milestones as any).initialWeight) {
          await updateDoc(doc(db, 'user_progress', userId), {
            'milestones.initialWeight': initialWeight
          });
        }
        
        const totalToLose = initialWeight - weightGoal;
        const lostSoFar = initialWeight - currentWeight;
        progress = Math.min(100, Math.round((lostSoFar / totalToLose) * 100));
      } else if (type === 'gain') {
        // For weight gain
        const initialWeight = progressData.milestones.daysTracked > 0 ? 
          (progressData.milestones as any).initialWeight || currentWeight - 10 : 
          currentWeight - 10;
          
        // Save initial weight if not set
        if (!(progressData.milestones as any).initialWeight) {
          await updateDoc(doc(db, 'user_progress', userId), {
            'milestones.initialWeight': initialWeight
          });
        }
        
        const totalToGain = weightGoal - initialWeight;
        const gainedSoFar = currentWeight - initialWeight;
        progress = Math.min(100, Math.round((gainedSoFar / totalToGain) * 100));
      } else {
        // For maintenance, if within 1kg of target, consider it 100%
        const variation = Math.abs(currentWeight - weightGoal);
        progress = variation <= 1 ? 100 : Math.max(0, 100 - Math.round(variation * 10));
      }
      
      // Update the achievement
      weightAchievement.progress = progress;
      if (progress >= 100 && !weightAchievement.unlockedAt) {
        weightAchievement.unlockedAt = new Date();
      }
      
      // Update in Firestore
      await updateDoc(doc(db, 'user_progress', userId), {
        'achievements': progressData.achievements.map(a => 
          a.id === 'weight-goal-achieved' ? weightAchievement : a
        ),
        'lastActive': new Date()
      });
    } catch (error) {
      console.error('Error updating weight goal progress:', error);
      throw error;
    }
  }
};

export default streaksService; 