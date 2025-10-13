const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Simple static file server
const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    // Security check
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`File not found: ${filePath}`);
            // Serve index.html for SPA routing
            fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Server Error: Cannot serve index.html');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
        } else {
            // File exists, serve it
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.ico': 'image/x-icon'
            };
            
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Server Error: Cannot read file');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                }
            });
        }
    });
});

server.listen(PORT, () => {
    console.log(`Simple server running on port ${PORT}`);
    console.log(`Serving files from: ${__dirname}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
