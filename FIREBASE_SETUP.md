# Firebase Configuration Guide

## ✅ Current Configuration Status

Your AncestryBio Dash application is configured to use **production Firebase services** (not emulators).

### Services Configured

1. **Firebase Authentication** ✅
   - Production service: `ancestrybio.firebaseapp.com`
   - No emulator configured
   - Email/Password provider enabled

2. **Cloud Firestore** ✅
   - Production database
   - No emulator configured
   - Collections: `users`, `batches`, `enzymes`, `organisms`

3. **Cloud Storage** ✅
   - Production storage: `ancestrybio.firebasestorage.app`
   - No emulator configured
   - Ready for file uploads

4. **Firebase Hosting** (Ready to configure)
   - Production hosting
   - No emulator configured

---

## Firebase Project Details

**Project ID**: `ancestrybio`
**Auth Domain**: `ancestrybio.firebaseapp.com`
**Storage Bucket**: `ancestrybio.firebasestorage.app`

---

## Required Firebase Console Setup

### 1. Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/project/ancestrybio)
2. Navigate to **Authentication** → **Sign-in method**
3. Enable the following providers:
   - ✅ **Email/Password** (Required)
   - ⚪ **Google** (Optional)
   - ⚪ **Anonymous** (Optional for testing)

### 2. Create Firestore Database

1. Navigate to **Firestore Database**
2. Click **Create database**
3. Choose **Production mode** (not test mode)
4. Select your preferred region (e.g., `us-central1`)
5. Click **Enable**

### 3. Set Up Firestore Security Rules

Navigate to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function hasRole(role) {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && isOwner(userId);
      allow update: if isOwner(userId) || hasRole('admin');
      allow delete: if hasRole('admin');
    }
    
    // Batches collection
    match /batches/{batchId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn() && 
                      (isOwner(resource.data.labTechId) || hasRole('admin'));
      allow delete: if hasRole('admin');
    }
    
    // Enzymes collection
    match /enzymes/{enzymeId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && (hasRole('admin') || hasRole('researcher'));
      allow update: if isSignedIn() && (hasRole('admin') || hasRole('researcher'));
      allow delete: if hasRole('admin');
    }
    
    // Organisms collection
    match /organisms/{organismId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && (hasRole('admin') || hasRole('researcher'));
      allow update: if isSignedIn() && (hasRole('admin') || hasRole('researcher'));
      allow delete: if hasRole('admin');
    }
  }
}
```

### 4. Create Storage Bucket

1. Navigate to **Storage**
2. Click **Get started**
3. Choose **Production mode**
4. Select your preferred region
5. Click **Done**

### 5. Set Up Storage Security Rules

Navigate to **Storage** → **Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function hasRole(role) {
      return isSignedIn() && 
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // Genomic files (FASTA, etc.)
    match /genomic-files/{allPaths=**} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && (hasRole('admin') || hasRole('researcher'));
      allow delete: if hasRole('admin');
    }
    
    // Culture images
    match /culture-images/{allPaths=**} {
      allow read: if isSignedIn();
      allow write: if isSignedIn();
      allow delete: if isSignedIn() && (hasRole('admin') || hasRole('researcher'));
    }
    
    // Batch images
    match /batch-images/{allPaths=**} {
      allow read: if isSignedIn();
      allow write: if isSignedIn();
      allow delete: if isSignedIn();
    }
  }
}
```

### 6. Enable Firebase Hosting

1. Navigate to **Hosting**
2. Click **Get started**
3. Follow the setup wizard
4. Your site will be available at: `https://ancestrybio.web.app`

---

## Deployment to Firebase Hosting

### Initial Setup

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init
```

When prompted, select:
- ✅ **Hosting**: Configure files for Firebase Hosting
- ✅ **Firestore**: Deploy Firestore security rules
- ✅ **Storage**: Deploy Storage security rules

Configuration answers:
- **What do you want to use as your public directory?** `dist/ancestory-bio`
- **Configure as a single-page app?** `Yes`
- **Set up automatic builds with GitHub?** `No` (or `Yes` if you want)
- **File dist/ancestory-bio/index.html already exists. Overwrite?** `No`

### Build and Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

Your app will be live at: `https://ancestrybio.web.app`

---

## Environment Variables

### Development (`environment.ts`)
Already configured with your Firebase project credentials.

### Production (`environment.prod.ts`)
Update with the same credentials:

```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyAEYHSLMQpcSnIJr2CdE9fsqcMGGk3SHJ4',
    authDomain: 'ancestrybio.firebaseapp.com',
    projectId: 'ancestrybio',
    storageBucket: 'ancestrybio.firebasestorage.app',
    messagingSenderId: '665392032395',
    appId: '1:665392032395:web:483debb6c3b8879226028e',
    measurementId: 'G-R5YLQJFS2M'
  },
  features: {
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableAnalytics: true  // Enable for production
  }
};
```

---

## Verification Checklist

### ✅ No Emulators Configured
- ✅ No `connectFirestoreEmulator` calls
- ✅ No `connectAuthEmulator` calls
- ✅ No `connectStorageEmulator` calls
- ✅ No emulator configuration in `app.config.ts`

### ✅ Production Services
- ✅ Using `getAuth()` (production)
- ✅ Using `getFirestore()` (production)
- ✅ Using `getStorage()` (production)
- ✅ Firebase config points to production project

### ✅ Security
- ⚠️ **Action Required**: Set up Firestore security rules
- ⚠️ **Action Required**: Set up Storage security rules
- ✅ Authentication enabled
- ✅ RBAC implemented in application

---

## Testing Production Services

### 1. Test Authentication
```bash
# Start the app
npm start

# Navigate to http://localhost:4200
# Register a new user
# Verify user appears in Firebase Console → Authentication
```

### 2. Test Firestore
```bash
# After logging in, run the seeding script
# Check Firebase Console → Firestore Database
# Verify collections: enzymes, batches
```

### 3. Test Storage (when file upload is implemented)
```bash
# Upload a file through the app
# Check Firebase Console → Storage
# Verify file appears in the bucket
```

---

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules are deployed
- Verify user is authenticated
- Check user has correct role

### "Firebase not initialized" errors
- Verify `environment.ts` has correct credentials
- Check `app.config.ts` providers are correct
- Restart development server

### "Storage bucket not found" errors
- Verify Storage is enabled in Firebase Console
- Check `storageBucket` in environment config
- Ensure Storage security rules are deployed

---

## Next Steps

1. ✅ **Verify** all services are enabled in Firebase Console
2. ✅ **Deploy** security rules for Firestore and Storage
3. ✅ **Test** authentication, database, and storage
4. ✅ **Deploy** to Firebase Hosting when ready

---

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Angular Fire Documentation](https://github.com/angular/angularfire)
- [Firebase Console](https://console.firebase.google.com/project/ancestrybio)
