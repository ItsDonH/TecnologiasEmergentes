import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { app } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class CandidatosService {

  private db = getFirestore(app);

  
  async obtenerPorCarrera(carrera: string): Promise<any[]> {
    const refCol = collection(this.db, 'candidatos');
    const q = query(refCol, where('carrera', '==', carrera));
    const snap = await getDocs(q);

    return snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  }

  
  async obtenerTodos(): Promise<any[]> {
    const refCol = collection(this.db, 'candidatos');
    const snap = await getDocs(refCol);

    return snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  }

  
  async crear(data: any) {
    return addDoc(collection(this.db, 'candidatos'), data);
  }

  
  async actualizar(id: string, data: any) {
    return updateDoc(doc(this.db, 'candidatos', id), data);
  }

  
  async eliminar(id: string) {
    return deleteDoc(doc(this.db, 'candidatos', id));
  }
}