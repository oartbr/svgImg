/*  this calls svimg to create the basic structure for building an svg using D3 */
svimg.getTop("my-svg", 1400, 2000);

function makePath(hStroke, iRadius, iJump, iStroke_width){
    let sUnik = svimg.makeUnik();
    let oLayer = svimg.d3.select("#my-svg")
                .append('svg')
                .attr('id', sUnik)
                .attr('class', 'downloadable')
                .attr('height', '100%')
                .attr('width', '100%');

    svimg.addLayer(oLayer, sUnik);

    let oLine = svimg.d3.line()
                .x((d,i) => d.x)
                .y((d,i) => d.y)
                .curve(svimg.d3.curveCardinal);
        
    let pathArray = [];
    let iX = 500;
    let iY = 500;
    let circX = 500;
    let circY = 600;
    let cX = 500;
    let cY = 700;
    let nPoints = 360;//10 + Math.random() * 30;
    let radius = iRadius;
    let iDirection = 1;

    let prevX = 0;
    let prevY = 0;
    console.log({iJump});
    for(let i = 0; i < nPoints * 5; i++ ){
        setTimeout(() => {
        let theta = 2 * Math.PI * i / nPoints; 
        
        circX = cX + radius * Math.cos(theta);
        circY = cY + radius * Math.sin(theta); 
        
        iX = (Math.random() * radius);
        iY = (Math.random() * radius);

        let iDistance = Math.sqrt(Math.pow(cX - iX, 2) + Math.pow(cY - iY, 2)); 

        if(iDistance > 400 && iDistance < 800){
            pathArray.push({x: circX, y: circY});
        }

        if(radius < 0){
            iDirection = iJump;
        } else if (radius > iRadius){
            iDirection = -iJump;
        }

        radius += iDirection; 
        cX += 0.03;
        
            oLayer.selectAll('path').remove();
            oLayer.append('path')
            .attr('fill', 'none')
            .attr('stroke-width', iStroke_width)
            .attr('style', "stroke:#" + hStroke) 
            .attr('d', oLine(pathArray))
            .transition()
            .duration(1000) // Duration of the animation in milliseconds
            .attr('transform', `rotate(360, ${cX}, ${cY})`);
        }, 2000);
        
    }



    $(`#${sUnik} path`).css('stroke',`#${hStroke}`);

    
}

/*  
    makePath('AAFF0099', 480, 100, 4);
    makePath(HexColor, iRadius, iJump, iStroke-width); 

    HexColor = the color of the path using Hex, including alpha (alpha is mandatory!) NO # REQUIRED
    iRadius = radius of the circle
    iJump = how many steps the process will move when the line reached the inner limit or the outer limit.
    iStroke-width = stroke with in pixels. It can be a decimal!
*/

//makePath('AAFF0099', 480, Math.random() * 100, 4);
//makePath('0047AB99', 480, Math.random() * 400, 1);
makePath('0047AB66', 480, 400, 5);
makePath('ff47AB99', 480, 400 + Math.random() * 10, 1);