// Simple Firebase Configuration - Direct approach without environment variables
// This configuration uses hardcoded values for maximum reliability

// Direct Firebase configuration (no environment variables)
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBNWEchdrKX9A2WdMa3VTnpbKgo0_eWqHE",
    authDomain: "otomono-c9938.firebaseapp.com",
    projectId: "otomono-c9938",
    storageBucket: "otomono-c9938.firebasestorage.app",
    messagingSenderId: "348906539551",
    appId: "1:348906539551:web:e249c40d0ae9e2964a632a",
    measurementId: "G-YVL497L1V3"
};

// Simple Firebase initialization
async function initializeFirebaseSimple() {
    try {
        console.log('Initializing Firebase with simple configuration...');
        console.log('Config:', FIREBASE_CONFIG);
        
        // Import Firebase modules
        const { initializeApp, getApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const { getDatabase, ref, set, get, push, remove } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');

        // Initialize Firebase app
        let app;
        try {
            app = getApp('simple-firebase-app');
            console.log('Using existing Firebase app');
        } catch (error) {
            app = initializeApp(FIREBASE_CONFIG, 'simple-firebase-app');
            console.log('Initialized new Firebase app');
        }
        
        // Get Firebase services
        const auth = getAuth(app);
        const db = getFirestore(app);
        const rtdb = getDatabase(app);

        // Configure Google Auth Provider
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({
            prompt: 'select_account'
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
            config: FIREBASE_CONFIG,
            isReady: true
        };

        console.log('Firebase initialized successfully with simple configuration');
        return true;
        
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        
        // Create fallback Firebase object
        window.firebase = {
            isReady: false,
            error: error.message,
            config: FIREBASE_CONFIG,
            // Fallback functions
            signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not available')),
            createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not available')),
            signOut: () => Promise.reject(new Error('Firebase not available')),
            onAuthStateChanged: () => {},
            collection: () => { throw new Error('Firebase not available'); },
            addDoc: () => Promise.reject(new Error('Firebase not available')),
            getDocs: () => Promise.reject(new Error('Firebase not available')),
            getDoc: () => Promise.reject(new Error('Firebase not available')),
            doc: () => { throw new Error('Firebase not available'); },
            updateDoc: () => Promise.reject(new Error('Firebase not available')),
            deleteDoc: () => Promise.reject(new Error('Firebase not available')),
            query: () => { throw new Error('Firebase not available'); },
            orderBy: () => { throw new Error('Firebase not available'); },
            where: () => { throw new Error('Firebase not available'); },
            onSnapshot: () => { throw new Error('Firebase not available'); },
            setDoc: () => Promise.reject(new Error('Firebase not available')),
            ref: () => { throw new Error('Firebase not available'); },
            set: () => Promise.reject(new Error('Firebase not available')),
            get: () => Promise.reject(new Error('Firebase not available')),
            push: () => { throw new Error('Firebase not available'); },
            remove: () => Promise.reject(new Error('Firebase not available'))
        };
        
        return false;
    }
}

// Export for global use
window.initializeFirebaseSimple = initializeFirebaseSimple;
window.firebaseConfig = FIREBASE_CONFIG;
