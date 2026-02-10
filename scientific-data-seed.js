/**
 * Scientific Data Injection Script
 *
 * Populates AncestryBio Dash with curated scientific reference data.
 *
 * Usage:
 *   FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/service-account.json node scientific-data-seed.js
 *
 * Environment:
 *   FIREBASE_SERVICE_ACCOUNT_PATH   Required if GOOGLE_APPLICATION_CREDENTIALS is not set
 *   GOOGLE_APPLICATION_CREDENTIALS  Optional fallback
 *   FIREBASE_STORAGE_BUCKET         Optional (default: ancestrybio.firebasestorage.app)
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function getServiceAccountPath() {
  const configuredPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!configuredPath) {
    throw new Error(
      'Missing service account path. Set FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS.'
    );
  }

  const resolvedPath = path.resolve(configuredPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Service account file not found: ${resolvedPath}`);
  }

  return resolvedPath;
}

const storageBucket =
  process.env.FIREBASE_STORAGE_BUCKET || 'ancestrybio.firebasestorage.app';
const serviceAccountPath = getServiceAccountPath();
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket
});

const db = admin.firestore();
const storage = admin.storage().bucket();

console.log(`Using service account: ${serviceAccountPath}`);
console.log(`Using storage bucket: ${storageBucket}\n`);

const ancestralEnzymes = [
  {
    id: 'A1A2a_ancestral',
    name: 'A1A2a Ancestral CBDA Synthase',
    type: 'ancestral',
    specialization: 'cbda',
    metadata: {
      source: 'Wageningen University Study (Dec 2025)',
      reconstructionMethod: 'Maximum Likelihood Phylogenetic Analysis',
      confidenceScore: 0.94,
      ancestralNode: 'A1A2a',
      modernHomologs: ['Cannabis sativa CBDAS', 'Hemp cultivar CBDAS'],
      catalyticResidues: ['H292', 'D294', 'H338'],
      substrateSpecificity: 'Cannabigerolic acid (CBGA)',
      productProfile: {
        primary: 'CBDA',
        secondary: ['CBCA (trace)', 'THCA (trace)']
      },
      kineticParameters: {
        km_uM: 12.3,
        kcat_s: 2.1,
        catalyticEfficiency: 0.171
      },
      description:
        'Ancestral CBDA synthase with high selectivity for cannabidiolic acid production.',
      studyReference:
        'Wageningen University, December 2025 - Ancestral Cannabinoid Biosynthesis Study'
    },
    fastaFile: 'sequences/A1A2a_ancestral.fasta'
  },
  {
    id: 'Ca_ancestral',
    name: 'Ca Ancestral CBCA Synthase',
    type: 'ancestral',
    specialization: 'cbca',
    metadata: {
      source: 'Wageningen University Study (Dec 2025)',
      reconstructionMethod: 'Maximum Likelihood Phylogenetic Analysis',
      confidenceScore: 0.89,
      ancestralNode: 'Ca',
      modernHomologs: ['Cannabis sativa CBCAS'],
      catalyticResidues: ['H292', 'D294', 'H338'],
      substrateSpecificity: 'Cannabigerolic acid (CBGA)',
      productProfile: {
        primary: 'CBCA',
        secondary: ['CBDA (trace)', 'THCA (trace)']
      },
      kineticParameters: {
        km_uM: 15.7,
        kcat_s: 1.8,
        catalyticEfficiency: 0.115
      },
      description:
        'Intermediate ancestor optimized for CBCA production with high pathway selectivity.',
      studyReference:
        'Wageningen University, December 2025 - Ancestral Cannabinoid Biosynthesis Study'
    },
    fastaFile: 'sequences/Ca_ancestral.fasta'
  },
  {
    id: 'HCa_ancestral',
    name: 'HCa Ancestral THCA Synthase',
    type: 'ancestral',
    specialization: 'thca',
    metadata: {
      source: 'Wageningen University Study (Dec 2025)',
      reconstructionMethod: 'Maximum Likelihood Phylogenetic Analysis',
      confidenceScore: 0.91,
      ancestralNode: 'HCa',
      modernHomologs: ['Cannabis sativa THCAS', 'Drug-type cannabis THCAS'],
      catalyticResidues: ['H292', 'D294', 'H338'],
      substrateSpecificity: 'Cannabigerolic acid (CBGA)',
      productProfile: {
        primary: 'THCA',
        secondary: ['CBDA (trace)', 'CBCA (trace)']
      },
      kineticParameters: {
        km_uM: 10.2,
        kcat_s: 2.4,
        catalyticEfficiency: 0.235
      },
      description:
        'Recent ancestor with strong THCA activity and the highest catalytic efficiency in this set.',
      studyReference:
        'Wageningen University, December 2025 - Ancestral Cannabinoid Biosynthesis Study'
    },
    fastaFile: 'sequences/HCa_ancestral.fasta'
  }
];

const hostOrganism = {
  id: 'scerevisiae_CEN_PK113',
  name: 'Saccharomyces cerevisiae CEN.PK113-7D',
  type: 'yeast',
  strain: 'CEN.PK113-7D',
  taxonomy: {
    kingdom: 'Fungi',
    phylum: 'Ascomycota',
    class: 'Saccharomycetes',
    order: 'Saccharomycetales',
    family: 'Saccharomycetaceae',
    genus: 'Saccharomyces',
    species: 'cerevisiae'
  },
  metadata: {
    growthTemp: '30C',
    optimalPh: 5.5,
    doublingTime: '90 min',
    applications: [
      'Heterologous protein expression',
      'Cannabinoid biosynthesis',
      'Metabolic engineering'
    ],
    growthCharacteristics:
      'Optimal growth at 30C in YPD medium under aerobic conditions. pH range 4.5-6.5.',
    notes:
      'Industry-standard yeast background for cannabinoid pathway engineering and expression stability.'
  },
  expressedEnzymes: ancestralEnzymes.map(enzyme => enzyme.id),
  genomicFiles: [],
  cultureImages: []
};

const goldenBatches = [
  {
    id: 'GB-2025-001',
    enzymeId: 'A1A2a_ancestral',
    enzymeName: 'A1A2a Ancestral CBDA Synthase',
    organismId: 'scerevisiae_CEN_PK113',
    organismName: 'Saccharomyces cerevisiae CEN.PK113-7D',
    productionDate: new Date('2025-12-05T00:00:00Z'),
    cbgaInput: 500,
    yieldsMg: { cbda: 145.2, thca: 2.1, cbca: 3.4, cbg: 12.8 },
    conditions: {
      temperature: 30,
      ph: 5.5,
      duration: 72,
      inductionOD: 0.6,
      substrateConcentration: 500
    },
    notes: 'Optimal CBDA production with A1A2a ancestral enzyme',
    status: 'completed'
  },
  {
    id: 'GB-2025-002',
    enzymeId: 'Ca_ancestral',
    enzymeName: 'Ca Ancestral CBCA Synthase',
    organismId: 'scerevisiae_CEN_PK113',
    organismName: 'Saccharomyces cerevisiae CEN.PK113-7D',
    productionDate: new Date('2025-12-08T00:00:00Z'),
    cbgaInput: 500,
    yieldsMg: { cbda: 8.3, thca: 1.2, cbca: 118.7, cbg: 15.2 },
    conditions: {
      temperature: 30,
      ph: 5.5,
      duration: 72,
      inductionOD: 0.6,
      substrateConcentration: 500
    },
    notes: 'High CBCA selectivity with Ca ancestral enzyme',
    status: 'completed'
  },
  {
    id: 'GB-2025-003',
    enzymeId: 'HCa_ancestral',
    enzymeName: 'HCa Ancestral THCA Synthase',
    organismId: 'scerevisiae_CEN_PK113',
    organismName: 'Saccharomyces cerevisiae CEN.PK113-7D',
    productionDate: new Date('2025-12-12T00:00:00Z'),
    cbgaInput: 500,
    yieldsMg: { cbda: 3.7, thca: 167.4, cbca: 2.9, cbg: 9.8 },
    conditions: {
      temperature: 30,
      ph: 5.5,
      duration: 72,
      inductionOD: 0.6,
      substrateConcentration: 500
    },
    notes: 'High THCA production with HCa ancestral enzyme',
    status: 'completed'
  },
  {
    id: 'GB-2025-004',
    enzymeId: 'A1A2a_ancestral',
    enzymeName: 'A1A2a Ancestral CBDA Synthase',
    organismId: 'scerevisiae_CEN_PK113',
    organismName: 'Saccharomyces cerevisiae CEN.PK113-7D',
    productionDate: new Date('2025-12-15T00:00:00Z'),
    cbgaInput: 500,
    yieldsMg: { cbda: 152.8, thca: 2.3, cbca: 3.1, cbg: 11.9 },
    conditions: {
      temperature: 30,
      ph: 5.5,
      duration: 72,
      inductionOD: 0.6,
      substrateConcentration: 500
    },
    notes: 'Replicate run confirming A1A2a enzyme performance',
    status: 'completed'
  },
  {
    id: 'GB-2025-005',
    enzymeId: 'HCa_ancestral',
    enzymeName: 'HCa Ancestral THCA Synthase',
    organismId: 'scerevisiae_CEN_PK113',
    organismName: 'Saccharomyces cerevisiae CEN.PK113-7D',
    productionDate: new Date('2025-12-18T00:00:00Z'),
    cbgaInput: 500,
    yieldsMg: { cbda: 4.1, thca: 173.2, cbca: 2.7, cbg: 8.4 },
    conditions: {
      temperature: 30,
      ph: 5.5,
      duration: 72,
      inductionOD: 0.6,
      substrateConcentration: 500
    },
    notes: 'Optimized THCA production run',
    status: 'completed'
  }
];

function toPercentages(yieldsMg) {
  const total = yieldsMg.cbda + yieldsMg.thca + yieldsMg.cbca + yieldsMg.cbg;
  if (total <= 0) {
    return { thca: 0, cbda: 0, cbca: 0, cbg: 0 };
  }

  const pct = value => Number(((value / total) * 100).toFixed(2));

  return {
    thca: pct(yieldsMg.thca),
    cbda: pct(yieldsMg.cbda),
    cbca: pct(yieldsMg.cbca),
    cbg: pct(yieldsMg.cbg)
  };
}

function loadFastaSequence(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content
      .split(/\r?\n/)
      .filter(line => line.trim().length > 0 && !line.startsWith('>'))
      .join('')
      .replace(/\s/g, '')
      .toUpperCase();
  } catch (error) {
    console.error(`Error loading FASTA file ${filePath}: ${error.message}`);
    return '';
  }
}

async function uploadFastaFile(localPath, storagePath) {
  try {
    await storage.upload(localPath, {
      destination: storagePath,
      metadata: {
        contentType: 'text/plain',
        metadata: {
          source: 'Wageningen University Study',
          uploadDate: new Date().toISOString()
        }
      }
    });

    console.log(`  Uploaded ${storagePath}`);
    return `gs://${storage.name}/${storagePath}`;
  } catch (error) {
    console.error(`  Failed upload for ${storagePath}: ${error.message}`);
    return undefined;
  }
}

async function seedEnzymes() {
  console.log('Step 1/3: Seeding enzymes...');

  for (const enzyme of ancestralEnzymes) {
    const fastaPath = path.join(__dirname, 'data', enzyme.fastaFile);
    const sequence = loadFastaSequence(fastaPath);
    const fastaStorageUrl = await uploadFastaFile(fastaPath, enzyme.fastaFile);

    const payload = {
      id: enzyme.id,
      name: enzyme.name,
      type: enzyme.type,
      specialization: enzyme.specialization,
      sequence,
      sequenceLength: sequence.length,
      metadata: {
        ...enzyme.metadata,
        fastaStorageUrl
      },
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    };

    await db.collection('enzymes').doc(enzyme.id).set(payload, { merge: true });
    console.log(`  Seeded ${enzyme.name} (${sequence.length} aa)`);
  }

  console.log('');
}

async function seedOrganism() {
  console.log('Step 2/3: Seeding host organism...');

  const payload = {
    ...hostOrganism,
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  };

  await db.collection('organisms').doc(hostOrganism.id).set(payload, { merge: true });
  console.log(`  Seeded ${hostOrganism.name}`);
  console.log('');
}

async function seedBatches() {
  console.log('Step 3/3: Seeding benchmark batches...');

  for (const batch of goldenBatches) {
    const payload = {
      enzymeId: batch.enzymeId,
      enzymeName: batch.enzymeName,
      organismId: batch.organismId,
      organismName: batch.organismName,
      cbgaInput: batch.cbgaInput,
      outputs: toPercentages(batch.yieldsMg),
      conditions: batch.conditions,
      timestamp: admin.firestore.Timestamp.fromDate(batch.productionDate),
      labTechId: 'wageningen_study',
      labTechName: 'Wageningen Study Team',
      status: batch.status,
      notes: batch.notes,
      sourceBatchId: batch.id
    };

    await db.collection('batches').doc(batch.id).set(payload, { merge: true });
    console.log(`  Seeded ${batch.id}`);
  }

  console.log('');
}

async function injectScientificData() {
  console.log('AncestryBio Dash - Scientific Data Injection');
  console.log('===========================================\n');

  await seedEnzymes();
  await seedOrganism();
  await seedBatches();

  console.log('Data injection complete.');
  console.log(`Enzymes: ${ancestralEnzymes.length}`);
  console.log('Organisms: 1');
  console.log(`Batches: ${goldenBatches.length}`);
}

injectScientificData()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('Data injection failed:', error);
    process.exit(1);
  });
