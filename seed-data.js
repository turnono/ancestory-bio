/**
 * Data seeding script for AncestryBio Dash
 * Run this to populate the database with sample data for testing
 * 
 * Usage: Copy this code and run it in the browser console while logged in
 */

// Sample Enzymes
const sampleEnzymes = [
  {
    name: 'CBGA Synthase Alpha',
    type: 'ancestral',
    specialization: 'promiscuous',
    metadata: {
      sequence: 'MKVLWAALLVTFLAGCQAKVEQAVETEPEPELRQQTEWQSGQRWELALGRFWDYLRWVQTLSEQVQEELLSSQVTQELRALMDETMKELKAYKSELEEQIQLRLKKLLLGER',
      reconstructionMethod: 'Maximum Likelihood',
      confidenceScore: 0.92,
      description: 'Ancestral enzyme showing broad substrate specificity for cannabinoid synthesis'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'THCA Synthase Modern',
    type: 'modern',
    specialization: 'thca',
    metadata: {
      sequence: 'MKVLWAALLVTFLAGCQAKVEQAVETEPEPELRQQTEWQSGQRWELALGRFWDYLRWVQTLSEQVQEELLSSQVTQELRALMDETMKELKAYKSELEEQIQLRLKKLLLGER',
      reconstructionMethod: 'Direct Sequencing',
      confidenceScore: 0.98,
      description: 'Highly specific THCA synthase from Cannabis sativa'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'CBDA Synthase Beta',
    type: 'modern',
    specialization: 'cbda',
    metadata: {
      sequence: 'MKVLWAALLVTFLAGCQAKVEQAVETEPEPELRQQTEWQSGQRWELALGRFWDYLRWVQTLSEQVQEELLSSQVTQELRALMDETMKELKAYKSELEEQIQLRLKKLLLGER',
      reconstructionMethod: 'Direct Sequencing',
      confidenceScore: 0.96,
      description: 'CBDA-specific synthase with high catalytic efficiency'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Intermediate Synthase Gamma',
    type: 'intermediate',
    specialization: 'promiscuous',
    metadata: {
      sequence: 'MKVLWAALLVTFLAGCQAKVEQAVETEPEPELRQQTEWQSGQRWELALGRFWDYLRWVQTLSEQVQEELLSSQVTQELRALMDETMKELKAYKSELEEQIQLRLKKLLLGER',
      reconstructionMethod: 'Ancestral Sequence Reconstruction',
      confidenceScore: 0.85,
      description: 'Intermediate evolutionary form showing partial specialization'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample Batches (will be created after enzymes)
const sampleBatches = [
  { enzymeIndex: 0, cbgaInput: 100, outputs: { thca: 35, cbda: 32, cbca: 33 }, notes: 'Balanced promiscuous output' },
  { enzymeIndex: 0, cbgaInput: 150, outputs: { thca: 38, cbda: 30, cbca: 32 }, notes: 'Slightly THCA-favored' },
  { enzymeIndex: 1, cbgaInput: 120, outputs: { thca: 85, cbda: 10, cbca: 5 }, notes: 'High THCA specificity' },
  { enzymeIndex: 1, cbgaInput: 130, outputs: { thca: 88, cbda: 8, cbca: 4 }, notes: 'Peak THCA yield' },
  { enzymeIndex: 2, cbgaInput: 110, outputs: { thca: 8, cbda: 87, cbca: 5 }, notes: 'High CBDA specificity' },
  { enzymeIndex: 2, cbgaInput: 125, outputs: { thca: 6, cbda: 90, cbca: 4 }, notes: 'Excellent CBDA production' },
  { enzymeIndex: 3, cbgaInput: 140, outputs: { thca: 45, cbda: 35, cbca: 20 }, notes: 'Intermediate specialization pattern' },
  { enzymeIndex: 3, cbgaInput: 135, outputs: { thca: 42, cbda: 38, cbca: 20 }, notes: 'Consistent intermediate behavior' }
];

// Function to seed data
async function seedData() {
  console.log('🌱 Starting data seeding...');
  
  // Get Firestore instance
  const { getFirestore, collection, addDoc, Timestamp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
  const db = getFirestore();
  
  // Get current user
  const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    console.error('❌ No user logged in. Please log in first.');
    return;
  }
  
  console.log(`👤 Seeding data for user: ${user.displayName || user.email}`);
  
  try {
    // Seed Enzymes
    console.log('🧬 Creating enzymes...');
    const enzymeIds = [];
    
    for (const enzyme of sampleEnzymes) {
      const docRef = await addDoc(collection(db, 'enzymes'), {
        ...enzyme,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      enzymeIds.push({ id: docRef.id, name: enzyme.name });
      console.log(`✅ Created enzyme: ${enzyme.name}`);
    }
    
    // Seed Batches
    console.log('📊 Creating batches...');
    
    for (const batchData of sampleBatches) {
      const enzyme = enzymeIds[batchData.enzymeIndex];
      
      await addDoc(collection(db, 'batches'), {
        enzymeId: enzyme.id,
        enzymeName: enzyme.name,
        cbgaInput: batchData.cbgaInput,
        outputs: batchData.outputs,
        timestamp: Timestamp.now(),
        labTechId: user.uid,
        labTechName: user.displayName || user.email,
        status: 'completed',
        notes: batchData.notes
      });
      
      console.log(`✅ Created batch for ${enzyme.name}: THCA ${batchData.outputs.thca}%, CBDA ${batchData.outputs.cbda}%, CBCA ${batchData.outputs.cbca}%`);
    }
    
    console.log('🎉 Data seeding completed successfully!');
    console.log(`Created ${enzymeIds.length} enzymes and ${sampleBatches.length} batches`);
    console.log('🔄 Refresh the page to see the data');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Run the seeding function
console.log('📝 Data seeding script loaded. Run seedData() to populate the database.');
console.log('⚠️  Make sure you are logged in before running this script.');

// Auto-run if you want
// seedData();
