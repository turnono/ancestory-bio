import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Enzyme, EnzymeType, EnzymeSpecialization } from '../models';

/**
 * Enzyme service - simplified stub for now
 */
@Injectable({
  providedIn: 'root'
})
export class EnzymeService {
  getAllEnzymes(): Observable<Enzyme[]> {
    // Return empty array for now - will be implemented with Firestore later
    return of([]);
  }

  getEnzyme(id: string): Observable<Enzyme | undefined> {
    return of(undefined);
  }
}
