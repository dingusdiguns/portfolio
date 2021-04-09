module.exports = {
  __registerCallbacks: [],

  assignGL( gl ){
    this.gl = gl;
    this.__registerCallbacks.forEach(
      ( callback ) => {
        callback( gl )
      }
    );
  },

  getNearestSquare( num ){
    let i = 0;
    while( i * i < num ){
      i++;
    }
    return i;
  },


  packFloatToVec4i( flt ){
    function fract ( f ) {
      return f - Math.floor(f);
    }
    let bitEnc = [1,255,65025,16581375]
    let enc = bitEnc.map(
      ( byte, index ) => {
        return fract(byte * flt)
      }
    );
    enc[0] -= (enc[1] * (1/255))
    enc[1] -= (enc[2] * (1/255))
    enc[2] -= (enc[3] * (1/255))

    return enc

  },

  unpackFloatToVec4i( rgba ){
    let dot = (rgba[0] * 1) + ( rgba[1] / 255 ) + ( rgba[2] / 65025 ) + (rgba[3] / 160581375)
    return dot
  },

  createTextureFromRGBAArray( arr, nearestSquare, thing ){
    let gl = this.gl;

    var data = new Uint8Array( arr );
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, nearestSquare, nearestSquare, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    return texture;
  },



  createTextureFromArray( arr ){
    let newArr = [];
    let gl = this.gl;
    arr.forEach(
      ( f, index ) => {
        let flt = this.packFloatToVec4i( f );
        newArr = newArr.concat( flt.map( ( datum ) => { return datum * 255 } ) );
      }
    );
    let nearestSquare = this.getNearestSquare( arr.length );
    for( var i = 0; i < nearestSquare * nearestSquare * 4; i++ ){
      if( !newArr[i] ){
        newArr[i] = 0;
      }
    }
    var data = new Uint8Array( newArr );
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, nearestSquare, nearestSquare, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    return texture;
  },

  createShader( type, source ){
    if( type === "fragment" ){
      type = this.gl.FRAGMENT_SHADER
    }else if( type === "vertex" ){
      type = this.gl.VERTEX_SHADER
    }
    let shader = this.gl.createShader( type );
    this.gl.shaderSource( shader, source );
    this.gl.compileShader( shader );
    let success = this.gl.getShaderParameter( shader, this.gl.COMPILE_STATUS );
    if( success ){
      return shader
    }

    console.log( this.gl.getShaderInfoLog( shader ) );
    this.gl.deleteShader( shader );
  },

  registerGLUpdate( callback ){
    this.__registerCallbacks.push( callback );
  },

  createProgram( vertexShader, fragmentShader, gl ){
    let program = this.gl.createProgram();
    this.gl.attachShader( program, vertexShader );
    this.gl.attachShader( program, fragmentShader );
    this.gl.linkProgram( program );
    let success = this.gl.getProgramParameter( program, this.gl.LINK_STATUS );
    if( success ){
      return program;
    }
    console.log( this.gl.getProgramInfoLog( program ) );
    this.gl.deleteProgram( program );
  },

  getDataType( value ){
    if( Array.isArray(value) ){
      return new Float32Array( value );
    }else{
    }
  },

  createAttribute( name, value, program ){
    if( !program && this.program ){
      program = this.program;
    }
    let location = this.gl.getAttribLocation( program, name );
    let buffer = this.gl.createBuffer();
    this.gl.bindBuffer( this.gl.ARRAY_BUFFER,
      buffer
    );
    let type = this.getDataType( value );
    // translate different value types
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      type,
      this.gl.STATIC_DRAW
    );
    return {location: location, buffer: buffer};
  },

  createTextureBuffer(){
    let texture = this.gl.createTexture();
    this.gl.bindTexture( this.gl.Texture_2D, texture );

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    return texture
  },

  createFBO( width, height ){
    let gl = this.gl;
    let texture = this.gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    let fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    return {
      fbo: fbo,
      texture: texture,
      status: status
    }

  },



  resizeCanvas( canvas ){
    // Lookup the size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    if (canvas.width  != displayWidth ||
        canvas.height != displayHeight) {

      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
  }
}
