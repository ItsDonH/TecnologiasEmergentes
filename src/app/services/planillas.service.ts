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
  where
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlanillasService {

  private ref = collection(db, 'planillas');

  // Crear planilla
  async crearPlanilla(data: any) {
    return await addDoc(this.ref, data);
  }

  // Obtener todas las planillas (ADMIN)
  async obtenerPlanillas() {
    const snapshot = await getDocs(this.ref);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // 🔥 Obtener planillas por carrera (VOTACIÓN)
  async obtenerPlanillasPorCarrera(carrera: string) {
    const q = query(this.ref, where('carrera', '==', carrera));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Eliminar planilla
  async eliminarPlanilla(id: string) {
    const refDoc = doc(db, 'planillas', id);
    await deleteDoc(refDoc);
  }

  // Actualizar planilla
  async actualizarPlanilla(id: string, data: any) {
    const refDoc = doc(db, 'planillas', id);
    await updateDoc(refDoc, data);
  }
}