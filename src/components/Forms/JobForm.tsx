import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonTextarea, IonDatetime, IonSelect, IonSelectOption, IonButton } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';

const JobForm: React.FC = () => {
  const history = useHistory();
  const [jobData, setJobData] = useState({
    companyName: '',
    position: '',
    location: '',
    salary: '',
    notes: '',
    dateApplied: new Date().toISOString(),
    status: 'applied'
  });

  const handleSubmit = () => {
    // TODO: Handle form submission
    console.log(jobData);
    history.goBack();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
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
          <IonLabel position="stacked">Notes</IonLabel>
          <IonTextarea 
            value={jobData.notes}
            onIonChange={e => setJobData({...jobData, notes: e.detail.value!})}
            rows={4}
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