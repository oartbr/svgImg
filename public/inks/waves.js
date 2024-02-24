/* 
   Waves V0.1 
   Oct 28nd 2023
*/

function waveA (width, height){

  //ctx.drawImage(this, 0, 0);

  const brightnessScale = d3.scaleLinear().domain([255, 0]).range([0,20]); // Linear scaling function for brightness to diameter
  
  const waverDiv = document.getElementById('my-svg');
  $('#my-svg').css("width","1500px").css("height", "1500px");
  waverDiv.width = width;
  waverDiv.height = height;
  const numOfWaves = 25;
  //const width = width;//+ svg.getAttribute('width');
  
  // Generate 32 waves with random heights
  for (let i = 0; i < numOfWaves; i++) {
      const amplitude = 100;//Math.random() * 10; // random height between 0 and 100
      const frequency = 0.1;
      const yOffset = (height / 2); // distributing the waves vertically
  
      let d = '';  // path data for the wave
  
      // Generate the sinusoidal path for the wave
      for (let x = 0; x <= width; x++) {
         const y = (amplitude * (i/10))* Math.sin((x * frequency)) + yOffset * (i/10);
          d += x === 0 ? `M${x} ${y}` : ` L${x} ${y}`;
      }
  
      // Create the path element and set its 'd' attribute
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'black');
      path.setAttribute('stroke-width', '0.1');
  
      waverDiv.appendChild(path);
  }
}

function waveB (width, height, matrix, deepness){
   //ctx.drawImage(this, 0, 0);
   let d = '';  // path data for the wave
 
   const waverDiv = document.getElementById('my-svg');
   $('#my-svg').css("width", width + "px").css("height", height + "px");
   
   const centerX = width/2;
   const centerY = height/2;

   const a = 1;
   const b = 2;
   const steps = 120; // Number of points in the spiral
   let colorDetect = false;
   let prevDetect = true;
   
   // Generate a number of concentric circles
   for (let j = 0; j <= (width / 5); j++) {
      // Generate a complete circle in this number of steps
      for (let i = 0; i <= steps; i++) {
         const theta = i/steps * 2 * Math.PI;
         const r = j * (deepness/2);
         const x = centerX + r * Math.cos(theta);
         const y = centerY + r * Math.sin(theta);

         try{
            if(typeof matrix[parseInt(x/3)][parseInt(y/3)] != 'undefined'){
              colorDetect = (matrix[parseInt(x/3)][parseInt(y/3)].diameter < deepness) ? true : false;
              d += (i === 0 || (colorDetect && !prevDetect)) ? `M${x} ${y}` : ` L${x} ${y}`;
              prevDetect = colorDetect;
            }
         }catch (e){
            //console.log({x,y});
         }
      }
   }
       // Create the path element and set its 'd' attribute
       const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
       path.setAttribute('d', d);
       path.setAttribute('fill', 'none');
       path.setAttribute('stroke', 'black');
       path.setAttribute('stroke-width', deepness/100);
      
      

       waverDiv.appendChild(path);
   
 }

 function xImg(sName, sColor, sScale, sFile, aRange, sType, onload){
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
 }

 const imgMap = function() {
   canvas.width = this.width;
   canvas.height = this.height;
   ctx.drawImage(this, 0, 0);
   const circles= [];
   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
   const pixelData = imageData.data;
   const pixelCount = pixelData.length / 4; // Each pixel has 4 values (R,G,B,A)
   
   const brightnessScale = d3.scaleLinear().domain([255, 0]).range(this.range); // Linear scaling function for brightness to diameter
   for (let i = 0; i < pixelCount; i++) {
       const R = pixelData[i * 4]; // Red value of pixel i
       const G = pixelData[i * 4 + 1]; // Green value of pixel i
       const B = pixelData[i * 4 + 2]; // Blue value of pixel i
       
 
 
       const brightness = 0.2126 * R + 0.7152 * G + 0.0722 * B; // Calculate brightness of pixel i
       const diameter = parseInt(brightnessScale(brightness)); // Map brightness to circle diameter
       const x = i % canvas.width; // Calculate x position of circle
 
       if(typeof matrix[x] == 'undefined'){
         matrix[x] = [];
       }
 
       const y = Math.floor(i / canvas.width); // Calculate y position of circle

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
       .attr("stroke-width", 0.1);
       //.attr('fill', d => `rgb(${pixelData[d.y * canvas.width * 4 + d.x * 4]}, ${pixelData[d.y * canvas.width * 4 + d.x * 4 + 1]}, ${pixelData[d.y * canvas.width * 4 + d.x * 4 + 2]})`);
   }
   
   d3.select('body').append('img');
   for(let k=0; k < 10; k++){
      waveB(this.width * this.svgScale, this.height * this.svgScale, matrix, k*3);
   }
   

 };

//waveA(1500,800);
xImg('brain', 'white', 3, "/img/mary0.jpg", [0,5], 'balls', imgMap);
