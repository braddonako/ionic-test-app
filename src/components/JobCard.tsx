import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonChip, IonItemSliding, IonItem, IonItemOptions, IonItemOption } from '@ionic/react';
import { Job } from '../hooks/useJobs';
import { JobStatus } from '../pages/JobDetails/JobDetails';

interface JobCardProps {
  job: Job;
  onClick: () => void;
  onDelete: () => void; 
}

const statusColors: Record<JobStatus, string> = {
  applied: 'primary',
  interviewing: 'warning',
  offered: 'success',
  rejected: 'danger'
};

export const JobCard: React.FC<JobCardProps> = ({ job, onClick, onDelete }) => {
  return (
    <IonItemSliding>
    <IonItem>
      <IonCard onClick={onClick} style={{ width: '100%' }}>
        <IonCardHeader>
          <IonCardTitle>{job.companyName}</IonCardTitle>
          <IonCardSubtitle>{job.position}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonChip color={statusColors[job.status]}>{job.status}</IonChip>
          <div>{new Date(job.dateApplied).toLocaleDateString()}</div>
          {job.location && <div>{job.location}</div>}
        </IonCardContent>
      </IonCard>
    </IonItem>

    <IonItemOptions side="end">
      <IonItemOption color="danger" onClick={onDelete}>
        Delete
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>
  );
};