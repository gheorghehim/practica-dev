const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from various directories
app.use(express.static(path.join(__dirname)));
app.use('/continut', express.static(path.join(__dirname, 'continut')));
app.use('/autentificare', express.static(path.join(__dirname, 'autentificare')));
app.use('/navbar', express.static(path.join(__dirname, 'navbar')));
app.use('/footer', express.static(path.join(__dirname, 'footer')));
app.use('/imagini', express.static(path.join(__dirname, 'imagini')));

// Redirect root to login page
app.get('/', (req, res) => {
    res.redirect('/autentificare/login.html');
});

// Handle 404s
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'autentificare/login.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 