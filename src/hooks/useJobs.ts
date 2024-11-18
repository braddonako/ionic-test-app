import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, orderBy, where, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export interface Note {
  content: string;
  timestamp: string;
  createdAt: number;
}

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
  status: 'applied' | 'interviewing' | 'offered' | 'rejected';
  createdAt?: string;
}

export function useJob(id: string | undefined) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, 'jobs', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() } as Job);
        } else {
          setError(new Error('Job not found'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  return { job, isLoading, error };
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch all jobs
  const fetchJobs = async () => {
    if (!user) return; 
    setLoading(true);
    try {
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(jobsQuery);
      const jobsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Job[];
      setJobs(jobsList);
      return jobsList;
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add new job
  const addJob = async (jobData: Omit<Job, 'id' | 'userId'>) => {
    if (!user) throw new Error('Must be logged in to add jobs');

    setLoading(true);
    try {
      const jobDataWithMetadata = {
        ...jobData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, 'jobs'), jobDataWithMetadata);
      const newJob = { id: docRef.id, ...jobDataWithMetadata };
      setJobs(prevJobs => [newJob, ...prevJobs]);
      await fetchJobs(); // Refresh jobs after adding
      return newJob;
    } catch (err) {
      console.error('Error adding job:', err);
      throw new Error('Failed to add job');
    } finally {
      setLoading(false);
    }
  };

  // Update existing job
  const updateJob = async (id: string, updates: Partial<Omit<Job, 'id' | 'userId'>>) => {
    if (!user) throw new Error('Must be logged in to update jobs');

    setLoading(true);
    try {
      const jobRef = doc(db, 'jobs', id);
      await updateDoc(jobRef, updates);
      await fetchJobs(); // Refresh jobs after updating
    } catch (err) {
      console.error('Error updating job:', err);
      throw new Error('Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  // Delete job
  const deleteJob = async (id: string) => {
    if (!user) throw new Error('Must be logged in to delete jobs');

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'jobs', id));
      await fetchJobs(); // Refresh jobs after deleting
    } catch (err) {
      console.error('Error deleting job:', err);
      throw new Error('Failed to delete job');
    } finally {
      setLoading(false);
    }
  };

  // Load jobs when user changes
  useEffect(() => {
    if (user) {
      fetchJobs();
    } else {
      setJobs([]); // Clear jobs when user logs out
    }
  }, [user]);

  const refreshJobs = async () => {
    try {
      await fetchJobs();
    } catch (err) {
      console.error('Error refreshing jobs:', err);
      throw err;
    }
  };

  return {
    jobs,
    loading,
    error,
    addJob,
    updateJob,
    deleteJob,
    refreshJobs
  };
}