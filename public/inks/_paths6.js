/*  this calls svimg to create the basic structure for building an svg using D3 */
svimg.getTop("my-svg", 1000, 1000);

class MakePath extends Generator{
    constructor(sId, hStroke, iRadius, iJump, iStroke_width){
        super(sId);

        this.hStroke = hStroke;
        this.iRadius = iRadius;
        this.iJump = iJump;
        this.iStroke_width = iStroke_width;

        return this;
    }

    generate (){
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
                    .curve(svimg.d3.curveBasis);


        let pathArray = [];
        let iX = 500; // center X
        let iY = 500; // center Y
        let circX = 0; // new pos X
        let circY = 0; // new pos Y
        let cX = 0; 
        let cY = 500;
        let nPoints = 4; // number of points in the circle
        let radius = this.iRadius; // radius
        let iDirection = 1; // 1 cw, -1 ccw

        let prevX = 0; // previous X
        let prevY = 0; // previous Y

        for(let i = 0; i < nPoints * 180; i++ ){
            
            let theta = 2 * Math.PI * i * Math.random() * 10; 

            this.iRadius = Math.random() * 10  * iDirection;

            circX = cX + this.iRadius * Math.cos(theta);
            circY = cY + this.iRadius * Math.sin(theta); 

            pathArray.push({x: circX, y: circY});
            //console.log({x: circX, y: circY, rad: this.iRadius, cos: Math.cos(theta) , iDirection});

            if (circX > 980){
                iDirection = -1;
                cY -= 10;
            } else if ( circX < 20){
                iDirection = 1;
                cY -= 10;
            }

            cX += this.iRadius;

        }

        oLayer.append('path')
                .attr('fill', 'none')
                .attr('stroke-width', this.iStroke_width)
                .attr('style', "stroke:#" + this.hStroke) 
                .attr('d', oLine(pathArray));

        $(`#${sUnik} path`).css('stroke',`#${this.hStroke}`);

        return this;

    }
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

svimg.addGenerator(new MakePath('path6', '0047AB99', 480, Math.random() * 20, 1).generate());