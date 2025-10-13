# Otomono Jerseys

Premium Jersey Design, Printing, and Selling Business Website

## Features

- Modern reel-style slider showcasing jersey designs
- Responsive design for web, tablet, and mobile
- Interactive modals for chat, login, and staff access
- Pure HTML+CSS+JavaScript implementation
- Tailwind CSS via CDN for styling

## Tech Stack

- **Frontend**: Pure HTML5 + CSS3 + JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN)
- **Server**: Python HTTP Server (built-in)

## Getting Started

### Option 1: Python Server (Recommended)
1. Start the server:
   ```bash
   python serve.py
   ```
   Or on Windows:
   ```bash
   start-server.bat
   ```
   Or on Unix/Linux/Mac:
   ```bash
   ./start-server.sh
   ```

2. Open your browser and navigate to `http://localhost:3000`

### Option 2: Any Static File Server
You can use any static file server:
- Python: `python -m http.server 3000`
- Node.js: `npx serve .`
- PHP: `php -S localhost:3000`
- Or simply open `index.html` directly in your browser

## Project Structure

```
├── index.html              # Main homepage with jersey slider
├── services.html           # Services page
├── serve.py               # Python HTTP server
├── start-server.bat       # Windows startup script
├── start-server.sh        # Unix/Linux/Mac startup script
├── public/
│   ├── logo.png
│   ├── logo-white.png
│   └── favicon.png
├── jersey-designs/
│   └── [10 jersey design images]
├── design-system.md       # Design system documentation
├── typography-guidelines.md
└── README.md
```

## Features

### Homepage (`index.html`)
- **Reel-style Slider**: Auto-playing slider with 10 jersey designs
- **Interactive Controls**: Previous, Next, Play/Pause buttons
- **Navigation**: Sticky header with smooth scrolling
- **Modals**: Live chat, Gmail login, Staff login
- **Testimonials**: Customer reviews with star ratings
- **Responsive Design**: Mobile-first approach

### Services Page (`services.html`)
- **Service Overview**: Jersey printing, design, bulk orders
- **Process Workflow**: 4-step process visualization
- **Pricing Tiers**: Flexible pricing options
- **Quality Assurance**: Material testing and inspection
- **Footer**: Navigation and company information

## Configuration

### Colors
- Primary: `#dc2626` (Red)
- Secondary: `#6b7280` (Gray)
- Accent: `#ff5630` (Orange)

### Fonts
- Primary: Inter (Google Fonts)
- Fallback: System fonts

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## No Dependencies Required

This application uses only:
- HTML5
- CSS3
- JavaScript (ES6+)
- Tailwind CSS (CDN)
- Python (for server, optional)

No npm packages, no build process, no compilation required!

## Quick Start

1. **Clone or download** this repository
2. **Open terminal** in the project directory
3. **Run**: `python serve.py`
4. **Open browser** to `http://localhost:3000`

That's it! No installation, no dependencies, no configuration needed.

## Deployment

Deploy to any static hosting service:
- **GitHub Pages**: Push to GitHub and enable Pages
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect GitHub repository
- **Firebase Hosting**: `firebase deploy`
- **Any web server**: Upload files to public_html

## License

ISC License