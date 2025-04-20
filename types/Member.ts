export interface Member {
  id: string;
  name: string;
  photo: string; // URI to the photo
  phone: string;
  email?: string;
  joinDate: string;
  expiryDate: string;
  membershipType: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  height?: number; // in cm
  weight?: number; // in kg
  age?: number;
  gender?: 'male' | 'female' | 'other';
  emergencyContact?: string;
  workoutHistory?: WorkoutSession[];
  paymentHistory?: Payment[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  muscleGroup: string;
}

export interface Set {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'upi' | 'cash' | 'qr' | 'other';
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}