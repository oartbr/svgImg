// routes.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const __baseDir = process.env.BASE_DIR;

// Middleware to parse JSON bodies
router.use(bodyParser.json({ limit: process.env.APP_UPLOAD_LIMIT || '10mb'}));

// Middleware to parse URL-encoded bodies
router.use(bodyParser.urlencoded({ 
    extended: true,
    limit: process.env.APP_UPLOAD_LIMIT  || '10mb' // Set limit to 10MB, adjust as needed
  }));

const link = window.location.pathname;
const project = {
    title: "For the Drawing Machine ",
    subtitle: "This is under development. Nothing to see here.",
    fileBase: process.cwd(),
    base: __baseDir,
    action: '',
    files: [],
    show:'',
    upload_dir: process.env.APP_UPLOAD_DIR ,
    currentFile: link.substring(link.lastIndexOf('/')+1)
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

// downloads a file from the downloads folder
router.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    project['action'] = '/downloads';
    res.sendFile(path.join(__dirname, '../public', `/downloads/${fileName}`));
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
        const directoryPath = project.fileBase + '/public/inks';  // Replace with your directory path
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

// Save a file
router.post('/file/:action/:filename', (req, res) => {
    project['action'] = `/file/${req.params.action}/${req.params.filename}`;

    let fileName = req.params.filename.split(".");
    fileName =  fileName[0] + '.' + req.body.id + '.' + fileName[1];
    console.log({req});
    fs.writeFile( project['upload_dir'] + fileName , `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <!-- Created with Inkscape (https://labs.original.art.br/draw) -->
    
    <svg
       xmlns:dc="http://purl.org/dc/elements/1.1/"
       xmlns:cc="http://creativecommons.org/ns#"
       xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
       xmlns:svg="http://www.w3.org/2000/svg"
       xmlns="http://www.w3.org/2000/svg"
       xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
       xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
       id="${req.body.id}"
       version="1.1"
       inkscape:version="0.91 r13725"
       width="${req.body.width}"
       height="${req.body.height}"
       viewBox="0 0 ${req.body.width} ${req.body.height}"
       sodipodi:docname="${req.params.filename}">
      <metadata
         id="metadata3404">
        <rdf:RDF>
          <cc:Work
             rdf:about="">
            <dc:format>image/svg+xml</dc:format>
            <dc:type
               rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
            <dc:title></dc:title>
          </cc:Work>
        </rdf:RDF>
      </metadata>
      ${req.body.svg}
      </svg>
      `, 'utf8', (err) => {
        if (err) {
            res.send(`Error!`);
          return;
        }
        
        res.send(`<a href="./download/${fileName}">${fileName}</a>`);
    });
    
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
    const directoryPath = project.fileBase + '/public/inks';  // Replace with your directory path
    project['action'] = '/';
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