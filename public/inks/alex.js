/* 
   Error V0.2 
   Feb 18th 2024
   svimg.createLayer(sTransformer, sFile, sColor, sScale, aRange, iThickness, sType)
*/
svimg.setDensity(7).createLayer('mapper', "/img/mary2.jpg",  '#66000008', 5, [0,50], 3, 'doodles').attr('limit', 50).setCenter(691,673);

svimg.setDensity(3).createLayer('mapper', "/img/mary5.jpg",  '#00ff0011', 5, [0,30], 3, 'scribbles').attr('limit', 30).setCenter(691,673);


svimg.setDensity(3).createLayer('mapper', "/img/mary0.jpg",  '#00666666', 5, [0,10], 1, 'swivels').attr('limit', 8).setCenter(411,679);
svimg.setDensity(1).createLayer('mapper', "/img/mary0.jpg",  '#00666666', 5, [0,10], 1, 'swivels').attr('limit', 10).setCenter(691,673);
svimg.setDensity(17).createLayer('mapper', "/img/mary1.jpg",  '#ffff0066', 5, [0,50], 10, 'swivels').attr('limit', 20).setCenter(691,673);
svimg.setDensity(17).createLayer('mapper', "/img/mary1.jpg",  '#99000033', 5, [0,50], 1, 'swivels').attr('limit', 20).setCenter(691,673);
svimg.setDensity(34).createLayer('mapper', "/img/mary1.jpg",  '#ff000033', 5, [0,50], 3, 'swivels').attr('limit', 20).setCenter(691,673);
svimg.setDensity(1).createLayer('mapper', "/img/mary6.jpg",  '#66000022', 5, [0,2], 3, 'scribbles').attr('limit', 2).setCenter(691,673);

//svimg.setDensity(3).createLayer('mapper', "/img/alex3.jpg",  '#ffff6666', 5, [0,30], 1, 'hLines').attr('limit', 15).setCenter(1050,750);
//svimg.setDensity(1).createLayer('mapper', "/img/alex3.jpg",  '#00006666', 5, [0,7], 1, 'hLines').attr('limit', 1).setCenter(1050,750);

//svimg.setDensity(3).insertLayer('bolaC', '#00006666', 5, "/img/mary0.jpg", [0,5], 'scribbles');