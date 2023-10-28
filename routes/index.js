// routes.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const __baseDir = process.env.BASE_DIR;
const project = {
    title: "The Drawing Machine",
    subtitle: "This is under development. The idea is to create some good stuff.",
    base: __baseDir,
    action: '',
    files: [],
    show:''
};

// get an image file from the img folder
router.get('/img/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    project['action'] = '/img'; 
    res.sendFile(path.join(__dirname, '../public', `/img/${fileName}`));
});

// get a javascript file from the js folder
router.get('/js/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    project['action'] = '/js';
    res.sendFile(path.join(__dirname, '../public', `/js/${fileName}`));
});

// get a css file from the css folder
router.get('/css/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    project['action'] = '/css';
    res.sendFile(path.join(__dirname, '../public', `/css/${fileName}`));
});

// Show a picture with filter
router.get('/view/:fileName', (req, res) => {
    const fileName = (req.params.fileName != ".js") ? req.params.fileName : "error.js";
    project['action'] = '/view';
    res.sendFile(path.join(__dirname, '../public', `/inks/${fileName}`), (err) => {
        if (err) {
            // Handle the error
            res.status(404).redirect('./error.js');
        } 
    });
    
});

// Show a picture with filter
router.get('/show/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    project['action'] = path.join(__dirname, '../public', `/inks/${fileName}`);
    if(fileName == 'list'){
        const directoryPath = project['base'] + 'public/inks';  // Replace with your directory path
        const aFiles = [];

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return console.error('Unable to scan directory: ' + err);
            } 
            files.forEach(file => {
                aFiles.push(file.split(".")[0]);
            });
            res.json(aFiles);
        });

    } else if (fileName == ''){
        res.redirect(project.base);
    } else {
        project['show'] = fileName;
        res.render('index', project);
    }
});

// Show a picture with filter
router.get('/show', (req, res) => {
    project['action'] = '/show';
    res.redirect('/');
});

// About route
router.get('/about', (req, res) => {
    project['action'] = '/about';
    res.render('about', project);
});

// User route with dynamic parameter
router.get('/user/:username', (req, res) => {
    project['action'] = '/user';
    res.send(`Hello, ${req.params.username}! <br> Now, go away.`);
});

// Home route
router.get('/', (req, res) => {
    const directoryPath = './public/inks';  // Replace with your directory path
    project['action'] = '/';
    console.log({link:directoryPath});
    fs.readdir(directoryPath, (err, files) => {
        const aFiles = [];
        if (err) {
            files = [];
            //return console.error('Unable to scan directory: ' + err);
        } 
        files.forEach(file => {
            aFiles.push(file.split(".")[0]);
        });

        project['files'] = aFiles;
        res.render('index', project);
    });
    
});

module.exports = router;