import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, analytics } from '../config/firebase';
import { User } from '../types';
import { logEvent } from 'firebase/analytics';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create user data in Firestore
  const fetchOrCreateUserData = async (firebaseUser: FirebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // User exists, update last login
      const userData = userSnap.data() as User;
      setUserData(userData);
      return userData;
    } else {
      // Create new user
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        currentAu: 0,
        referralCode: generateReferralCode(),
        referralMultiplier: 1,
        createdAt: new Date()
      };

      await setDoc(userRef, {
        ...newUser,
        createdAt: serverTimestamp()
      });

      setUserData(newUser);
      return newUser;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchOrCreateUserData(user);
        logEvent(analytics, 'user_login');
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await fetchOrCreateUserData(result.user);
      logEvent(analytics, 'login_success', {
        method: 'google'
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      logEvent(analytics, 'login_error', {
        error: error.message
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      logEvent(analytics, 'user_logout');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const value = {
    currentUser,
    userData,
    loading,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 