import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonChip } from '@ionic/react';
import { Job } from '../../hooks/useJobs';

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  return (
    <IonCard onClick={onClick}>
      <IonCardHeader>
        <IonCardTitle>{job.companyName}</IonCardTitle>
        <IonCardSubtitle>{job.position}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonChip>{job.status}</IonChip>
        <div>{new Date(job.dateApplied).toLocaleDateString()}</div>
        {job.location && <div>{job.location}</div>}
      </IonCardContent>
    </IonCard>
  );
};