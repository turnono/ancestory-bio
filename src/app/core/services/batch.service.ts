import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  collectionData,
  docData,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Batch, BatchStatus, CannabinoidOutputs } from '../models';

/**
 * Batch service for managing promiscuous enzyme yield tracking
 * Core feature: Tracks 1-to-many outputs (CBGA → THCA/CBDA/CBCA)
 */
@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private firestore = inject(Firestore);
  private batchesCollection = collection(this.firestore, 'batches');

  /**
   * Get all batches with real-time updates
   */
  getAllBatches(): Observable<Batch[]> {
    const q = query(this.batchesCollection, orderBy('timestamp', 'desc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map(batches => this.convertTimestamps(batches))
    );
  }

  /**
   * Get batches by enzyme ID
   */
  getBatchesByEnzyme(enzymeId: string): Observable<Batch[]> {
    const q = query(
      this.batchesCollection,
      where('enzymeId', '==', enzymeId),
      orderBy('timestamp', 'desc')
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map(batches => this.convertTimestamps(batches))
    );
  }

  /**
   * Get batches by lab tech
   */
  getBatchesByLabTech(labTechId: string): Observable<Batch[]> {
    const q = query(
      this.batchesCollection,
      where('labTechId', '==', labTechId),
      orderBy('timestamp', 'desc')
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map(batches => this.convertTimestamps(batches))
    );
  }

  /**
   * Get single batch by ID
   */
  getBatch(id: string): Observable<Batch> {
    const batchDoc = doc(this.firestore, `batches/${id}`);
    return docData(batchDoc, { idField: 'id' }).pipe(
      map(batch => this.convertTimestamp(batch))
    );
  }

  /**
   * Create new batch
   */
  async createBatch(
    enzymeId: string,
    cbgaInput: number,
    outputs: CannabinoidOutputs,
    labTechId: string,
    labTechName: string,
    enzymeName: string,
    notes?: string
  ): Promise<string> {
    // Validate outputs sum to approximately 100%
    const total = outputs.thca + outputs.cbda + outputs.cbca;
    if (total < 95 || total > 105) {
      throw new Error(`Output percentages must sum to ~100%. Current total: ${total}%`);
    }

    const batch: Omit<Batch, 'id'> = {
      enzymeId,
      enzymeName,
      cbgaInput,
      outputs,
      timestamp: new Date(),
      labTechId,
      labTechName,
      status: BatchStatus.IN_PROGRESS,
      notes
    };

    const docRef = await addDoc(this.batchesCollection, batch);
    
    // Check if this is a peak yield
    await this.checkPeakYield(docRef.id, enzymeId, outputs);
    
    return docRef.id;
  }

  /**
   * Update batch status
   */
  async updateBatchStatus(id: string, status: BatchStatus): Promise<void> {
    const batchDoc = doc(this.firestore, `batches/${id}`);
    await updateDoc(batchDoc, { status });
  }

  /**
   * Delete batch (admin/researcher only)
   */
  async deleteBatch(id: string): Promise<void> {
    const batchDoc = doc(this.firestore, `batches/${id}`);
    await deleteDoc(batchDoc);
  }

  /**
   * Check if current batch represents peak yield for this enzyme
   * Peak yield = highest total cannabinoid production for this enzyme
   */
  private async checkPeakYield(
    batchId: string,
    enzymeId: string,
    outputs: CannabinoidOutputs
  ): Promise<void> {
    const currentTotal = outputs.thca + outputs.cbda + outputs.cbca;
    
    // Get all batches for this enzyme
    const q = query(
      this.batchesCollection,
      where('enzymeId', '==', enzymeId)
    );
    
    const batches = await collectionData(q, { idField: 'id' }).pipe(
      map(batches => this.convertTimestamps(batches))
    ).toPromise();

    if (!batches) return;

    // Check if this is the highest yield
    const isPeak = batches.every(batch => {
      if (batch.id === batchId) return true;
      const batchTotal = batch.outputs.thca + batch.outputs.cbda + batch.outputs.cbca;
      return currentTotal >= batchTotal;
    });

    if (isPeak) {
      await this.updateBatchStatus(batchId, BatchStatus.PEAK_YIELD);
      // TODO: Trigger push notification via FCM
    }
  }

  /**
   * Calculate average yields for an enzyme
   */
  calculateAverageYields(batches: Batch[]): CannabinoidOutputs {
    if (batches.length === 0) {
      return { thca: 0, cbda: 0, cbca: 0 };
    }

    const totals = batches.reduce(
      (acc, batch) => ({
        thca: acc.thca + batch.outputs.thca,
        cbda: acc.cbda + batch.outputs.cbda,
        cbca: acc.cbca + batch.outputs.cbca
      }),
      { thca: 0, cbda: 0, cbca: 0 }
    );

    return {
      thca: totals.thca / batches.length,
      cbda: totals.cbda / batches.length,
      cbca: totals.cbca / batches.length
    };
  }

  /**
   * Convert Firestore Timestamps to Date objects
   */
  private convertTimestamps(batches: any[]): Batch[] {
    return batches.map(batch => this.convertTimestamp(batch));
  }

  private convertTimestamp(batch: any): Batch {
    return {
      ...batch,
      timestamp: batch.timestamp?.toDate ? batch.timestamp.toDate() : batch.timestamp
    } as Batch;
  }
}
