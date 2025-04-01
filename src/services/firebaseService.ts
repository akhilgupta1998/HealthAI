import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  serverTimestamp,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';
import { signInWithPopup, signOut, User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { ref as dbRef, set, get, child, update } from 'firebase/database';
import { auth, db, storage, rtdb, googleProvider, performance, trace } from '@/firebase';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

// Performance monitoring wrapper
const withPerformanceMonitoring = async <T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> => {
  if (!performance) return operation();
  
  const perfTrace = trace(performance, operationName);
  perfTrace.start();
  
  try {
    const result = await operation();
    perfTrace.stop();
    return result;
  } catch (error) {
    perfTrace.stop();
    throw error;
  }
};

// Cache wrapper
const withCache = async <T>(
  key: string,
  operation: () => Promise<T>,
  duration: number = CACHE_DURATION
): Promise<T> => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < duration) {
    return cached.data;
  }
  
  const result = await operation();
  cache.set(key, { data: result, timestamp: Date.now() });
  return result;
};

// Network state management
export const setOfflineMode = async (enabled: boolean): Promise<void> => {
  if (enabled) {
    await disableNetwork(db);
  } else {
    await enableNetwork(db);
  }
};

// User Profile Types
export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: Date;
  updatedAt: Date;
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  activityLevel?: string;
  goalWeight?: number;
  goalCalories?: number;
  goalWater?: number;
  dietaryPreferences?: string[];
  allergies?: string[];
}

// Water Log Types
export interface WaterLog {
  id?: string;
  userId: string;
  amount: number; // in ml
  timestamp: Date;
  note?: string;
}

// Weight Log Types
export interface WeightLog {
  id?: string;
  userId: string;
  weight: number; // in kg
  timestamp: Date;
  note?: string;
}

// Meal Log Types
export interface MealLog {
  id?: string;
  userId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: Date;
  imageUrl?: string;
  note?: string;
}

// Exercise Log Types
export interface ExerciseLog {
  id?: string;
  userId: string;
  type: string;
  duration: number; // in minutes
  caloriesBurned: number;
  timestamp: Date;
  note?: string;
}

// Meal Plan Types
export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions?: string;
}

export interface MealPlan {
  id?: string;
  userId: string;
  title: string;
  date: Date;
  meals: Meal[];
  dietType?: string;
  calorieTarget?: number;
  createdAt: Date;
}

// Utility function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Convert Firestore document to typed object
const convertDoc = <T>(doc: any): T => {
  const data = doc.data();
  const id = doc.id;
  
  // Convert all timestamp fields to Date objects
  Object.keys(data).forEach(key => {
    if (data[key] instanceof Timestamp) {
      data[key] = convertTimestamp(data[key]);
    }
  });
  
  return { id, ...data } as T;
};

// Authentication Services with improved error handling
export const signInWithGoogle = async (): Promise<User> => {
  return withPerformanceMonitoring('signInWithGoogle', async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Create/update user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      }, { merge: true });
      
      // Store basic user info in RTDB for quick access
      await set(dbRef(rtdb, `users/${user.uid}/basicInfo`), {
        displayName: user.displayName,
        email: user.email,
        lastLogin: new Date().toISOString(),
        lastActive: new Date().toISOString()
      });
      
      return user;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  });
};

// User signup with email/password
export const signUpWithEmail = async (email: string, password: string, displayName?: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      displayName: displayName || email.split('@')[0],
      email: user.email,
      photoURL: '',
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    
    return user;
  } catch (error) {
    console.error('Error signing up with email', error);
    throw error;
  }
};

// User login with email/password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with email', error);
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
    throw error;
  }
};

// User Profile Services with caching
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  return withPerformanceMonitoring('getUserProfile', async () => {
    return withCache(`profile_${userId}`, async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          return convertDoc<UserProfile>(userDoc);
        }
        return null;
      } catch (error) {
        console.error('Error getting user profile:', error);
        throw new Error(`Failed to fetch user profile: ${error.message}`);
      }
    });
  });
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user profile', error);
    throw error;
  }
};

// Water Tracking Services
export const addWaterLog = async (waterLog: WaterLog): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'water_logs'), {
      ...waterLog,
      timestamp: Timestamp.fromDate(waterLog.timestamp || new Date()),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding water log', error);
    throw error;
  }
};

export const getWaterLogs = async (userId: string, startDate?: Date, endDate?: Date): Promise<WaterLog[]> => {
  try {
    let q = query(
      collection(db, 'water_logs'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    if (startDate) {
      q = query(q, where('timestamp', '>=', Timestamp.fromDate(startDate)));
    }
    
    if (endDate) {
      q = query(q, where('timestamp', '<=', Timestamp.fromDate(endDate)));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertDoc<WaterLog>(doc));
  } catch (error) {
    console.error('Error getting water logs', error);
    throw error;
  }
};

export const updateWaterLog = async (id: string, data: Partial<WaterLog>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'water_logs', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating water log', error);
    throw error;
  }
};

export const deleteWaterLog = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'water_logs', id));
  } catch (error) {
    console.error('Error deleting water log', error);
    throw error;
  }
};

// Weight Tracking Services
export const addWeightLog = async (weightLog: WeightLog): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'weight_logs'), {
      ...weightLog,
      timestamp: Timestamp.fromDate(weightLog.timestamp || new Date()),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding weight log', error);
    throw error;
  }
};

export const getWeightLogs = async (userId: string, limitCount = 30): Promise<WeightLog[]> => {
  try {
    const q = query(
      collection(db, 'weight_logs'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertDoc<WeightLog>(doc));
  } catch (error) {
    console.error('Error getting weight logs', error);
    throw error;
  }
};

export const updateWeightLog = async (id: string, data: Partial<WeightLog>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'weight_logs', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating weight log', error);
    throw error;
  }
};

export const deleteWeightLog = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'weight_logs', id));
  } catch (error) {
    console.error('Error deleting weight log', error);
    throw error;
  }
};

// Meal Tracking Services
export const addMealLog = async (mealLog: MealLog): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'meal_logs'), {
      ...mealLog,
      timestamp: Timestamp.fromDate(mealLog.timestamp || new Date()),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding meal log', error);
    throw error;
  }
};

export const getMealLogs = async (userId: string, date?: Date): Promise<MealLog[]> => {
  try {
    let q = query(
      collection(db, 'meal_logs'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    if (date) {
      // Get start and end of the specified date
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      q = query(
        q,
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate))
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertDoc<MealLog>(doc));
  } catch (error) {
    console.error('Error getting meal logs', error);
    throw error;
  }
};

export const updateMealLog = async (id: string, data: Partial<MealLog>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'meal_logs', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating meal log', error);
    throw error;
  }
};

export const deleteMealLog = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'meal_logs', id));
  } catch (error) {
    console.error('Error deleting meal log', error);
    throw error;
  }
};

// Exercise Tracking Services
export const addExerciseLog = async (exerciseLog: ExerciseLog): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'exercise_logs'), {
      ...exerciseLog,
      timestamp: Timestamp.fromDate(exerciseLog.timestamp || new Date()),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding exercise log', error);
    throw error;
  }
};

export const getExerciseLogs = async (userId: string, date?: Date): Promise<ExerciseLog[]> => {
  try {
    let q = query(
      collection(db, 'exercise_logs'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    if (date) {
      // Get start and end of the specified date
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      q = query(
        q,
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate))
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertDoc<ExerciseLog>(doc));
  } catch (error) {
    console.error('Error getting exercise logs', error);
    throw error;
  }
};

export const updateExerciseLog = async (id: string, data: Partial<ExerciseLog>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'exercise_logs', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating exercise log', error);
    throw error;
  }
};

export const deleteExerciseLog = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'exercise_logs', id));
  } catch (error) {
    console.error('Error deleting exercise log', error);
    throw error;
  }
};

// Meal Plan Services
export const addMealPlan = async (mealPlan: MealPlan): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'meal_plans'), {
      ...mealPlan,
      date: Timestamp.fromDate(mealPlan.date || new Date()),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding meal plan', error);
    throw error;
  }
};

export const getMealPlans = async (userId: string): Promise<MealPlan[]> => {
  try {
    const q = query(
      collection(db, 'meal_plans'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => convertDoc<MealPlan>(doc));
  } catch (error) {
    console.error('Error getting meal plans', error);
    throw error;
  }
};

export const getMealPlanById = async (id: string): Promise<MealPlan | null> => {
  try {
    const mealPlanDoc = await getDoc(doc(db, 'meal_plans', id));
    if (mealPlanDoc.exists()) {
      return convertDoc<MealPlan>(mealPlanDoc);
    }
    return null;
  } catch (error) {
    console.error('Error getting meal plan', error);
    throw error;
  }
};

export const updateMealPlan = async (id: string, data: Partial<MealPlan>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'meal_plans', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating meal plan', error);
    throw error;
  }
};

export const deleteMealPlan = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'meal_plans', id));
  } catch (error) {
    console.error('Error deleting meal plan', error);
    throw error;
  }
};

// Daily Summary (Aggregate Data)
export interface DailySummary {
  userId: string;
  date: Date;
  totalCaloriesConsumed: number;
  totalCaloriesBurned: number;
  totalWaterConsumed: number;
  weight?: number;
  meals: {
    breakfast: MealLog[];
    lunch: MealLog[];
    dinner: MealLog[];
    snack: MealLog[];
  };
  exercises: ExerciseLog[];
  waterLogs: WaterLog[];
}

export const getDailySummary = async (userId: string, date: Date): Promise<DailySummary> => {
  try {
    // Get start and end of the specified date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    // Get all meals for the day
    const mealLogs = await getMealLogs(userId, date);
    
    // Get all exercises for the day
    const exerciseLogs = await getExerciseLogs(userId, date);
    
    // Get all water logs for the day
    const waterLogs = await getWaterLogs(userId, startDate, endDate);
    
    // Get weight log for the day if exists
    const weightLogs = await getWeightLogs(userId, 1);
    const todayWeightLog = weightLogs.find(log => {
      const logDate = log.timestamp;
      return logDate >= startDate && logDate <= endDate;
    });
    
    // Calculate totals
    const totalCaloriesConsumed = mealLogs.reduce((sum, meal) => sum + meal.calories, 0);
    const totalCaloriesBurned = exerciseLogs.reduce((sum, exercise) => sum + exercise.caloriesBurned, 0);
    const totalWaterConsumed = waterLogs.reduce((sum, water) => sum + water.amount, 0);
    
    // Organize meals by type
    const meals = {
      breakfast: mealLogs.filter(meal => meal.mealType === 'breakfast'),
      lunch: mealLogs.filter(meal => meal.mealType === 'lunch'),
      dinner: mealLogs.filter(meal => meal.mealType === 'dinner'),
      snack: mealLogs.filter(meal => meal.mealType === 'snack'),
    };
    
    return {
      userId,
      date,
      totalCaloriesConsumed,
      totalCaloriesBurned,
      totalWaterConsumed,
      weight: todayWeightLog?.weight,
      meals,
      exercises: exerciseLogs,
      waterLogs,
    };
  } catch (error) {
    console.error('Error getting daily summary', error);
    throw error;
  }
};

// Storage Services with progress tracking
export const uploadFile = async (
  userId: string,
  file: File,
  path: string
): Promise<string> => {
  return withPerformanceMonitoring('uploadFile', async () => {
    try {
      const storageRef = ref(storage, `${path}/${userId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress: ${progress}%`);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(new Error(`Upload failed: ${error.message}`));
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(new Error(`Failed to get download URL: ${error.message}`));
            }
          }
        );
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  });
};

export default {
  // Auth
  signInWithGoogle,
  signOutUser,
  
  // User Profile
  getUserProfile,
  updateUserProfile,
  
  // Water Tracking
  addWaterLog,
  getWaterLogs,
  updateWaterLog,
  deleteWaterLog,
  
  // Weight Tracking
  addWeightLog,
  getWeightLogs,
  updateWeightLog,
  deleteWeightLog,
  
  // Meal Tracking
  addMealLog,
  getMealLogs,
  updateMealLog,
  deleteMealLog,
  
  // Exercise Tracking
  addExerciseLog,
  getExerciseLogs,
  updateExerciseLog,
  deleteExerciseLog,
  
  // Meal Plan
  addMealPlan,
  getMealPlans,
  getMealPlanById,
  updateMealPlan,
  deleteMealPlan,
  
  // Summary
  getDailySummary,
  
  // Storage
  uploadFile,
}; 