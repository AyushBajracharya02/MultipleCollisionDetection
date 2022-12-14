import Circle from "./Particle.js";

var canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
var ctx = canvas.getContext("2d");
const particles = [];
var i,j;
const radius = 15;

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

function randomInt(min,max)
{
    //calculates distance between max and min, multiplies it to random and adds min
    return Math.floor( Math.random()*  ( max - min + 1 ) + min );
}

function distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

function collisionDetection(o1,o2){
    if((distance(o1.x,o2.y,o2.x,o2.y) < radius*2)){
        return true;
    }
    return false;
}

//generating random non-overlapping
for( i=0;i<50;i++){
    var x = randomInt(radius,innerWidth-radius);
    var y = randomInt(radius,innerHeight-radius);
    var dx = (Math.random() - 0.5)*3;
    var dy = (Math.random() - 0.5)*3;
    if(i !== 0){
        for(j = 0; j < particles.length ; j++){
            if(distance(x, y, particles[j].x, particles[j].y) < 2*radius){
                x = randomInt(radius,innerWidth-radius);
                y = randomInt(radius,innerHeight-radius);
                j=-1;
            }
        }
    }
    particles.push(new Circle(x,y,radius,dx,dy));
}

function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach(particle => {
        particle.animate(particles);
    });
}

animate();

export {canvas,ctx,collisionDetection,resolveCollision};