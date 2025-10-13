# Otomono Jerseys - Static Site Deployment Guide

## Overview
This is a pure HTML+CSS+JS static website that can be deployed without any server requirements. All assets are self-contained and can be served from any static hosting platform.

## Deployment Options

### 1. GitHub Pages (Recommended)
**Free hosting with custom domain support**

1. **Enable GitHub Pages:**
   - Go to your repository: `https://github.com/Rizaski/otomono`
   - Click **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Choose **master** branch
   - Select **/ (root)** folder
   - Click **Save**

2. **Access your site:**
   - Your site will be available at: `https://rizaski.github.io/otomono/`
   - GitHub will automatically build and deploy your static files

3. **Custom Domain (Optional):**
   - In Pages settings, add your custom domain
   - Update DNS records to point to GitHub Pages

### 2. Netlify (Alternative)
**Drag-and-drop deployment**

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Site will be live instantly
4. Custom domain support available

### 3. Vercel (Alternative)
**Git-based deployment**

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect static site
4. Deploy with one click

### 4. Any Static Hosting
**Upload files to any web server**

- Upload all files to your web server's public directory
- Ensure `index.html` is in the root
- All assets are relative paths, so they'll work anywhere

## File Structure
```
otomono/
├── index.html          # Homepage
├── services.html       # Services page
├── about.html          # About page
├── contact.html        # Contact page
├── public/             # Static assets
│   ├── logo.png
│   ├── favicon.png
│   ├── aboutusimg.png
│   └── ...
├── jersey-designs/    # Jersey images
└── README.md
```

## Key Features
- ✅ Pure HTML+CSS+JS (no build process required)
- ✅ Responsive design (mobile-friendly)
- ✅ SEO optimized
- ✅ Fast loading (CDN assets)
- ✅ Cross-browser compatible
- ✅ No server dependencies

## Testing Locally
```bash
# Option 1: Python server
python -m http.server 3000

# Option 2: Node.js server
npx serve .

# Option 3: PHP server
php -S localhost:3000
```

## Troubleshooting

### Common Issues:
1. **404 Errors:** Ensure all file paths are correct
2. **Images not loading:** Check file paths in HTML
3. **CSS not loading:** Verify Tailwind CDN is accessible
4. **Navigation issues:** Check href attributes

### GitHub Pages Specific:
- Wait 5-10 minutes after enabling Pages
- Check repository settings for correct branch
- Ensure files are committed and pushed

## Performance Tips
- Images are optimized for web
- CSS is loaded from CDN (fast)
- JavaScript is minimal and efficient
- All assets use relative paths

## Security
- No server-side code (static only)
- No database connections
- No sensitive data exposure
- HTTPS enabled on all platforms

## Support
For deployment issues, check:
1. File paths and structure
2. Browser console for errors
3. Network tab for failed requests
4. Platform-specific documentation
