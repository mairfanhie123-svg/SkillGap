// src/services/firebase.js
// ─────────────────────────────────────────────
// Firebase Auth (Google Sign-In + Email/Password) + Firestore
// ─────────────────────────────────────────────
// Setup steps:
// 1. Go to https://console.firebase.google.com
// 2. Create a project → "SkillGap"
// 3. Add a Web App → copy the firebaseConfig below
// 4. Enable Authentication:
//    a. Click "Authentication" in left menu
//    b. Click "Sign-in method" tab
//    c. Click "Email/Password"
//    d. Toggle "Enable" → Click "Save"
//    e. Also enable "Google" provider
// 5. Enable Firestore Database → start in test mode
// 6. Paste your config values in .env
// ─────────────────────────────────────────────

import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'

// ── Config (from .env) ─────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// ── Init ───────────────────────────────────────
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// ── Development: Connect to Auth Emulator ───────
if (import.meta.env.DEV) {
  // This bypasses domain restrictions for development
  // Run: firebase emulators:start --only auth
  // connectAuthEmulator(auth, 'http://localhost:9099')
}

const googleProvider = new GoogleAuthProvider()

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

export async function signUpWithEmail(email, password, displayName) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, { displayName })
  return result.user
}

export async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function logOut() {
  await signOut(auth)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}

// ─────────────────────────────────────────────
// FIRESTORE — USER DOCUMENT
// Path: users/{uid}
// ─────────────────────────────────────────────

export async function upsertUser(user) {
  const ref = doc(db, 'users', user.uid)
  await setDoc(
    ref,
    {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function fetchUser(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

// ─────────────────────────────────────────────
// FIRESTORE — SAVE PROFILE & RESULTS
// ─────────────────────────────────────────────

export async function saveProfile(uid, profile) {
  await updateDoc(doc(db, 'users', uid), {
    profile,
    profileSavedAt: serverTimestamp(),
  })
}

export async function saveAnalysis(uid, analysis) {
  await updateDoc(doc(db, 'users', uid), {
    analysis,
    analysisAt: serverTimestamp(),
  })
}

export async function saveRoadmap(uid, roadmap) {
  await updateDoc(doc(db, 'users', uid), {
    roadmap,
    roadmapAt: serverTimestamp(),
  })
}

export async function loadUserData(uid) {
  const data = await fetchUser(uid)
  if (!data) return { profile: null, analysis: null, roadmap: null }
  return {
    profile: data.profile || null,
    analysis: data.analysis || null,
    roadmap: data.roadmap || null,
  }
}
