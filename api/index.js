// Vercel API route for static file serving
export default function handler(req, res) {
    // Redirect to static version
    res.redirect(301, '/index-static.html');
}
