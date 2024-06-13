// To import necessary modules
const http = require('http');
const fs = require('fs');
const path = require('path');

// Defines the port which the server will listen to
const PORT = process.env.PORT || 3000;

// Creates a server instance
http.createServer((req, res) => {
    // Determines the file path requested by the client
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Determines the content type based on the file extension
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
    }

    // Reads the file content from the file system
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // If the file is not found, returns a 404 error
            if (err.code == 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                // If there is an internal server error, returns a 500 error
                res.writeHead(500);
                res.end('500 Internal Server Error');
            }
        } else {
            // If file is found, displays its content with the appropriate type
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });

}).listen(PORT, () => {
    // Logs a message when the server starts listening
    console.log(`Server running at http://localhost:${PORT}/`);
});