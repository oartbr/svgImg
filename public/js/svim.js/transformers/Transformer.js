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