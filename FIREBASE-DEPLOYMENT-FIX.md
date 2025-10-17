# Firebase Authentication Deployment Fix

## Problem: `auth/network-request-failed` Error

This error occurs when Firebase Authentication fails to connect in deployed environments. Here are the solutions:

## 🔧 Solution 1: Firebase Console Configuration

### 1. Add Authorized Domains
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `otomono-c9938`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your deployment domain:
   - `your-domain.com`
   - `your-domain.netlify.app`
   - `your-domain.vercel.app`
   - `your-domain.github.io`

### 2. Enable Authentication Methods
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Enable **Google** authentication (if using Gmail login)
4. Configure OAuth consent screen

## 🔧 Solution 2: CORS Configuration

### For Netlify Deployment:
Create `_redirects` file in `public` folder:
```
/*    /index.html   200
```

### For Vercel Deployment:
Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

## 🔧 Solution 3: Firebase Security Rules

### Update Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Update Realtime Database Rules:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## 🔧 Solution 4: Environment Variables

### For Production Deployment:
1. Set environment variables in your hosting platform:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

## 🔧 Solution 5: Code-Level Fixes

### 1. Add Retry Logic:
```javascript
async function signInWithRetry(email, password, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

### 2. Add Network Error Handling:
```javascript
function handleAuthError(error) {
    switch (error.code) {
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection and try again.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/user-not-found':
            return 'User not found. Please check your email.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        default:
            return 'Authentication failed. Please try again.';
    }
}
```

## 🔧 Solution 6: Alternative Authentication

### Use localStorage Fallback:
```javascript
function authenticateWithFallback(email, password) {
    // Try Firebase first
    if (firebaseReady) {
        return signInWithEmailAndPassword(auth, email, password);
    }
    
    // Fallback to localStorage
    const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    const user = adminUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('adminUser', JSON.stringify(user));
        return Promise.resolve({ user });
    }
    
    throw new Error('Authentication failed');
}
```

## 🚀 Quick Fix Implementation

### 1. Update Firebase Config:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBNWEchdrKX9A2WdMa3VTnpbKgo0_eWqHE",
    authDomain: "otomono-c9938.firebaseapp.com",
    projectId: "otomono-c9938",
    storageBucket: "otomono-c9938.firebasestorage.app",
    messagingSenderId: "348906539551",
    appId: "1:348906539551:web:e249c40d0ae9e2964a632a",
    measurementId: "G-YVL497L1V3"
};
```

### 2. Add Error Handling:
```javascript
try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
} catch (error) {
    console.error('Auth error:', error);
    if (error.code === 'auth/network-request-failed') {
        // Try fallback authentication
        return authenticateWithFallback(email, password);
    }
    throw error;
}
```

## 📋 Deployment Checklist

- [ ] Add domain to Firebase authorized domains
- [ ] Enable email/password authentication
- [ ] Update security rules
- [ ] Test authentication locally
- [ ] Deploy with proper CORS headers
- [ ] Test authentication on deployed site
- [ ] Monitor Firebase console for errors

## 🔍 Debugging Steps

1. **Check Browser Console** for detailed error messages
2. **Check Firebase Console** for authentication logs
3. **Test Network Connection** to Firebase servers
4. **Verify Domain Configuration** in Firebase console
5. **Check Security Rules** for proper permissions

## 📞 Support

If issues persist:
1. Check Firebase status page
2. Verify project configuration
3. Test with different browsers
4. Check hosting platform CORS settings
