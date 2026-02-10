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

  // USADO POR ESTUDIANTES - Verificar si ya votó
  async yaVoto(idEstudiante: string): Promise<boolean> {
    const refCol = collection(this.db, 'votos');
    const q = query(refCol, where('idEstudiante', '==', idEstudiante));
    const snap = await getDocs(q);
    
    return !snap.empty;
  }

  // USADO POR ESTUDIANTES - Registrar voto
  async registrarVoto(
  idEstudiante: string,
  idCandidato: string
): Promise<void> {

  // Verificar si ya votó
  const yaVoto = await this.yaVoto(idEstudiante);

  if (yaVoto) {
    throw new Error('El estudiante ya ha votado');
  }

  // Crear voto
  const voto = {
    fecha: Timestamp.now(),
    idCandidato,
    idEstudiante
  };

  // Guardar voto
  await addDoc(collection(this.db, 'votos'), voto);

  // Actualizar estudiante
  const estudianteRef = doc(this.db, 'estudiantes', idEstudiante);

  await updateDoc(estudianteRef, {
    yaVoto: true
  });

}


  // USADO POR ESTUDIANTES - Obtener voto de un estudiante
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

  // USADO POR ADMIN - Obtener todos los votos
  async obtenerTodos(): Promise<any[]> {
    const refCol = collection(this.db, 'votos');
    const snap = await getDocs(refCol);

    return snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  }

  // USADO POR ADMIN - Contar votos por candidato
  async contarVotosPorCandidato(idCandidato: string): Promise<number> {
    const refCol = collection(this.db, 'votos');
    const q = query(refCol, where('idCandidato', '==', idCandidato));
    const snap = await getDocs(q);
    
    return snap.size;
  }
}