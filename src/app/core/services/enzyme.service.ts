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
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, from, map } from 'rxjs';
import { Enzyme } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EnzymeService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
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

  /**
   * Upload FASTA file to Cloud Storage
   * @param enzymeId - Enzyme identifier
   * @param file - FASTA file to upload
   * @returns Cloud Storage URL
   */
  async uploadFastaFile(enzymeId: string, file: File): Promise<string> {
    const storagePath = `sequences/${enzymeId}.fasta`;
    const storageRef = ref(this.storage, storagePath);
    
    await uploadBytes(storageRef, file, {
      contentType: 'text/plain',
      customMetadata: {
        enzymeId,
        uploadDate: new Date().toISOString()
      }
    });
    
    return await getDownloadURL(storageRef);
  }

  /**
   * Parse FASTA format to extract amino acid sequence
   * @param content - FASTA file content
   * @returns Amino acid sequence
   */
  parseFastaSequence(content: string): string {
    const lines = content.split('\n');
    // Skip header line (starts with '>') and join remaining lines
    const sequence = lines
      .filter(line => !line.startsWith('>') && line.trim().length > 0)
      .join('')
      .replace(/\s/g, '') // Remove all whitespace
      .toUpperCase();
    return sequence;
  }

  /**
   * Calculate sequence length (number of amino acids)
   * @param sequence - Amino acid sequence
   * @returns Number of amino acids
   */
  calculateSequenceLength(sequence: string): number {
    return sequence.replace(/\s/g, '').length;
  }

  /**
   * Validate amino acid sequence
   * @param sequence - Amino acid sequence to validate
   * @returns true if valid, false otherwise
   */
  validateSequence(sequence: string): boolean {
    // Valid amino acid codes (single letter)
    const validAminoAcids = /^[ACDEFGHIKLMNPQRSTVWY]+$/i;
    const cleanSequence = sequence.replace(/\s/g, '');
    return validAminoAcids.test(cleanSequence);
  }
}
