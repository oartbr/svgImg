// routes.js

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// get an image file from the img folder
router.get('/img/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    res.sendFile(path.join(__dirname, '../public', `img/${fileName}`));
});

// get a javascript file from the js folder
router.get('/js/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    res.sendFile(path.join(__dirname, '../public', `js/${fileName}`));
});

// get a css file from the css folder
router.get('/css/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    res.sendFile(path.join(__dirname, '../public', `css/${fileName}`));
});

// Show a picture with filter
router.get('/view/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    res.sendFile(path.join(__dirname, '../public', `views/${fileName}`));
});

// Show a picture with filter
router.get('/show/:fileName', (req, res) => {
    const fileName = req.params.fileName;

    if(fileName == 'list'){
        const directoryPath = '../svgimg/public/views';  // Replace with your directory path
        const aFiles = [];

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return console.error('Unable to scan directory: ' + err);
            } 
            files.forEach(file => {
                aFiles.push(file.split(".")[0]);
            });
            res.json(aFiles);
            return;
        });

    } else if (fileName == 'dir'){
        res.sendFile(path.join(__dirname, '../public', 'components/views.html'));
        return;
    }

    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Show a picture with filter
router.get('/show', (req, res) => {
    const fileName = req.params.fileName;

    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});



// Show a picture with filter
router.get('/show/list', (req, res) => {
    const directoryPath = '../svgimg/public/views';  // Replace with your directory path

    fs.readdir(directoryPath, (err, files) => {
        const aFiles = [];
        if (err) {
            return console.error('Unable to scan directory: ' + err);
        } 
        files.forEach(file => {
            aFiles.push(file.split(".")[0]);
        });


        res.send(JSON.stringify(aFiles));
    });
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