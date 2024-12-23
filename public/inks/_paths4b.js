/*  this calls svimg to create the basic structure for building an svg using D3 */
svimg.getTop("my-svg", 1000, 1000);

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
                .curve(svimg.d3.curveCatmullRom.alpha(0));


    let pathArray = [];
    let iX = 500;
    let iY = 500;
    let circX = 500;
    let circY = 500;
    let cX = 0;
    let cY = 10;
    let nPoints = 10 + Math.random() * 30;
    let radius = iRadius;
    let iDirection = 1;

    let prevX = 0;
    let prevY = 0;

    for(let i = 0; i < 1000; i+=10 ){
        
        circX = i;
        circY = (circY > 1) ? circY * -1 : Math.random() * 5;
        pathArray.push({x: circX, y: cY + circY});

        

    }

    oLayer.append('path')
            .attr('fill', 'none')
            .attr('stroke-width', iStroke_width)
            .attr('style', "stroke:#" + hStroke) 
            .attr('d', oLine(pathArray));

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
makePath('0047AB99', 450, Math.random() * 10, 1);