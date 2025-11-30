import { db } from '../src/firebaseConfig';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, query, where, updateDoc, deleteDoc, Query, DocumentData, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import { User, Appointment, PatientRecord, UserRole } from '../types';
import { notifyResearchersAboutNewRecord } from './notificationService';

export const getUser = async (uid: string): Promise<User | null> => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as User;
    }
    return null;
};

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, data);
};

export const getAppointmentsForUser = async (userId: string, role: UserRole): Promise<Appointment[]> => {
    const appointmentsRef = collection(db, 'appointments');
    let q: Query<DocumentData>;

    if (role === UserRole.PATIENT) {
        q = query(appointmentsRef, where('patientId', '==', userId));
    } else if (role === UserRole.DOCTOR) {
        q = query(appointmentsRef, where('doctorId', '==', userId));
    } else {
        return [];
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
};

export const createAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
    return docRef.id;
};

export const updateAppointmentStatus = async (appointmentId: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, { status });
};

export const getPatientRecords = async (patientId: string): Promise<PatientRecord[]> => {
    const recordsRef = collection(db, 'patientRecords');
    const q = query(recordsRef, where('patientId', '==', patientId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PatientRecord));
};

/**
 * Add patient record with consent and tags
 */
export const addPatientRecord = async (recordData: Omit<PatientRecord, 'id'>) => {
    const dataWithTimestamp = {
        ...recordData,
        lastModified: Timestamp.now(),
        createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'patientRecords'), dataWithTimestamp);

    if (recordData.researchConsent) {
        await notifyResearchersAboutNewRecord({ id: docRef.id, ...dataWithTimestamp }, false);
    }

    return docRef.id;
};

/**
 * Update patient record
 */
export const updatePatientRecord = async (recordId: string, updates: Partial<PatientRecord>, userId: string) => {
    const recordRef = doc(db, 'patientRecords', recordId);
    const dataWithTimestamp = {
        ...updates,
        lastModified: Timestamp.now(),
        modifiedBy: userId
    };

    await updateDoc(recordRef, dataWithTimestamp);

    if (updates.researchConsent) {
        const recordDoc = await getDoc(recordRef);
        if (recordDoc.exists()) {
            await notifyResearchersAboutNewRecord({ id: recordId, ...recordDoc.data() }, true);
        }
    }
};

/**
 * Real-time listener for patient records
 */
export const subscribeToPatientRecords = (
    patientId: string,
    callback: (records: PatientRecord[]) => void
): (() => void) => {
    const q = query(
        collection(db, 'patientRecords'),
        where('patientId', '==', patientId),
        orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const records: PatientRecord[] = [];
        snapshot.forEach((doc) => {
            records.push({
                id: doc.id,
                ...doc.data()
            } as PatientRecord);
        });
        callback(records);
    });

    return unsubscribe;
};

/**
 * Real-time listener for research records (with consent only)
 */
export const subscribeToResearchRecords = (
    callback: (records: PatientRecord[]) => void
): (() => void) => {
    const q = query(
        collection(db, 'patientRecords'),
        where('researchConsent', '==', true),
        orderBy('lastModified', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const records: PatientRecord[] = [];
        snapshot.forEach((doc) => {
            records.push({
                id: doc.id,
                ...doc.data()
            } as PatientRecord);
        });
        callback(records);
    });

    return unsubscribe;
};

export const getAllPatientRecords = async (): Promise<PatientRecord[]> => {
    const recordsRef = collection(db, 'patientRecords');
    const querySnapshot = await getDocs(recordsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PatientRecord));
};

export const getPatientsForDoctor = async (doctorId: string) => {
    const recordsRef = collection(db, 'patientRecords');
    const q = query(recordsRef, where('doctorId', '==', doctorId));
    const querySnapshot = await getDocs(q);

    const patientIds = new Set<string>();
    querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.patientId) {
            patientIds.add(data.patientId);
        }
    });

    return Array.from(patientIds);
};
