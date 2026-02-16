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
    const q = query(refCol, where('idEstudiante', '==', idEstudiante));
    const snap = await getDocs(q);
    
    return !snap.empty;
  }

  
  async registrarVoto(
  idEstudiante: string,
  idCandidato: string
): Promise<void> {

  
  const yaVoto = await this.yaVoto(idEstudiante);

  if (yaVoto) {
    throw new Error('El estudiante ya ha votado');
  }

  
  const voto = {
    fecha: Timestamp.now(),
    idCandidato,
    idEstudiante
  };

  
  await addDoc(collection(this.db, 'votos'), voto);

  
  const estudianteRef = doc(this.db, 'estudiantes', idEstudiante);

  await updateDoc(estudianteRef, {
    yaVoto: true
  });

}


  
  async obtenerVotoPorEstudiante(idEstudiante: string): Promise<any | null> {
    const refCol = collection(this.db, 'votos');
    const q = query(refCol, where('idEstudiante', '==', idEstudiante));
    const snap = await getDocs(q);

    if (snap.empty) {
      return null;
    }

    const doc = snap.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  }

  
  async obtenerTodos(): Promise<any[]> {
    const refCol = collection(this.db, 'votos');
    const snap = await getDocs(refCol);

    return snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  }

  
  async contarVotosPorCandidato(idCandidato: string): Promise<number> {
    const refCol = collection(this.db, 'votos');
    const q = query(refCol, where('idCandidato', '==', idCandidato));
    const snap = await getDocs(q);
    
    return snap.size;
  }
}