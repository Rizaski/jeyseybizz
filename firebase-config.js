// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBNWEchdrKX9A2WdMa3VTnpbKgo0_eWqHE",
    authDomain: "otomono-c9938.firebaseapp.com",
    projectId: "otomono-c9938",
    storageBucket: "otomono-c9938.firebasestorage.app",
    messagingSenderId: "348906539551",
    appId: "1:348906539551:web:e249c40d0ae9e2964a632a",
    measurementId: "G-YVL497L1V3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configure Google provider
provider.setCustomParameters({
    prompt: 'select_account'
});

// Authentication functions
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('User signed in:', user);
        return user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
};

export const signInWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        console.log('User signed in with email:', user);
        return user;
    } catch (error) {
        console.error('Error signing in with email:', error);
        throw error;
    }
};

export const createUserWithEmail = async (email, password) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        console.log('User created with email:', user);
        return user;
    } catch (error) {
        console.error('Error creating user with email:', error);
        throw error;
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
        console.log('User signed out');
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

export const getCurrentUser = () => {
    return auth.currentUser;
};

export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Export auth instance for direct use if needed
export {
    auth
};