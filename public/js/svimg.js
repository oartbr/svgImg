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