import Transformer from './Transformer.js';

class Mapper extends Transformer{
    constructor(sId){
      super(sId);
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
      console.log(this.center,777);
      
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
          
          direction = this.transformer.findDirection(x*this.svgScale, y*this.svgScale, this.center.x, this.center.y);
          swivel = this.transformer.traceSwivel(x*this.svgScale + 3 - Math.floor(Math.random() * 6), y*this.svgScale + 3 - Math.floor(Math.random() * 6), direction, diameter);
  
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