/* 
   Error V0.2 
   Feb 18th 2024
   svimg.insertLayer(sName, sColor, sScale, sFile, aRange, sType, iThickness)
*/
// Get the value of the variable (e.g., 'myVar')
const sFile = "/img/oliA.jpg";

svimg.setDensity(1).createLayer('mapper', "/img/vistaA.jpg",  '#00660066', 5, [0,30], 1, 'doodles').attr('limit', 30).setCenter(411,679);
svimg.setDensity(1).createLayer('mapper', "/img/vistaB.jpg",  '#00006666', 5, [0,30], 1, 'doodles').attr('limit', 30).setCenter(411,679);
svimg.setDensity(1).createLayer('mapper', "/img/vistaC.jpg",  '#a699ff66', 5, [0,60], 1, 'doodles').attr('limit', 30).setCenter(411,679);