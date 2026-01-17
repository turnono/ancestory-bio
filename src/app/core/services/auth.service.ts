import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  user,
  User as FirebaseUser,
  updateProfile
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc,
  docData
} from '@angular/fire/firestore';
import { Observable, from, of, switchMap } from 'rxjs';
import { User, UserRole } from '../models';

/**
 * Authentication service with role-based access control
 * Manages Firebase Auth and user profile data in Firestore
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Observable of current user
  user$ = user(this.auth);

  // Observable of current user with profile data
  userProfile$: Observable<User | null> = this.user$.pipe(
    switchMap(firebaseUser => {
      if (!firebaseUser) return of(null);
      const userDoc = doc(this.firestore, `users/${firebaseUser.uid}`);
      return docData(userDoc) as Observable<User>;
    })
  );

  /**
   * Sign in with email and password
   */
  signIn(email: string, password: string): Observable<User> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap(credential => this.getUserProfile(credential.user.uid))
    );
  }

  /**
   * Register new user with role
   */
  register(
    email: string, 
    password: string, 
    displayName: string, 
    role: UserRole = UserRole.LAB_TECH
  ): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap(async credential => {
        // Update Firebase Auth profile
        await updateProfile(credential.user, { displayName });

        // Create user profile in Firestore
        const userProfile: User = {
          uid: credential.user.uid,
          email: email,
          displayName: displayName,
          role: role,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        const userDoc = doc(this.firestore, `users/${credential.user.uid}`);
        await setDoc(userDoc, userProfile);

        return userProfile;
      })
    );
  }

  /**
   * Sign out current user
   */
  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  /**
   * Get user profile from Firestore
   */
  private getUserProfile(uid: string): Observable<User> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDoc)).pipe(
      switchMap(snapshot => {
        if (snapshot.exists()) {
          return of(snapshot.data() as User);
        }
        throw new Error('User profile not found');
      })
    );
  }

  /**
   * Check if user has specific role
   */
  hasRole(user: User | null, role: UserRole): boolean {
    return user?.role === role;
  }

  /**
   * Check if user has admin privileges
   */
  isAdmin(user: User | null): boolean {
    return this.hasRole(user, UserRole.ADMIN);
  }

  /**
   * Check if user can perform action based on role hierarchy
   * Admin > Researcher > Lab Tech
   */
  canPerformAction(user: User | null, requiredRole: UserRole): boolean {
    if (!user) return false;

    const roleHierarchy = {
      [UserRole.ADMIN]: 3,
      [UserRole.RESEARCHER]: 2,
      [UserRole.LAB_TECH]: 1
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }
}
