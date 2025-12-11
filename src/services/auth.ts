import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User, SubscriptionTier } from '../types';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  lastActiveAt: string;
  // User preferences from onboarding
  industry?: string;
  level?: string;
  goal?: string;
  targetDate?: string;
}

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, displayName: string): Promise<AuthUser> {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update display name
    await updateProfile(firebaseUser, { displayName });

    // Create user document in Firestore
    const userData: AuthUser = {
      uid: firebaseUser.uid,
      email: email,
      displayName: displayName,
      subscriptionTier: 'free',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return userData;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up');
  }
}

/**
 * Sign in existing user
 */
export async function signIn(email: string, password: string): Promise<AuthUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data() as AuthUser;

    // Update last active timestamp
    await updateDoc(doc(db, 'users', firebaseUser.uid), {
      lastActiveAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });

    return { ...userData, lastActiveAt: new Date().toISOString() };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
}

/**
 * Get current user data
 */
export async function getCurrentUserData(uid: string): Promise<AuthUser | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data() as AuthUser;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

/**
 * Update user subscription tier
 */
export async function updateUserSubscription(uid: string, tier: SubscriptionTier): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), {
      subscriptionTier: tier,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const firebaseUser = userCredential.user;

    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (userDoc.exists()) {
      // Existing user - update last active
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        lastActiveAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      });

      const userData = userDoc.data() as AuthUser;
      return { ...userData, lastActiveAt: new Date().toISOString() };
    } else {
      // New user - create user document
      const userData: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'User',
        subscriptionTier: 'free',
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return userData;
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with Google');
  }
}

/**
 * Auth state observer
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
