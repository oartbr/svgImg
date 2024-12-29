/* 
   Error V0.2 
   Feb 18th 2024
   svimg.insertLayer(sName, sColor, sScale, sFile, aRange, sType, iThickness)
*/
svimg.setDensity(1).createLayer('mapper', "/img/sennaB.png",  '#FF00FF66', 10, [0,20], 1, 'scribbles').attr('limit', 8).setCenter(411,679);
svimg.setDensity(1).createLayer('mapper', "/img/sennaB.png",  '#FFFF0066', 10, [0,20], 1, 'scribbles').attr('limit', 15).setCenter(411,679);
svimg.setDensity(1).createLayer('mapper', "/img/sennaB.png",  '#00FFFF66', 10, [0,20], 1, 'scribbles').attr('limit', 20).setCenter(411,679);
svimg.setDensity(17).createLayer('mapper', "/img/sennaD.png",  '#00FF0022', 10, [200,1], 8, 'balls').attr('limit',-199).setCenter(411,679);