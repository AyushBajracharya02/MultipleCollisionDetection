import { canvas , ctx , collisionDetection , resolveCollision } from "./script.js";
export default class Particle {
    constructor(x, y, radius , xVelocity, yVelocity ) {
        this.mass = 0.1;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.stroke = 'black';//`rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},1)`;
        this.velocity = {
            x: xVelocity,
            y: yVelocity
        };
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = `${this.stroke}`;
        ctx.stroke();
    }

    updatePosition() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    updateVelocity() {
        //reversing when hits left or right wall
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        //reversing when hitting up or down wall
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        } 
    }

    updateAll() {
        this.updateVelocity();
        this.updatePosition();
    }

    animate(particles) {
        this.draw();
        for(var i=0;i<particles.length;i++){
            if(this === particles[i]){
                continue;
            }
            else{
                if(collisionDetection(this,particles[i])){
                    resolveCollision(this,particles[i]);
                }
            }
        }
        this.updateAll();
    }
}