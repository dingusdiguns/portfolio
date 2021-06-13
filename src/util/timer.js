class Timer{
  constructor( options, callback ){
    this.target = options.target;
    this.rate = options.rate;
    this.duration = options.duration;
    this.value = 0;
    this.delay = options.delay ? options.delay : 0;
    this.delayValue = 0;
    this.initialValue = 0;
    this.name = options.name;
    if( callback ){
      this.callback = callback
      this.callbackExecuted = false;
    }
  }

  changeCallback( callback ){
    this.callback = callback;
  }

  changeDuration( duration ){
    this.duration = duration;
  }

  changeRate( rate ){
    this.rate = rate;
  }

  startTimer(){
    if( !this.timerStarted ){
      this.startTime = new Date().getTime() + ( this.delay * 1000 );
      this.targetEndTime = this.startTime + this.duration;
      this.initialValue = this.value;
      this.timerStarted = true;
    }
  }

  countUp(){
    // this.startTime = new Date().getTime();
    // this.targetEndTime = this.startTime + this.duration;
    //
    // if( this.delayValue > this.delay){
    //   this.value =
    //   this.value < this.target ?
    //   this.value + this.rate :
    //   this.value;
    //
    //   if( this.value >= 1 && this.callback && !this.callbackExecuted ){
    //     this.callback();
    //     this.callbackExecuted = true;
    //   }
    //
    //   this.value =
    //   this.value > 1 ?
    //   this.value: this.value;
    // }else{
    //   this.delayValue+=this.rate;
    // }

    this.countingDown = false;
    this.countingUp = true;
    this.target = 1;
    this.startTimer();
    if( this.value === this.target && !this.callbackExecuted && this.callback ){
      this.callback()
      this.callbackExecuted = true;
    }
  }

  countDown(){
    this.countingDown = true;
    this.countingUp = false;
    this.target = 0;
    this.startTimer();
    if( this.value === this.target && !this.callbackExecuted && this.callback ){
      this.callback()
      this.callbackExecuted = true;
    }

  }

  reset(){
    this.value = 0;
    this.timerStarted = false;
    this.callbackExecuted = false;
    this.startTimer();
  }

  getValue(){
    let current = new Date().getTime();
    let time = current - this.startTime < 0 ? 0 : current - this.startTime;
    time = !time ? 0 : (time / 1000);
    time = time / (this.duration / 1000);
    time = time > 1 ? 1 : time;
    let value = this.initialValue + ( ( this.target - this.initialValue ) * time );
    this.value = value;
    if(  this.value >= 1 && this.callback && !this.callbackExecuted ){
      this.callbackExecuted = true;
      this.callback();
    }
    return value;
  }


}

export default Timer
