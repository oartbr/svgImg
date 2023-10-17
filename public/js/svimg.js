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
  
    if(window.top == window.self){
     return new Svimg();
    }


  
  }());