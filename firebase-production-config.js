// Production-ready Firebase configuration for Vercel deployment
const firebaseConfig = {
    apiKey: "AIzaSyBNWEchdrKX9A2WdMa3VTnpbKgo0_eWqHE",
    authDomain: "otomono-c9938.firebaseapp.com",
    projectId: "otomono-c9938",
    storageBucket: "otomono-c9938.firebasestorage.app",
    messagingSenderId: "348906539551",
    appId: "1:348906539551:web:e249c40d0ae9e2964a632a",
    measurementId: "G-YVL497L1V3"
};

// Production environment detection
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const isVercel = window.location.hostname.includes('vercel.app');

// Enhanced Firebase initialization for production
async function initializeFirebaseProduction() {
    try {
        // Dynamic imports for better compatibility
        const { initializeApp, getApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, where, onSnapshot, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const { getDatabase, ref, set, get, push, remove } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');

        // Initialize Firebase with production configuration
        let app;
        const appName = isProduction ? 'production-app' : 'development-app';
        
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
            isProduction,
            isVercel
        };

        console.log('Firebase initialized successfully for production');
        return true;
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        return false;
    }
}

// Production-ready Gmail authentication
async function authenticateWithGmail() {
    try {
        if (!window.firebase) {
            await initializeFirebaseProduction();
        }

        const { auth, googleProvider, signInWithPopup, signInWithRedirect } = window.firebase;
        
        // Try popup first (works better in production)
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('Gmail authentication successful via popup:', result.user.email);
            return result;
        } catch (popupError) {
            console.log('Popup failed, trying redirect:', popupError.message);
            // Fallback to redirect
            await signInWithRedirect(auth, googleProvider);
            return null;
        }
    } catch (error) {
        console.error('Gmail authentication failed:', error);
        throw error;
    }
}

// Production-ready Firebase database operations
async function saveToFirestore(collectionName, data) {
    try {
        if (!window.firebase) {
            await initializeFirebaseProduction();
        }

        const { db, collection, addDoc } = window.firebase;
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: new Date(),
            environment: isProduction ? 'production' : 'development'
        });
        
        console.log(`Document saved to ${collectionName}:`, docRef.id);
        return docRef;
    } catch (error) {
        console.error(`Error saving to ${collectionName}:`, error);
        throw error;
    }
}

// Export for use in other files
window.initializeFirebaseProduction = initializeFirebaseProduction;
window.authenticateWithGmail = authenticateWithGmail;
window.saveToFirestore = saveToFirestore;
