/* 
   Error V0.2 
   Feb 18th 2024
   svimg.insertLayer(sName, sColor, sScale, sFile, aRange, sType, iThickness)
*/
svimg.setDensity(2).createLayer('mapper', "/img/vo-cats.jpg",  '#3333ff66', 5, [0,20], 1, 'scribbles').attr('limit', 15).setCenter(1050,750);
svimg.setDensity(1).createLayer('mapper', "/img/vo-cats.jpg",  '#3333ff66', 5, [0,30], 1, 'scribbles').attr('limit', 15).setCenter(1050,750);
svimg.setDensity(1).createLayer('mapper', "/img/vo-cats.jpg",  '#3333ff66', 5, [0,25], 1, 'scribblesA').attr('limit', 5).setCenter(1050,750);