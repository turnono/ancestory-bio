import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy,
  Timestamp 
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Enzyme } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EnzymeService {
  private firestore = inject(Firestore);
  private enzymesCollection = collection(this.firestore, 'enzymes');

  getAllEnzymes(): Observable<Enzyme[]> {
    const q = query(this.enzymesCollection, orderBy('createdAt', 'desc'));
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Enzyme))
      )
    );
  }

  getEnzyme(id: string): Observable<Enzyme | undefined> {
    const enzymeDoc = doc(this.firestore, 'enzymes', id);
    return from(getDoc(enzymeDoc)).pipe(
      map(doc => {
        if (doc.exists()) {
          return { id: doc.id, ...doc.data() } as Enzyme;
        }
        return undefined;
      })
    );
  }

  async createEnzyme(enzyme: Omit<Enzyme, 'id'>): Promise<string> {
    const enzymeData = {
      ...enzyme,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    const docRef = await addDoc(this.enzymesCollection, enzymeData);
    return docRef.id;
  }

  async updateEnzyme(id: string, enzyme: Partial<Enzyme>): Promise<void> {
    const enzymeDoc = doc(this.firestore, 'enzymes', id);
    await updateDoc(enzymeDoc, {
      ...enzyme,
      updatedAt: Timestamp.now()
    });
  }

  async deleteEnzyme(id: string): Promise<void> {
    const enzymeDoc = doc(this.firestore, 'enzymes', id);
    await deleteDoc(enzymeDoc);
  }
}
