import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js"
import { UI } from "./UI.js"

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1800;
  canvas.height = 900;
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 140;
      this.speed = 0;
      this.maxSpeed = 6;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.maxParticles = 100;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = false;
      this.score = 0;
      this.time = 0;
      this.lives = 5;
      this.winningScore = 40;
      this.maxTime = 30000;
      this.gameOver = false;
      this.fillColor = 'black'
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }
    update(deltaTime) {
      this.time += deltaTime;
      if(this.time > this.maxTime) this.gameOver = true;
      this.background.update();
      this.player.update(this.input.keys, deltaTime);
      //enemies
      if(this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else{
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach(enemy => {
        enemy.update(deltaTime)
        if(enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1)
      })
      //messages
      this.floatingMessages.forEach((message) => {
        message.update(deltaTime);
        
      });
      //particles
      this.particles.forEach((particle, index) =>{
        particle.update();
        if(particle.markedForDeletion) this.particles.splice(index, 1)
      })
      if(this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }
      //collisions
      this.collisions.forEach((collisions, index) =>{
        collisions.update(deltaTime);
        if(collisions.markedForDeletion) this.collisions.splice(index, 1)
      })
      this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion)
    }
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.particles.forEach((particle) => {
        particle.draw(context);
      });
      this.floatingMessages.forEach((message) => {
        message.draw(context);
      });
      this.collisions.forEach((collision) => {
        collision.draw(context);
      });
      this.UI.draw(context)
    }
    addEnemy(){
      if(this.speed > 0 && Math.random() < 0.6) this.enemies.push(new GroundEnemy(this))
      else if (this.speed >0)  this.enemies.push(new ClimbingEnemy(this))
      this.enemies.push(new FlyingEnemy(this));
      
    }
  }
  const game = new Game(canvas.width, canvas.height);
  console.log(game);

  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    if(!game.gameOver )requestAnimationFrame(animate);
  }
  animate(0);
});
