/* 
   Error V0.2 
   Feb 18th 2024
   svimg.insertLayer(sName, sColor, sScale, sFile, aRange, sType, iThickness)
*/
svimg.setDensity(31).createLayer('mapper', "/img/frida3.jpg",  '#66FF0033', 5, [0,250], 3, 'doodles').attr('limit', 250).setCenter(691,673);
svimg.setDensity(33).createLayer('mapper', "/img/frida3.jpg",  '#ffFF0033', 5, [0,350], 3, 'doodles').attr('limit', 250).setCenter(691,673);
svimg.setDensity(1).createLayer('mapper', "/img/frida1.jpg",  '#0000ff33', 5, [0,20], 1, 'hLines').attr('limit', 7).setCenter(691,673);
svimg.setDensity(1).createLayer('mapper', "/img/frida1.jpg",  '#0000ff33', 5, [0,10], 0.5, 'scribbles').attr('limit', 5).setCenter(691,673);
svimg.setDensity(1).createLayer('mapper', "/img/frida1.jpg",  '#0000ff33', 5, [0,25], 1, 'scrobbles').attr('limit', 18).setCenter(691,673);
svimg.setDensity(1).createLayer('mapper', "/img/frida1.jpg",  '#0000ff33', 5, [0,15], 1, 'scrobbles').attr('limit', 5).setCenter(691,673);
svimg.setDensity(1).createLayer('mapper', "/img/frida1.jpg",  '#0000ff33', 5, [0,25], 1, 'scrobbles').attr('limit', 8).setCenter(691,673);
svimg.setDensity(1).createLayer('mapper', "/img/frida1.jpg",  '#0000ff33', 5, [0,15], 1, 'scrobbles').attr('limit', 12).setCenter(691,673);
