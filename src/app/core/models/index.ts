/**
 * User model with role-based access control
 */
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  RESEARCHER = 'researcher',
  LAB_TECH = 'lab_tech'
}

/**
 * Batch model for tracking promiscuous enzyme outputs
 * Key feature: 1-to-many relationship (CBGA → THCA/CBDA/CBCA)
 */
export interface Batch {
  id: string;
  enzymeId: string;
  enzymeName?: string; // Denormalized for display
  organismId?: string;
  organismName?: string; // Denormalized for display
  cbgaInput: number; // Input in milligrams
  outputs: CannabinoidOutputs;
  conditions?: ProductionConditions; // Batch production parameters
  timestamp: Date;
  labTechId: string;
  labTechName?: string; // Denormalized for display
  status: BatchStatus;
  notes?: string;
}

export interface CannabinoidOutputs {
  thca: number; // Percentage (0-100)
  cbda: number; // Percentage (0-100)
  cbca: number; // Percentage (0-100)
  cbg?: number; // Remaining CBG percentage (optional)
}

/**
 * Production conditions for batch tracking
 */
export interface ProductionConditions {
  temperature?: number; // Temperature in °C
  ph?: number; // pH value
  duration?: number; // Duration in hours
  inductionOD?: number; // Optical density at induction
  substrateConcentration?: number; // Substrate concentration in μM
}

export enum BatchStatus {
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  PEAK_YIELD = 'peak-yield'
}

/**
 * Enzyme model for phylogenetic tracking
 */
export interface Enzyme {
  id: string;
  name: string;
  type: EnzymeType;
  specialization: EnzymeSpecialization;
  sequence?: string; // Amino acid sequence
  sequenceLength?: number; // Number of amino acids
  newickData?: string; // Phylogenetic tree in NEWICK format
  metadata: EnzymeMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export enum EnzymeType {
  ANCESTRAL = 'ancestral',
  MODERN = 'modern',
  INTERMEDIATE = 'intermediate'
}

export enum EnzymeSpecialization {
  PROMISCUOUS = 'promiscuous', // Produces all three outputs
  THCA_SPECIFIC = 'thca',
  CBDA_SPECIFIC = 'cbda',
  CBCA_SPECIFIC = 'cbca'
}

/**
 * Kinetic parameters for enzyme catalysis
 */
export interface KineticParameters {
  km_uM?: number; // Michaelis constant in micromolar
  kcat_s?: number; // Turnover number in per second
  catalyticEfficiency?: number; // kcat/Km
}

/**
 * Product profile for enzyme outputs
 */
export interface ProductProfile {
  primary?: string; // Primary product (e.g., 'CBDA', 'THCA', 'CBCA')
  secondary?: string[]; // Secondary products with trace amounts
}

export interface EnzymeMetadata {
  sequence?: string; // Amino acid sequence (deprecated, use Enzyme.sequence)
  reconstructionMethod?: string;
  confidenceScore?: number; // 0-1
  description?: string;
  source?: string; // Data source (e.g., 'Wageningen University Study')
  ancestralNode?: string; // Phylogenetic node identifier
  modernHomologs?: string[]; // Related modern enzymes
  catalyticResidues?: string[]; // Active site residues (e.g., ['H292', 'D294', 'H338'])
  substrateSpecificity?: string; // Primary substrate
  productProfile?: ProductProfile; // Expected product distribution
  kineticParameters?: KineticParameters; // Enzyme kinetics
  studyReference?: string; // Scientific reference
  fastaStorageUrl?: string; // Cloud Storage URL for FASTA file
}

/**
 * Full Linnaean taxonomy classification
 */
export interface Taxonomy {
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
}

/**
 * Organism metadata including growth parameters
 */
export interface OrganismMetadata {
  growthCharacteristics?: string;
  notes?: string;
  growthTemp?: string; // Optimal temperature (e.g., '30°C')
  optimalPh?: number; // Optimal pH
  doublingTime?: string; // Doubling time (e.g., '90 min')
  applications?: string[]; // Common applications
}

/**
 * Organism model for microbial host management
 */
export interface Organism {
  id: string;
  name: string;
  type: OrganismType;
  strain: string;
  taxonomy?: Taxonomy;
  metadata?: OrganismMetadata;
  genomicFiles: GenomicFile[];
  cultureImages: CultureImage[];
  expressedEnzymes: string[]; // Array of enzyme IDs
  createdAt: Date;
  updatedAt: Date;
}

export enum OrganismType {
  YEAST = 'yeast',
  BACTERIA = 'bacteria',
  FUNGI = 'fungi'
}

export interface GenomicFile {
  id: string;
  name: string;
  fastaUrl: string;
  uploadDate: Date;
  size: number; // Bytes
}

export interface CultureImage {
  id: string;
  url: string;
  uploadDate: Date;
  description: string;
  thumbnailUrl?: string;
}
