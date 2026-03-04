import { Injectable } from '@angular/core';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../firebase.config';

@Injectable({ providedIn: 'root' })
export class ResultadosService {

  private db = getFirestore(app);

  async obtenerVotos(): Promise<any[]> {
    const snap = await getDocs(collection(this.db, 'votos'));
      console.log('Total documentos:', snap.size);       // ¿Cuántos encontró?
  console.log('Está vacío:', snap.empty);            // ¿Está vacía la colección?
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async obtenerPlanillas(): Promise<any[]> {
    const snap = await getDocs(collection(this.db, 'planillas'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}