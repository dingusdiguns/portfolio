class CanvasUtil{
  constructor(){

  }
  createCanvas(){
    let canvas = document.createElement( "canvas" );
    let ctx = canvas.getContext( "2d" )
    this.canvas = canvas;
    this.ctx = ctx;
  }
}

export default CanvasUtil
