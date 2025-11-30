import { db } from '../src/firebaseConfig';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Notification } from '../types';

export const createNotification = async (
    userId: string,
    type: 'new_record' | 'updated_record' | 'system',
    title: string,
    message: string,
    recordId?: string
): Promise<void> => {
    try {
        await addDoc(collection(db, 'notifications'), {
            userId,
            type,
            title,
            message,
            recordId: recordId || null,
            read: false,
            createdAt: Timestamp.now()
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

export const subscribeToNotifications = (
    userId: string,
    callback: (notifications: Notification[]) => void
): (() => void) => {
    const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifications: Notification[] = [];
        snapshot.forEach((doc) => {
            notifications.push({
                id: doc.id,
                ...doc.data()
            } as Notification);
        });
        callback(notifications);
    });

    return unsubscribe;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    try {
        await updateDoc(doc(db, 'notifications', notificationId), {
            read: true
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
    try {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            where('read', '==', false)
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const updatePromises = snapshot.docs.map(doc =>
                updateDoc(doc.ref, { read: true })
            );
            await Promise.all(updatePromises);
            unsubscribe();
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
};

export const notifyResearchersAboutNewRecord = async (
    record: any,
    isUpdate: boolean = false
): Promise<void> => {
    try {
        const usersQuery = query(
            collection(db, 'users'),
            where('role', '==', 'RESEARCHER')
        );

        onSnapshot(usersQuery, async (snapshot) => {
            const notificationPromises = snapshot.docs.map(userDoc => {
                const type = isUpdate ? 'updated_record' : 'new_record';
                const title = isUpdate
                    ? 'Patient Record Updated'
                    : 'New Patient Record Available';
                const message = `${record.diagnosis} - ${record.doctor}${record.tags && record.tags.length > 0 ? ` [${record.tags.join(', ')}]` : ''}`;

                return createNotification(
                    userDoc.id,
                    type,
                    title,
                    message,
                    record.id
                );
            });

            await Promise.all(notificationPromises);
        });
    } catch (error) {
        console.error('Error notifying researchers:', error);
    }
};
