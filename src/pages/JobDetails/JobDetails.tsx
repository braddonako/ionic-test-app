import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,IonSelect, IonSelectOption, IonItem, IonLabel, IonTextarea, IonButton, IonItemSliding, IonItemOption, IonItemOptions, IonIcon, IonChip } from '@ionic/react';
import { useParams } from 'react-router';
import { Note, useJob } from '../../hooks/useJobs'; 
import { format } from 'date-fns';
import { useJobs } from '../../hooks/useJobs'; 
import { useEffect, useState } from 'react';
import { formatSalary } from '../../utils/utils';
import './jobDetails.css';
import { addCircleOutline, calendarOutline, cashOutline, locationOutline, timeOutline, trashOutline } from 'ionicons/icons';

export type JobStatus = 'applied' | 'interviewing' | 'offered' | 'rejected';

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { job, isLoading, error } = useJob(jobId);
  const { updateJob, refreshJobs } = useJobs();
  const [currentStatus, setCurrentStatus] = useState<JobStatus>(job?.status || 'applied');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>(job?.notes || []);

  const handleDeleteNote = async (timestampToDelete: string) => {
    try {
      const updatedNotes = notes.filter(note => note.timestamp !== timestampToDelete);
      setNotes(updatedNotes);
      
      await updateJob(jobId, {
        notes: updatedNotes,
      });
      await refreshJobs();
    } catch (error) {
      console.error('Failed to delete note:', error);
      setNotes(notes); // Revert on error
    }
  };
  


  const handleStatusUpdate = async (newStatus: JobStatus) => {
    setCurrentStatus(newStatus); 
    try {
      await updateJob(jobId, {
        status: newStatus,
      });
      await refreshJobs();
    } catch (error) {
      console.error('Failed to update job:', error);
      setCurrentStatus(job?.status || 'applied'); 
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
      
      await updateJob(jobId, {
        notes: updatedNotes, 
      });
      await refreshJobs();
      setNewNote(''); 
    } catch (error) {
      console.error('Failed to add note:', error);
      setNotes(notes);
    }
  };

  useEffect(() => {
    if (job?.status) {
      setCurrentStatus(job.status);
    }
    if (job?.notes) {
      setNotes(job.notes);
    }
  }, [job]); 


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{job.companyName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="job-header">
          <h1>{job.position}</h1>
          <div className="job-meta">
            <IonChip>
            <IonIcon icon={locationOutline}></IonIcon>
              <IonLabel>{job.location}</IonLabel>
            </IonChip>
            <IonChip>
                <IonIcon icon={calendarOutline}></IonIcon>
              <IonLabel>Applied {format(new Date(job.dateApplied), 'MMM d, yyyy')}</IonLabel>
            </IonChip>
            <IonChip>
              <IonIcon icon={cashOutline}></IonIcon>
              <IonLabel>{formatSalary(job.salary)}</IonLabel>
            </IonChip>
          </div>
        </div>

        <div className="status-section ion-padding">
          <IonLabel position="stacked" color="medium">Application Status</IonLabel>
          <IonSelect 
            value={currentStatus}
            onIonChange={e => handleStatusUpdate(e.detail.value as JobStatus)}
            interface="popover"
            className={`status-select status-${currentStatus}`}
          >
            <IonSelectOption value="applied">📝 Applied</IonSelectOption>
            <IonSelectOption value="interviewing">🗣 Interviewing</IonSelectOption>
            <IonSelectOption value="offered">🎉 Offered</IonSelectOption>
            <IonSelectOption value="rejected">❌ Rejected</IonSelectOption>
          </IonSelect>
        </div>

        <div className="notes-section ion-padding">
          <h2>Notes</h2>
          <div className="note-input">
            <IonTextarea
              value={newNote}
              onIonChange={e => setNewNote(e.detail.value ?? '')}
              placeholder="Add a new note..."
              rows={3}
              className="ion-margin-bottom"
            />
            <IonButton 
                expand="block" 
                onClick={handleAddNote} 
                disabled={!newNote.trim()}
                className="add-note-button"
                >
                <IonIcon icon={addCircleOutline} slot="start"></IonIcon>
                Add Note
            </IonButton>
          </div>

          <div className="notes-list">
            {notes.map((note) => (
              <IonItemSliding key={note.timestamp}>
                <IonItem className="note-item">
                  <div className="note-container">
                    <div className="note-header">
                    <IonIcon icon={timeOutline}></IonIcon>
                      <small className="note-timestamp">
                        {format(new Date(note.timestamp), 'MMM d, yyyy h:mm a')}
                      </small>
                    </div>
                    <p className="note-content">{note.content}</p>
                  </div>
                </IonItem>
                <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => handleDeleteNote(note.timestamp)}>
                      <IonIcon icon={trashOutline} slot="icon-only"></IonIcon>
                    </IonItemOption>    
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default JobDetails;