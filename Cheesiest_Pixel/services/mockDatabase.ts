
import { User } from '../types';

export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  lastVisit: string;
  lastUpdated: string;
  status: 'Stable' | 'Critical' | 'Recovering';
  avatar: string;
  vitals: {
    bp: string;
    heartRate: string;
    spO2: string;
    temp: string;
  };
  history: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isDoctor: boolean;
}

const MOCK_PATIENTS: PatientData[] = [
  {
    id: 'p1',
    name: 'Rahul Sharma',
    age: 45,
    gender: 'Male',
    condition: 'Type 2 Diabetes',
    lastVisit: '2 days ago',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: 'Stable',
    avatar: 'https://picsum.photos/seed/rahul/200',
    vitals: { bp: '130/85', heartRate: '78', spO2: '98%', temp: '98.6°F' },
    history: ['Diagnosed 2019', 'Metformin 500mg prescribed', 'Reported dizziness on 12/10']
  },
  {
    id: 'p2',
    name: 'Sarah Khan',
    age: 32,
    gender: 'Female',
    condition: 'Chronic Migraine',
    lastVisit: 'Today',
    lastUpdated: new Date().toISOString(),
    status: 'Recovering',
    avatar: 'https://picsum.photos/seed/sarah/200',
    vitals: { bp: '110/70', heartRate: '72', spO2: '99%', temp: '98.4°F' },
    history: ['MRI Clear', 'Ayurvedic Nasya therapy started', 'Trigger: Stress']
  },
  {
    id: 'p3',
    name: 'Amit Verma',
    age: 58,
    gender: 'Male',
    condition: 'Hypertension',
    lastVisit: '1 week ago',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    status: 'Critical',
    avatar: 'https://picsum.photos/seed/amit/200',
    vitals: { bp: '160/100', heartRate: '88', spO2: '96%', temp: '99.1°F' },
    history: ['Emergency admit Aug 2023', 'Family history of cardiac issues']
  },
  {
    id: 'p4',
    name: 'Priya Patel',
    age: 28,
    gender: 'Female',
    condition: 'PCOS',
    lastVisit: '3 days ago',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: 'Stable',
    avatar: 'https://picsum.photos/seed/priya/200',
    vitals: { bp: '118/76', heartRate: '74', spO2: '99%', temp: '98.6°F' },
    history: ['Lifestyle modification plan', 'Yoga therapy adherence: High']
  }
];

const MOCK_CHATS: Record<string, ChatMessage[]> = {
  'p1': [
    { id: 'c1', senderId: 'p1', text: 'Doctor, I am feeling a bit dizzy today.', timestamp: new Date(Date.now() - 86400000), isDoctor: false },
    { id: 'c2', senderId: 'd1', text: 'Have you checked your blood sugar levels this morning?', timestamp: new Date(Date.now() - 86000000), isDoctor: true },
    { id: 'c3', senderId: 'p1', text: 'Yes, it was 145 mg/dL.', timestamp: new Date(Date.now() - 85000000), isDoctor: false }
  ],
  'p2': [
    { id: 'c1', senderId: 'p2', text: 'The new medication is working well. Headaches are less frequent.', timestamp: new Date(Date.now() - 172800000), isDoctor: false },
    { id: 'c2', senderId: 'd1', text: 'That is great news, Sarah. Continue the course for another week.', timestamp: new Date(Date.now() - 172000000), isDoctor: true }
  ]
};

export const MockDatabase = {
  updateDoctorProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...data, id: userId } as User;
  },

  getPatientsForDoctor: async (doctorId: string): Promise<PatientData[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_PATIENTS;
  },

  updatePatientRecord: async (patientId: string, updates: Partial<PatientData>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = MOCK_PATIENTS.findIndex(p => p.id === patientId);
    if (index !== -1) {
      MOCK_PATIENTS[index] = {
        ...MOCK_PATIENTS[index],
        ...updates,
        lastUpdated: new Date().toISOString()
      };
    }
  },

  getChatHistory: async (patientId: string): Promise<ChatMessage[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_CHATS[patientId] || [];
  },

  sendChatMessage: async (patientId: string, text: string): Promise<ChatMessage> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'd1',
      text,
      timestamp: new Date(),
      isDoctor: true
    };
    if (!MOCK_CHATS[patientId]) MOCK_CHATS[patientId] = [];
    MOCK_CHATS[patientId].push(newMsg);
    return newMsg;
  }
};
