# Scientific Data Injection Guide

This guide explains how to populate the AncestryBio Dash production database with verified scientific data from the Wageningen University study (December 2025).

## Data Sources

### Ancestral Enzymes
Three ancestral cannabinoid synthases reconstructed via Maximum Likelihood phylogenetic analysis:

1. **A1A2a Ancestral CBDA Synthase**
   - Primary product: Cannabidiolic acid (CBDA)
   - Confidence score: 0.94
   - Km: 12.3 μM | kcat: 2.1 s⁻¹

2. **Ca Ancestral CBCA Synthase**
   - Primary product: Cannabichromenic acid (CBCA)
   - Confidence score: 0.89
   - Km: 15.7 μM | kcat: 1.8 s⁻¹

3. **HCa Ancestral THCA Synthase**
   - Primary product: Tetrahydrocannabinolic acid (THCA)
   - Confidence score: 0.91
   - Km: 10.2 μM | kcat: 2.4 s⁻¹

### Host Organism
- **Saccharomyces cerevisiae CEN.PK113-7D**
- Industry-standard yeast strain for cannabinoid biosynthesis
- Optimal growth: 30°C, pH 5.5, ~90 min doubling time

### Golden Batches
Five verified production runs demonstrating:
- CBDA production: 145-153 mg/L (A1A2a enzyme)
- CBCA production: 119 mg/L (Ca enzyme)
- THCA production: 167-173 mg/L (HCa enzyme)

## Prerequisites

### 1. Install Firebase Admin SDK
```bash
npm install firebase-admin
```

### 2. Obtain Service Account Key

You need a Firebase Admin SDK service account key to run this script:

1. Go to [Firebase Console](https://console.firebase.google.com/project/ancestrybio/settings/serviceaccounts/adminsdk)
2. Click "Generate new private key"
3. Save the file outside version control (for example: `~/secrets/ancestrybio-adminsdk.json`)
4. Export the path before running the script:
   ```bash
   export FIREBASE_SERVICE_ACCOUNT_PATH=~/secrets/ancestrybio-adminsdk.json
   ```
5. **IMPORTANT**: Never commit the service-account JSON file

### 3. Verify FASTA Files

Ensure the following files exist:
```
data/sequences/A1A2a_ancestral.fasta
data/sequences/Ca_ancestral.fasta
data/sequences/HCa_ancestral.fasta
```

## Running the Script

### Execute Data Injection
```bash
FIREBASE_SERVICE_ACCOUNT_PATH=~/secrets/ancestrybio-adminsdk.json node scientific-data-seed.js
```

### Expected Output
```
AncestryBio Dash - Scientific Data Injection
===========================================

Using service account: /absolute/path/to/service-account.json
Using storage bucket: ancestrybio.firebasestorage.app

Step 1/3: Seeding enzymes...
  Uploaded sequences/A1A2a_ancestral.fasta
  Seeded A1A2a Ancestral CBDA Synthase (XXX aa)
  Uploaded sequences/Ca_ancestral.fasta
  Seeded Ca Ancestral CBCA Synthase (XXX aa)
  Uploaded sequences/HCa_ancestral.fasta
  Seeded HCa Ancestral THCA Synthase (XXX aa)

Step 2/3: Seeding host organism...
  Seeded Saccharomyces cerevisiae CEN.PK113-7D

Step 3/3: Seeding benchmark batches...
  Seeded GB-2025-001
  Seeded GB-2025-002
  Seeded GB-2025-003
  Seeded GB-2025-004
  Seeded GB-2025-005

Data injection complete.
Enzymes: 3
Organisms: 1
Batches: 5
```

## Verification

### 1. Firebase Console
Visit the [Firestore Database](https://console.firebase.google.com/project/ancestrybio/firestore) to verify:
- `enzymes` collection: 3 documents
- `organisms` collection: 1 document
- `batches` collection: 5 documents

### 2. Cloud Storage
Visit [Firebase Storage](https://console.firebase.google.com/project/ancestrybio/storage) to verify:
- `sequences/A1A2a_ancestral.fasta`
- `sequences/Ca_ancestral.fasta`
- `sequences/HCa_ancestral.fasta`

### 3. Production Application
Visit [https://ancestrybio.web.app](https://ancestrybio.web.app) and verify:
- **Enzyme Management**: View 3 ancestral enzymes with full metadata
- **Organism Management**: View S. cerevisiae profile
- **Yield Tracker**: See Chart.js visualization with 5 golden batches

## Data Structure

### Enzyme Document
```javascript
{
  id: 'A1A2a_ancestral',
  name: 'A1A2a Ancestral CBDA Synthase',
  type: 'ancestral',
  specialization: 'cbda',
  sequence: '...',
  sequenceLength: 660,
  metadata: {
    source: 'Wageningen University Study (Dec 2025)',
    reconstructionMethod: 'Maximum Likelihood Phylogenetic Analysis',
    confidenceScore: 0.94,
    kineticParameters: { km_uM: 12.3, kcat_s: 2.1, ... },
    fastaStorageUrl: 'gs://ancestrybio.firebasestorage.app/sequences/...'
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Batch Document
```javascript
{
  sourceBatchId: 'GB-2025-001',
  enzymeId: 'A1A2a_ancestral',
  enzymeName: 'A1A2a Ancestral CBDA Synthase',
  organismId: 'scerevisiae_CEN_PK113',
  organismName: 'Saccharomyces cerevisiae CEN.PK113-7D',
  cbgaInput: 500,
  outputs: { thca: 1.29, cbda: 89.35, cbca: 2.09, cbg: 7.27 },
  conditions: { temperature: 30, ph: 5.5, duration: 72, ... },
  timestamp: Timestamp,
  labTechId: 'wageningen_study',
  labTechName: 'Wageningen Study Team',
  status: 'completed',
  notes: 'Optimal CBDA production with A1A2a ancestral enzyme'
}
```

## Troubleshooting

### Error: "Service account key not found"
- Ensure `FIREBASE_SERVICE_ACCOUNT_PATH` (or `GOOGLE_APPLICATION_CREDENTIALS`) is set
- Ensure the JSON file exists at that path

### Error: "FASTA file not found"
- Verify `data/sequences/` directory exists
- Check that all 3 FASTA files are present

### Error: "Permission denied"
- Ensure your service account has Firestore and Storage permissions
- Check Firebase IAM settings

### Error: "Storage bucket not found"
- Verify the storage bucket name in the script matches your Firebase project
- Check that Firebase Storage is enabled

## Security Notes

- **Never commit** service-account JSON files to version control
- The service account key grants full admin access to your Firebase project
- Store it securely and rotate keys periodically
- For production deployments, use environment variables or secret management

## References

- **Study**: Wageningen University, December 2025 - Ancestral Cannabinoid Biosynthesis
- **Method**: Maximum Likelihood Phylogenetic Reconstruction
- **Host**: S. cerevisiae CEN.PK113-7D
- **Substrate**: Cannabigerolic acid (CBGA) at 500 μM
- **Conditions**: 30°C, pH 5.5, 72h fermentation
