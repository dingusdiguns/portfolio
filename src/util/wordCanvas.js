import CanvasUtil from "./canvasUtil";

const THREE = require("three");
const Util = require("./glUtil");

class WordCanvas extends CanvasUtil{
  constructor( word, size, font ){
    super();
    this.createCanvas();
    this.word = word;
    this.size = size;
    this.font = font;
    this.setup();
  }

  getCanvasMeasurement(){
    this.ctx.font = `${ this.size }px ${this.font}`;
    let measurement = this.ctx.measureText( this.word.toUpperCase(), 0, 0 );
    return measurement;
  }

  sizeCanvas( width, height ){
    this.canvas.width = width;
    this.width = width ;
    this.canvas.height = height;
    this.ctx.fillStyle = "black"
    this.ctx.textBaseline = "top"
    this.ctx.textAlign = "center"
    this.ctx.fillStyle = "black";
    this.ctx.font = `${ this.size }px ${this.font}`;
    this.ctx.fillText( this.word.toUpperCase(), this.canvas.width / 2, 0 );
    document.body.appendChild(this.canvas)
  }

  setup(){
    let measurement = this.getCanvasMeasurement();
    this.sizeCanvas( measurement.width, this.size );
  }

  largestWidth( arr ){
    let totalWidth = 0;
    arr.forEach(
      ( element ) => {
        totalWidth = element.canvas.width > totalWidth ? element.canvas.width: totalWidth;
      }
    );
    arr.forEach(
      ( element ) => {
        element.createCanvas();
        element.sizeCanvas( totalWidth, element.size );
      }
    );
  }

  generatePoints( numPoints ){
    this.points = [];
    this.textureData = []
    console.log( this.canvas.width );
    for( var x = 0; x < this.canvas.width; x++ ){
      for( var y = 0; y < this.canvas.height; y++ ){
        let pix = this.ctx.getImageData( x, y, 1, 1 ).data;
        let value = pix[3];
        if( value > .5 ){
          this.points.push(
            {
              x: x,
              y: y
            }
          );
          let _x = Util.packFloatToVec4i( x / this.canvas.width );
          let _y = Util.packFloatToVec4i( y / this.canvas.height );
          this.textureData = this.textureData.concat(
            Util.packFloatToVec4i( x / this.canvas.width ),
            Util.packFloatToVec4i( y / this.canvas.height )
          );
        }
      }
    }
    while( this.textureData.length < (numPoints * 8) ){
      let _point = (Math.random() * this.points.length)
      this.points.push( _point );
      this.textureData = this.textureData.concat(
        Util.packFloatToVec4i( _point.x / this.canvas.width ),
        Util.packFloatToVec4i( _point.y / this.canvas.height )
      );
    }
  }

  generateTexture( textureLength ){
    let w = Util.getNearestSquare( textureLength );
    while( this.textureData.length < ( w * w * 4 ) ){
      this.textureData.push(0);
    }
    this.positionTexture = new THREE.DataTexture( new Float32Array(this.textureData), w, w, THREE.RGBAFormat, THREE.FloatType );
    this.positionTexture.minFilter = THREE.NearestFilter;
    this.positionTexture.magFilter = THREE.NearestFilter;

    this.texture = new THREE.CanvasTexture( this.canvas );
  }

}

export default WordCanvas;
