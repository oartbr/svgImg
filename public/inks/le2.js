/* 
   Error V0.2 
   Feb 18th 2024
   svimg.insertLayer(sName, sColor, sScale, sFile, aRange, sType, iThickness)
*/
svimg.insertLayer('LeA', '#00006666', 5, "/img/leF.jpg", [0,6], 'scribbles');
svimg.insertLayer('LeB', '#00006666', 5, "/img/leB.jpg", [0,10], 'scribbles');
svimg.insertLayer('LeB', '#00006666', 5, "/img/leB.jpg", [0,20], 'scribbles');
svimg.setDensity(23).insertLayer('LeC', '#66666666', 5, "/img/leC.jpg", [0,500], 'balls', 0.1);
svimg.setDensity(1).insertLayer('LeA', '#00006666', 5, "/img/leD.jpg", [0,100], 'balls', 0.1);
svimg.insertLayer('LeA', '#00006666', 5, "/img/leE.jpg", [0,100], 'balls', 0.1);