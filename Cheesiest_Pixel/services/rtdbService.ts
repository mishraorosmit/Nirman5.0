import { rtdb } from '../src/firebaseConfig';
import { ref, set, onDisconnect, onValue, serverTimestamp } from 'firebase/database';

export const setupPresence = (userId: string) => {
    const connectedRef = ref(rtdb, '.info/connected');
    const userStatusRef = ref(rtdb, `/status/${userId}`);

    onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === false) {
            return;
        }

        onDisconnect(userStatusRef).set({
            state: 'offline',
            last_changed: serverTimestamp(),
        }).then(() => {
            set(userStatusRef, {
                state: 'online',
                last_changed: serverTimestamp(),
            });
        });
    });
};

export const updateUserOnlineStatus = async (userId: string, isOnline: boolean) => {
    const userStatusRef = ref(rtdb, `/status/${userId}`);
    await set(userStatusRef, {
        state: isOnline ? 'online' : 'offline',
        last_changed: serverTimestamp(),
    });
};
