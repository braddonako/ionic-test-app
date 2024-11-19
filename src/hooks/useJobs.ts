import { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { JobsRepository } from '../repositories/jobs/jobsRepository';
import { Job } from '../repositories/jobs/models/job';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const jobsRepo = useMemo(() => new JobsRepository(db), []);

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const jobsList = await jobsRepo.getAllByUserId(user.uid);
      setJobs(jobsList);
      return jobsList;
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, jobsRepo]);

  const addJob = async (jobData: Omit<Job, 'id' | 'userId'>) => {
    if (!user) throw new Error('Must be logged in to add jobs');

    setLoading(true);
    try {
      const newJob = await jobsRepo.create(user.uid, jobData);
      await fetchJobs(); 
      return newJob;
    } catch (err) {
      console.error('Error adding job:', err);
      throw new Error('Failed to add job');
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id: string, updates: Partial<Omit<Job, 'id' | 'userId'>>) => {
    if (!user) throw new Error('Must be logged in to update jobs');

    setLoading(true);
    try {
      await jobsRepo.update(id, updates);
      await fetchJobs(); 
    } catch (err) {
      console.error('Error updating job:', err);
      throw new Error('Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id: string) => {
    if (!user) throw new Error('Must be logged in to delete jobs');

    setLoading(true);
    try {
      await jobsRepo.delete(id);
      await fetchJobs(); 
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
  }, [user, fetchJobs]);

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

// Single job hook
export function useJob(id: string | undefined) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const jobsRepo = useMemo(() => new JobsRepository(db), []);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const fetchedJob = await jobsRepo.getById(id);
        
        if (fetchedJob) {
          setJob(fetchedJob);
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
  }, [id, jobsRepo]);

  return { job, isLoading, error };
}