function createCircle() {
    canvas.width = 1000;
    canvas.height = 1000;
    const svgScale = 5;
    const circles = [];
    const lines = [];
    
    const brightnessScale = d3.scaleLinear().domain([255, 0]).range([1,10]); // Linear scaling function for brightness to diameter
    for (let i = 0; i < 100; i++) {

        const circle = { x: i*svgScale, y: i*svgScale, diameter: i*10, id: "t" + i};
        circles.push(circle);
        
    }
  
    // Create SVG container and add circles
    d3.select('svg').attr('width', canvas.width*5).attr('height', canvas.height*5);
    const svg = d3.select('svg').append('svg').attr('width', canvas.width*5).attr('height', canvas.height*5).attr("id",this.id );

    if (true){
      svg.selectAll('circle').data(circles).enter().append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.diameter / 4)
        .style('stroke', "#000000")
        .style('fill', '#ff000000')
        .attr("stroke-width", this.thickness);
        //.attr('fill', d => `rgb(${pixelData[d.y * canvas.width * 4 + d.x * 4]}, ${pixelData[d.y * canvas.width * 4 + d.x * 4 + 1]}, ${pixelData[d.y * canvas.width * 4 + d.x * 4 + 2]})`);
    }
    
    d3.select('body').append('img');

    /* 
    
    expriment 2
    
    */

    const ctx = canvas.getContext('2d');

    // Wave parameters
    const amplitude = 40; // Height of wave
    const frequency = 0.05; // How many waves in the canvas width
    const phaseShift = 0; // Phase shift of the wave

    // Drawing the wave
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    for (let x = 0; x < canvas.width; x++) {
        let y = canvas.height / 2 + amplitude * Math.sin(frequency * x + phaseShift);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
  };


/*
this function has the basic structure of building an svg using D3
*/
function createWave(){
    const oArray = [];
    let iX = 0;
    let iY = 0;
    let iVariable = 20;
    let bDirection = true;

    for(let i = 0; i < 100; i++){
        oArray.push(i);
    }

    d3.select("#my-svg")
      .attr('height', '1000')
      .attr('width', '1000');
    
    let oLayer = d3.select("#my-svg")
                    .append('svg')
                    .attr('height', '100%')
                    .attr('width', '100%');
    
    oLayer.selectAll('rect')
          .data(oArray)
          .enter().append('rect')
            .attr('height', ( d, i ) => 1 * d)
            .attr('width', ( d, i ) => d * i / 500 )
            .attr('x', ( d, i ) => d * i / 10 )
            .attr('y', ( d, i ) => 500 - (d * i / 30 ));



    oLayer.selectAll('circle.group1')
            .data(oArray)
            .enter().append('circle')
                .attr('class', 'group1')
                .attr('cx', ( d, i ) => findPlace(d, i))
                .attr('cy', ( d, i ) => (d * i / 20 ))
                .attr('r', ( d, i ) => d * i / 100 )
                .attr('fill', "#00000000" )
                .attr('stroke', "#ff0000" );

    oLayer.selectAll('circle.group2')
            .data(oArray)
            .enter().append('circle')
                .attr('class', 'group2')
                .attr('cx', ( d, i ) => findPlace(d, i))
                .attr('cy', ( d, i ) => (d * i / 15 ))
                .attr('r', ( d, i ) => d * i / 90 )
                .attr('fill', "#00000000" )
                .attr('stroke', "#00ff00" );

    oLayer.selectAll('ellipse.group3')
                .data(oArray)
                .enter().append('ellipse')
                    .attr('class', 'group3')
                    .attr('cx', ( d, i ) => 100 + findPlace(d, i))
                    .attr('cy', ( d, i ) => (d * i / 25 ))
                    .attr('rx', ( d, i ) => d * i / 90 )
                    .attr('ry', ( d, i ) => d * i / 30 )
                    .attr('fill', "#00000000" )
                    .attr('stroke', "#00ffff" );
    
 

    function findPlace(d,i){
        bDirection = (iVariable > 500) ?  false : true; 
        iVariable +=  (bDirection) ? (d * 2) + 30 : -((d * 2) + 30); 
        return iVariable;
    }

    function roughDesign(sId, sColor){
        let oLineArray = [];
        let x1 = 0;
        let y1 = 0;
        let x2 = 50;
        let y2 = 50;
        let xDir = 5;
        let yDir = 5;
        let xSeed = 50 * Math.random(1);
        let ySeed = 50 * Math.random(1);
        
        for(let i = 0; i < 15000; i++){
            x1 = x2;
            y1 = y2;
    
            if(x2 > 950){
                xDir = -1;
            } else if(x2 < 50){
                xDir = 1;
            } 
    
            if(y2 > 950){
                yDir = -1;
            } else if(y2 < 50){
                yDir = 1;
            }
    
            x2 += xSeed * Math.random(5) * xDir;
            y2 += ySeed * Math.random(5) * yDir;
            
            oLineArray.push({i, x1, x2, y1, y2});
        }
    
        oLayer.selectAll('line.' + sId)
                        .data(oLineArray)
                        .enter().append('line')
                            .attr('class', sId)
                            .attr('x1', ( d, i ) => d.x1 )
                            .attr('y1', ( d, i ) => d.y1 )
                            .attr('x2', ( d, i ) => d.x2 )
                            .attr('y2', ( d, i ) => d.y2)
                            .attr('fill', "#00000000" )
                            .attr('stroke', sColor );
    }

    roughDesign('groupA', "#6666ff");
    roughDesign('groupZ', "#ff6666");

}



createWave();

//createCircle();