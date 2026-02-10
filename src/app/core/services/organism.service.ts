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
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable, from, map } from 'rxjs';
import { Organism, GenomicFile, CultureImage } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrganismService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
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

  /**
   * Upload genomic file to Cloud Storage
   * @param organismId - Organism identifier
   * @param file - Genomic file to upload (.fasta, .gb, .gff)
   * @returns GenomicFile object
   */
  async uploadGenomicFile(organismId: string, file: File): Promise<GenomicFile> {
    const fileId = `${Date.now()}_${file.name}`;
    const storagePath = `genomic-files/${organismId}/${fileId}`;
    const storageRef = ref(this.storage, storagePath);
    
    await uploadBytes(storageRef, file, {
      contentType: file.type || 'text/plain',
      customMetadata: {
        organismId,
        uploadDate: new Date().toISOString()
      }
    });
    
    const url = await getDownloadURL(storageRef);
    
    return {
      id: fileId,
      name: file.name,
      fastaUrl: url,
      uploadDate: new Date(),
      size: file.size
    };
  }

  /**
   * Upload culture image to Cloud Storage
   * @param organismId - Organism identifier
   * @param file - Image file to upload
   * @param description - Image description
   * @returns CultureImage object
   */
  async uploadCultureImage(organismId: string, file: File, description: string = ''): Promise<CultureImage> {
    const imageId = `${Date.now()}_${file.name}`;
    const storagePath = `culture-images/${organismId}/${imageId}`;
    const storageRef = ref(this.storage, storagePath);
    
    await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        organismId,
        uploadDate: new Date().toISOString(),
        description
      }
    });
    
    const url = await getDownloadURL(storageRef);
    
    // TODO: Generate thumbnail (could use Cloud Functions)
    return {
      id: imageId,
      url,
      uploadDate: new Date(),
      description,
      thumbnailUrl: url // For now, use same URL
    };
  }

  /**
   * Delete genomic file from Cloud Storage
   * @param organismId - Organism identifier
   * @param fileId - File identifier
   */
  async deleteGenomicFile(organismId: string, fileId: string): Promise<void> {
    const storagePath = `genomic-files/${organismId}/${fileId}`;
    const storageRef = ref(this.storage, storagePath);
    await deleteObject(storageRef);
  }

  /**
   * Delete culture image from Cloud Storage
   * @param organismId - Organism identifier
   * @param imageId - Image identifier
   */
  async deleteCultureImage(organismId: string, imageId: string): Promise<void> {
    const storagePath = `culture-images/${organismId}/${imageId}`;
    const storageRef = ref(this.storage, storagePath);
    await deleteObject(storageRef);
  }
}
