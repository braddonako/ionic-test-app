import { Note } from "./note";


export type JobStatus = 'applied' | 'interviewing' | 'offered' | 'rejected';

export interface Job {
    id?: string;
    userId: string;
    companyName: string;
    position: string;
    location: string;
    salary: string;
    notes: Note[];  
    dateApplied: string;
    status: JobStatus;
    createdAt?: string;
  }