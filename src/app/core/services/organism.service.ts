import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Organism } from '../models';

/**
 * Organism service - simplified stub for now
 */
@Injectable({
  providedIn: 'root'
})
export class OrganismService {
  getAllOrganisms(): Observable<Organism[]> {
    // Return empty array for now - will be implemented with Firestore later
    return of([]);
  }

  getOrganism(id: string): Observable<Organism | undefined> {
    return of(undefined);
  }
}
