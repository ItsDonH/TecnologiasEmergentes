import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  limit
} from 'firebase/firestore';
import { app } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  private db = getFirestore(app);

  // 🔹 USADO EN LOGIN
  async obtenerPorCorreo(correo: string): Promise<any | null> {
    const ref = collection(this.db, 'estudiantes');
    const q = query(ref, where('correo', '==', correo), limit(1));
    const snap = await getDocs(q);

    if (snap.empty) {
      return null;
    }

    return {
      id: snap.docs[0].id,
      ...snap.docs[0].data()
    };
  }

  // 🔹 USADO EN GESTIÓN DE USUARIOS
  async obtenerEstudiantes(): Promise<any[]> {
    const ref = collection(this.db, 'estudiantes');
    const snap = await getDocs(ref);

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}