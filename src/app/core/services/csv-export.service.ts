import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { Batch, Enzyme, Organism } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CsvExportService {

  /**
   * Export batches to CSV file
   * @param batches - Array of batches to export
   * @param filename - Output filename (default: 'batches.csv')
   */
  exportBatches(batches: Batch[], filename: string = 'batches.csv'): void {
    const data = batches.map(batch => ({
      'Batch ID': batch.id,
      'Enzyme': batch.enzymeName || batch.enzymeId,
      'Organism': batch.organismName || batch.organismId || 'N/A',
      'CBGA Input (mg)': batch.cbgaInput,
      'THCA (%)': batch.outputs.thca.toFixed(2),
      'CBDA (%)': batch.outputs.cbda.toFixed(2),
      'CBCA (%)': batch.outputs.cbca.toFixed(2),
      'CBG (%)': batch.outputs.cbg?.toFixed(2) || 'N/A',
      'Status': batch.status,
      'Temperature (°C)': batch.conditions?.temperature || 'N/A',
      'pH': batch.conditions?.ph || 'N/A',
      'Duration (h)': batch.conditions?.duration || 'N/A',
      'Lab Tech': batch.labTechName || batch.labTechId,
      'Date': new Date(batch.timestamp).toLocaleDateString(),
      'Notes': batch.notes || ''
    }));

    this.downloadCsv(data, filename);
  }

  /**
   * Export enzymes to CSV file
   * @param enzymes - Array of enzymes to export
   * @param filename - Output filename (default: 'enzymes.csv')
   */
  exportEnzymes(enzymes: Enzyme[], filename: string = 'enzymes.csv'): void {
    const data = enzymes.map(enzyme => ({
      'Enzyme ID': enzyme.id,
      'Name': enzyme.name,
      'Type': enzyme.type,
      'Specialization': enzyme.specialization,
      'Sequence Length': enzyme.sequenceLength || 'N/A',
      'Reconstruction Method': enzyme.metadata?.reconstructionMethod || 'N/A',
      'Confidence Score': enzyme.metadata?.confidenceScore?.toFixed(3) || 'N/A',
      'Km (μM)': enzyme.metadata?.kineticParameters?.km_uM || 'N/A',
      'kcat (s⁻¹)': enzyme.metadata?.kineticParameters?.kcat_s || 'N/A',
      'Catalytic Efficiency': enzyme.metadata?.kineticParameters?.catalyticEfficiency || 'N/A',
      'Primary Product': enzyme.metadata?.productProfile?.primary || 'N/A',
      'Secondary Products': enzyme.metadata?.productProfile?.secondary?.join(', ') || 'N/A',
      'Catalytic Residues': enzyme.metadata?.catalyticResidues?.join(', ') || 'N/A',
      'Source': enzyme.metadata?.source || 'N/A',
      'Description': enzyme.metadata?.description || ''
    }));

    this.downloadCsv(data, filename);
  }

  /**
   * Export organisms to CSV file
   * @param organisms - Array of organisms to export
   * @param filename - Output filename (default: 'organisms.csv')
   */
  exportOrganisms(organisms: Organism[], filename: string = 'organisms.csv'): void {
    const data = organisms.map(organism => ({
      'Organism ID': organism.id,
      'Name': organism.name,
      'Type': organism.type,
      'Strain': organism.strain,
      'Kingdom': organism.taxonomy?.kingdom || 'N/A',
      'Phylum': organism.taxonomy?.phylum || 'N/A',
      'Class': organism.taxonomy?.class || 'N/A',
      'Order': organism.taxonomy?.order || 'N/A',
      'Family': organism.taxonomy?.family || 'N/A',
      'Genus': organism.taxonomy?.genus || 'N/A',
      'Species': organism.taxonomy?.species || 'N/A',
      'Growth Temperature': organism.metadata?.growthTemp || 'N/A',
      'Optimal pH': organism.metadata?.optimalPh || 'N/A',
      'Doubling Time': organism.metadata?.doublingTime || 'N/A',
      'Applications': organism.metadata?.applications?.join(', ') || 'N/A',
      'Genomic Files': organism.genomicFiles?.length || 0,
      'Culture Images': organism.cultureImages?.length || 0,
      'Expressed Enzymes': organism.expressedEnzymes?.length || 0,
      'Notes': organism.metadata?.notes || ''
    }));

    this.downloadCsv(data, filename);
  }

  /**
   * Convert data to CSV and trigger download
   * @param data - Array of objects to convert to CSV
   * @param filename - Output filename
   */
  private downloadCsv(data: any[], filename: string): void {
    const csv = Papa.unparse(data, {
      quotes: true,
      header: true
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
