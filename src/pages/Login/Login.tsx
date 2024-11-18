import { IonContent, IonPage, IonButton } from '@ionic/react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase/config';

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
      <IonContent>
        <IonButton expand="block" onClick={signInWithGoogle}>
          Sign in with Google
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;