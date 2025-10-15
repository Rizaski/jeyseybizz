// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrLm4hxslT2H_jaT6eQrAEK8swP55h6_c",
    authDomain: "jeysey-39fb6.firebaseapp.com",
    projectId: "jeysey-39fb6",
    storageBucket: "jeysey-39fb6.firebasestorage.app",
    messagingSenderId: "71940333413",
    appId: "1:71940333413:web:c9986db4e5e314d8124b8c"
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
        const result = await signIn(auth, provider);
        const user = result.user;
        console.log('User signed in:', user);
        return user;
    } catch (error) {
        console.error('Error signing in:', error);
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