import { db, auth } from '../src/firebaseConfig';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { UserRole } from '../types';

export const seedDatabase = async () => {
    console.log("Starting database seed...");

    try {
        const usersToCreate = [
            {
                email: 'patient@samhita.com',
                password: 'patient123',
                name: 'Rahul Sharma',
                role: UserRole.PATIENT,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul'
            },
            {
                email: 'doctor@samhita.com',
                password: 'doctor123',
                name: 'Dr. Anjali Gupta',
                role: UserRole.DOCTOR,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali'
            },
            {
                email: 'researcher@samhita.com',
                password: 'researcher123',
                name: 'Dr. Vikram Singh',
                role: UserRole.RESEARCHER,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram'
            },
            {
                email: 'priya.patel@samhita.com',
                password: 'priya2024',
                name: 'Priya Patel',
                role: UserRole.PATIENT,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
            },
            {
                email: 'amit.verma@samhita.com',
                password: 'amit2024',
                name: 'Amit Verma',
                role: UserRole.PATIENT,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit'
            },
            {
                email: 'sarah.khan@samhita.com',
                password: 'sarah2024',
                name: 'Sarah Khan',
                role: UserRole.PATIENT,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
            },
            {
                email: 'dr.mehta@samhita.com',
                password: 'mehta2024',
                name: 'Dr. Rajesh Mehta',
                role: UserRole.DOCTOR,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh'
            },
            {
                email: 'dr.nair@samhita.com',
                password: 'nair2024',
                name: 'Dr. Lakshmi Nair',
                role: UserRole.DOCTOR,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lakshmi'
            },
            {
                email: 'dr.kumar@samhita.com',
                password: 'kumar2024',
                name: 'Dr. Arun Kumar',
                role: UserRole.DOCTOR,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arun'
            },
            {
                email: 'research.sharma@samhita.com',
                password: 'sharma2024',
                name: 'Dr. Neha Sharma',
                role: UserRole.RESEARCHER,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha'
            },
            {
                email: 'research.das@samhita.com',
                password: 'das2024',
                name: 'Dr. Suresh Das',
                role: UserRole.RESEARCHER,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh'
            }
        ];

        const createdUserIds: { [key: string]: string } = {};

        for (const userData of usersToCreate) {
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    userData.email,
                    userData.password
                );

                const userId = userCredential.user.uid;

                if (userData.role === UserRole.PATIENT) createdUserIds.patient = userId;
                if (userData.role === UserRole.DOCTOR) createdUserIds.doctor = userId;
                if (userData.role === UserRole.RESEARCHER) createdUserIds.researcher = userId;

                await setDoc(doc(db, 'users', userId), {
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    avatar: userData.avatar,
                    createdAt: new Date().toISOString()
                });

                console.log(`✓ Created user: ${userData.name} (${userId})`);
            } catch (error: any) {
                if (error.code === 'auth/email-already-in-use') {
                    console.log(`User ${userData.email} already exists, skipping...`);
                } else {
                    console.error(`Error creating user ${userData.email}:`, error);
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (createdUserIds.patient && createdUserIds.doctor) {
            const records = [
                {
                    patientId: createdUserIds.patient,
                    patientName: 'Rahul Sharma',
                    age: 45,
                    gender: 'Male',
                    date: new Date().toISOString(),
                    diagnosis: 'Hypertension',
                    doctor: 'Dr. Anjali Gupta',
                    treatmentType: 'Integrated',
                    status: 'Ongoing',
                    organSystem: 'Cardiology',
                    diseaseType: 'Lifestyle-linked',
                    severity: 'Moderate',
                    stage: 'Chronic'
                },
                {
                    patientId: createdUserIds.patient,
                    patientName: 'Rahul Sharma',
                    age: 45,
                    gender: 'Male',
                    date: new Date(Date.now() - 86400000 * 30).toISOString(),
                    diagnosis: 'Type 2 Diabetes',
                    doctor: 'Dr. Anjali Gupta',
                    treatmentType: 'Allopathy',
                    status: 'Ongoing',
                    organSystem: 'Endocrinology',
                    diseaseType: 'Metabolic',
                    severity: 'Moderate',
                    stage: 'Chronic'
                }
            ];

            for (const record of records) {
                await addDoc(collection(db, 'patientRecords'), record);
                console.log(`✓ Seeded record: ${record.diagnosis}`);
            }

            const appointments = [
                {
                    patientId: createdUserIds.patient,
                    patientName: 'Rahul Sharma',
                    doctorId: createdUserIds.doctor,
                    doctorName: 'Dr. Anjali Gupta',
                    time: new Date(Date.now() + 86400000).toISOString(),
                    type: 'Video',
                    status: 'Confirmed'
                },
                {
                    patientId: createdUserIds.patient,
                    patientName: 'Rahul Sharma',
                    doctorId: createdUserIds.doctor,
                    doctorName: 'Dr. Anjali Gupta',
                    time: new Date(Date.now() + 86400000 * 3).toISOString(),
                    type: 'In-Person',
                    status: 'Pending'
                }
            ];

            for (const apt of appointments) {
                await addDoc(collection(db, 'appointments'), apt);
                console.log(`✓ Seeded appointment for: ${apt.patientName}`);
            }
        }

        console.log("✅ Database seeding completed!");
        alert(`Database seeded successfully!

Test Accounts:

PATIENTS:
• patient@samhita.com / patient123
• priya.patel@samhita.com / priya2024
• amit.verma@samhita.com / amit2024
• sarah.khan@samhita.com / sarah2024

DOCTORS:
• doctor@samhita.com / doctor123
• dr.mehta@samhita.com / mehta2024
• dr.nair@samhita.com / nair2024
• dr.kumar@samhita.com / kumar2024

RESEARCHERS:
• researcher@samhita.com / researcher123
• research.sharma@samhita.com / sharma2024
• research.das@samhita.com / das2024

Please refresh the page.`);
    } catch (error) {
        console.error("Error seeding database:", error);
        alert("Error seeding database. Check console for details.");
    }
};
