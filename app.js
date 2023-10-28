require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.APP_PORT;
const __baseDir = process.env.BASE_DIR;

const routes = require('./routes/index.js'); // Import the router
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes); // Use the router
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 