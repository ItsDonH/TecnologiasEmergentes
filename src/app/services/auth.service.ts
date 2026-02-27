import { Injectable } from '@angular/core';
import { 
  signInWithEmailAndPassword, 
  getAuth, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { app } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = getAuth(app);

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

<<<<<<< HEAD
  
=======
  // MÉTODO PARA OBTENER EL ESTADO DE AUTENTICACIÓN EN TIEMPO REAL
>>>>>>> c541644a8e14792225ba8cc9c4f634e7c8885ab6
  getAuthState(): Promise<any> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        resolve(user);
      });
    });
  }

}
