# Otomono Jerseys - Static Deployment Guide

## Quick Static Deployment Options

### Option 1: GitHub Pages (Recommended)
1. Go to your repository settings
2. Scroll to "Pages" section
3. Select "Deploy from a branch"
4. Choose "gh-pages" branch
5. Your site will be available at: `https://rizaski.github.io/otomonojerseys`

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Deploy settings:
   - Build command: `echo 'Static site'`
   - Publish directory: `.`
   - Your site will be available at: `https://your-site-name.netlify.app`

### Option 3: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Select "Static Site" deployment
4. Your site will be available at: `https://your-site-name.vercel.app`

## Files for Static Deployment

- `index-static.html` - Main static homepage
- `about.html` - About page
- `services.html` - Services page
- `public/` - Assets folder (logos, images)
- `jersey-designs/` - Jersey design images

## Features Included

✅ Responsive design
✅ Modern UI with Tailwind CSS
✅ Smooth scrolling navigation
✅ Contact forms
✅ Mobile-friendly
✅ Fast loading

## No Server Required

This static deployment doesn't require:
- Node.js server
- Database
- Backend processing
- Server-side rendering

Perfect for hosting on any static site platform!
