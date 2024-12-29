/* 
   Kosmo V0.2 
   Feb 18th 2024
   svimg.insertLayer(sName, sColor, sScale, sFile, aRange, sType, iThickness)
*/
svimg.setDensity(1).createLayer('mapper', "/img/kosmo.jpg",  '#00cc6666', 5, [0,20], 0.5, 'scribbles').attr('limit', 10).setCenter(411,679);
svimg.setDensity(1).createLayer('mapper', "/img/kosmo.jpg",  '#00996666', 5, [0,20], 0.5, 'scribbles').attr('limit', 5).setCenter(411,679);
svimg.setDensity(2).createLayer('mapper', "/img/kosmo.jpg",  '#00666666', 5, [0,20], 0.5, 'scribbles').attr('limit', 15).setCenter(411,679);
svimg.setDensity(32).createLayer('mapper', "/img/kosmo.jpg",  '#33006666', 5, [200,1], 0.5, 'balls').attr('limit',-198).setCenter(411,679);