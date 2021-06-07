const THREE = require("three");
let _t = 0;
class Word{
  constructor( title, scene, size ){
    this.title = title;
    let mesh = new THREE.Mesh();
    this.mesh = mesh;
    this.size = size;
    scene.add( this.mesh )
    this.wordData = this.getWordData()
    this.chars = [];
    this.setup();
    this.mesh.position.set( 0, 200, 0 )

  }

  getWordData(){

    let canvas = document.createElement( "canvas" );
    let ctx = canvas.getContext( "2d" );

    ctx.font = `${ this.size }px sans-serif`;
    var txt = this.title;
    let data = ctx.measureText(txt);

    return data;

  }

  getCharData( str ){

    let sub = str.slice( 0, str.length - 1 );

    let canvas = document.createElement( "canvas" );
    let ctx = canvas.getContext( "2d" );
    ctx.font = `${ this.size }px sans-serif`;
    var txt = this.title;
    let prev = ctx.measureText( sub );
    let total = ctx.measureText( str );
    let data = ctx.measureText( str[ str.length - 1 ] );
    canvas.width = data.width;
    canvas.height = this.size;
    ctx.font = `${ this.size }px sans-serif`;
    ctx.textBaseline = "top";
    ctx.fillText( str[str.length - 1], 0, 0 );
    data.canvas = canvas;
    data.offset = prev.width

    return data;
  }

  setup(){
    let offset = 0;
    for( var i = 0; i < this.title.length; i++ ){
      let char = this.title[i];
      let substr = this.title.slice( 0, i + 1 );
      let data = this.getCharData( substr );
      offset+=data.width;
      let geo = new THREE.PlaneGeometry(
        data.width,
        this.size,
        4
      )

      // document.body.appendChild( data.canvas )

      let texture = new THREE.Texture( data.canvas );
      let material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
      });

      texture.needsUpdate = true;

      material.side = THREE.DoubleSide;
      let mesh = new THREE.Mesh( geo, material );
      mesh.position.set( ( -this.wordData.width / 2 ) + data.offset, -200, 200 );
      this.mesh.add( mesh );
      this.chars.push( mesh )
      mesh.rotation.set( 3 * Math.PI / 4,0,0);
    }
  }

  animate(){

  }
}

export default Word
