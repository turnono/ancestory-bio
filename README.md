# AncestryBio Dash - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Firebase account
- Git (optional)

## Installation

1. **Install Dependencies**
   ```bash
   cd /Users/abdullah/Documents/Manual_Library/Github/ancestory-bio
   npm install --legacy-peer-deps
   ```

2. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database (test mode)
   - Enable Cloud Storage (test mode)
   - Copy your Firebase config

3. **Update Environment Files**
   
   Edit `src/environments/environment.ts` and `src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: false, // true for prod
     firebase: {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID",
       measurementId: "YOUR_MEASUREMENT_ID"
     },
     features: {
       enableOfflineMode: true,
       enablePushNotifications: true,
       enableAnalytics: false // true for prod
     }
   };
   ```

4. **Run Development Server**
   ```bash
   npm start
   ```
   
   Open [http://localhost:4200](http://localhost:4200)

5. **Create First User**
   - Navigate to `/auth/register`
   - Create an admin account
   - Start using the dashboard!

## Build for Production

```bash
npm run build
```

Output will be in `dist/ancestory-bio/`

## Firestore Security Rules

Copy this to Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /batches/{batchId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'researcher'];
    }
    
    match /enzymes/{enzymeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'researcher'];
    }
    
    match /organisms/{organismId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'researcher'];
    }
  }
}
```

## Troubleshooting

### Build Errors
- Clear npm cache: `npm cache clean --force`
- Reinstall: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`

### Firebase Connection Issues
- Verify environment.ts has correct Firebase config
- Check Firebase project is active
- Ensure Authentication is enabled

### CSS Warnings
- Tailwind `@apply` warnings are expected and don't affect functionality

## Next Features to Implement

1. **Yield Tracker** - Batch input forms and real-time dashboard
2. **Phylogenetic Tree** - D3.js visualization with NEWICK support
3. **Organism Management** - FASTA file uploads and image galleries
4. **PWA Features** - Offline mode and push notifications

For detailed implementation plan, see `implementation_plan.md`
