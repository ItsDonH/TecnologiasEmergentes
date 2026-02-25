import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
  Timestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { app } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class VotosService {

  private db = getFirestore(app);

  async yaVoto(idEstudiante: string): Promise<boolean> {
    const refCol = collection(this.db, 'votos');
    const q = query(refCol, where('estudianteId', '==', idEstudiante));
    const snap = await getDocs(q);

    return !snap.empty;
  }

  async registrarVoto(data: any): Promise<void> {

    const yaVoto = await this.yaVoto(data.estudianteId);

    if (yaVoto) {
      throw new Error('El estudiante ya ha votado');
    }

    const voto = {
      fecha: Timestamp.now(),
      estudianteId: data.estudianteId,
      planillaId: data.planillaId
    };

    await addDoc(collection(this.db, 'votos'), voto);

    const estudianteRef = doc(this.db, 'estudiantes', data.estudianteId);

    await updateDoc(estudianteRef, {
      yaVoto: true
    });
  }

  async obtenerTodos(): Promise<any[]> {
    const refCol = collection(this.db, 'votos');
    const snap = await getDocs(refCol);

    return snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  }

  async contarVotosPorPlanilla(planillaId: string): Promise<number> {
    const refCol = collection(this.db, 'votos');
    const q = query(refCol, where('planillaId', '==', planillaId));
    const snap = await getDocs(q);

    return snap.size;
  }
}