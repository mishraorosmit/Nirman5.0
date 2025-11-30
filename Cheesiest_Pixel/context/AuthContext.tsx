import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../src/firebaseConfig';
import { onAuthStateChanged, User as FirebaseUser, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User, AuthState, UserRole } from '../types';
import { setupPresence, updateUserOnlineStatus } from '../services/rtdbService';

interface AuthContextType extends AuthState {
    loading: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    loading: true,
    logout: async () => { },
    refreshUser: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch user details from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const appUser: User = {
                            id: firebaseUser.uid,
                            name: userData.name || firebaseUser.displayName || 'User',
                            email: firebaseUser.email || '',
                            role: userData.role as UserRole,
                            avatar: userData.avatar || firebaseUser.photoURL || undefined
                        };
                        setUser(appUser);
                        // Setup Realtime Presence
                        setupPresence(firebaseUser.uid);
                    } else {
                        // Fallback if user document doesn't exist
                        const appUser: User = {
                            id: firebaseUser.uid,
                            name: firebaseUser.displayName || 'User',
                            email: firebaseUser.email || '',
                            role: UserRole.PATIENT,
                            avatar: firebaseUser.photoURL || undefined
                        };
                        setUser(appUser);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        if (user) {
            await updateUserOnlineStatus(user.id, false);
        }
        await firebaseSignOut(auth);
        setUser(null);
    };

    const refreshUser = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const appUser: User = {
                        id: currentUser.uid,
                        name: userData.name || currentUser.displayName || 'User',
                        email: currentUser.email || '',
                        role: userData.role as UserRole,
                        avatar: userData.avatar || currentUser.photoURL || undefined
                    };
                    setUser(appUser);
                }
            } catch (error) {
                console.error("Error refreshing user data:", error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
