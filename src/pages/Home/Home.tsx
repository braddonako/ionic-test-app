import { IonContent, IonPage, IonFab, IonFabButton, IonIcon, IonText } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router';
import { useJobs } from '../../hooks/useJobs';
import { JobCard } from './JobCard';
import { useIonViewWillEnter } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const { jobs, loading, error, refreshJobs, deleteJob } = useJobs();
  const location = useLocation();

  useIonViewWillEnter(() => {
    refreshJobs();
  });

  const handleCreateJob = () => {
    history.push('/job-form');
  };

  const handleJobClick = (jobId: string) => {
      history.push(`/job-details/${jobId}`); 
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      await refreshJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  return (
    <IonPage>
      <IonContent>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        <IonText color="primary">
          <h1 className="job-dashboard-title">AppliTrack Dashboard</h1>
        </IonText>
        {jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => handleJobClick(job.id!)}
            onDelete={() => handleDeleteJob(job.id!)}
          />
        ))}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleCreateJob}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;