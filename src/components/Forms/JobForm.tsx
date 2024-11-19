import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonSelect, IonSelectOption, IonButton, IonButtons, IonBackButton, IonText, IonNote } from '@ionic/react';
import { formatSalary } from '../../utils/utils';
import { useJobForm } from '../../hooks/useJobForm';
import './jobForm.css';

const JobForm: React.FC = () => {
  const {
    jobData,
    setJobData,
    initialNote,
    setInitialNote,
    isSubmitting,
    error,
    handleSubmit
  } = useJobForm();

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
        {/* Company Information Group */}
        <div className="form-group">
          <h2 className="form-section-title">Company Information</h2>
          <IonItem>
            <IonLabel position="stacked">
              Company Name <span className="required">*</span>
            </IonLabel>
            <IonInput 
              required
              value={jobData.companyName}
              onIonChange={e => setJobData({...jobData, companyName: e.detail.value!})}
              className={!jobData.companyName ? 'ion-invalid' : ''}
            />
            <IonNote slot="helper">Enter the company's official name</IonNote>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">
              Position <span className="required">*</span>
            </IonLabel>
            <IonInput 
              required
              value={jobData.position}
              onIonChange={e => setJobData({...jobData, position: e.detail.value!})}
              className={!jobData.position ? 'ion-invalid' : ''}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Location</IonLabel>
            <IonInput 
              value={jobData.location}
              onIonChange={e => setJobData({...jobData, location: e.detail.value!})}
              placeholder="Remote or office location"
            />
          </IonItem>
        </div>

        {/* Application Details Group */}
        <div className="form-group">
          <h2 className="form-section-title">Application Details</h2>
          <IonItem>
            <IonLabel position="stacked">Expected Salary</IonLabel>
            <IonInput 
              type="text"
              value={formatSalary(jobData.salary)}
              onIonChange={e => {
                const rawValue = e.detail.value?.replace(/[^0-9]/g, '');
                const formattedValue = rawValue ? formatSalary(rawValue) : '';
                const element = e.target as HTMLIonInputElement;
                element.value = formattedValue;
                setJobData({...jobData, salary: rawValue || ''});
              }}
              placeholder="$XXX,XXX"
            />
            <IonNote slot="helper">Annual salary before taxes</IonNote>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">
              Date Applied <span className="required">*</span>
            </IonLabel>
            <IonDatetime
              value={jobData.dateApplied}
              onIonChange={e => setJobData({...jobData, dateApplied: e.detail.value as string})}
              max={new Date().toISOString()}
              className={!jobData.dateApplied ? 'ion-invalid' : ''}
            />  
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">
              Status <span className="required">*</span>
            </IonLabel>
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
        </div>

        {/* Notes Section */}
        <div className="form-group">
          <h2 className="form-section-title">Additional Notes</h2>
          <IonItem>
            <IonLabel position="stacked">Notes</IonLabel>
            <IonTextarea 
              value={initialNote}
              onIonChange={e => setInitialNote(e.detail.value!)}
              rows={4}
              placeholder="Add any relevant details about the position, interview process, or follow-up tasks..."
            />
          </IonItem>
        </div>

        {error && (
          <div className="error-message ion-padding">
            <IonText color="danger">{error}</IonText>
          </div>
        )}

        <IonButton 
          expand="block" 
          className="ion-margin-top" 
          onClick={handleSubmit}
          disabled={isSubmitting || !jobData.companyName || !jobData.position || !jobData.dateApplied || !jobData.status}
        >
          {isSubmitting ? 'Saving...' : 'Save Job Application'}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default JobForm;