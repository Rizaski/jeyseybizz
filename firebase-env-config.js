// Firebase Environment Variables Configuration for Vercel
// This file handles environment variables for production deployment

// Environment variables for Vercel
const getFirebaseConfig = () => {
    // Check if we're in production (Vercel)
    const isProduction = typeof window !== 'undefined' &&
        (window.location.hostname.includes('vercel.app') ||
            window.location.hostname !== 'localhost');

    if (isProduction) {
        // Use environment variables in production
        return {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBNWEchdrKX9A2WdMa3VTnpbKgo0_eWqHE",
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "otomono-c9938.firebaseapp.com",
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "otomono-c9938",
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "otomono-c9938.firebasestorage.app",
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "348906539551",
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:348906539551:web:e249c40d0ae9e2964a632a",
            measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-YVL497L1V3"
        };
    } else {
        // Use hardcoded config for development
        return {
            apiKey: "AIzaSyBNWEchdrKX9A2WdMa3VTnpbKgo0_eWqHE",
            authDomain: "otomono-c9938.firebaseapp.com",
            projectId: "otomono-c9938",
            storageBucket: "otomono-c9938.firebasestorage.app",
            messagingSenderId: "348906539551",
            appId: "1:348906539551:web:e249c40d0ae9e2964a632a",
            measurementId: "G-YVL497L1V3"
        };
    }
};

// Enhanced Firebase initialization with environment variables
async function initializeFirebaseWithEnv() {
    try {
        console.log('Initializing Firebase with environment variables...');

        // Get configuration based on environment
        const firebaseConfig = getFirebaseConfig();
        console.log('Firebase config:', firebaseConfig);

        // Dynamic imports for better compatibility
        const {
            initializeApp,
            getApp
        } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const {
            getAuth,
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
            getRedirectResult
        } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const {
            getFirestore,
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
            setDoc
        } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const {
            getDatabase,
            ref,
            set,
            get,
            push,
            remove
        } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');

        // Initialize Firebase with environment-specific configuration
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

        // Initialize FirebaseAuth wrapper
        if (window.FirebaseAuth) {
            await window.FirebaseAuth.initialize();
        }

        console.log('Firebase initialized successfully with environment variables');
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

    // Check if environment variables are available
    if (typeof process !== 'undefined' && process.env) {
        console.log('Process.env available:', !!process.env);
        console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
        console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    } else {
        console.log('Process.env not available in browser environment');
    }

    console.log('=== End Debug ===');
}

// Export functions for global use
window.initializeFirebaseWithEnv = initializeFirebaseWithEnv;
window.debugEnvironmentVariables = debugEnvironmentVariables;
window.getFirebaseConfig = getFirebaseConfig;