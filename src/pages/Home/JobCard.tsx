import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonChip, IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonIcon } from '@ionic/react';
import { Job } from '../../hooks/useJobs';
import { JobStatus } from '../JobDetails/JobDetails';
import { calendarOutline, locationOutline } from 'ionicons/icons';
import './jobCard.css';
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
      <IonCard onClick={onClick} className="job-card">
        <IonCardHeader>
          <div className="job-card__header">
            <div>
              <IonCardTitle className="job-card__title">{job.companyName}</IonCardTitle>
              <IonCardSubtitle className="job-card__subtitle">{job.position}</IonCardSubtitle>
            </div>
            <IonChip 
              color={statusColors[job.status]}
              className="job-card__status-chip"
            >
              {job.status}
            </IonChip>
          </div>
        </IonCardHeader>
        <IonCardContent>
          <div className="job-card__metadata">
            <div className="job-card__metadata-item">
              <IonIcon icon={calendarOutline} />
              {new Date(job.dateApplied).toLocaleDateString()}
            </div>
            {job.location && (
              <div className="job-card__metadata-item">
                <IonIcon icon={locationOutline} />
                {job.location}
              </div>
            )}
          </div>
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