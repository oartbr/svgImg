/* 
   Error V0.2 
   Feb 18th 2024
   svimg.insertLayer(sName, sColor, sScale, sFile, aRange, sType, iThickness)
*/
svimg.setDensity(1).createLayer('mapper', "/img/oli-tui.jpg",  '#3333ff66', 5, [0,35], 1, 'scribbles').attr('limit', 26).setCenter(1050,750);
svimg.setDensity(1).createLayer('mapper', "/img/oli-tui.jpg",  '#3333ff66', 5, [0,30], 1, 'scribbles').attr('limit', 15).setCenter(1050,750);
svimg.setDensity(2).createLayer('mapper', "/img/oli-tui.jpg",  '#3333ff66', 5, [0,20], 1, 'lines').attr('limit', 5).setCenter(1050,750);