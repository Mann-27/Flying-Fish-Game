class Background{
    constructor(game){
        this.game = game;
        this.image = document.getElementById('background');
        this.width=2400;//actual background size
        this.height=this.game.baseHeight;//actual background size
        this.scaledWidth;
        this.scaledHeight;
        this.x;
       
    }
    update(){
        this.x -= this.game.speed;
      if(this.x <= -this.scaledWidth)this.x=0;//set background image to its original pos ,if it went offscreen(towards left)
    }
    draw(){
        
        this.game.ctx.drawImage(this.image,this.x,0,this.scaledWidth,this.scaledHeight);//this func expects 3 params ,image ,x co-ordinate and y-co-ordinate
        this.game.ctx.drawImage(this.image,this.x + this.scaledWidth - 1 ,0,this.scaledWidth,this.scaledHeight);
        if(this.game.canvas >= this.scaledWidth){
            this.game.ctx.drawImage(this.image,this.x,0,this.scaledWidth * 2 - 2 ,this.scaledHeight);
        }

    }
    resize(){
        this.scaledWidth=this.width * this.game.ratio;
        this.scaledHeight=this.height * this.game.ratio;
        this.x = 0;
    }
    BackgroundMusic(){[

    ]}
}


