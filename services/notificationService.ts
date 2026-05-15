import { Event } from '@/models/event';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

export const notificationService = {
    scheduleEventNotification: async (event: Event) => {
        const triggerDate = new Date(event.startDateTime)

        triggerDate.setMinutes(triggerDate.getMinutes() - 60);

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: `Événements`,
                body: `${event.title} commencera dans une heure!`,
                sound: true
            },
            trigger: {
                type: SchedulableTriggerInputTypes.DATE,
                date: triggerDate
            },
        });

        return notificationId;
    },
    cancelEventNotification: async (event: Event) => {
        await Notifications.cancelScheduledNotificationAsync(event.notificationId!)
    },
    requestPermissions: async () => {
        const { status } = await Notifications.requestPermissionsAsync();

        return status === "granted";
    }
}

