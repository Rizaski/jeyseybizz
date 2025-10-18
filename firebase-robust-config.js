// Robust Firebase Configuration for Production
// This file provides fallback mechanisms and better error handling

// Hardcoded Firebase configuration (fallback for when env vars don't work)
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBNWEchdrKX9A2WdMa3VTnpbKgo0_eWqHE",
    authDomain: "otomono-c9938.firebaseapp.com",
    projectId: "otomono-c9938",
    storageBucket: "otomono-c9938.firebasestorage.app",
    messagingSenderId: "348906539551",
    appId: "1:348906539551:web:e249c40d0ae9e2964a632a",
    measurementId: "G-YVL497L1V3"
};

// Firebase initialization with multiple fallback mechanisms
async function initializeFirebaseRobust() {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
        try {
            console.log(`Firebase initialization attempt ${attempts + 1}/${maxAttempts}`);
            
            // Dynamic imports with retry mechanism
            const { initializeApp, getApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            const { getDatabase, ref, set, get, push, remove } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');

            // Initialize Firebase with unique app name for each attempt
            let app;
            const appName = `firebase-app-${attempts}`;
            
            try {
                app = getApp(appName);
                console.log(`Using existing Firebase app: ${appName}`);
            } catch (error) {
                app = initializeApp(FIREBASE_CONFIG, appName);
                console.log(`Initialized new Firebase app: ${appName}`);
            }
            
            const auth = getAuth(app);
            const db = getFirestore(app);
            const rtdb = getDatabase(app);

            // Configure Google Auth Provider
            const googleProvider = new GoogleAuthProvider();
            googleProvider.setCustomParameters({
                prompt: 'select_account',
                hd: 'gmail.com'
            });
            googleProvider.addScope('email');
            googleProvider.addScope('profile');

            // Make Firebase available globally with comprehensive error handling
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
                isReady: true,
                lastError: null
            };

            // Test Firebase connection
            try {
                await auth.authStateReady();
                console.log('Firebase initialized successfully with robust configuration');
                return true;
            } catch (testError) {
                console.warn('Firebase auth test failed, but continuing:', testError);
                return true; // Still return true as Firebase is initialized
            }
            
        } catch (error) {
            attempts++;
            console.error(`Firebase initialization attempt ${attempts} failed:`, error);
            
            if (attempts >= maxAttempts) {
                console.error('All Firebase initialization attempts failed');
                
                // Create a fallback Firebase object with error handling
                window.firebase = {
                    isReady: false,
                    lastError: error,
                    config: FIREBASE_CONFIG,
                    // Mock functions that show user-friendly errors
                    signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not available. Please try again later.')),
                    createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not available. Please try again later.')),
                    signOut: () => Promise.reject(new Error('Firebase not available. Please try again later.')),
                    onAuthStateChanged: () => {},
                    collection: () => { throw new Error('Firebase not available. Please try again later.'); },
                    addDoc: () => Promise.reject(new Error('Firebase not available. Please try again later.')),
                    getDocs: () => Promise.reject(new Error('Firebase not available. Please try again later.')),
                    getDoc: () => Promise.reject(new Error('Firebase not available. Please try again later.')),
                    doc: () => { throw new Error('Firebase not available. Please try again later.'); },
                    updateDoc: () => Promise.reject(new Error('Firebase not available. Please try again later.')),
                    deleteDoc: () => Promise.reject(new Error('Firebase not available. Please try again later.')),
                    query: () => { throw new Error('Firebase not available. Please try again later.'); },
                    orderBy: () => { throw new Error('Firebase not available. Please try again later.'); },
                    where: () => { throw new Error('Firebase not available. Please try again later.'); },
                    onSnapshot: () => { throw new Error('Firebase not available. Please try again later.'); },
                    setDoc: () => Promise.reject(new Error('Firebase not available. Please try again later.')),
                    ref: () => { throw new Error('Firebase not available. Please try again later.'); },
                    set: () => Promise.reject(new Error('Firebase not available. Please try again later.')),
                    get: () => Promise.reject(new Error('Firebase not available. Please try again later.')),
                    push: () => { throw new Error('Firebase not available. Please try again later.'); },
                    remove: () => Promise.reject(new Error('Firebase not available. Please try again later.'))
                };
                
                return false;
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
    }
}

// Enhanced debug function
function debugFirebaseStatus() {
    console.log('=== Firebase Status Debug ===');
    console.log('Hostname:', window.location.hostname);
    console.log('Is Vercel:', window.location.hostname.includes('vercel.app'));
    console.log('Firebase available:', !!window.firebase);
    console.log('Firebase ready:', window.firebase?.isReady);
    console.log('Firebase config:', window.firebase?.config);
    console.log('Last error:', window.firebase?.lastError);
    console.log('=== End Debug ===');
}

// Retry Firebase initialization
async function retryFirebaseInitialization() {
    console.log('Retrying Firebase initialization...');
    return await initializeFirebaseRobust();
}

// Export functions for global use
window.initializeFirebaseRobust = initializeFirebaseRobust;
window.debugFirebaseStatus = debugFirebaseStatus;
window.retryFirebaseInitialization = retryFirebaseInitialization;
window.firebaseConfig = FIREBASE_CONFIG;
