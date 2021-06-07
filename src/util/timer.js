class Timer{
  constructor( options, callback ){
    this.target = options.target;
    this.rate = options.rate;
    this.value = 0;
    this.delay = options.delay ? options.delay : 0;
    this.delayValue = 0;
    if( callback ){
      this.callback = callback
      this.callbackExecuted = false;
    }
  }

  changeCallback( callback ){
    this.callback = callback;
  }

  changeRate( rate ){
    this.rate = rate;
  }

  countUp(){
    if( this.delayValue > this.delay){
      this.value =
      this.value < this.target ?
      this.value + this.rate :
      this.value;

      if( this.value >= 1 && this.callback && !this.callbackExecuted ){
        this.callback();
        this.callbackExecuted = true;
      }

      this.value =
      this.value > 1 ?
      this.value: this.value;
    }else{
      this.delayValue+=this.rate;
    }

  }

  countDown(){


    this.value =
    this.value > 0 ?
    this.value - this.rate:
    this.value;



    this.value =
    this.value < 0 ?
    0: this.value;

  }

  reset(){
    this.value = 0;
    this.callbackExecuted = false;
  }

  getValue(){
    return this.value
  }


}

export default Timer
