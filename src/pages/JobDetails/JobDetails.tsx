import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,IonSelect, IonSelectOption, IonItem, IonLabel } from '@ionic/react';
import { useParams } from 'react-router';
import { useJob } from '../../hooks/useJobs'; 
import { format } from 'date-fns';
import { useJobs } from '../../hooks/useJobs'; 
import { useEffect, useState } from 'react';

type JobStatus = 'applied' | 'interviewing' | 'offered' | 'rejected';

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { job, isLoading, error } = useJob(jobId);
  const { updateJob, refreshJobs } = useJobs();
  const [currentStatus, setCurrentStatus] = useState<JobStatus>(job?.status || 'applied');

  const handleStatusUpdate = async (newStatus: JobStatus) => {
    setCurrentStatus(newStatus); 
    try {
      await updateJob(jobId, {
        status: newStatus,
        notes: `Updated status to ${newStatus}`
      });
      await refreshJobs();
    } catch (error) {
      console.error('Failed to update job:', error);
      setCurrentStatus(job?.status || 'applied'); 
    }
  };

  useEffect(() => {
    if (job?.status) {
      setCurrentStatus(job.status);
    }
  }, [job]);


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Location: {job.location}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <h1>{job.companyName} - {job.position}</h1>
          <p>Applied on {format(new Date(job.dateApplied), 'MM/dd/yyyy')}</p>
          <IonItem>
            <IonLabel position="stacked">Current Status:</IonLabel>
                    <IonSelect 
            value={currentStatus}
            onIonChange={e => handleStatusUpdate(e.detail.value as JobStatus)}
        >
                <IonSelectOption value="applied">Applied</IonSelectOption>
                <IonSelectOption value="interviewing">Interviewing</IonSelectOption>
                <IonSelectOption value="offered">Offered</IonSelectOption>
                <IonSelectOption value="rejected">Rejected</IonSelectOption>
          </IonSelect>      
          </IonItem>
          <h2>Notes:</h2>
          <p>{job.notes}</p>
          
        </div>
      </IonContent>
    </IonPage>
  );
};

export default JobDetails;