// routes.js

const express = require('express');
const router = express.Router();
const path = require('path');

// get an image file from the img folder
router.get('/img/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    res.sendFile(path.join(__dirname, '../public', 'img/${fileName}'));
});

// get a javascript file from the js folder
router.get('/js/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    res.sendFile(path.join(__dirname, '../public', 'js/${fileName}'));
});

// Show a picture with filter
router.get('/top/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// About route
router.get('/about', (req, res) => {
    res.send('About Page');
});

// User route with dynamic parameter
router.get('/user/:username', (req, res) => {
    res.send(`Hello, ${req.params.username}!`);
});

// Home route
router.get('/', (req, res) => {
    // Send HTML file on root access
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = router;