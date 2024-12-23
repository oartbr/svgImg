/* General functions / initial version  */
// Load image

d3.polygon = function(sides, centerX, centerY, size) {
  var points = [];
  for (var i = 0; i < sides; i++) {
    var degree = (360 / sides) * i + 30;
    var radian = Math.PI / 180 * degree;
    points.push([
      centerX + size * Math.cos(radian),
      centerY + size * Math.sin(radian)
    ].join(","));
  }
  return "M" + points.join("L") + "Z";
}


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
  const polygons = [];
  
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

        const poly = new Polygon(6, x*this.svgScale, y*this.svgScale, diameter);
        polygonContains.push(poly);
       
      }

      matrix[x][y] = { x: x*this.svgScale, y: y*this.svgScale, diameter: diameter, bid: this.bid};
      
  }


  // Create SVG container and add circles
  d3.select('svg').attr('width', canvas.width*this.svgScale).attr('height', canvas.height*this.svgScale);
  const svg = d3.select('svg').append('svg').attr('width', canvas.width*this.svgScale).attr('height', canvas.height*this.svgScale).attr("id",this.id );
  console.log(this.type);
  if (this.type == 'balls'){
    const xRan = 100 - Math.floor(Math.random() * 200);
    const yRan = 100 - Math.floor(Math.random() * 200);
    svg.selectAll('circle').data(circles).enter().append('circle')
      .attr('cx', d => d.x + xRan)
      .attr('cy', d => d.y + yRan)
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
  } else if (this.type == 'poly'){
    svg.selectAll('polygon').data(lines).enter().append('polygon')
      .attr("d", d3.polygon(6, d.x, d.x, d.diameter))
      .style('stroke', this.colorStroke)
      .style('fill', '#ff000000')
      .attr("stroke-width", this.thickness);
  }
  
  d3.select('body').append('img');
};

/* Object svimg */
window.svimg = (function (){
    function Svimg(){
      this.transformers = {};
      this.components = [];
      this.generators = [];
      this.util = {};
      const link = window.location.pathname;
      this.fileName = link.substring(link.lastIndexOf('/')+1);
      this.svg = [];
      this.layer = [];
      this.d3 = d3;
      this.ready();
    }
    Svimg.prototype = {
      ready(){
        console.log("Svimg is on babe!");
        $("body").append("<top></top>");
        $(document).ready(function() {
          this.addTransformer(new MapIm('mapIm'));
          this.addTransformer(new Orbiter('orbiter'));
          this.util = new Util();
        }.bind(this));
      },
      addTransformer(oTob){
        this.transformers[oTob.sId] = oTob;
      },
      addGenerator(oGob){
        this.generators[oGob.sId] = oGob;
      },
      reset(){
        Object.keys(this.layer).forEach(function(key) {
          this.layer[key].remove();
          delete this.layer[key];
         }.bind(this));
         this.refresh();
      },
      setUp(){

      },
      onLoad(){

      },
      refresh(){
        Object.keys(this.generators).forEach(function(key) {
          this.generators[key].generate();
         }.bind(this));
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
      insertLayer(sName, sColor, sScale, sFile, aRange, sType, iThickness, sTransformer = 'mapIm'){
        sName = this.fileName + '_' + this.makeUnik();
        this.svg[sName] = new Image();
        this.svg[sName].colorStroke = sColor;
        this.svg[sName].svgScale = sScale;
        this.svg[sName].onload = this.transformers[sTransformer].onload;
        this.svg[sName].src = "." + sFile;
        this.svg[sName].range = aRange || [0,20];
        this.svg[sName].bid = num++;
        this.svg[sName].type = sType;
        this.svg[sName].id = sName;
        this.svg[sName].thickness = iThickness || 1;
        this.svg[sName].density = this.density || 1;
        this.layer.push({sName, sColor, sScale, sFile, aRange, sType, iThickness});
        this.density = 1;// this resets density for each layer
      },
      setDensity(iDens){
        this.density = iDens;
        return this;
      },
      addLayer(oLayer, sName){
        oLayer.sName = sName;
        this.layer.push(oLayer);
      },
      button(){
        document.write('<button class="download">Download</button>');
        $("button.download").on("click", function(){
          this.generateFiles(); // this.generateDownload(); << this is the function that will generate the files to download, the current file is not 100% readable at inkScape!
        }.bind(this));
      },

      insertButton(sName, fAction){
        document.write(`<button class="${sName}">${sName}</button>`);
        $(`button.${sName}`).on("click", fAction);
      },

      /*  this gets the layers on the design, includes it on a text and calls the back-end to generate the files to download */
      generateFiles(sButtonName){
        console.log(this);
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
          $(`button.${sButtonName}`).after(downloadLink);//this gets the return from the server and creates a link for download.
        });

      },

      /*  this gets the layers on the design, includes it on a text and calls the back-end to generate the files to download */
      generateDownloads(sButtonName){
        
        const sUnik = this.makeUnik();// this will be a unik code for the file
        
        const oLayer = {}; //  creates the layer that will append all the layers
        oLayer.fileName = this.fileName + ".svg";
        oLayer.id = sUnik;
        
        this.layer.forEach(layer => {
          const element = $("svg#" + layer.sName);
          const sStroke = $("path", element).css('stroke');
          const sStrokeNoAlpha = this.rgbaToHexA(sStroke).slice(0, -2);
          $("path", element).css('stroke', sStrokeNoAlpha); // this removes the transparency from the color of the path because the files can't have any transparency to work on inkscape
          
          $("path", element).css('stroke', sStroke); // this returns the original color to the path
          //$(element).prop('width', '100%').prop('height', '100%');
          oLayer.svg += element.prop('outerHTML'); // this includes the svg and the path on a text to be sent to the server
          //console.log(this.makeUnik(), element.prop('outerHTML'));
        });

        $.post("../file/download/" + oLayer.fileName, oLayer, function(data){
          const downloadLink = $(data).addClass("downloadLink");
          $(`button.${sButtonName}`).after(downloadLink);//this gets the return from the server and creates a link for download.
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
      rgbaToHexA(rgbaString = 'rgba(0,0,0,0)') {
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
this.bid
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


class Transformer {
  constructor(sId){
    this.sId = sId;
  }
}

class MapIm extends Transformer{
  constructor(sId){
    super(sId);
  }

  onload() {
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;
    const pixelCount = pixelData.length / 4; // Each pixel has 4 values (R,G,B,A)
    const circles = [];
    const lines = [];
    const polygons = [];
    const density = this.density;
    let countDensity = 0;
    let prevDot = {x:0,y:0};
    let currentDot = {x:0,y:0};
    
    const brightnessScale = d3.scaleLinear().domain([255, 0]).range(this.range); // Linear scaling function for brightness to diameter
    for (let i = 0; i < pixelCount; i++) {
        const R = pixelData[i * 4]; // Red value of pixel i
        const G = pixelData[i * 4 + 1]; // Green value of pixel i
        const B = pixelData[i * 4 + 2]; // Blue value of pixel i
        countDensity++;


        const brightness = 0.2126 * R + 0.7152 * G + 0.0722 * B; // Calculate brightness of pixel i
        const diameter = brightnessScale(brightness); // Map brightness to circle diameter
        const x = i % canvas.width; // Calculate x position of circle

        if(typeof matrix[x] == 'undefined'){
          matrix[x] = [];
        }

        const y = Math.floor(i / canvas.width); // Calculate y position of circle


        if (diameter > 1 && countDensity % density == 0) {
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
    
    if (this.type == 'balls'){
     
      svg.selectAll('circle').data(circles).enter().append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => (d.diameter / 4))
        .style('stroke', this.colorStroke)
        .style('fill', '#ff000000')
        .attr("stroke-width", this.thickness);
        //.attr('fill', d => `rgb(${pixelData[d.y * canvas.width * 4 + d.x * 4]}, ${pixelData[d.y * canvas.width * 4 + d.x * 4 + 1]}, ${pixelData[d.y * canvas.width * 4 + d.x * 4 + 2]})`);
    } else if (this.type == 'doodles'){
     
      svg.selectAll('circle').data(circles).enter().append('circle')
        .attr('cx', d => d.x + 3 - Math.floor(Math.random() * 6))
        .attr('cy', d => d.y + 3 - Math.floor(Math.random() * 6))
        .attr('r', d => (d.diameter / 4))
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
    }  else if (this.type == 'scribbles'){
      svg.selectAll('line').data(lines).enter().append('line')
        .attr('x1', d => d.x + d.bid + 10 - Math.floor(Math.random() * 20))
        .attr('y1', d => d.y + 3 - Math.floor(Math.random() * 6))
        .attr('x2', d => d.x + d.diameter + 10 - Math.floor(Math.random() * 20))
        .attr('y2', d => d.y + d.diameter + 3 - Math.floor(Math.random() * 6))
        .style('stroke', this.colorStroke)
        .style('fill', '#ff000000')
        .attr("stroke-width", this.thickness);
    } else if (this.type == 'wavels'){
      function wavel(oD, bEnd){
        if(prevDot.x == 0 && prevDot.y == 0){ // se for zero, seta o valor de partida. Isto só pode acontecer uma vez, logo no inicio.
          prevDot.x = oD.x + oD.bid + 10 - Math.floor(Math.random() * 20);
          prevDot.y = oD.y + 3 - Math.floor(Math.random() * 6);
        }         
        if (bEnd){ // se for o fim da linha, calcula onde deveria ser e muda o valor de prevDot.
          prevDot.x = oD.x + oD.diameter + 10 - Math.floor(Math.random() * 20);
          prevDot.y = oD.y + oD.diameter + 3 - Math.floor(Math.random() * 6);
        }
        oD.x = prevDot.x; // muda o valor de oD para o valor de prevDot
        oD.y = prevDot.y; // se não é o final da linha, prevDot estaria no valor anterior e não mudamos eles. Isto é, o início da linha é igual ao final da anterior.
        
        return oD; // retorna o valor de oD
      }

      svg.selectAll('line').data(lines).enter().append('line')
      .attr('x1', d => {
        const start = wavel(d, false);
        return start.x;
      })
      .attr('y1', d => {
          const start = wavel(d, false);
          return start.y;
      })
      .attr('x2', d => {
          const end = wavel(d, true);
          return end.x;
      })
      .attr('y2', d => {
          const end = wavel(d, true);
          return end.y;
      })
        .style('stroke', this.colorStroke)
        .style('fill', '#ff000000')
        .attr("stroke-width", this.thickness);
      

      
    } else if (this.type == 'overlapper'){
      svg.selectAll('line').data(lines).enter().append('line')
        .attr('x1', d => d.x + d.bid + 10 - Math.floor(Math.random() * 20))
        .attr('y1', d => d.y + 3 - Math.floor(Math.random() * 6))
        .attr('x2', d => d.x + d.diameter + 10 - Math.floor(Math.random() * 20))
        .attr('y2', d => d.y + d.diameter + 3 - Math.floor(Math.random() * 6))
        .style('stroke', this.colorStroke)
        .style('fill', '#ff000000')
        .attr("stroke-width", this.thickness);
    } else if (this.type == 'poly'){
      svg.selectAll('polygon').data(polygon).enter().append('polygon')
        .attr("d", d3.polygon(6, d.x, d.x, d.diameter))
        .style('stroke', this.colorStroke)
        .style('fill', '#ff0000ff')
        .attr("stroke-width", this.thickness);
    }

        // square for alignment
        svg.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 5) // Set the width of the square
          .attr('height', 5) // Set the height of the square
          .style('stroke', '#ff0000')
          .style('fill', 'none')
          .attr("stroke-width", 0.1);
        svg.append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 5) // Set the width of the square
          .style('stroke', '#ff0000')
          .style('fill', 'none')
          .attr("stroke-width", 0.1);
    
    d3.select('body').append('img');

    return matrix
  }
}

class Orbiter extends Transformer{
  constructor(sId){
    super(sId);
    this.element = svimg.getTop("my-svg", 2500, 2500);
  }

  onload() {
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
        //const A = pixelData[i * 4 + 3]; // Alpha value of pixel i


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
    svimg.transformers['orbiter'].makePath('0047AB66', 1250, 1, 0.5, matrix, this.svgScale, canvas.width, canvas.height);

    
    d3.select('body').append('img');
    return matrix
  }

  makePath(hStroke, iRadius, iJump, iStroke_width, oMatrix, iScale, canvas_width, canvas_height){
    let sUnik = svimg.makeUnik();
    let oLayer = svimg.d3.select("#my-svg")
                .append('svg')
                .attr('id', sUnik)
                .attr('class', 'downloadable')
                .attr('height', '100%')
                .attr('width', '100%');
    console.log({iJump, iScale, canvas_width, canvas_height});
    svimg.addLayer(oLayer, sUnik);

    let oLine = svimg.d3.line()
                .x((d,i) => d.x)
                .y((d,i) => d.y)
                .curve(svimg.d3.curveCardinal);
        
    let pathArray = [];
    let iX = 0;
    let iY = 0;
    let circX = 500;
    let circY = 600;
    let cX = 1250;
    let cY = 1250;
    let nPoints = 360;//10 + Math.random() * 30;
    let radius = 1;
    let iDirection = -1;

    let prevX = 0;
    let prevY = 0;

    for(let i = 0; i < nPoints * 80; i++ ){
      setTimeout(() => {
        let theta = 2 * Math.PI * i / nPoints; 
        let iDiam = (i % 2 === 1) ? 1: -1;
        circX = cX + radius * Math.cos(theta);
        circY = cY + radius * Math.sin(theta); 

        
        iX = cX + (radius + iDiam * oMatrix[parseInt(circX/10)][parseInt(circY/10)]['diameter']) * Math.cos(theta);
        iY = cY + (radius + iDiam * oMatrix[parseInt(circX/10)][parseInt(circY/10)]['diameter']) * Math.sin(theta);

        pathArray.push({x: iX, y: iY});

        //pathArray.push({x: circX, y: circY});

        console.log({r:((radius/iRadius) * 100).toFixed(2) +'%'});

        if(radius < 0){
          iDirection = iJump/25;
        } else if (radius > iRadius){
          radius = iRadius;
        }

        radius += iDirection; 

        oLayer.selectAll('path').remove();
            oLayer.append('path')
            .attr('fill', 'none')
            .attr('stroke-width', iStroke_width)
            .attr('style', "stroke:#" + hStroke) 
            .attr('d', oLine(pathArray))
            .transition()
            .duration(1000) // Duration of the animation in milliseconds
            .attr('transform', `rotate(360, ${cX}, ${cY})`);
        }, 0);
    }

    $(`#${sUnik} path`).css('stroke',`#${hStroke}`);
    
  }
}


class Generator {
  constructor(sId){
    this.sId = sId;
    return this;
  }

  generate(){

    return this;
  }
}


class Component {
  constructor(sId){
    this.sId = sId;
  }
}

class Util {
  constructor(sId){
    this.sId = sId;
  }
}

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
