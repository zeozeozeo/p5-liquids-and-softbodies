const maxParticles = 3000;

function createNewLiquidParticle(x, y) {
    var liquidParticle = new Liquid(x, y);
    if (Object.keys(liquidParticle).length === 0) {
        return;
    } else {
        particles.push(liquidParticle);
        return liquidParticle;
    }
}

// var colors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"];
function Liquid(x, y) {
    if (particles.length >= maxParticles || !spawnLiquidCheckbox.checked()) {
        return;
    }
    var options = {
        friction: 0.0,
        restitution: 0.2,
    };
    // this.radius = (w+h)/280;
    this.radius = defaultParticleRadius;
    this.body = Bodies.circle(x, y, this.radius, options);
    this.lifeTime = particleLifetime; // seconds
    this.existTime = 0.0;
    this.startDestroyAnim = false;
    this.radiusMultiplier = 1.0;
    this.destroyMe = false;

    // this.color = colors[liquidSketch.floor(liquidSketch.random(0, colors.length))];
    this.color = "#4287F5";

    World.add(world, this.body);

    this.isOffScreen = function () {
        var position = this.body.position;
        return position.y > h;
    };

    this.destroy = function () {
        World.remove(world, this.body);
    };

    this.destroyIfNeeded = function () {
        if (this.existTime > this.lifeTime) {
            this.startDestroyAnim = true;
        }
    };

    this.show = function () {
        // start decreasing the radius if needed
        if (this.startDestroyAnim) {
            if (this.radiusMultiplier <= 0) {
                this.destroyMe = true;
            } else if (this.radius > 5) {
                this.radiusMultiplier -= deltaTime;
                Matter.Body.scale(this.body, 0.5, 0.5);
            } else {
                this.destroyMe = true;
            }
        }
        var position = this.body.position;

        liquidSketch.push();
        liquidSketch.translate(position.x, position.y);
        liquidSketch.rectMode(liquidSketch.CENTER);
        liquidSketch.noStroke();
        liquidSketch.fill(this.color);
        liquidSketch.ellipse(0, 0, this.radius * 2 * this.radiusMultiplier);
        liquidSketch.pop();
    };
}
