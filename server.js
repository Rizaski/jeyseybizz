const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    try {
        let filePath = '.' + req.url;

        // If requesting root, serve index.html
        if (filePath === './' || filePath === './index.html') {
            filePath = './index.html';
        }

        // Security: prevent directory traversal
        if (filePath.includes('..')) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }

        // Get file extension
        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                console.error(`Error reading file ${filePath}:`, error.message);
                
                if (error.code === 'ENOENT') {
                    // File not found, serve index.html for SPA routing
                    fs.readFile('./index.html', (error, content) => {
                        if (error) {
                            console.error('Error reading index.html:', error.message);
                            res.writeHead(500, { 'Content-Type': 'text/html' });
                            res.end(`
                                <html>
                                    <head><title>Server Error</title></head>
                                    <body>
                                        <h1>Server Error</h1>
                                        <p>Unable to serve the requested page.</p>
                                        <p>Error: ${error.message}</p>
                                    </body>
                                </html>
                            `);
                        } else {
                            res.writeHead(200, {
                                'Content-Type': 'text/html'
                            });
                            res.end(content, 'utf-8');
                        }
                    });
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end(`
                        <html>
                            <head><title>Server Error</title></head>
                            <body>
                                <h1>Server Error</h1>
                                <p>An error occurred while processing your request.</p>
                                <p>Error: ${error.message}</p>
                            </body>
                        </html>
                    `);
                }
            } else {
                res.writeHead(200, {
                    'Content-Type': contentType
                });
                res.end(content, 'utf-8');
            }
        });
    } catch (error) {
        console.error('Server error:', error.message);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <head><title>Server Error</title></head>
                <body>
                    <h1>Server Error</h1>
                    <p>An unexpected error occurred.</p>
                    <p>Error: ${error.message}</p>
                </body>
            </html>
        `);
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error.message);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});