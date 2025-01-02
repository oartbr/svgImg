/* 
   Error V0.2 
   Feb 18th 2024
   svimg.insertLayer(sName, sColor, sScale, sFile, aRange, sType, iThickness)
*/
// Get the query string from the URL
const queryString = window.location.search;

// Parse the query string
const urlParams = new URLSearchParams(queryString);

// Get the value of the variable (e.g., 'myVar')
const sFile = "/img/" + urlParams.get('file');

svimg.setDensity(1).createLayer('mapper', sFile,  '#00666666', 5, [0,30], 1, 'scribblesB').attr('limit', 28).setCenter(411,679);
svimg.setDensity(1).createLayer('mapper', sFile,  '#00666666', 5, [0,30], 1, 'scribblesA').attr('limit', 15).setCenter(411,679);
svimg.setDensity(1).createLayer('mapper', sFile,  '#00666666', 5, [0,30], 1, 'scribblesA').attr('limit', 10).setCenter(411,679);