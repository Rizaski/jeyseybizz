// Static deployment script for platforms that don't support Node.js
// This creates a simple static site structure

const fs = require('fs');
const path = require('path');

// Create a simple static server for platforms like GitHub Pages
const staticServer = `
<!DOCTYPE html>
<html>
<head>
    <title>Otomono Jerseys - Static Deployment</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Otomono Jerseys</h1>
    <p>This is a static deployment. For full functionality, please use a Node.js hosting platform.</p>
    <script>
        // Redirect to main site if available
        window.location.href = './index.html';
    </script>
</body>
</html>
`;

// Write static server file
fs.writeFileSync('static.html', staticServer);
console.log('Static deployment file created: static.html');
