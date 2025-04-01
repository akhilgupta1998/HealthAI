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
  Timestamp, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Types for reminders and reports
export interface ReminderSettings {
  userId: string;
  hydrationReminders: boolean;
  hydrationFrequency: number; // in minutes
  hydrationStart: string; // 24h format "HH:MM"
  hydrationEnd: string; // 24h format "HH:MM"
  exerciseReminders: boolean;
  exerciseFrequency: number; // in days
  exerciseTime: string; // 24h format "HH:MM"
  mealReminders: boolean;
  breakfastTime: string; // 24h format "HH:MM"
  lunchTime: string; // 24h format "HH:MM"
  dinnerTime: string; // 24h format "HH:MM"
  monthlyReports: boolean;
  emailReports: boolean;
  pushNotifications: boolean;
  lastUpdated: Date;
}

export interface EmailReport {
  id?: string;
  userId: string;
  reportType: 'monthly' | 'weekly' | 'progress' | 'achievement';
  sentAt: Date;
  data: any; // Report data structure will depend on type
  status: 'pending' | 'sent' | 'failed';
}

// Get default reminder settings
const getDefaultReminderSettings = (userId: string): ReminderSettings => ({
  userId,
  hydrationReminders: true,
  hydrationFrequency: 60, // Every hour
  hydrationStart: "08:00",
  hydrationEnd: "22:00",
  exerciseReminders: true,
  exerciseFrequency: 1, // Every day
  exerciseTime: "17:00",
  mealReminders: true,
  breakfastTime: "08:00",
  lunchTime: "12:30",
  dinnerTime: "19:00",
  monthlyReports: true,
  emailReports: true,
  pushNotifications: true,
  lastUpdated: new Date()
});

// Helper to check if current time is within reminder window
const isWithinTimeWindow = (startTime: string, endTime: string): boolean => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  
  return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
};

// Helper to format time string (for display)
export const formatTimeString = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const reminderService = {
  /**
   * Get or initialize user reminder settings
   */
  async getUserReminderSettings(userId: string): Promise<ReminderSettings> {
    try {
      const settingsRef = doc(db, 'user_settings', userId);
      const settingsDoc = await getDoc(settingsRef);
      
      if (settingsDoc.exists()) {
        const data = settingsDoc.data() as ReminderSettings;
        
        // Convert Firestore timestamp to Date object
        data.lastUpdated = data.lastUpdated instanceof Timestamp 
          ? data.lastUpdated.toDate() 
          : new Date(data.lastUpdated);
          
        return data;
      }
      
      // If no settings exist, create and return default
      const defaultSettings = getDefaultReminderSettings(userId);
      await setDoc(settingsRef, {
        ...defaultSettings,
        lastUpdated: serverTimestamp()
      });
      return defaultSettings;
    } catch (error) {
      console.error('Error getting user reminder settings:', error);
      throw error;
    }
  },
  
  /**
   * Update user reminder settings
   */
  async updateReminderSettings(userId: string, settings: Partial<ReminderSettings>): Promise<void> {
    try {
      const settingsRef = doc(db, 'user_settings', userId);
      await updateDoc(settingsRef, {
        ...settings,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating reminder settings:', error);
      throw error;
    }
  },
  
  /**
   * Request permission for browser notifications
   */
  async requestNotificationPermission(): Promise<boolean> {
    try {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
      }
      
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  },
  
  /**
   * Send a browser notification
   */
  async sendNotification(title: string, options: NotificationOptions = {}): Promise<boolean> {
    try {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
      }
      
      if (Notification.permission !== 'granted') {
        const granted = await this.requestNotificationPermission();
        if (!granted) return false;
      }
      
      // Set default options
      const defaultOptions: NotificationOptions = {
        icon: '/logo.png',
        badge: '/logo.png',
        silent: false,
        ...options
      };
      
      new Notification(title, defaultOptions);
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  },
  
  /**
   * Schedule a hydration reminder based on user settings
   */
  async scheduleHydrationReminder(userId: string): Promise<void> {
    try {
      const settings = await this.getUserReminderSettings(userId);
      
      if (!settings.hydrationReminders) return;
      
      // Check if within active hours
      if (!isWithinTimeWindow(settings.hydrationStart, settings.hydrationEnd)) return;
      
      // Schedule notification
      setTimeout(async () => {
        // Verify that reminders are still enabled before sending
        const updatedSettings = await this.getUserReminderSettings(userId);
        if (!updatedSettings.hydrationReminders) return;
        
        // Send notification if push notifications are enabled
        if (updatedSettings.pushNotifications) {
          this.sendNotification('Time to hydrate!', {
            body: 'Remember to drink water to stay hydrated.',
            icon: '/icons/water-drop.png'
          });
        }
        
        // Schedule next reminder
        this.scheduleHydrationReminder(userId);
      }, settings.hydrationFrequency * 60 * 1000); // Convert minutes to milliseconds
    } catch (error) {
      console.error('Error scheduling hydration reminder:', error);
    }
  },
  
  /**
   * Schedule all reminders for a user
   */
  async scheduleAllReminders(userId: string): Promise<void> {
    try {
      // Start with hydration reminders
      this.scheduleHydrationReminder(userId);
      
      // Additional reminder types could be implemented here
    } catch (error) {
      console.error('Error scheduling reminders:', error);
    }
  },
  
  /**
   * Schedule a monthly email report
   */
  async scheduleMonthlyEmailReport(userId: string): Promise<void> {
    try {
      const settings = await this.getUserReminderSettings(userId);
      
      if (!settings.monthlyReports || !settings.emailReports) return;
      
      // Create a pending email report record
      const now = new Date();
      const reportData = {
        userId,
        reportType: 'monthly' as const,
        sentAt: now,
        data: {
          month: now.getMonth(),
          year: now.getFullYear()
        },
        status: 'pending' as const
      };
      
      await addDoc(collection(db, 'email_reports'), reportData);
      
      // Note: The actual email sending would typically be handled by a backend function
      // This is just recording that a report should be sent
    } catch (error) {
      console.error('Error scheduling monthly report:', error);
    }
  },
  
  /**
   * Check if it's time to send a monthly report
   */
  isTimeForMonthlyReport(lastReportDate: Date | null): boolean {
    if (!lastReportDate) return true;
    
    const now = new Date();
    const lastMonth = lastReportDate.getMonth();
    const currentMonth = now.getMonth();
    const lastYear = lastReportDate.getFullYear();
    const currentYear = now.getFullYear();
    
    // Send if it's a different month or year
    return lastMonth !== currentMonth || lastYear !== currentYear;
  },
  
  /**
   * Get email reports for a user
   */
  async getUserReports(userId: string): Promise<EmailReport[]> {
    try {
      const reportsQuery = query(
        collection(db, 'email_reports'),
        where('userId', '==', userId)
      );
      
      const reportDocs = await getDocs(reportsQuery);
      
      return reportDocs.docs.map(doc => {
        const data = doc.data() as EmailReport;
        return {
          id: doc.id,
          ...data,
          sentAt: data.sentAt instanceof Timestamp 
            ? data.sentAt.toDate() 
            : new Date(data.sentAt)
        };
      });
    } catch (error) {
      console.error('Error getting user reports:', error);
      throw error;
    }
  }
};

export default reminderService; 