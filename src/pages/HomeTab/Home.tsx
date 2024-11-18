import { IonContent, IonPage, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router';
import { useJobs } from '../../hooks/useJobs';
import { JobCard } from './JobCard';
import { useEffect } from 'react';
import { useIonViewWillEnter } from '@ionic/react';


const Home: React.FC = () => {
  const history = useHistory();
  const { jobs, loading, error, refreshJobs } = useJobs();
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

  return (
    <IonPage>
      <IonContent>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        
        {jobs.map(job => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => handleJobClick(job.id!)}
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