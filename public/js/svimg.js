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
  if (this.type == 'balls'){
    svg.selectAll('circle').data(circles).enter().append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.diameter / 4)
      .style('stroke', this.colorStroke)
      .style('fill', '#ff000000')
      .attr("stroke-width", this.thickness);
      //.attr('fill', d => `rgb(${pixelData[d.y * canvas.width * 4 + d.x * 4]}, ${pixelData[d.y * canvas.width * 4 + d.x * 4 + 1]}, ${pixelData[d.y * canvas.width * 4 + d.x * 4 + 2]})`);
  } else if (this.type == 'lines'){
    svg.selectAll('line').data(lines).enter().append('line')
      .attr('x1', d => d.x + d.bid)
      .attr('y1', d => d.y)
      .attr('x2', d => d.x + d.diameter - d.bid)
      .attr('y2', d => d.y + d.diameter)
      .style('stroke', this.colorStroke)
      .style('fill', '#ff000000')
      .attr("stroke-width", this.thickness);
  }
  
  d3.select('body').append('img');
};

/* Object svimg */
window.svimg = (function (){
    function Svimg(){
      this.fileName = '';
      this.svg = [];
      this.layer = [];
      this.d3 = d3;
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
                svimg.fileName = fileName; 
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

      },
      insertLayer(sName, sColor, sScale, sFile, aRange, sType, iThickness){
        this.svg[sName] = new Image();
        this.svg[sName].colorStroke = sColor;
        this.svg[sName].svgScale = sScale;
        this.svg[sName].onload = onload;
        this.svg[sName].src = "." + sFile;
        this.svg[sName].range = aRange || [0,20];
        this.svg[sName].bid = num++;
        this.svg[sName].type = sType;
        this.svg[sName].id = sName;
        this.svg[sName].thickness = iThickness || 1;
        this.layer.push({sName, sColor, sScale, sFile, aRange, sType, iThickness});
      },
      addLayer(oLayer, sName){
        oLayer.sName = sName;
        this.layer.push(oLayer);
      },
      button(){
        document.write('<button class="download">Download</button>');
        $("button.download").on("click", function(){
          this.generateFiles();
        }.bind(this));
      },

      /*  this gets the layers on the design, includes it on a text and calls the back-end to generate the files to download */
      generateFiles(){
        const sUnik = this.makeUnik();// this will be a unik code for the file
        
        const oLayer = {}; //  creates the layer that will append all the layers
        oLayer.fileName = this.fileName + ".svg";
        oLayer.id = sUnik;

        this.layer.forEach(layer => {
          const element = $("svg#" + layer.sName);
          const sStroke = $("path", element).css('stroke');
          const sStrokeNoAlpha = this.rgbaToHexA(sStroke).slice(0, -2);

          $("path", element).css('stroke', sStrokeNoAlpha); // this removes the transparency from the color of the path because the files can't have any transparency to work on inkscape
          oLayer.svg += element.html(); // this includes the svg and the path on a text to be sent to the server
          $("path", element).css('stroke', sStroke); // this returns the original color to the path
        });

        $.post("../file/download/" + oLayer.fileName, oLayer, function(data){
          const downloadLink = $(data).addClass("downloadLink");
          $("button.download").after(downloadLink);//this gets the return from the server and creates a link for download.
        });

      },

      makeUnik(iLength) {
        // Define the characters to include in the code
        // Exclude 'l' and 'O' by omitting them from the respective character ranges
        const sChars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ0123456789';
        
        // Initialize an empty string for the code
        let sCode = '';
        
        // Generate a 5-character code
        for (let i = 0; i < (iLength || 5); i++) {
          // Select a random character from 'chars' and append it to 'code'
          const iRandomIndex = Math.floor(Math.random() * sChars.length);
          sCode += sChars.charAt(iRandomIndex);
        }
        
        return sCode;
      },

      /*  this calls svimg to create the basic structure for building an svg using D3 */
      getTop(sId, iHeight, iWidth) {
        this.d3.select("#" + sId)
                  .attr('height', iHeight + '')
                  .attr('width', iWidth + '');
        return true;
      },

      /*  this translates a string rgba(0,0,0,0) to a hex #00000000 < with alpha channel */
      rgbaToHexA(rgbaString) {
        // Extract RGBA values from the string
        const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)/);
        if (!match) {
            throw new Error('Invalid RGBA color string');
        }
        
        // Parse RGBA values
        const [r, g, b, a] = match.slice(1).map(Number);
    
        // Convert each component to HEX and pad with 0 if necessary
        const toHex = c => ('0' + c.toString(16)).slice(-2);
        // Convert the alpha from 0-1 to 0-255 then to HEX
        const alphaHex = toHex(Math.round(a * 255));
    
        return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
      }
      
  
    }
    
    class Line{
      constructor(){
        
      }
    }

    class SVG {
      constructor(sID, oOwner){
        this.sID = sID;
        this.el = $(`<svg id="${this.sID}"></svg>`);
        $("#" + oOwner).append(this.el);

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


  const waver = function() {
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
    if (this.type == 'balls'){
      svg.selectAll('circle').data(circles).enter().append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.diameter / 4)
        .style('stroke', this.colorStroke)
        .style('fill', '#ff000000')
        .attr("stroke-width", 1);
        //.attr('fill', d => `rgb(${pixelData[d.y * canvas.width * 4 + d.x * 4]}, ${pixelData[d.y * canvas.width * 4 + d.x * 4 + 1]}, ${pixelData[d.y * canvas.width * 4 + d.x * 4 + 2]})`);
    } else if (this.type == 'lines'){
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