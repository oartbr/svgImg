
/*
this function has the basic structure of building an svg using D3
*/

d3.select("#my-svg")
      .attr('height', '1000')
      .attr('width', '1000');
    
let oLayer = d3.select("#my-svg")
                .append('svg')
                .attr('height', '100%')
                .attr('width', '100%');
    
let line = d3.line()
                .x((d,i) => d.x)
                .y((d,i) => d.y)
                .curve(d3.curveCardinal);

function makePath(hStroke, iRadius, iJump, iStroke_width){
    let pathArray = [];
    let iX = 500;
    let iY = 500;
    let circX = 500;
    let circY = 500;
    let cX = 500;
    let cY = 500;
    let nPoints = 10 + Math.random() * 30;
    let radius = iRadius;
    let iDirection = 1;

    let prevX = 0;
    let prevY = 0;
    console.log({iJump});

    for(let i = 0; i < nPoints * 120; i++ ){
        
        let theta = 2 * Math.PI * i / nPoints; 
        
        circX = cX + radius * Math.cos(theta);
        circY = cY + radius * Math.sin(theta); 
        
        iX = (Math.random(i) * radius);
        iY = (Math.random(i) * radius);

        let iDistance = Math.sqrt(Math.pow(cX - iX, 2) + Math.pow(cY - iY, 2)); 
        let iPrevDistance = Math.sqrt(Math.pow(prevX - iX, 2) + Math.pow(prevY - iY, 2));

        if(iDistance < 400){
            //pathArray.push({x: iX, y: iY });
        } else {
            pathArray.push({x: circX, y: circY});
        }
        
        prevX = iX;
        prevY = iY;

        if(radius < 0){
            iDirection = iJump;
        } else if (radius > iRadius){
            iDirection = -iJump;
        }

        radius += iDirection; 
        
    }

    oLayer.append('path')
            .attr('d', line(pathArray))
            .attr('fill', 'none')
            .attr('stroke', hStroke)
            .attr('stroke-width', iStroke_width);
}


//makePath('#66666666', 400);
//makePath('#0000ff33', 480, Math.random() * 10);

//makePath('#00000066', 450, Math.random() * 100);
makePath('#FF00F366', 480, 50 + (Math.random() * 50), 4);
makePath('#AAFF0099', 480, Math.random() * 100, 4);
makePath('#0047AB99', 480, Math.random() * 20, 1);