# Firebase Authentication Setup Guide

## Step 1: Firebase Console Configuration

### 1.1 Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `jeysey-39fb6`
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Google** provider
5. Add your project's **Web SDK configuration**

### 1.2 Configure Authorized Domains
Add these domains to **Authorized domains**:
- `localhost` (for local development)
- `127.0.0.1` (for local development)
- Your deployed domain (e.g., `your-username.github.io`)
- `netlify.app` (if using Netlify)
- `vercel.app` (if using Vercel)

### 1.3 OAuth Configuration
1. In Google provider settings:
   - **Project support email**: Your email
   - **Web SDK configuration**: 
     - **Authorized JavaScript origins**: 
       - `http://localhost:8000`
       - `https://your-username.github.io`
       - Your deployed domain
     - **Authorized redirect URIs**:
       - `http://localhost:8000`
       - `https://your-username.github.io`
       - Your deployed domain

## Step 2: Environment-Specific Configuration

### 2.1 Local Development
```javascript
// For localhost development
const firebaseConfig = {
    apiKey: "AIzaSyDrLm4hxslT2H_jaT6eQrAEK8swP55h6_c",
    authDomain: "jeysey-39fb6.firebaseapp.com",
    projectId: "jeysey-39fb6",
    storageBucket: "jeysey-39fb6.firebasestorage.app",
    messagingSenderId: "71940333413",
    appId: "1:71940333413:web:c9986db4e5e314d8124b8c"
};
```

### 2.2 Production Deployment
Ensure your deployed domain is added to Firebase authorized domains.

## Step 3: Testing Configuration

### 3.1 Test Locally
1. Run `python -m http.server 8000` or `python serve.py`
2. Visit `http://localhost:8000/firebase-test.html`
3. Click "Test Google Authentication"
4. Verify successful login

### 3.2 Test on Deployed Site
1. Deploy to your hosting platform
2. Visit `https://your-domain.com/firebase-test.html`
3. Test authentication flow
4. Verify domain authorization

## Step 4: Troubleshooting

### Common Issues:
1. **Domain not authorized**: Add domain to Firebase console
2. **Network errors**: Check internet connection and firewall
3. **Popup blocked**: Allow popups for your domain
4. **CORS errors**: Ensure proper domain configuration

### Debug Steps:
1. Check browser console for errors
2. Use Firebase test page for diagnostics
3. Verify domain in Firebase console
4. Test with different browsers
