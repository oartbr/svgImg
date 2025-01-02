/* 
   Error V0.2 
   Feb 18th 2024
   svimg.createLayer(sTransformer, sFile, sColor, sScale, aRange, iThickness, sType)
*/


svimg.setDensity(3).createLayer('mapper', "/img/alex3.jpg",  '#ff666666', 5, [0,30], 1, 'scribbles').attr('limit', 15).setCenter(1050,750);
svimg.setDensity(1).createLayer('mapper', "/img/alex3.jpg",  '#00006666', 5, [0,25], 1, 'scribblesA').attr('limit', 5).setCenter(1050,750);

//svimg.setDensity(3).insertLayer('bolaC', '#00006666', 5, "/img/mary0.jpg", [0,5], 'scribbles');