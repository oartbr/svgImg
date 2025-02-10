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

svimg.setDensity(1).createLayer('mapper', sFile,  '#2b01ff66', 5, [0,10], 1, 'scribbles').attr('limit', [7.5,10]).setCenter(0,0);
svimg.setDensity(1).createLayer('mapper', sFile,  '#2b01ff66', 5, [0,20], 1, 'scribbles').attr('limit', [10,15]).setCenter(1250,0);
svimg.setDensity(2).createLayer('mapper', sFile,  '#2b01ff66', 5, [0,20], 1, 'scribbles').attr('limit', [5,10]).setCenter(1250,1631);
svimg.setDensity(3).createLayer('mapper', sFile,  '#2b01ff66', 5, [0,20], 1, 'scribbles').attr('limit', [3,5]).setCenter(0,1631);