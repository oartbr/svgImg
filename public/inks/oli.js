/* 
   Error V0.2 
   Feb 18th 2024
   svimg.insertLayer(sName, sColor, sScale, sFile, aRange, sType, iThickness)
*/
svimg.setDensity(41).insertLayer('OliD', 'pink', 5, "/img/oliD.jpg", [0,120], 'balls');//41
//svimg.setDensity(23).insertLayer('OliD', '#99009966', 5, "/img/oliD.jpg", [0,50], 'doodles');//41
/* 
svimg.setDensity(52).createLayer('mapper', "/img/oliD.jpg",  'pink', 5, [0,50], 1, 'swivels').attr('limit', 1).setCenter(1050,750);
svimg.setDensity(61).createLayer('mapper', "/img/oliD.jpg",  'gold', 5, [0,60], 1, 'swivels').attr('limit', 2).setCenter(1050,750);
svimg.setDensity(41).createLayer('mapper', "/img/oliE.jpg",  'pink', 5, [0,60], 1, 'swivels').attr('limit', 2).setCenter(1050,750);
*/
svimg.setDensity(1).createLayer('mapper', "/img/oliC.jpg",  'teal', 5, [0,15], 0.1, 'doodles').attr('limit', 15).setCenter(1050,750);//ok
svimg.setDensity(2).createLayer('mapper', "/img/oliA.jpg",  '#00660066', 5, [0,50], 1, 'hLines').attr('limit', 26).setCenter(1050,750);//ok
svimg.setDensity(41).createLayer('mapper', "/img/oliE.jpg",  'pink', 5, [0,60], 1, 'swivels').attr('limit', 2).setCenter(1050,750);