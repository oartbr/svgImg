/* 
   Kosmo V0.1 
   Oct 23nd 2023
   svimg.insertLayer(sName, sColor, sScale, sFile, aRange, sType, iThickness)
*/

svimg.setDensity(1).createLayer('mapper', "/img/kosmo.jpg",  '#FF00FF66', 10, [0,20], 1, 'scribbles').attr('limit', 5).setCenter(411,679);
svimg.setDensity(1).createLayer('mapper', "/img/kosmo.jpg",  '#FFFF0066', 10, [0,20], 1, 'scribbles').attr('limit', 10).setCenter(411,679);
svimg.setDensity(1).createLayer('mapper', "/img/kosmo.jpg",  '#00FFFF66', 10, [0,20], 1, 'scribbles').attr('limit', 20).setCenter(411,679);
svimg.setDensity(17).createLayer('mapper', "/img/kosmo.jpg",  '#00FF0022', 10, [200,1], 8, 'balls').attr('limit',-198).setCenter(411,679);