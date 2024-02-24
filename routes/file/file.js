// file.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const __baseDir = process.env.BASE_DIR;

// Save a file
router.post('/file/:filename', (req, res) => {
    //project['action'] = '/user';
    
    res.send(`Hello, ${req.params.username}! <br> Now, go away.`);
});


module.exports = router;