import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonSelect, IonSelectOption, IonButton, IonButtons, IonBackButton } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { useJobs } from '../../hooks/useJobs';

interface Note {
    content: string;
    timestamp: string;
    createdAt: number;
  }

const JobForm: React.FC = () => {
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
    const [currentNote, setCurrentNote] = useState('');

    const handleAddNote = () => {
      if (currentNote.trim()) {
        setJobData({
          ...jobData,
          notes: [
            ...jobData.notes,
            {
              content: currentNote.trim(),
              timestamp: new Date().toISOString(),
              createdAt: new Date().getTime()
            }
          ]
        });
        setCurrentNote('');
      }
    };

 
  
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        
        try {
          await addJob(jobData);
          history.replace('/', { refresh: true }); 
        } catch (error) {
          console.error('Error saving job application:', error);
          setError('Failed to save job application. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
         <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>New Job Application</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Company Name</IonLabel>
          <IonInput 
            value={jobData.companyName}
            onIonChange={e => setJobData({...jobData, companyName: e.detail.value!})}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Position</IonLabel>
          <IonInput 
            value={jobData.position}
            onIonChange={e => setJobData({...jobData, position: e.detail.value!})}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Location</IonLabel>
          <IonInput 
            value={jobData.location}
            onIonChange={e => setJobData({...jobData, location: e.detail.value!})}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Expected Salary</IonLabel>
          <IonInput 
            type="number"
            value={jobData.salary}
            onIonChange={e => setJobData({...jobData, salary: e.detail.value!})}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Date Applied</IonLabel>
          <IonDatetime
            value={jobData.dateApplied}
            onIonChange={e => setJobData({...jobData, dateApplied: e.detail.value as string})}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Status</IonLabel>
          <IonSelect 
            value={jobData.status}
            onIonChange={e => setJobData({...jobData, status: e.detail.value})}
          >
            <IonSelectOption value="applied">Applied</IonSelectOption>
            <IonSelectOption value="interviewing">Interviewing</IonSelectOption>
            <IonSelectOption value="offered">Offered</IonSelectOption>
            <IonSelectOption value="rejected">Rejected</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
        <IonLabel position="stacked">Add Note</IonLabel>
        <IonTextarea 
            value={currentNote}
            onIonChange={e => setCurrentNote(e.detail.value!)}
            rows={4}
            placeholder="Enter your note here..."
        />
        <IonButton 
            expand="block" 
            className="ion-margin-top" 
            onClick={handleAddNote}
            disabled={!currentNote.trim()}
        >
            Add Note
        </IonButton>
        </IonItem>

        {jobData.notes.length > 0 && (
        <IonItem>
            <IonLabel position="stacked">Previous Notes</IonLabel>
            <div className="ion-padding">
            {jobData.notes.map((note, index) => (
                <div key={index} className="ion-margin-bottom">
                <p>{note.content}</p>
                <small className="ion-text-muted">
                    {new Date(note.timestamp).toLocaleString()}
                </small>
                </div>
            ))}
            </div>
        </IonItem>
        )}

        <IonButton expand="block" className="ion-margin-top" onClick={handleSubmit}>
          Save Job Application
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default JobForm;