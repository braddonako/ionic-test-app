import { useState } from 'react';
import { useHistory } from 'react-router';
import { useJobs } from './useJobs';
import { Note } from '../repositories/jobs/models/note';

export const useJobForm = () => {
  const history = useHistory();
  const { addJob } = useJobs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobData, setJobData] = useState({
    companyName: '',
    position: '',
    location: '',
    salary: '',
    notes: [] as Note[],
    dateApplied: new Date().toISOString(),
    status: 'applied' as const
  });
  const [initialNote, setInitialNote] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const jobDataToSubmit = {
        ...jobData,
        notes: initialNote.trim() ? [{
          content: initialNote.trim(),
          timestamp: new Date().toISOString(),
          createdAt: new Date().getTime()
        }] : []
      };
      await addJob(jobDataToSubmit);
      history.replace('/', { refresh: true }); 
    } catch (error) {
      console.error('Error saving job application:', error);
      setError('Failed to save job application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    jobData,
    setJobData,
    initialNote,
    setInitialNote,
    isSubmitting,
    error,
    handleSubmit
  };
};