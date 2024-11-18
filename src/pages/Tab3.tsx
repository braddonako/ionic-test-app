import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useAuth } from '../context/AuthContext';
import './Tab3.css';

const Tab3: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // The PrivateRoute will automatically redirect to login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <div style={{ padding: '20px' }}>
          <IonButton expand="block" onClick={handleLogout} color="danger">
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;