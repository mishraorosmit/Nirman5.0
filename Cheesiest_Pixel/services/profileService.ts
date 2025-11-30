import { storage, db } from '../src/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * Upload a profile picture to Firebase Storage
 * @param userId - The user's ID
 * @param file - The image file to upload
 * @returns The download URL of the uploaded image
 */
export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
    try {
        if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('Image size must be less than 5MB');
        }

        const storageRef = ref(storage, `profile-pictures/${userId}/${Date.now()}_${file.name}`);

        const snapshot = await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(snapshot.ref);

        await updateDoc(doc(db, 'users', userId), {
            avatar: downloadURL
        });

        return downloadURL;
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        throw error;
    }
};

/**
 * Update user profile data in Firestore
 * @param userId - The user's ID
 * @param data - The profile data to update (name, email, etc.)
 */
export const updateUserProfile = async (userId: string, data: Partial<{
    name: string;
    email: string;
    avatar?: string;
    [key: string]: any;
}>): Promise<void> => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, data);
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};
