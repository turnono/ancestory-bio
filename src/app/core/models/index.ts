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
  cbgaInput: number; // Input in milligrams
  outputs: CannabinoidOutputs;
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

export interface EnzymeMetadata {
  sequence: string;
  reconstructionMethod?: string;
  confidenceScore?: number; // 0-1
  description?: string;
}

/**
 * Organism model for microbial host management
 */
export interface Organism {
  id: string;
  name: string;
  type: OrganismType;
  strain: string;
  taxonomy?: {
    genus?: string;
    species?: string;
  };
  metadata?: {
    growthCharacteristics?: string;
    notes?: string;
  };
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
