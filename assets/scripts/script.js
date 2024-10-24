//import UserTracker from "./userCount";

class Game {
  constructor(canvas, context, userCount) {
    this.canvas = canvas;
    this.ctx = context;
    this.ctxButton = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.baseHeight = 720;
    this.ratio = this.height / this.baseHeight;
    this.background = new Background(this); //created instance of Background class and this represents the game class
    this.player = new Player(this); // here this is with the context of entire game object .

    this.userCount = userCount;
    this.sound = new AudioControl();
    this.obstacles = []; //empty obstacles array to hold currently active practical objects
    this.numberOfObstacles = 15;
    this.speed;
    this.minSpeed;
    this.maxSpeed;
    this.gravity;
    this.score;
    this.gameOver;
    this.timer;
    this.isRunning = true;
    this.message1;
    this.message2;
    this.eventTimer = 0;
    this.eventInterval = 150;
    this.touchStartX;
    this.swipeDistance = 50;
    //this.debug=false;
    this.buttonHeight = 40;
    this.buttonWidth = 120;
    this.buttonX = 300;
    this.buttonY = 600;

    // this.onSound='On';
    this.bottomMargin;

    // Menu flags
    this.showMenu = true; // Initially show the menu
    this.showGameOverMenu = false; // Initially hide the game over menu

    //resize event listeners
    this.resize(window.innerWidth, window.innerHeight);
    let resizeTimeout;
    window.addEventListener("resize", (e) => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
      }, 1); //debounce resize calls.
    });

    //mouse controls
    this.canvas.addEventListener("mousedown", (e) => {
      this.player.flap();
    });
    this.canvas.addEventListener("mouseup", (e) => {
      // this.player.fishWingsUp();
      setTimeout(() => {
        this.player.fishWingsUp();
      }, 50);
    });
    //keyboard controls
    window.addEventListener("keyup", (e) => {
      console.log(e);
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowUp")
        this.player.flap();
      if (e.key === "Shift" || e.key.toLowerCase() === "c")
        this.player.startCharge();
    });

    window.addEventListener("keydown", (e) => {
      this.player.fishWingsDown();
    });
    //touch controls
    this.canvas.addEventListener("touchstart", (e) => {
      this.player.flap();
      this.touchStartX = e.changedTouches[0].pageX;
    });
    this.canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      {
        passive: true;
      }
    });
    this.canvas.addEventListener("touchend", (e) => {
      if (this.touchStartX > this.swipeDistance) {
        this.player.startCharge();
      } else {
        this.player.flap();
        {
          passive: true;
        }
        // setTimeout(()=>{
        //     this.player.fishWingsUp();
        // },100);
      }
    });
    // this.createObstacles(); // Create initial obstacles
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    // this.ctx.fillStyle='aqua';
    this.ctx.font = "30px Ubuntu  ";
    this.ctx.textAlign = "right";
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "white";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ratio = this.height / this.baseHeight;
    this.bottomMargin = Math.floor(50 * this.ratio);
    this.gravity = 0.15 * this.ratio;
    this.speed = 2 * this.ratio; //2px per animation frame
    this.minSpeed = this.speed;
    this.maxSpeed = this.speed * 10;

    this.background.resize();
    this.player.resize();
    this.createObstacles();
    this.obstacles.forEach((obstacle) => {
      obstacle.resize();
    });
    this.score = 0;
    this.gameOver = false;
    this.timer = 0;
  }

  render(deltaTime) {
    if (!this.gameOver) this.timer += deltaTime;
    this.handlePeriodicEvents(deltaTime);
    this.background.update();
    this.background.draw();
    this.drawStatusText();
    this.player.update();
    this.player.draw();
    this.obstacles.forEach((obstacle) => {
      obstacle.update();
      obstacle.draw();
    });
  }

  createObstacles() {
    this.obstacles = [];
    const firstX = this.baseHeight * this.ratio * 0.4;
    const obstacleSpacing = 420 * this.ratio; // change obstacle spacing to adjust diff of game,that will reposition the obstacle/
    for (let i = 0; i < this.numberOfObstacles; i++) {
      this.obstacles.push(new Obstacle(this, firstX + i * obstacleSpacing)); //built-in method push will add new elements at the end of array.
    }
  }
  checkCollision(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    // const distance = Math.sqrt(dx * dx + dy * dy);
    // const sumOfRadii = a.collisionRadius + b.collisionRadius;
    const distanceSquared = dx * dx + dy * dy;
    const sumOfRadiiSquared = (a.collisionRadius + b.collisionRadius) ** 2;
    return distanceSquared <= sumOfRadiiSquared;
  }

  formatTimer() {
    return (this.timer * 0.001).toFixed(1); // 1 second=1000 mili second
  }

  handlePeriodicEvents(deltaTime) {
    if (this.eventTimer < this.eventInterval) {
      this.eventTimer += deltaTime;
      this.eventUpdate = false;
    } else {
      this.eventTimer = this.eventTimer % this.eventInterval;
      this.eventUpdate = true;
      //console.log(this.eventTimer);
    }
  }
  triggerGameOver() {
    this.player.stopCharge();

    if (!this.gameOver) {
      this.gameOver = true;
      this.userCount.addScore(this.score);
      //this.userCount.drawVisitCount();
      if (this.obstacles.length <= 0) {
        this.sound.play(this.sound.victory);
        this.message1 = `Nailed it champ!!! 🏆`;
        this.message2 =
          "\nCan   you   do   it  faster   than " +
          this.formatTimer() +
          " seconds?";
      } else {
        this.sound.play(this.sound.defeat);
        this.message1 = "OOPS,Lost ☹️";
        this.message2 = "Collision time " + this.formatTimer() + " seconds!";
      }
      alert(`Thank you for playing, ${this.userCount.userName}!`); // Farewell message
      //this.userCount.drawVisitCount(this.ctx);
      //drawButton();
      //this.isRunning=false;
      // stopAnimation();
    }
  }
  drawStatusText() {
    this.ctx.save();
    this.ctx.fillText("Score: " + this.score, this.width - 40, 30);
    this.ctx.textAlign = "left";
    this.ctx.fillText("Timer: " + this.formatTimer(), 10, 30);
    if (this.gameOver) {
      this.ctx.textAlign = "center";
      this.ctx.font = "30px Ubuntu ";
      this.ctx.fillText(
        this.message1,
        this.width * 0.5,
        this.height * 0.5 - 80
      );
      this.ctx.font = "20px Ubuntu ";
      this.ctx.fillText(
        this.message2,
        this.width * 0.5,
        this.height * 0.5 - 60
      );

      this.ctx.fillText(
        "Press  'ctrl + R'   to  reload and  try again!",
        this.width * 0.5,
        this.height * 0.5 - 40
      );
      this.ctx.fillText(
        "Close Browser to end the game.",
        this.width * 0.5,
        this.height * 0.5 - 20
      );

      this.userCount.drawVisitCount(this.ctx);
    }
    if (this.player.energy <= this.player.minEnergy) this.ctx.fillStyle = "red";
    else if (
      this.player.energy >= this.player.minEnergy &&
      this.player.energy <= this.player.maxEnergy
    )
      this.ctx.fillStyle = "orange";
    for (let i = 0; i < this.player.energy; i++) {
      this.ctx.fillRect(
        10,
        this.height - 10 - this.player.barSize * i,
        this.player.barSize * 5,
        this.player.barSize
      );
    }
    this.ctx.restore();
  }
}

//load event is fired when the whole page is loaded including all dependent resources such as stylesheets,scripts,iframes and images as well.
// window.addEventListener("load", function () {
//   const canvas = document.getElementById("canvas1");
//   const ctx = canvas.getContext("2d");
//   canvas.width = 720;
//   canvas.height = 720;

//   // Create an instance of UserTracker and call handleUserCount
//   const userCount = new UserTracker();
//   userCount.handleUserCount(); // Increment and store user count in local storage
//   console.log(userCount.getAllUsers());

//   //created an object of Game class
//   const game = new Game(canvas, ctx, userCount);
//   let lastTime = 0;

//   function animate(timeStamp) {
//     const deltaTime = timeStamp - lastTime;
//     lastTime = timeStamp;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     game.render(deltaTime);

//     requestAnimationFrame(animate);
//   }

//   requestAnimationFrame(animate);
// });

window.addEventListener("load", async function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 720;
  canvas.height = 720;

  // Create an instance of UserTracker
  const userCount = new UserTracker();

  // Await the completion of user session handling
  await userCount.handleUserSession();

  // Start the game after the promise is resolved
  startGame();

  // This is the actual startGame function
  function startGame() {
    const game = new Game(canvas, ctx, userCount);
    let lastTime = 0;
    let timer = 0; // Initialize the timer

    function animate(timeStamp) {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;

      // Update timer
      timer += deltaTime / 1000; // Convert deltaTime to seconds

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      game.render(deltaTime);

      // // Display the timer
      // ctx.fillStyle = "black";
      // ctx.font = "20px Arial";
      // ctx.fillText(`Time: ${timer.toFixed(2)}s`, 10, 20); // Display timer

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }
});

// class Game{
//     constructor(canvas,context,userCount){
//         this.canvas=canvas;
//         this.ctx=context;
//         this.ctxButton=context;
//         this.width=this.canvas.width;
//         this.height=this.canvas.height;
//         this.baseHeight=720;
//         this.ratio=this.height/this.baseHeight;
//         this.background=new Background(this);//created instance of Background class and this represents the game class
//         this.player=new Player(this);// here this is with the context of entire game object . 
       
//         this.userCount=userCount;
//         this.sound=new AudioControl();
//         this.obstacles=[];//empty obstacles array to hold currently active practical objects
//         this.numberOfObstacles = 15;
//         this.speed;
//         this.minSpeed;
//         this.maxSpeed;
//         this.gravity;
//         this.score;
//         this.gameOver;
//         this.timer;
//         this.isRunning=true;
//         this.message1;
//         this.message2;
//         this.eventTimer = 0;
//         this.eventInterval = 150;
//         this.touchStartX;
//         this.swipeDistance = 50;
//         //this.debug=false;
//         this.buttonHeight=40;
//         this.buttonWidth=120;
//         this.buttonX=300;
//         this.buttonY=600;
        
//        // this.onSound='On';
//         this.bottomMargin;
        
//         // Menu flags
//         this.showMenu = true; // Initially show the menu
//         this.showGameOverMenu = false; // Initially hide the game over menu
        
//         this.resize(window.innerWidth,window.innerHeight)
//         window.addEventListener('resize', e => {
//          this.resize(e.currentTarget.innerWidth,e.currentTarget.innerHeight);
//         });

//         //mouse controls
//         this.canvas.addEventListener('mousedown', e => {
            
//            this.player.flap();
           
//         });
//         this.canvas.addEventListener('mouseup', e => {
//            // this.player.fishWingsUp();
//            setTimeout(()=>{
//             this.player.fishWingsUp();
//         },50);
//          });
//         //keyboard controls
//         window.addEventListener('keyup', e=> {
//             console.log(e);
//             if(e.key === ' '|| e.key === 'Enter' || e.key === 'ArrowUp') this.player.flap();
//             if(e.key === 'Shift'|| e.key.toLowerCase() === 'c' )this.player.startCharge();
//         })
       
//          window.addEventListener('keydown', e => {
//             this.player.fishWingsDown();
            
//          });
//         //touch controls
//         this.canvas.addEventListener('touchstart', e => {
//            this.player.flap();
//            this.touchStartX = e.changedTouches[0].pageX;
          
//         })
//        this.canvas.addEventListener('touchmove', e => {
//        e.preventDefault();
//        });
//        this.canvas.addEventListener('touchend', e => {
//         if(this.touchStartX > this.swipeDistance){
          
//             this.player.startCharge();
//          }
//          else{
//             this.player.flap();
//             // setTimeout(()=>{
//             //     this.player.fishWingsUp();
//             // },100);
//          }
       
//      })

//     }
  

//     resize(width,height){
        
//          this.canvas.width=width;
//          this.canvas.height=height;
//         // this.ctx.fillStyle='aqua';
//          this.ctx.font="30px Ubuntu  ";
//          this.ctx.textAlign = 'right';
//          this.ctx.lineWidth=1; 
//          this.ctx.strokeStyle='white';
//          this.width=this.canvas.width;
//          this.height=this.canvas.height;
//          this.ratio=this.height/this.baseHeight;
//          this.bottomMargin = Math.floor(50 * this.ratio);
//          this.gravity=0.15 * this.ratio;
//          this.speed=2 * this.ratio;//2px per animation frame
//          this.minSpeed=this.speed;
//          this.maxSpeed=this.speed * 10;

//          this.background.resize();
//          this.player.resize();
//          this.createObstacles();
//          this.obstacles.forEach(obstacle => {
//             obstacle.resize();
//          })
//          this.score=0;
//          this.gameOver=false;
//          this.timer=0;
//     }
    
//     render(deltaTime){
       
//         if(!this.gameOver)this.timer+=deltaTime;
//         this.handlePeriodicEvents(deltaTime);
//         this.background.update();
//         this.background.draw();
//         this.drawStatusText();
//         this.player.update();
//         this.player.draw();
//         this.obstacles.forEach(obstacle => {
//             obstacle.update();
//             obstacle.draw();
//          })
       
        
//     }
   

  

//     createObstacles(){
//         this.obstacles = [];
//         const firstX = this.baseHeight * this.ratio;
//         const obstacleSpacing = 450*this.ratio;// change obstacle spacing to adjust diff of game,that will reposition the obstacle/
//         for(let i=0; i<this.numberOfObstacles;i++){
//             this.obstacles.push(new Obstacle(this,firstX + i * obstacleSpacing))//built-in method push will add new elements at the end of array.
//         }
//     }
//      checkCollision(a, b){
//         const dx = a.collisionX - b.collisionX;
//         const dy = a.collisionY - b.collisionY;
//         const distance = Math.sqrt(dx*dx + dy*dy);
//         const sumOfRadii = a.collisionRadius + b.collisionRadius;
//         return distance <= sumOfRadii;
//      }

//     formatTimer(){
//         return (this.timer * 0.001).toFixed(1);// 1 second=1000 mili second
//     }
    
//     handlePeriodicEvents(deltaTime){
//         if(this.eventTimer < this.eventInterval){
//             this.eventTimer += deltaTime;
//             this.eventUpdate = false;   
//         }else{
//             this.eventTimer = this.eventTimer % this.eventInterval;
//             this.eventUpdate = true;
//             //console.log(this.eventTimer);

//         }
//     }
//     triggerGameOver(){
//        this.player.stopCharge();
      
       
//         if(!this.gameOver){
//             this.gameOver=true;
//             this.userCount.addScore(this.score);
//             //this.userCount.drawVisitCount();
//             if(this.obstacles.length <= 0){
//                 this.sound.play(this.sound.victory);
//                 this.message1 = `Nailed it champ!!! 🏆`;
//                 this.message2="\nCan   you   do   it  faster   than "+this.formatTimer()+ ' seconds?';
//             }
//             else{
//                 this.sound.play(this.sound.defeat);
//                 this.message1 = "OOPS,Lost ☹️";
//                  this.message2= "Collision time "  + this.formatTimer() + ' seconds!';
                 
//             }
//             alert(`Thank you for playing, ${this.userCount.userName}!`); // Farewell message
//             //this.userCount.drawVisitCount(this.ctx);
//             //drawButton();
//             //this.isRunning=false;
//            // stopAnimation();

//         }
        
//     }
//     drawStatusText(){
//         this.ctx.save();
//         this.ctx.fillText('Score: ' + this.score, this.width-40  , 30);
//         this.ctx.textAlign = 'left';
//         this.ctx.fillText('Timer: ' + this.formatTimer(), 10 , 30);
//         if(this.gameOver){
          
//             this.ctx.textAlign = 'center';
//             this.ctx.font='30px Ubuntu ';
//             this.ctx.fillText(this.message1,this.width * 0.5 , this.height * 0.5 - 80);
//             this.ctx.font='20px Ubuntu ';
//             this.ctx.fillText(this.message2,this.width * 0.5 , this.height * 0.5 - 60);
           
//             this.ctx.fillText("Press  'ctrl + R'   to  reload and  try again!",this.width * 0.5 , this.height * 0.5 - 40);
//             this.ctx.fillText("Close Browser to end the game.",this.width * 0.5 , this.height * 0.5 - 20);

//             this.userCount.drawVisitCount(this.ctx);
//         }
//         if(this.player.energy <= this.player.minEnergy)this.ctx.fillStyle='red';
//         else if(this.player.energy >= this.player.minEnergy && this.player.energy <= this.player.maxEnergy)this.ctx.fillStyle='orange';
//         for(let i = 0; i< this.player.energy ; i++){
//             this.ctx.fillRect(10,this.height - 10 - this.player.barSize * i  ,this.player.barSize * 5, this.player.barSize);
//         }
//         this.ctx.restore();
//     }

// }


// //load event is fired when the whole page is loaded including all dependent resources such as stylesheets,scripts,iframes and images as well.
// window.addEventListener('load',function(){



//         const canvas =document.getElementById('canvas1');
//         const ctx=canvas.getContext('2d');
//         canvas.width=720;
//         canvas.height=720;
       
//          // Create an instance of UserTracker and call handleUserCount
//     const userCount = new UserTracker();
//     userCount.handleUserCount(); // Increment and store user count in local storage


//        /* getContent() :method creates so called drawing context which basically is a javascript interface that contains all drawing methods and properties that we all need.
//         it expects atleast 1 argument.
        
//         */
//    //created an object of Game class
//    const game=new Game(canvas,ctx,userCount);
//     let lastTime = 0;
    
// function animate(timeStamp){
//     const deltaTime = timeStamp - lastTime;
//     lastTime=timeStamp;
//     ctx.clearRect(0,0,canvas.width,canvas.height);
//     game.render(deltaTime);

//     requestAnimationFrame(animate);
  
    
// }

// requestAnimationFrame(animate);
 
// });
