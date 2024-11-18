import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonSelect, IonSelectOption, IonButton, IonButtons, IonBackButton } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { Note, useJobs } from '../../hooks/useJobs';


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
            <IonLabel position="stacked">Note</IonLabel>
            <IonTextarea 
                value={initialNote}
                onIonChange={e => setInitialNote(e.detail.value!)}
                rows={4}
                placeholder="Enter your note here..."
            />
        </IonItem>

            <IonButton expand="block" className="ion-margin-top" onClick={handleSubmit}>
                Save Job Application
            </IonButton>
         </IonContent>
        </IonPage>
  );
};

export default JobForm;