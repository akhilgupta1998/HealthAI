import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Types for wearable data
export interface WearableDevice {
  id?: string;
  userId: string;
  deviceType: 'apple_health' | 'fitbit' | 'google_fit' | 'samsung_health' | 'garmin' | 'other';
  deviceName: string;
  isConnected: boolean;
  lastSynced: Date | null;
  authToken?: string;
  refreshToken?: string;
  tokenExpires?: Date;
  settings: {
    syncSteps: boolean;
    syncHeartRate: boolean;
    syncSleep: boolean;
    syncWorkouts: boolean;
    syncCalories: boolean;
    autoSync: boolean;
    syncFrequency: number; // in minutes
  };
}

export interface HealthData {
  id?: string;
  userId: string;
  deviceId: string;
  dataType: 'steps' | 'heart_rate' | 'sleep' | 'workout' | 'calories';
  startTime: Date;
  endTime: Date;
  value: number;
  unit: string;
  metadata?: Record<string, any>;
}

export interface SleepData extends Omit<HealthData, 'dataType' | 'value'> {
  dataType: 'sleep';
  sleepStages: {
    awake: number; // in minutes
    light: number; // in minutes
    deep: number; // in minutes
    rem: number; // in minutes
  };
  totalDuration: number; // in minutes
  efficiency: number; // percentage
}

export interface HeartRateData extends Omit<HealthData, 'dataType'> {
  dataType: 'heart_rate';
  restingHeartRate?: number;
  minHeartRate: number;
  maxHeartRate: number;
  avgHeartRate: number;
}

export interface WorkoutData extends Omit<HealthData, 'dataType'> {
  dataType: 'workout';
  workoutType: string;
  caloriesBurned: number;
  distance?: number;
  distanceUnit?: string;
  steps?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  elevationGain?: number;
}

// Get default wearable device settings
const getDefaultDeviceSettings = (userId: string, deviceType: WearableDevice['deviceType'], deviceName: string): WearableDevice => ({
  userId,
  deviceType,
  deviceName,
  isConnected: false,
  lastSynced: null,
  settings: {
    syncSteps: true,
    syncHeartRate: true,
    syncSleep: true,
    syncWorkouts: true,
    syncCalories: true,
    autoSync: true,
    syncFrequency: 60 // Sync every hour by default
  }
});

// Helper to convert timestamps
const convertTimestamp = (timestamp: Timestamp | Date): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

export const wearableService = {
  /**
   * Get user's connected wearable devices
   */
  async getUserDevices(userId: string): Promise<WearableDevice[]> {
    try {
      const devicesQuery = query(
        collection(db, 'wearable_devices'),
        where('userId', '==', userId)
      );
      
      const deviceDocs = await getDocs(devicesQuery);
      
      return deviceDocs.docs.map(doc => {
        const data = doc.data() as WearableDevice;
        return {
          id: doc.id,
          ...data,
          lastSynced: data.lastSynced ? convertTimestamp(data.lastSynced) : null,
          tokenExpires: data.tokenExpires ? convertTimestamp(data.tokenExpires) : undefined
        };
      });
    } catch (error) {
      console.error('Error getting user devices:', error);
      throw error;
    }
  },
  
  /**
   * Connect a new wearable device
   */
  async connectDevice(device: Omit<WearableDevice, 'id' | 'isConnected' | 'lastSynced'>): Promise<WearableDevice> {
    try {
      const newDevice: WearableDevice = {
        ...device,
        isConnected: true,
        lastSynced: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'wearable_devices'), {
        ...newDevice,
        lastSynced: serverTimestamp()
      });
      
      return {
        ...newDevice,
        id: docRef.id
      };
    } catch (error) {
      console.error('Error connecting device:', error);
      throw error;
    }
  },
  
  /**
   * Update a connected device
   */
  async updateDevice(deviceId: string, data: Partial<WearableDevice>): Promise<void> {
    try {
      const deviceRef = doc(db, 'wearable_devices', deviceId);
      await updateDoc(deviceRef, {
        ...data,
        lastSynced: data.lastSynced || serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  },
  
  /**
   * Disconnect a wearable device
   */
  async disconnectDevice(deviceId: string): Promise<void> {
    try {
      const deviceRef = doc(db, 'wearable_devices', deviceId);
      await updateDoc(deviceRef, {
        isConnected: false,
        lastSynced: serverTimestamp()
      });
    } catch (error) {
      console.error('Error disconnecting device:', error);
      throw error;
    }
  },
  
  /**
   * Store health data from a wearable device
   */
  async storeHealthData(data: Omit<HealthData, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'health_data'), {
        ...data,
        startTime: Timestamp.fromDate(data.startTime),
        endTime: Timestamp.fromDate(data.endTime)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error storing health data:', error);
      throw error;
    }
  },
  
  /**
   * Store sleep data from a wearable device
   */
  async storeSleepData(data: Omit<SleepData, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'health_data'), {
        ...data,
        startTime: Timestamp.fromDate(data.startTime),
        endTime: Timestamp.fromDate(data.endTime)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error storing sleep data:', error);
      throw error;
    }
  },
  
  /**
   * Store workout data from a wearable device
   */
  async storeWorkoutData(data: Omit<WorkoutData, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'health_data'), {
        ...data,
        startTime: Timestamp.fromDate(data.startTime),
        endTime: Timestamp.fromDate(data.endTime)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error storing workout data:', error);
      throw error;
    }
  },
  
  /**
   * Get step count data for a date range
   */
  async getStepData(userId: string, startDate: Date, endDate: Date): Promise<HealthData[]> {
    try {
      const dataQuery = query(
        collection(db, 'health_data'),
        where('userId', '==', userId),
        where('dataType', '==', 'steps'),
        where('startTime', '>=', Timestamp.fromDate(startDate)),
        where('endTime', '<=', Timestamp.fromDate(endDate)),
        orderBy('startTime', 'asc')
      );
      
      const dataDocs = await getDocs(dataQuery);
      
      return dataDocs.docs.map(doc => {
        const data = doc.data() as HealthData;
        return {
          id: doc.id,
          ...data,
          startTime: convertTimestamp(data.startTime),
          endTime: convertTimestamp(data.endTime)
        };
      });
    } catch (error) {
      console.error('Error getting step data:', error);
      throw error;
    }
  },
  
  /**
   * Get heart rate data for a date range
   */
  async getHeartRateData(userId: string, startDate: Date, endDate: Date): Promise<HeartRateData[]> {
    try {
      const dataQuery = query(
        collection(db, 'health_data'),
        where('userId', '==', userId),
        where('dataType', '==', 'heart_rate'),
        where('startTime', '>=', Timestamp.fromDate(startDate)),
        where('endTime', '<=', Timestamp.fromDate(endDate)),
        orderBy('startTime', 'asc')
      );
      
      const dataDocs = await getDocs(dataQuery);
      
      return dataDocs.docs.map(doc => {
        const data = doc.data() as HeartRateData;
        return {
          id: doc.id,
          ...data,
          startTime: convertTimestamp(data.startTime),
          endTime: convertTimestamp(data.endTime)
        };
      });
    } catch (error) {
      console.error('Error getting heart rate data:', error);
      throw error;
    }
  },
  
  /**
   * Get sleep data for a date range
   */
  async getSleepData(userId: string, startDate: Date, endDate: Date): Promise<SleepData[]> {
    try {
      const dataQuery = query(
        collection(db, 'health_data'),
        where('userId', '==', userId),
        where('dataType', '==', 'sleep'),
        where('startTime', '>=', Timestamp.fromDate(startDate)),
        where('endTime', '<=', Timestamp.fromDate(endDate)),
        orderBy('startTime', 'asc')
      );
      
      const dataDocs = await getDocs(dataQuery);
      
      return dataDocs.docs.map(doc => {
        const data = doc.data() as SleepData;
        return {
          id: doc.id,
          ...data,
          startTime: convertTimestamp(data.startTime),
          endTime: convertTimestamp(data.endTime)
        };
      });
    } catch (error) {
      console.error('Error getting sleep data:', error);
      throw error;
    }
  },
  
  /**
   * Initialize Apple Health connection (requires client-side integration)
   */
  async connectAppleHealth(userId: string): Promise<WearableDevice | null> {
    try {
      // Note: Real implementation would use Apple HealthKit JavaScript API
      // This is a placeholder that simulates successful connection
      
      const device = getDefaultDeviceSettings(userId, 'apple_health', 'Apple Health');
      device.isConnected = true;
      
      const docRef = await addDoc(collection(db, 'wearable_devices'), {
        ...device,
        lastSynced: serverTimestamp()
      });
      
      return {
        ...device,
        id: docRef.id,
        lastSynced: new Date()
      };
    } catch (error) {
      console.error('Error connecting to Apple Health:', error);
      return null;
    }
  },
  
  /**
   * Initialize Google Fit connection (requires OAuth)
   */
  async connectGoogleFit(userId: string, authCode: string): Promise<WearableDevice | null> {
    try {
      // Note: Real implementation would exchange auth code for tokens
      // This is a placeholder that simulates successful connection
      
      const device = getDefaultDeviceSettings(userId, 'google_fit', 'Google Fit');
      device.isConnected = true;
      device.authToken = 'simulated-token';
      device.refreshToken = 'simulated-refresh-token';
      
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Token expires in 1 hour
      device.tokenExpires = expiryDate;
      
      const docRef = await addDoc(collection(db, 'wearable_devices'), {
        ...device,
        lastSynced: serverTimestamp(),
        tokenExpires: Timestamp.fromDate(expiryDate)
      });
      
      return {
        ...device,
        id: docRef.id,
        lastSynced: new Date()
      };
    } catch (error) {
      console.error('Error connecting to Google Fit:', error);
      return null;
    }
  },
  
  /**
   * Initialize Fitbit connection (requires OAuth)
   */
  async connectFitbit(userId: string, authCode: string): Promise<WearableDevice | null> {
    try {
      // Note: Real implementation would exchange auth code for tokens
      // This is a placeholder that simulates successful connection
      
      const device = getDefaultDeviceSettings(userId, 'fitbit', 'Fitbit');
      device.isConnected = true;
      device.authToken = 'simulated-token';
      device.refreshToken = 'simulated-refresh-token';
      
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Token expires in 1 hour
      device.tokenExpires = expiryDate;
      
      const docRef = await addDoc(collection(db, 'wearable_devices'), {
        ...device,
        lastSynced: serverTimestamp(),
        tokenExpires: Timestamp.fromDate(expiryDate)
      });
      
      return {
        ...device,
        id: docRef.id,
        lastSynced: new Date()
      };
    } catch (error) {
      console.error('Error connecting to Fitbit:', error);
      return null;
    }
  },
  
  /**
   * Sync data from connected wearable devices
   */
  async syncWearableData(userId: string): Promise<boolean> {
    try {
      const devices = await this.getUserDevices(userId);
      
      // Filter to only connected devices
      const connectedDevices = devices.filter(device => device.isConnected);
      
      if (connectedDevices.length === 0) {
        return false;
      }
      
      // For each connected device, sync data
      // Note: In a real implementation, this would call device-specific APIs
      for (const device of connectedDevices) {
        // Update last synced timestamp
        await this.updateDevice(device.id!, {
          lastSynced: new Date()
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error syncing wearable data:', error);
      return false;
    }
  }
};

export default wearableService; 