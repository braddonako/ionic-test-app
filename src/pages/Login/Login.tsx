import { IonContent, IonPage, IonButton, IonText } from '@ionic/react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase/config';
import './Login.css';

const Login: React.FC = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
<IonPage>
  <IonContent fullscreen className="ion-padding">
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to</h1>
          <IonText color="primary" className="app-title">Applitrack</IonText>
          <p className="subtitle">Track your job applications with ease</p>
        </div>
        
        <IonButton 
          expand="block" 
          onClick={signInWithGoogle}
          className="google-button"
        >
          <img 
            src="/assets/google-logo.png" 
            alt="Google" 
            className="google-icon" 
          />
          Sign in with Google
        </IonButton>
      </div>
    </div>
  </IonContent>
</IonPage>
  );
};

export default Login;