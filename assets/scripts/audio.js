class AudioControl{
   constructor(){
    this.charge=document.getElementById('charge');
    this.flap1=document.getElementById('flap1');
    this.flap2=document.getElementById('flap2');
    this.flap3=document.getElementById('flap3');
    this.flap4=document.getElementById('flap4');
    this.flap5=document.getElementById('flap5');
    this.victory=document.getElementById('win');
    this.defeat=document.getElementById('loose');
   // this.backgroundMusic=document.getElementById('backgroundMusic');
    this.flapSounds=[this.flap1,this.flap2,this.flap3,this.flap4,this.flap5];
   }
   play(sound){
    sound.currentTime=0;
    sound.play();
   }
//    pause(sound){
//     sound.currentTime=0;
//     sound.play();
//    }
}