# Static Deployment Guide for Otomono Jerseys

## Quick Fix for 404 Errors

### Option 1: GitHub Pages (Recommended)
1. Go to repository settings
2. Scroll to "Pages" section
3. Select "Deploy from a branch"
4. Choose "master" branch
5. Your site will be available at: `https://rizaski.github.io/otomonobizz`

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Deploy settings:
   - Build command: `echo 'Static site'`
   - Publish directory: `.`
4. Your site will be available at: `https://your-site-name.netlify.app`

### Option 3: Vercel (Current Issue)
The 404 error suggests Vercel is not finding the files. Try:
1. Check if `index.html` exists in root directory
2. Verify all assets are in correct paths
3. Use GitHub Pages instead for guaranteed static hosting

## File Structure Required
```
/
├── index.html          (Main homepage)
├── about.html          (About page)
├── services.html       (Services page)
├── public/             (Assets folder)
│   ├── logo.png
│   ├── favicon.png
│   └── logo-white.png
├── jersey-designs/     (Jersey images)
└── vercel.json         (Deployment config)
```

## Common 404 Causes
1. Missing `index.html` in root
2. Incorrect file paths
3. Platform-specific routing issues
4. Build configuration problems

## Quick Test
Visit: `https://rizaski.github.io/otomonobizz` (after GitHub Pages setup)
