
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
    


function rough(){
    
    roughDesign('groupC', "#eeeeee33", 980, 20);
    roughDesign('groupB', "#ff333333", 600, 400);
    roughDesign('groupZ', "#cccccc33", 900, 100);
    roughDesign('groupA', "#66666633", 800, 200);
    

}

function roughDesign(sId, sColor, iMax, iMin){
    let oLineArray = [];
    let x1 = 0;
    let y1 = 0;
    let x2 = 20;
    let y2 = 20;
    let xDir = 5;
    let yDir = 5;
    let xSeed = 800 * Math.random(1);
    let ySeed = 800 * Math.random(1);
    
    for(let i = 0; i < 1000; i++){
        x1 = x2;
        y1 = y2;

        if(x2 > iMax){
            xDir = -1;
        } else if(x2 < iMin){
            xDir = 1;
        } 

        if(y2 > iMax){
            yDir = -1;
        } else if(y2 < iMin){
            yDir = 1;
        }

        x2 += xSeed * Math.random(1) * xDir * (i/2000);
        y2 += ySeed * Math.random(1) * yDir * (i/2000);
        
        


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



rough();

//createCircle();