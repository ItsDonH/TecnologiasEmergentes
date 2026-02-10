import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
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
}