const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve all static files from a directory named 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // Send HTML file on root access
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/img/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  res.sendFile(path.join(__dirname, 'public', 'img/${fileName}'));
});

app.get('/js/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  res.sendFile(path.join(__dirname, 'public', 'js/${fileName}'));
});

app.get('/top/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 
