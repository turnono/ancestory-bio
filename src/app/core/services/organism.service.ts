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
import { Organism } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrganismService {
  private firestore = inject(Firestore);
  private organismsCollection = collection(this.firestore, 'organisms');

  getAllOrganisms(): Observable<Organism[]> {
    const q = query(this.organismsCollection, orderBy('createdAt', 'desc'));
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Organism))
      )
    );
  }

  getOrganism(id: string): Observable<Organism | undefined> {
    const organismDoc = doc(this.firestore, 'organisms', id);
    return from(getDoc(organismDoc)).pipe(
      map(doc => {
        if (doc.exists()) {
          return { id: doc.id, ...doc.data() } as Organism;
        }
        return undefined;
      })
    );
  }

  async createOrganism(organism: Omit<Organism, 'id'>): Promise<string> {
    const organismData = {
      ...organism,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    const docRef = await addDoc(this.organismsCollection, organismData);
    return docRef.id;
  }

  async updateOrganism(id: string, organism: Partial<Organism>): Promise<void> {
    const organismDoc = doc(this.firestore, 'organisms', id);
    await updateDoc(organismDoc, {
      ...organism,
      updatedAt: Timestamp.now()
    });
  }

  async deleteOrganism(id: string): Promise<void> {
    const organismDoc = doc(this.firestore, 'organisms', id);
    await deleteDoc(organismDoc);
  }
}
