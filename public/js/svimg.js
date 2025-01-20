/* General functions / initial version  */

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
          this.addTransformer('mapIm', MapIm);
          this.addTransformer('mapper', Mapper);
          this.addTransformer('orbiter', Orbiter);
          this.util = new Util();
        }.bind(this));
      },
      addTransformer(sId, oTob){
        //this.transformers[oTob.sId] = oTob;
        this.transformers[sId] = oTob;
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
      addLayerButton(sID, oOwner){
        const oButton = $("<div class='layerButton' id='" + sID + "_control'>" + sID + "</div>");
        oButton.attr('title', oOwner.colorStroke + " > " + oOwner.type );
        $(".layerButtons").append(oButton);

        $(oButton).on("click", function(){
          $("svg#" + oOwner.id).toggleClass("inactive");
          $(this).toggleClass("inactive");
        });
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
        const transformer = this.transformers[sTransformer];
        
        this.svg[sName] = new Image();
        this.svg[sName].transformer = new transformer(sName);
        this.svg[sName].colorStroke = sColor;
        this.svg[sName].svgScale = sScale;
        this.svg[sName].onload = this.svg[sName].transformer.onload;
        this.svg[sName].src = "." + sFile;
        this.svg[sName].range = aRange || [0,20];
        this.svg[sName].bid = num++;
        this.svg[sName].type = sType;
        this.svg[sName].id = sName;
        this.svg[sName].thickness = iThickness || 1;
        this.svg[sName].density = this.density || 1;
        this.svg[sName].center = this.center || {x:0, y:0};
        this.layer.push({sName, sColor, sScale, sFile, aRange, sType, iThickness});
        this.density = 1;// this resets density for each layer
        this.addLayerButton(sName, this.svg[sName]);
        return this.svg[sName].transformer;
      },
      createLayer(sTransformer, sFile, sColor, sScale, aRange, iThickness, sType){
        sName = this.fileName + '_' + this.makeUnik();
        const transformer = this.transformers[sTransformer];

        this.svg[sName] = new Image();
        this.svg[sName].transformer = new transformer(sName);
        this.svg[sName].colorStroke = sColor;
        this.svg[sName].svgScale = sScale;
        this.svg[sName].onload = this.svg[sName].transformer.onload;
        this.svg[sName].src = "." + sFile;
        this.svg[sName].range = aRange || [0,20];
        this.svg[sName].bid = num++;
        this.svg[sName].type = sType;
        this.svg[sName].id = sName;
        this.svg[sName].thickness = iThickness || 1;
        this.svg[sName].density = this.density || 1;
        this.layer.push({sName, sColor, sScale, sFile, aRange, sType, iThickness});
        this.density = 1;// this resets density for each layer
        this.addLayerButton(sName, this.svg[sName], this.svg[sName] );
        return this.svg[sName].transformer;
      },
      setDensity(iDens){
        this.density = iDens;
        return this;
      },
      setCenter(x,y){
        this.center = {x,y};
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
        const sFileName = this.fileName;
        
        this.layer.forEach(layer => {
          
          const oLayer = {}; //  creates the layer that will append all the layers
          oLayer.fileName = layer.sName + ".svg";
          oLayer.id = sFileName;
          
          const element = $("svg#" + layer.sName);
          const sStroke = $("path", element).css('stroke');
          const sStrokeNoAlpha = this.rgbaToHexA(sStroke).slice(0, -2);
          
          $("path", element).css('stroke', sStrokeNoAlpha); // this removes the transparency from the color of the path because the files can't have any transparency to work on inkscape
          $("path", element).css('stroke', sStroke); // this returns the original color to the path

          //$(element).prop('width', '100%').prop('height', '100%');
          oLayer.svg += element.prop('outerHTML'); // this includes the svg and the path on a text to be sent to the server
          
          //console.log(this.makeUnik(), element.prop('outerHTML'));
          if(!element.hasClass("inactive")){ 
            $.post("../file/download/" + oLayer.fileName, oLayer, function(data){
              const downloadLink = $(data).addClass("downloadLink");
              $(`button.${sButtonName}`).after(downloadLink);//this gets the return from the server and creates a link for download.
            });
          }
        });

      },

      // this should create a thumbnail for the design, so we can have a dashboard with the latest inks.
      generateThumbnail(){
        const element = document.querySelector("svg#" + "my-svg");
        const sFileName = this.fileName;
        if (!element) {
            console.error(`Element svg#${layer.sName} not found`);
            return;
        }
        /*
        const sStroke = element.querySelector("path").style.stroke;
        const sStrokeNoAlpha = this.rgbaToHexA(sStroke).slice(0, -2);

        element.querySelectorAll("path").forEach(path => {
          path.style.stroke = sStrokeNoAlpha; // this removes the transparency from the color of the path because the files can't have any transparency to work on inkscape
          path.style.stroke = sStroke; // this returns the original color to the path
        });
*/
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(element);

        //const  = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = "data:image/svg+xml;base64," + btoa(svgString);

        img.onload = function() {
          const maxWidth = 250;
          const maxHeight = 250;
          let width = img.width;
          let height = img.height;

          // Calculate the aspect ratio
          const aspectRatio = width / height;

              
          // Adjust width and height to fit within the 250x250 box
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
                width = maxWidth;
                height = maxWidth / aspectRatio;
            } else {
                height = maxHeight;
                width = maxHeight * aspectRatio;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const thumbnail = canvas.toDataURL("image/png").split(',')[1]; // Get base64 part
      
          $.post("../file/makeThumbnail/" + sFileName + ".png", { thumbnail }, function(data) {
              const downloadLink = $(data).addClass("downloadLink");
              $(`button.${sButtonName}`).after(downloadLink); // this gets the return from the server and creates a link for download.
              console.log(downloadLink);
          });

        };
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

  attr(sAttribute, sValue){
    if(sValue){
      this[sAttribute] = sValue;
    } else {
      return this[sAttribute];
    }
    return this;
  }

}

class MapIm extends Transformer{
  constructor(sId){
    super(sId);
    this.type = 'mapIm';
  }

  onload() {
    function findDirection(x1, y1, x2, y2){
      return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; // returns the angle in degrees
    }
  
    function traceSwivel(x,y,angle, length){
      const x2 = x + length * Math.cos(angle * Math.PI / 180);
      const y2 = y + length * Math.sin(angle * Math.PI / 180);
      return {x1: x, y1: y, x2: x2, y2: y2};
    }
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;
    const pixelCount = pixelData.length / 4; // Each pixel has 4 values (R,G,B,A)
    const circles = [];
    const lines = [];
    const swivels = [];
    const polygons = [];
    const density = this.density;
    let countDensity = 0;
    let prevDot = {x:0,y:0};
    let currentDot = {x:0,y:0};
    let direction = 0;
    let swivel = 0;
    const center = this.center;
    
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
        
        direction = findDirection(x*this.svgScale, y*this.svgScale, this.center.x, this.center.y);
        swivel = traceSwivel(x*this.svgScale + 3 - Math.floor(Math.random() * 6), y*this.svgScale + 3 - Math.floor(Math.random() * 6), direction, diameter);

        if (diameter > 1 && countDensity % density == 0) {
          const circle = { x: x*this.svgScale, y: y*this.svgScale, diameter: diameter, pixelData: pixelData[i]};
          circles.push(circle);
          
          const line = { x: x*this.svgScale, y: y*this.svgScale, diameter: diameter, bid: this.bid};
          lines.push(line);

          swivels.push(swivel);
        }

        matrix[x][y] = { x: x*this.svgScale, y: y*this.svgScale, diameter: diameter, bid: this.bid};
      
        
    }

      // Create SVG container and add elements
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
    }   else if (this.type == 'tortless'){
      svg.selectAll('line').data(lines).enter().append('line')
        .attr('x1', d => d.x + d.bid + 10 - Math.floor(Math.random() * 20))
        .attr('y1', d => d.y + 3 - Math.floor(Math.random() * 6))
        .attr('x2', d => d.x + d.diameter + 10 - Math.floor(Math.random() * 20))
        .attr('y2', d => d.y + d.diameter + 3 - Math.floor(Math.random() * 6))
        .style('stroke', this.colorStroke)
        .style('fill', '#ff000000')
        .attr("stroke-width", this.thickness);
    }   else if (this.type == 'swivels'){
      svg.selectAll('swivel').data(swivels).enter().append('line')
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
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

class Mapper extends Transformer{
  constructor(sId){
    super(sId);
    this.type = 'mapper';
    this.limit = 0;
  }

  setCenter(iX, iY){
    this.center = {x:iX || 0, y:iY || 0};
    return this;
  }

  findDirection(x1, y1, x2, y2){
    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; // returns the angle in degrees
  }

  traceSwivel(x,y,angle, length){
    const x2 = x + length * Math.cos(angle * Math.PI / 180);
    const y2 = y + length * Math.sin(angle * Math.PI / 180);
    return {x1: x, y1: y, x2: x2, y2: y2};
  }

  onload() {
    canvas.width = this.width;
    canvas.height = this.height;
    this.width = 250;
    this.height = 250;
    ctx.drawImage(this, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;
    const pixelCount = pixelData.length / 4; // Each pixel has 4 values (R,G,B,A)
    const circles = [];
    const lines = [];
    const swivels = [];
    const polygons = [];
    const density = this.density;
    let countDensity = 0;
    let prevDot = {x:0,y:0};
    let currentDot = {x:0,y:0};
    let direction = 0;
    let swivel = 0;
    this.center = this.transformer.center;
    
    const brightnessScale = d3.scaleLinear().domain([255, 0]).range(this.range); // Linear scaling function for brightness to diameter
    //console.log(this.transformer.sId, this.transformer.limit);
    
    if(typeof this.transformer.limit == 'number'){
      this.transformer.limit = [0, this.transformer.limit];
    } else if (typeof this.transformer.limit == 'undefined'){
      this.transformer.limit = [0, this.range[0]];
    }
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
        
        direction = this.transformer.findDirection(x*this.svgScale, y*this.svgScale, this.center.x, this.center.y);
        swivel = this.transformer.traceSwivel(x*this.svgScale + 3 - Math.floor(Math.random() * 6), y*this.svgScale + 3 - Math.floor(Math.random() * 6), direction, diameter);

        //console.log({diameter, range: this.range[1], limit: this.transformer.limit, max: diameter > (this.range[1] - this.transformer.limit[1]), min: diameter < (this.range[1] - this.transformer.limit[0])});
        const hasLimit = (this.transformer.limit) ? diameter >= this.transformer.limit[0] && diameter <= this.transformer.limit[1] : true;

        if (diameter > 1 && countDensity % density == 0 && hasLimit) {
          const circle = { x: x*this.svgScale, y: y*this.svgScale, diameter: diameter, pixelData: pixelData[i]};
          circles.push(circle);
          
          const line = { x: x*this.svgScale, y: y*this.svgScale, diameter: diameter, bid: this.bid, r1: Math.random(), r2: Math.random()};
          lines.push(line);

          swivels.push(swivel);
        }

        matrix[x][y] = { x: x*this.svgScale, y: y*this.svgScale, diameter: diameter, bid: this.bid};
      
        
    }

      // Create SVG container and add elements
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
    } else if (this.type == 'hLines'){
      svg.selectAll('line').data(lines).enter().append('line')
        .attr('x1', d => d.x )
        .attr('y1', d => d.y)
        .attr('x2', d => d.x + (d.diameter/3))
        .attr('y2', d => d.y + (d.diameter/7))
        .style('stroke', this.colorStroke)
        .style('fill', '#ff000000')
        .attr("stroke-width", this.thickness);
    }  else if (this.type == 'vLines'){
      svg.selectAll('line').data(lines).enter().append('line')
        .attr('x1', d => d.x + d.bid)
        .attr('y1', d => d.y)
        .attr('x2', d => d.x + d.diameter - d.bid)
        .attr('y2', d => d.y + (d.diameter/2))
        .style('stroke', this.colorStroke)
        .style('fill', '#ff000000')
        .attr("stroke-width", this.thickness);
    } else if (this.type == 'dLines'){
      svg.selectAll('line').data(lines).enter().append('line')
        .attr('x1', d => d.x)
        .attr('y1', d => d.y)
        .attr('x2', d => d.x + d.diameter + 10 - Math.floor(Math.random() * 20))
        .attr('y2', d => d.y)
        .style('stroke', this.colorStroke)
        .style('fill', '#ff000000')
        .attr("stroke-width", this.thickness);
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
    }   else if (this.type == 'scribblesA'){
      svg.selectAll('line').data(lines).enter().append('line')
        .attr('x1', d => d.x )
        .attr('y1', d => d.y )
        .attr('x2', d => d.x + (d.diameter/4))
        .attr('y2', d => d.y + (d.diameter/4))
        .style('stroke', this.colorStroke)
        .style('fill', '#ff000000')
        .attr("stroke-width", this.thickness)
        .attr('transform', d => `rotate(${20 - Math.floor(Math.random() * 40)}, ${d.x - (d.diameter/2)}, ${d.y - (d.diameter/2)})`);
    }  else if (this.type == 'scribblesB'){
      svg.selectAll('line').data(lines).enter().append('line')
        .attr('x1', d => d.x + 2 - Math.floor(d.r1 * 2))
        .attr('y1', d => d.y )
        .attr('x2', d => d.x + (d.diameter/1) + 2 - Math.floor(d.r1 * 2))
        .attr('y2', d => d.y + (d.diameter/1))
        .style('stroke', this.colorStroke)
        .style('fill', '#ff000000')
        .attr("stroke-width", this.thickness)
        .attr('transform', d => `rotate(${25 - Math.floor(Math.random() * 50)}, ${d.x}, ${d.y})`);
    }  else if (this.type == 'swivels'){
      svg.selectAll('swivel').data(swivels).enter().append('line')
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
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
      svg.selectAll('circle').data(circles).enter().append('polygon')
        .attr("d", d => d3.polygon(6, d.x, d.x, d.diameter))
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
    this.type = 'orbiter';
  }

  direction(x1, y2, x2, y1){
    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; // returns the angle in degrees
  }

  line(x,y,angle, length){
    const x2 = x + length * Math.cos(angle * Math.PI / 180);
    const y2 = y + length * Math.sin(angle * Math.PI / 180);
    return {x1: x, y1: y, x2: x2, y2: y2};
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
    svimg.transformers['orbiter'].makePath('0047AB66', canvas.width, 1, 0.5, matrix, this.svgScale, canvas.width, canvas.height);

    
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
    //console.log({iJump, iScale, canvas_width, canvas_height});
    svimg.addLayer(oLayer, sUnik);

    let oLine = svimg.d3.line()
                .x((d,i) => d.x)
                .y((d,i) => d.y)
                .curve(svimg.d3.curveCardinal);
        
    let pathArray = [];
    let iX = 0;
    let iY = 0;
    let circX = 0; // this will be the location of the calculated point
    let circY = 0; // this will be the location of the calculated point
    let cX = 125; //this is the center of the spiral
    let cY = 125; //this is the center of the spiral
    let nPoints = 360;//10 + Math.random() * 30; // this is the number of points on the spiral
    let radius = 1; // this is the radius of the spiral
    let iDirection = -1; // this is the direction of the spiral

    let prevX = 0; // this is the previous x point
    let prevY = 0; // this is the previous y point

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

        //console.log({r:((radius/iRadius) * 100).toFixed(2) +'%'});

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
            .duration(1) // Duration of the animation in milliseconds
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
