import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp, 
  serverTimestamp,
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { db } from '@/firebase';
import { streaksService } from './streaksService';
import { v4 as uuidv4 } from 'uuid';

// Goal types
export type GoalType = 
  | 'general_health'
  | 'weight_loss'
  | 'weight_gain'
  | 'muscle_gain'
  | 'maintenance'
  | 'exercise'
  | 'hydration'
  | 'sleep'
  | 'custom';

export interface Goal {
  id?: string;
  userId: string;
  title: string;
  description: string;
  type: GoalType;
  category: 'weight' | 'nutrition' | 'exercise' | 'water' | 'sleep' | 'other';
  
  // Universal goal fields
  currentValue?: number | null;
  targetValue?: number | null;
  unit?: string;
  
  // Dates
  startDate: Date;
  targetDate?: Date | null;
  completedDate?: Date | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  
  // Progress tracking
  progress?: number; // 0-100%
  streakDays?: number;
  lastCheckedIn?: Date;
  
  // Status
  isActive: boolean;
  isCompleted: boolean;
  isArchived?: boolean;
  
  // Reminders and notifications
  reminderFrequency?: 'daily' | 'weekly' | 'none';
  reminderTime?: string; // Time in HH:MM format
  
  // Associated entries for tracking
  entries?: GoalEntry[];
  
  // Customizable by user
  colorCode?: string;
  icon?: string;
}

export interface GoalEntry {
  id: string;
  goalId: string;
  userId: string;
  date: Date;
  value: number;
  note?: string;
  createdAt: Timestamp;
}

// Helper functions
const convertTimestamp = (timestamp: Timestamp | Date): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

class GoalService {
  /**
   * Create a new goal
   */
  async createGoal(goalData: Partial<Goal>): Promise<Goal> {
    const goalId = uuidv4();
    const goalRef = doc(db, 'goals', goalId);
    
    const newGoal: Goal = {
      id: goalId,
      userId: goalData.userId!,
      title: goalData.title || '',
      description: goalData.description || '',
      type: goalData.type || 'general_health',
      category: goalData.category || 'weight',
      currentValue: goalData.currentValue || null,
      targetValue: goalData.targetValue || null,
      unit: goalData.unit || 'kg',
      startDate: goalData.startDate || new Date(),
      targetDate: goalData.targetDate || null,
      isActive: true,
      isCompleted: false,
      progress: 0,
      streakDays: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      ...goalData
    };
    
    // Remove entries before saving to Firestore (we'll save them separately)
    const { entries, ...goalToSave } = newGoal as any;
    
    // Convert Date objects to Timestamps for Firestore
    const formattedGoal = this.formatGoalForFirestore(goalToSave);
    
    await setDoc(goalRef, formattedGoal);
    
    return this.formatGoalFromFirestore({ 
      ...formattedGoal, 
      id: goalId
    });
  }
  
  /**
   * Get all goals for a user
   */
  async getUserGoals(userId: string): Promise<Goal[]> {
    const goalsQuery = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(goalsQuery);
    const goals: Goal[] = [];
    
    for (const doc of snapshot.docs) {
      const goalData = doc.data();
      goals.push(this.formatGoalFromFirestore({
        ...goalData,
        id: doc.id
      }));
    }
    
    return goals;
  }
  
  /**
   * Get active goals for a user
   */
  async getActiveGoals(userId: string): Promise<Goal[]> {
    const goalsQuery = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      where('isActive', '==', true),
      where('isCompleted', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(goalsQuery);
    const goals: Goal[] = [];
    
    for (const doc of snapshot.docs) {
      const goalData = doc.data();
      goals.push(this.formatGoalFromFirestore({
        ...goalData,
        id: doc.id
      }));
    }
    
    return goals;
  }
  
  /**
   * Get a single goal by ID
   */
  async getGoal(goalId: string): Promise<Goal | null> {
    const goalRef = doc(db, 'goals', goalId);
    const snapshot = await getDoc(goalRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return this.formatGoalFromFirestore({
      ...snapshot.data(),
      id: snapshot.id
    });
  }
  
  /**
   * Update an existing goal
   */
  async updateGoal(goalId: string, goalData: Partial<Goal>): Promise<void> {
    const goalRef = doc(db, 'goals', goalId);
    
    // Format the goal data for Firestore
    const formattedGoal = this.formatGoalForFirestore({
      ...goalData,
      updatedAt: Timestamp.now()
    });
    
    await updateDoc(goalRef, formattedGoal);
  }
  
  /**
   * Delete a goal
   */
  async deleteGoal(goalId: string): Promise<void> {
    const goalRef = doc(db, 'goals', goalId);
    await deleteDoc(goalRef);
    
    // Also delete all entries associated with this goal
    const entriesQuery = query(
      collection(db, 'goalEntries'),
      where('goalId', '==', goalId)
    );
    
    const snapshot = await getDocs(entriesQuery);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }
  
  /**
   * Mark a goal as complete
   */
  async completeGoal(goalId: string): Promise<void> {
    const goalRef = doc(db, 'goals', goalId);
    
    await updateDoc(goalRef, {
      isCompleted: true,
      completedDate: Timestamp.fromDate(new Date()),
      progress: 100,
      updatedAt: Timestamp.now()
    });
  }
  
  /**
   * Archive a goal
   */
  async archiveGoal(goalId: string): Promise<void> {
    const goalRef = doc(db, 'goals', goalId);
    
    await updateDoc(goalRef, {
      isActive: false,
      isArchived: true,
      updatedAt: Timestamp.now()
    });
  }
  
  /**
   * Reactivate an archived goal
   */
  async reactivateGoal(goalId: string): Promise<void> {
    const goalRef = doc(db, 'goals', goalId);
    
    await updateDoc(goalRef, {
      isActive: true,
      isArchived: false,
      updatedAt: Timestamp.now()
    });
  }
  
  /**
   * Add an entry to track progress
   */
  async addGoalEntry(goalId: string, userId: string, value: number, date = new Date(), note?: string): Promise<GoalEntry> {
    const entryId = uuidv4();
    const entryRef = doc(db, 'goalEntries', entryId);
    
    const entry: GoalEntry = {
      id: entryId,
      goalId,
      userId,
      date,
      value,
      note,
      createdAt: Timestamp.now()
    };
    
    // Format for Firestore
    const formattedEntry = {
      ...entry,
      date: Timestamp.fromDate(date)
    };
    
    await setDoc(entryRef, formattedEntry);
    
    // Update the goal's progress and streak
    await this.updateGoalProgress(goalId);
    
    return entry;
  }
  
  /**
   * Get all entries for a goal
   */
  async getGoalEntries(goalId: string): Promise<GoalEntry[]> {
    const entriesQuery = query(
      collection(db, 'goalEntries'),
      where('goalId', '==', goalId),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(entriesQuery);
    const entries: GoalEntry[] = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data() as any;
      entries.push({
        ...data,
        id: doc.id,
        date: data.date.toDate(),
      });
    }
    
    return entries;
  }
  
  /**
   * Calculate and update a goal's progress
   */
  async updateGoalProgress(goalId: string): Promise<void> {
    const goal = await this.getGoal(goalId);
    if (!goal) return;
    
    const entries = await this.getGoalEntries(goalId);
    
    // Sort entries by date
    entries.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    let progress = 0;
    let streakDays = 0;
    
    if (entries.length > 0) {
      // Calculate progress based on goal type
      if (goal.currentValue !== null && goal.targetValue !== null) {
        const latestValue = entries[entries.length - 1].value;
        const totalChange = goal.targetValue - goal.currentValue;
        const currentChange = latestValue - goal.currentValue;
        
        // Calculate progress percentage
        if (totalChange !== 0) {
          progress = Math.min(100, Math.max(0, (currentChange / totalChange) * 100));
        }
      }
      
      // Calculate streak
      let lastDate: Date | null = null;
      let currentStreak = 0;
      
      // Group entries by date (one per day max)
      const entriesByDate = new Map<string, GoalEntry>();
      for (const entry of entries) {
        const dateString = entry.date.toISOString().split('T')[0];
        entriesByDate.set(dateString, entry);
      }
      
      // Convert to array and sort
      const sortedEntries = Array.from(entriesByDate.values())
        .sort((a, b) => a.date.getTime() - b.date.getTime());
      
      // Calculate streak
      for (const entry of sortedEntries) {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        
        if (!lastDate) {
          // First entry
          currentStreak = 1;
        } else {
          const expectedDate = new Date(lastDate);
          expectedDate.setDate(expectedDate.getDate() + 1);
          
          if (entryDate.getTime() === expectedDate.getTime()) {
            // Sequential day
            currentStreak++;
          } else {
            // Streak broken
            currentStreak = 1;
          }
        }
        
        lastDate = entryDate;
      }
      
      streakDays = currentStreak;
      
      // Update the goal with the calculated progress and streak
      await this.updateGoal(goalId, {
        progress,
        streakDays,
        lastCheckedIn: entries[entries.length - 1].date
      });
    }
  }
  
  /**
   * Helper to format a goal for Firestore (convert Date objects to Timestamps)
   */
  private formatGoalForFirestore(goal: any): any {
    const formattedGoal: any = { ...goal };
    
    // Convert Date objects to Firestore Timestamps
    if (formattedGoal.startDate instanceof Date) {
      formattedGoal.startDate = Timestamp.fromDate(formattedGoal.startDate);
    }
    
    if (formattedGoal.targetDate instanceof Date) {
      formattedGoal.targetDate = Timestamp.fromDate(formattedGoal.targetDate);
    }
    
    if (formattedGoal.completedDate instanceof Date) {
      formattedGoal.completedDate = Timestamp.fromDate(formattedGoal.completedDate);
    }
    
    if (formattedGoal.lastCheckedIn instanceof Date) {
      formattedGoal.lastCheckedIn = Timestamp.fromDate(formattedGoal.lastCheckedIn);
    }
    
    // Remove id if present (Firestore will handle document ID)
    if ('id' in formattedGoal) {
      delete formattedGoal.id;
    }
    
    // Remove entries if present (stored separately)
    if ('entries' in formattedGoal) {
      delete formattedGoal.entries;
    }
    
    return formattedGoal;
  }
  
  /**
   * Helper to format a Firestore goal to our app format (convert Timestamps to Dates)
   */
  private formatGoalFromFirestore(goalData: any): Goal {
    const formattedGoal: any = { ...goalData };
    
    // Convert Firestore Timestamps to Date objects
    if (formattedGoal.startDate && typeof formattedGoal.startDate.toDate === 'function') {
      formattedGoal.startDate = formattedGoal.startDate.toDate();
    }
    
    if (formattedGoal.targetDate && typeof formattedGoal.targetDate.toDate === 'function') {
      formattedGoal.targetDate = formattedGoal.targetDate.toDate();
    }
    
    if (formattedGoal.completedDate && typeof formattedGoal.completedDate.toDate === 'function') {
      formattedGoal.completedDate = formattedGoal.completedDate.toDate();
    }
    
    if (formattedGoal.lastCheckedIn && typeof formattedGoal.lastCheckedIn.toDate === 'function') {
      formattedGoal.lastCheckedIn = formattedGoal.lastCheckedIn.toDate();
    }
    
    if (formattedGoal.createdAt && typeof formattedGoal.createdAt.toDate === 'function') {
      // Keep this as Timestamp for Firestore queries
    }
    
    if (formattedGoal.updatedAt && typeof formattedGoal.updatedAt.toDate === 'function') {
      // Keep this as Timestamp for Firestore queries
    }
    
    return formattedGoal as Goal;
  }
}

export const goalService = new GoalService(); 