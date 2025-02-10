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

svimg.setDensity(1).createLayer('mapper', sFile,  '#2b01ff66', 5, [0,100], 1, 'swivels').attr('limit', [75,100]).setCenter(689,652);
svimg.setDensity(1).createLayer('mapper', sFile,  '#0024ee66', 5, [0,100], 1, 'swivels').attr('limit', [50,75]).setCenter(689,652);
svimg.setDensity(2).createLayer('mapper', sFile,  '#0090d266', 5, [0,100], 1, 'swivels').attr('limit', [25,50]).setCenter(689,652);
svimg.setDensity(3).createLayer('mapper', sFile,  '#00c1c166', 5, [0,100], 1, 'swivels').attr('limit', [5,25]).setCenter(689,652);