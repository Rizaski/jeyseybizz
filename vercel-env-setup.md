# 🔧 Vercel Environment Variables Setup Guide

## 🎯 **Required Environment Variables for Firebase**

### **✅ Set these in your Vercel Dashboard:**

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add these variables:**

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBNWEchdrKX9A2WdMa3VTnpbKgo0_eWqHE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=otomono-c9938.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=otomono-c9938
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=otomono-c9938.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=348906539551
NEXT_PUBLIC_FIREBASE_APP_ID=1:348906539551:web:e249c40d0ae9e2964a632a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-YVL497L1V3
```

### **✅ Environment Variable Names:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

---

## **🚀 Steps to Configure:**

### **Step 1: Access Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**

### **Step 2: Add Environment Variables**
1. Click **"Add New"**
2. **Name:** `NEXT_PUBLIC_FIREBASE_API_KEY`
3. **Value:** `AIzaSyBNWEchdrKX9A2WdMa3VTnpbKgo0_eWqHE`
4. **Environment:** Production, Preview, Development
5. Click **"Save"**

### **Step 3: Repeat for All Variables**
Add all 7 environment variables listed above.

### **Step 4: Redeploy**
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for deployment to complete

---

## **🔍 Troubleshooting:**

### **If Environment Variables Not Working:**

#### **1. Check Variable Names:**
- Ensure they start with `NEXT_PUBLIC_`
- Check for typos in variable names
- Verify all 7 variables are set

#### **2. Check Deployment:**
- Redeploy after adding variables
- Check deployment logs for errors
- Verify variables are available in production

#### **3. Check Browser Console:**
- Open Developer Tools (F12)
- Look for environment variable debug output
- Check for Firebase initialization errors

#### **4. Debug Commands:**
Add this to your browser console to debug:
```javascript
// Check if environment variables are loaded
console.log('Environment check:', {
    hostname: window.location.hostname,
    isVercel: window.location.hostname.includes('vercel.app'),
    firebaseConfig: window.firebase?.config
});
```

---

## **🎯 Expected Results:**

### **✅ After Setting Environment Variables:**
- Console shows: "Firebase initialized successfully with environment variables"
- No Firebase configuration errors
- Admin panel loads with real data
- Gmail authentication works

### **✅ Debug Output Should Show:**
```
=== Environment Variables Debug ===
Hostname: your-app.vercel.app
Is Vercel: true
Is Production: true
Process.env available: true
NEXT_PUBLIC_FIREBASE_API_KEY: AIzaSyBNWEchdrKX9A2WdMa3VTnpbKgo0_eWqHE
NEXT_PUBLIC_FIREBASE_PROJECT_ID: otomono-c9938
=== End Debug ===
```

---

## **🆘 If Still Not Working:**

### **1. Check Vercel Logs:**
- Go to Vercel Dashboard → Functions tab
- Check for any error messages
- Look for environment variable issues

### **2. Verify Firebase Project:**
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select project: `otomono-c9938`
- Check project settings
- Verify API keys match

### **3. Test Locally:**
- Set environment variables in `.env.local`
- Test Firebase connection locally
- Verify configuration works

---

**🎯 Follow these steps to properly configure environment variables for Firebase in Vercel!** 🚀✨
