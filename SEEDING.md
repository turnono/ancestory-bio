# Data Seeding Guide

This guide explains how to populate the AncestryBio Dash database with sample data for testing.

## Prerequisites

- You must be logged into the application
- Firebase must be properly configured
- You must have an active internet connection

## Method 1: Browser Console (Recommended)

1. **Log in to the application** at http://localhost:4200
2. **Open the browser console** (F12 or Cmd+Option+I on Mac)
3. **Copy the entire contents** of `seed-data.js`
4. **Paste into the console** and press Enter
5. **Run the seeding function**:
   ```javascript
   seedData()
   ```
6. **Wait for completion** - you'll see progress messages
7. **Refresh the page** to see the new data

## What Gets Created

### Enzymes (4 total)
- **CBGA Synthase Alpha** (Ancestral, Promiscuous)
- **THCA Synthase Modern** (Modern, THCA-specific)
- **CBDA Synthase Beta** (Modern, CBDA-specific)
- **Intermediate Synthase Gamma** (Intermediate, Promiscuous)

### Batches (8 total)
- 2 batches for CBGA Synthase Alpha (balanced outputs)
- 2 batches for THCA Synthase Modern (high THCA)
- 2 batches for CBDA Synthase Beta (high CBDA)
- 2 batches for Intermediate Synthase Gamma (mixed outputs)

## Expected Results

After seeding, you should see:
- **Yield Tracker**: Chart visualization with 8 data points
- **Stats Dashboard**: Updated counts (8 batches, 4 enzymes)
- **Batch Table**: 8 recent batches with cannabinoid percentages
- **Enzyme Catalog**: 4 enzymes available for selection

## Troubleshooting

### "No user logged in" error
- Make sure you're logged in before running the script
- Check that you see your name in the navigation header

### "Permission denied" error
- Verify Firestore security rules allow writes
- Check that your user has the correct role

### Data not appearing
- Refresh the page after seeding completes
- Check the browser console for errors
- Verify Firebase connection in Network tab

## Clearing Data

To remove seeded data, use the Firebase Console:
1. Go to Firebase Console → Firestore Database
2. Delete the `enzymes` and `batches` collections
3. Or delete individual documents

## Next Steps

After seeding data:
1. Navigate to **Yield Tracker** to see the chart visualization
2. Click on individual batches to view details
3. Try creating new batches using the "New Batch" button
4. Explore the enzyme catalog

---

**Note**: This is sample data for development/testing only. In production, data should be entered through the application forms.
