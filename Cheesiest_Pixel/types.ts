export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  RESEARCHER = 'RESEARCHER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface PatientRecord {
  id: string;
  patientId: string;
  patientName?: string;
  age?: number;
  gender?: string;
  date: string;
  diagnosis: string;
  doctor: string;
  doctorId?: string;
  treatmentType: 'Allopathy' | 'Ayurveda' | 'Homeopathy' | 'Integrated';
  status: 'Ongoing' | 'Recovered' | 'Critical';
  organSystem?: string;
  diseaseType?: string;
  severity?: string;
  stage?: string;

  // Real-time interactivity fields
  researchConsent?: boolean;        // Can researchers access this record?
  tags?: string[];                  // Doctor-defined tags for categorization
  lastModified?: any;               // Timestamp of last modification
  modifiedBy?: string;              // User ID who last modified
}

export interface Notification {
  id: string;
  userId: string;                   // Researcher ID who receives this
  type: 'new_record' | 'updated_record' | 'system';
  title: string;
  message: string;
  recordId?: string;                // Related patient record ID
  read: boolean;
  createdAt: any;                   // Timestamp
}

export interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: 'Video' | 'In-Person';
  status: 'Confirmed' | 'Pending';
}

export interface ComparisonData {
  condition: string;
  allopathyScore: number;
  ayurvedaScore: number;
  homeopathyScore: number;
  integratedScore: number;
}