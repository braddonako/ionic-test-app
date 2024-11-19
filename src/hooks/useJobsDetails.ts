import { useState, useEffect } from 'react';
import { Note } from '../repositories/jobs/models/note';
import { JobStatus } from '../repositories/jobs/models/job';
import { useJobs } from './useJobs';

export function useJobDetails(jobId: string, initialJob?: any) {
  const { updateJob, refreshJobs } = useJobs();
  const [currentStatus, setCurrentStatus] = useState<JobStatus>(initialJob?.status || 'applied');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>(initialJob?.notes || []);

  useEffect(() => {
    if (initialJob?.status) {
      setCurrentStatus(initialJob.status);
    }
    if (initialJob?.notes) {
      setNotes(initialJob.notes);
    }
  }, [initialJob]);

  const handleDeleteNote = async (timestampToDelete: string) => {
    try {
      const updatedNotes = notes.filter(note => note.timestamp !== timestampToDelete);
      setNotes(updatedNotes);
      await updateJob(jobId, { notes: updatedNotes });
      await refreshJobs();
    } catch (error) {
      console.error('Failed to delete note:', error);
      setNotes(notes);
    }
  };

  const handleStatusUpdate = async (newStatus: JobStatus) => {
    setCurrentStatus(newStatus);
    try {
      await updateJob(jobId, { status: newStatus });
      await refreshJobs();
    } catch (error) {
      console.error('Failed to update job:', error);
      setCurrentStatus(initialJob?.status || 'applied');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    const newNoteObj: Note = {
      createdAt: Date.now(),
      content: newNote,
      timestamp: new Date().toISOString(),
    };

    try {
      const updatedNotes = [newNoteObj, ...notes];
      setNotes(updatedNotes);
      await updateJob(jobId, { notes: updatedNotes });
      await refreshJobs();
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
      setNotes(notes);
    }
  };

  return {
    currentStatus,
    newNote,
    notes,
    setNewNote,
    handleDeleteNote,
    handleStatusUpdate,
    handleAddNote
  };
}