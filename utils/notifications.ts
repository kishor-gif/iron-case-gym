import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Member } from '@/types/Member';

// Configure notifications
export const configureNotifications = async () => {
  // Request permissions
  await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  // Configure notification behavior
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

// Schedule payment reminder for a member
export const schedulePaymentReminder = async (member: Member) => {
  // Cancel any existing notifications for this member
  await cancelMemberNotifications(member.id);

  const expiryDate = new Date(member.expiryDate);
  const reminderDate = new Date(expiryDate);
  reminderDate.setDate(reminderDate.getDate() - 5); // 5 days before expiry

  // If reminder date is in the past, don't schedule
  if (reminderDate < new Date()) return;

  // Schedule 5 notifications per day for 5 days
  for (let day = 0; day < 5; day++) {
    const dayDate = new Date(reminderDate);
    dayDate.setDate(dayDate.getDate() + day);

    // Times to show notifications each day
    const times = [9, 12, 15, 18, 20]; // 9 AM, 12 PM, 3 PM, 6 PM, 8 PM

    for (let i = 0; i < times.length; i++) {
      const scheduledDate = new Date(dayDate);
      scheduledDate.setHours(times[i], 0, 0);

      // Only schedule if it's in the future
      if (scheduledDate > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Membership Expiring Soon',
            body: `Hi ${member.name}, your Iron Case Gym membership expires in ${5 - day} days. Please renew to continue your fitness journey!`,
            data: { memberId: member.id },
          },
          trigger: {
            date: scheduledDate,
          },
          identifier: `${member.id}-payment-${day}-${i}`,
        });
      }
    }
  }
};

// Cancel all notifications for a specific member
export const cancelMemberNotifications = async (memberId: string) => {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  
  for (const notification of scheduledNotifications) {
    if (notification.identifier.startsWith(`${memberId}-payment`)) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};