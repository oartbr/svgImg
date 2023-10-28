/* General functions / initial version  */
// Load image
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let images = [];
let num = 1;
const matrix = [];
var json = [];

const onload = function() {
  canvas.width = this.width;
  canvas.height = this.height;
  ctx.drawImage(this, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixelData = imageData.data;
  const pixelCount = pixelData.length / 4; // Each pixel has 4 values (R,G,B,A)
  const circles = [];
  const lines = [];
  
  const brightnessScale = d3.scaleLinear().domain([255, 0]).range(this.range); // Linear scaling function for brightness to diameter
  for (let i = 0; i < pixelCount; i++) {
      const R = pixelData[i * 4]; // Red value of pixel i
      const G = pixelData[i * 4 + 1]; // Green value of pixel i
      const B = pixelData[i * 4 + 2]; // Blue value of pixel i
      


      const brightness = 0.2126 * R + 0.7152 * G + 0.0722 * B; // Calculate brightness of pixel i
      const diameter = brightnessScale(brightness); // Map brightness to circle diameter
      const x = i % canvas.width; // Calculate x position of circle

      if(typeof matrix[x] == 'undefined'){
        matrix[x] = [];
      }

      const y = Math.floor(i / canvas.width); // Calculate y position of circle


      if (diameter > 1) {
        const circle = { x: x*this.svgScale, y: y*this.svgScale, diameter: diameter, pixelData: pixelData[i]};
        circles.push(circle);

        const line = { x: x*this.svgScale, y: y*this.svgScale, diameter: diameter, bid: this.bid};
        lines.push(line);
      }

      matrix[x][y] = { x: x*this.svgScale, y: y*this.svgScale, diameter: diameter, bid: this.bid};
      
  }


  // Create SVG container and add circles
  d3.select('svg').attr('width', canvas.width*this.svgScale).attr('height', canvas.height*this.svgScale);
  const svg = d3.select('svg').append('svg').attr('width', canvas.width*this.svgScale).attr('height', canvas.height*this.svgScale).attr("id",this.id );
  console.log(this.type);
  if(this.type == 'balls'){
    svg.selectAll('circle').data(circles).enter().append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.diameter / 4)
      .style('stroke', this.colorStroke)
      .style('fill', '#ff000000')
      .attr("stroke-width", 1);
      //.attr('fill', d => `rgb(${pixelData[d.y * canvas.width * 4 + d.x * 4]}, ${pixelData[d.y * canvas.width * 4 + d.x * 4 + 1]}, ${pixelData[d.y * canvas.width * 4 + d.x * 4 + 2]})`);
  } else if(this.type == 'lines'){
    svg.selectAll('line').data(lines).enter().append('line')
      .attr('x1', d => d.x + d.bid)
      .attr('y1', d => d.y)
      .attr('x2', d => d.x + d.diameter - d.bid)
      .attr('y2', d => d.y + d.diameter)
      .style('stroke', this.colorStroke)
      .style('fill', '#ff000000')
      .attr("stroke-width", 1);
  }
  
  d3.select('body').append('img');
};

function svgImage(sName, sColor, sScale, sFile, aRange, sType){
  images[sName] = new Image();
  images[sName].colorStroke = sColor;
  images[sName].svgScale = sScale;
  images[sName].onload = onload;
  images[sName].src = "." + sFile;
  images[sName].range = aRange || [0,20];
  images[sName].bid = num++;
  images[sName].type = sType;
  images[sName].id = sName;
  json.push({layer: {sName, sColor, sScale, sFile, aRange, sType}});
  //console.log(images);
}


/* Object svimg */
window.svimg = (function (){
    function Svimg(){
      this.svg = [];
      this.setUp();
    }
    Svimg.prototype = {
      setUp(){
        console.log("Svimg is on babe!");
        $("body").append("<top></top>");
      },
      onLoad(){

      },
      refresh(){
 
      },
      newSvg(sID, oOwner){
        let oSvg = new SVG(sID, oOwner);
        this.svg.push(oSvg);
        return oSvg;
      },
      getView(){
        //img.crossOrigin = "Anonymous";
        //const url = "https://chrome-cors-testing.s3.eu-central-1.amazonaws.com/hacksoft.svg";

        
        const link = window.location.pathname;
        const fileName = link.substring(link.lastIndexOf('/')+1);
        const url = svimg.base + "view/" + fileName + ".js";

        console.log(fileName);
        if(typeof fileName == 'string' && fileName != 'show'){
          $.getScript(url)
              .done(function(script, textStatus) {
                console.log(url + " script loaded!");
                return true;
              })
              .fail(function(jqxhr, settings, exception) {
                console.error("Error loading script:", exception);
                return false;
              });
  
        } else {
          return false;
        }

        return true;

      }  
    }

    class SVG{
      constructor(sID, oOwner){
        this.sID = sID;
        this.el = $(`<svg id="${this.sID}"></svg>`);
        $(oOwner).append(this.el);
        return this;
      }
      
      setup(){

      }

      resize(iWidth, iHeight){
        $(this.el).attr("width", iWidth);
        $(this.el).attr("height", iHeight);
      }

    }

    class shape{
      constructor(sID, oOwner){
        this.sID = sID;
        this.oOwner = oOwner;
        this.el = $(`<svg id="${this.sID}"></svg>`);
        return this;
      }

    }

    class hexagon extends shape{
      constructor(x, y, r, sID, oOwner){
        super(sID, oOwner);
        this.shape = this.create(x, y, r, this.oOwner);
      }

      // Create a Hexagon, it needs Center coordinates and a radius
      create (cx, cy, r, oOwner){
        // Calculate the vertices for the hexagon
        const hexagonVertices = Array.from({length: 6}).map((_, i) => {
            const angle = 2 * Math.PI / 6 * i;
            return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
        });

        // Draw the hexagon using a path
        const hexagonPath = `M${hexagonVertices[0][0]},${hexagonVertices[0][1]}` + 
                            hexagonVertices.slice(1).map(p => `L${p[0]},${p[1]}`).join(" ") + 
                            "Z";

        return hexagonPath;
      }
    }
  
    if(window.top == window.self){
     return new Svimg();
    }


  
  }());