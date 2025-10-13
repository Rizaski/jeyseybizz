# Otomono Jerseys - Premium Jersey Design & Printing

A modern, responsive website for jersey design, printing, and selling business built with React Native Web, Tailwind CSS, and Firebase.

## Features

- 🎨 **Modern Landing Page** - Beautiful, responsive design with reel-style slider
- 🖼️ **Interactive Slider** - Showcase jersey designs with auto-play functionality
- 📱 **Mobile-First Design** - Optimized for all devices
- 🎯 **Brand Integration** - Uses official Otomono logo and favicon
- 🔥 **Firebase Backend** - Ready for authentication, database, and storage
- 🎨 **Tailwind CSS** - Modern styling with custom brand colors
- ⚡ **Lucide Icons** - Beautiful, consistent iconography

## Tech Stack

- **Frontend**: React Native Web, Tailwind CSS, Lucide Icons
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Styling**: Tailwind CSS with custom brand colors
- **Icons**: Lucide React Native

## Brand Colors

- Primary: #0052cc (Blue)
- Secondary: #36b37e (Green)
- Accent: #ff5630 (Orange)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Copy your Firebase config to `src/config/firebase.js`
   - Replace the placeholder values with your actual Firebase credentials

3. **Run the Application**
   ```bash
   # For web development
   npm run web
   
   # For React Native development
   npm start
   ```

## Project Structure

```
├── src/
│   ├── components/
│   │   └── LandingPage.js      # Main landing page component
│   └── config/
│       └── firebase.js         # Firebase configuration
├── jersey-designs/             # Jersey design images
├── public/                     # Static assets (logo, favicon)
├── App.js                      # Main app component
├── index.html                  # HTML entry point
└── tailwind.config.js          # Tailwind CSS configuration
```

## Firebase Configuration

You'll need to provide the following Firebase configuration values:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Features Overview

### Landing Page
- Hero section with animated slider
- Interactive jersey design showcase
- Auto-play functionality with manual controls
- Responsive design for all screen sizes

### Slider Component
- Displays all jersey designs from the `jersey-designs` folder
- Smooth transitions and animations
- Play/pause controls
- Slide indicators
- Touch/swipe support

### Design System
- Consistent typography using Inter font family
- Brand color scheme throughout
- Modern UI components with shadows and rounded corners
- Responsive grid layouts

## Development

The project uses React Native Web for cross-platform development, allowing you to build for both web and mobile using the same codebase.

### Key Components

- **LandingPage**: Main component with slider and features
- **Firebase Config**: Backend integration setup
- **Tailwind Config**: Custom styling configuration

## Deployment

The application can be deployed to any static hosting service like:
- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages

## License

ISC License - See LICENSE file for details
