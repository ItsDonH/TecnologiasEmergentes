import { Injectable } from '@angular/core';
import { db } from '../firebase.config';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDoc
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlanillasService {

  private ref = collection(db, 'planillas');

  async crearPlanilla(data: any) {
    return await addDoc(this.ref, data);
  }

  async obtenerPlanillas() {
    const snapshot = await getDocs(this.ref);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async obtenerPlanilla(id: string) {

    const refDoc = doc(db, 'planillas', id);
    const snapshot = await getDoc(refDoc);

    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    }

    return null;
  }

  async obtenerPlanillasPorCarrera(carrera: string) {

    const q = query(this.ref, where('carrera', '==', carrera));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async eliminarPlanilla(id: string) {

    const refDoc = doc(db, 'planillas', id);
    await deleteDoc(refDoc);

  }

  async actualizarPlanilla(id: string, data: any) {

    const refDoc = doc(db, 'planillas', id);
    await updateDoc(refDoc, data);

  }
}