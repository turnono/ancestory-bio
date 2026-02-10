import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BatchService } from '../../../core/services/batch.service';
import { EnzymeService } from '../../../core/services/enzyme.service';
import { OrganismService } from '../../../core/services/organism.service';
import { Batch, Enzyme, Organism } from '../../../core/models';
import { Observable, switchMap, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface BatchDetail {
  batch: Batch;
  enzyme?: Enzyme;
  organism?: Organism;
}

@Component({
  selector: 'app-batch-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <button routerLink="/yield-tracker" class="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2">
        ← Back to Yield Tracker
      </button>

      @if (batchDetail$ | async; as detail) {
        <div class="space-y-6">
          <!-- Header -->
          <div class="glass-card p-8">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h1 class="text-3xl font-bold">Batch Details</h1>
                <p class="text-gray-600 dark:text-gray-400 mt-2">
                  Created {{ detail.batch.timestamp | date:'medium' }}
                </p>
              </div>
              <span
                class="px-3 py-1 rounded-full text-sm font-medium"
                [ngClass]="{
                  'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-200': detail.batch.status === 'completed',
                  'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-200': detail.batch.status === 'in-progress',
                  'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-200': detail.batch.status === 'peak-yield'
                }">
                {{ detail.batch.status === 'peak-yield' ? '🏆 Peak Yield' : detail.batch.status }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-gray-600 dark:text-gray-400">CBGA Input</label>
                <p class="text-2xl font-bold">{{ detail.batch.cbgaInput }} mg</p>
              </div>
              <div>
                <label class="text-sm text-gray-600 dark:text-gray-400">Lab Technician</label>
                <p class="text-lg">{{ detail.batch.labTechName }}</p>
              </div>
            </div>
          </div>

          <!-- Cannabinoid Outputs -->
          <div class="glass-card p-8">
            <h3 class="text-lg font-semibold mb-4">Cannabinoid Outputs</h3>
            <div class="grid grid-cols-4 gap-4">
              <div class="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-lg">
                <p class="text-sm text-gray-600 dark:text-gray-400">THCA</p>
                <p class="text-3xl font-bold text-primary-600">{{ detail.batch.outputs.thca.toFixed(1) }}%</p>
              </div>
              <div class="bg-success-50 dark:bg-success-900/10 p-4 rounded-lg">
                <p class="text-sm text-gray-600 dark:text-gray-400">CBDA</p>
                <p class="text-3xl font-bold text-success-600">{{ detail.batch.outputs.cbda.toFixed(1) }}%</p>
              </div>
              <div class="bg-warning-50 dark:bg-warning-900/10 p-4 rounded-lg">
                <p class="text-sm text-gray-600 dark:text-gray-400">CBCA</p>
                <p class="text-3xl font-bold text-warning-600">{{ detail.batch.outputs.cbca.toFixed(1) }}%</p>
              </div>
              @if (detail.batch.outputs.cbg) {
                <div class="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                  <p class="text-sm text-gray-600 dark:text-gray-400">CBG</p>
                  <p class="text-3xl font-bold text-purple-600">{{ detail.batch.outputs.cbg.toFixed(1) }}%</p>
                </div>
              }
            </div>
          </div>

          <!-- Production Conditions -->
          @if (detail.batch.conditions) {
            <div class="glass-card p-8">
              <h3 class="text-lg font-semibold mb-4">Production Conditions</h3>
              <div class="grid grid-cols-3 gap-6">
                @if (detail.batch.conditions.temperature) {
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">Temperature</label>
                    <p class="text-lg font-medium">{{ detail.batch.conditions.temperature }}°C</p>
                  </div>
                }
                @if (detail.batch.conditions.ph) {
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">pH</label>
                    <p class="text-lg font-medium">{{ detail.batch.conditions.ph }}</p>
                  </div>
                }
                @if (detail.batch.conditions.duration) {
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">Duration</label>
                    <p class="text-lg font-medium">{{ detail.batch.conditions.duration }} hours</p>
                  </div>
                }
                @if (detail.batch.conditions.inductionOD) {
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">Induction OD</label>
                    <p class="text-lg font-medium">{{ detail.batch.conditions.inductionOD }}</p>
                  </div>
                }
                @if (detail.batch.conditions.substrateConcentration) {
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">Substrate Concentration</label>
                    <p class="text-lg font-medium">{{ detail.batch.conditions.substrateConcentration }}</p>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Enzyme Details -->
          @if (detail.enzyme) {
            <div class="glass-card p-8">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Enzyme Information</h3>
                <button
                  [routerLink]="['/enzymes', detail.enzyme.id]"
                  class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Full Details →
                </button>
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="text-sm text-gray-600 dark:text-gray-400">Name</label>
                  <p class="text-lg font-medium">{{ detail.enzyme.name }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600 dark:text-gray-400">Type</label>
                  <p class="text-lg">{{ detail.enzyme.type }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600 dark:text-gray-400">Specialization</label>
                  <p class="text-lg">{{ detail.enzyme.specialization }}</p>
                </div>
                @if (detail.enzyme.sequenceLength) {
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">Sequence Length</label>
                    <p class="text-lg">{{ detail.enzyme.sequenceLength }} amino acids</p>
                  </div>
                }
                @if (detail.enzyme.metadata?.kineticParameters) {
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">Km (μM)</label>
                    <p class="text-lg">{{ detail.enzyme.metadata?.kineticParameters?.km_uM || 'N/A' }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">kcat (s⁻¹)</label>
                    <p class="text-lg">{{ detail.enzyme.metadata?.kineticParameters?.kcat_s || 'N/A' }}</p>
                  </div>
                }
                @if (detail.enzyme.metadata?.productProfile?.primary) {
                  <div class="col-span-2">
                    <label class="text-sm text-gray-600 dark:text-gray-400">Primary Product</label>
                    <p class="text-lg">{{ detail.enzyme.metadata?.productProfile?.primary }}</p>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Organism Details -->
          @if (detail.organism) {
            <div class="glass-card p-8">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Organism Information</h3>
                <button
                  [routerLink]="['/organisms', detail.organism.id]"
                  class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Full Details →
                </button>
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="text-sm text-gray-600 dark:text-gray-400">Name</label>
                  <p class="text-lg font-medium">{{ detail.organism.name }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600 dark:text-gray-400">Strain</label>
                  <p class="text-lg">{{ detail.organism.strain }}</p>
                </div>
                @if (detail.organism.taxonomy) {
                  <div class="col-span-2">
                    <label class="text-sm text-gray-600 dark:text-gray-400">Taxonomy</label>
                    <p class="text-lg italic">
                      {{ detail.organism.taxonomy.genus }} {{ detail.organism.taxonomy.species }}
                    </p>
                  </div>
                }
                @if (detail.organism.metadata?.growthTemp) {
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">Growth Temperature</label>
                    <p class="text-lg">{{ detail.organism.metadata?.growthTemp }}</p>
                  </div>
                }
                @if (detail.organism.metadata?.optimalPh) {
                  <div>
                    <label class="text-sm text-gray-600 dark:text-gray-400">Optimal pH</label>
                    <p class="text-lg">{{ detail.organism.metadata?.optimalPh }}</p>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Notes -->
          @if (detail.batch.notes) {
            <div class="glass-card p-8">
              <h3 class="text-lg font-semibold mb-2">Notes</h3>
              <p class="text-gray-700 dark:text-gray-300">{{ detail.batch.notes }}</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class BatchDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private batchService = inject(BatchService);
  private enzymeService = inject(EnzymeService);
  private organismService = inject(OrganismService);
  
  batchDetail$!: Observable<BatchDetail>;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.batchDetail$ = this.batchService.getBatch(id).pipe(
        switchMap(batch => {
          if (!batch) {
            return of({ batch: {} as Batch });
          }

          const enzyme$ = batch.enzymeId 
            ? this.enzymeService.getEnzyme(batch.enzymeId) 
            : of(undefined);
          
          const organism$ = batch.organismId 
            ? this.organismService.getOrganism(batch.organismId) 
            : of(undefined);

          return combineLatest([of(batch), enzyme$, organism$]).pipe(
            map(([batch, enzyme, organism]) => ({
              batch,
              enzyme,
              organism
            }))
          );
        })
      );
    }
  }
}
