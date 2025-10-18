// Firebase Production Configuration for Vercel
// This file handles environment variables for production deployment

// Environment variables for Vercel (these will be replaced during build)
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBNWEchdrKX9A2WdMa3VTnpbKgo0_eWqHE";
const FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "otomono-c9938.firebaseapp.com";
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "otomono-c9938";
const FIREBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "otomono-c9938.firebasestorage.app";
const FIREBASE_MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "348906539551";
const FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:348906539551:web:e249c40d0ae9e2964a632a";
const FIREBASE_MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-YVL497L1V3";

// Firebase configuration object
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID
};

// Enhanced Firebase initialization for production
async function initializeFirebaseForProduction() {
    try {
        console.log('Initializing Firebase for production...');
        console.log('Firebase config:', firebaseConfig);
        
        // Dynamic imports for better compatibility
        const { initializeApp, getApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const { getDatabase, ref, set, get, push, remove } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');

        // Initialize Firebase with production configuration
        let app;
        const appName = 'production-app';
        
        try {
            app = getApp(appName);
            console.log(`Using existing Firebase app: ${appName}`);
        } catch (error) {
            app = initializeApp(firebaseConfig, appName);
            console.log(`Initialized new Firebase app: ${appName}`);
        }
        
        const auth = getAuth(app);
        const db = getFirestore(app);
        const rtdb = getDatabase(app);

        // Configure Google Auth Provider for production
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({
            prompt: 'select_account',
            hd: 'gmail.com'
        });
        googleProvider.addScope('email');
        googleProvider.addScope('profile');

        // Make Firebase available globally
        window.firebase = {
            app,
            auth,
            db,
            rtdb,
            signInWithEmailAndPassword,
            createUserWithEmailAndPassword,
            signOut,
            onAuthStateChanged,
            updatePassword,
            reauthenticateWithCredential,
            EmailAuthProvider,
            GoogleAuthProvider,
            signInWithPopup,
            signInWithRedirect,
            getRedirectResult,
            googleProvider,
            collection,
            addDoc,
            getDocs,
            getDoc,
            doc,
            updateDoc,
            deleteDoc,
            query,
            orderBy,
            where,
            onSnapshot,
            setDoc,
            ref,
            set,
            get,
            push,
            remove,
            config: firebaseConfig
        };

        console.log('Firebase initialized successfully for production');
        return true;
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
        return false;
    }
}

// Debug function to check environment variables
function debugEnvironmentVariables() {
    console.log('=== Environment Variables Debug ===');
    console.log('Hostname:', window.location.hostname);
    console.log('Is Vercel:', window.location.hostname.includes('vercel.app'));
    console.log('Is Production:', window.location.hostname !== 'localhost');
    console.log('Firebase Config:', firebaseConfig);
    console.log('=== End Debug ===');
}

// Export functions for global use
window.initializeFirebaseForProduction = initializeFirebaseForProduction;
window.debugEnvironmentVariables = debugEnvironmentVariables;
window.firebaseConfig = firebaseConfig;
