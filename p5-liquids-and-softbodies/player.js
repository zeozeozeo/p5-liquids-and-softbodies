let dummyColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"];

function Player(x, y) {
    var particleOptions = { 
        friction: 0.05,
        frictionStatic: 0.1,
    };
 
    var constraintOptions = { };
    
    this.color = 255;
    this.particleRadius = 10;
    this.maxVelocity = 15;

    // softbody.js:
    // xx, yy, columns, rows, columnGap, rowGap, crossBrace,
    // particleRadius, particleOptions, constraintOptions
    this.body = softBody(x, y, 4, 8, 0, 0, true, this.particleRadius, particleOptions, constraintOptions);
    Composite.add(world, this.body);

    this.handleInput = function(keyCode) {
        switch (keyCode) {
            case 87: case 32: // w, space
                this.body.bodies.forEach(body => {
                    if (getRandomInt(0, 1) == 0) {
                        var position = body.position;
                        Body.applyForce(body, position, {x: 0, y: -0.01});
                    }
                });
                break;
            case 65: // a
                this.body.bodies.forEach(body => {
                    if (getRandomInt(0, 1) == 0) {
                        var position = body.position;
                        Body.applyForce(body, position, {x: -0.005, y: 0});
                    }
                });
                break;
            case 83: // s
                this.body.bodies.forEach(body => {
                    if (getRandomInt(0, 1) == 0) {
                        var position = body.position;
                        Body.applyForce(body, position, {x: 0, y: 0.01});
                    }
                });
                break;
            case 68: // d
                this.body.bodies.forEach(body => {
                    if (getRandomInt(0, 1) == 0) {
                        var position = body.position;
                        Body.applyForce(body, position, {x: 0.005, y: 0});
                    }
                });
                break;
            
            default:
                break;
        }
    }

    this.clampVelocity = function() {
        this.body.bodies.forEach(body => {
            if (body.velocity.x > this.maxVelocity) {
                Body.setVelocity(body, {
                    x: this.maxVelocity,
                    y: body.velocity.y
                });
            } else if (body.velocity.y > this.maxVelocity) {
                Body.setVelocity(body, {
                    x: body.velocity.x,
                    y: this.maxVelocity
                });
            };
        });
    };

    this.show = function() {
        this.body.bodies.forEach(body => {
            var position = body.position;
            
            liquidSketch.push();
            liquidSketch.translate(position.x, position.y);
            liquidSketch.rectMode(mainSketch.CENTER);
            liquidSketch.noStroke();
            liquidSketch.fill(this.color);
            liquidSketch.ellipse(0, 0, this.particleRadius*2);
            liquidSketch.pop();
        });
    };
}

function Dummy(x, y) {
    var particleOptions = { 
        friction: 0.05,
        frictionStatic: 0.1,
    };
 
    var constraintOptions = { };
    
    this.color = dummyColors[liquidSketch.floor(liquidSketch.random(0, dummyColors.length))];;
    this.particleRadius = 10;
    this.maxVelocity = 15;

    // softbody.js:
    // xx, yy, columns, rows, columnGap, rowGap, crossBrace,
    // particleRadius, particleOptions, constraintOptions
    this.body = softBody(x, y, 4, 8, 0, 0, true, this.particleRadius, particleOptions, constraintOptions);
    Composite.add(world, this.body);

    this.isOffScreen = function() {
        var position = this.body.bodies[0].position;
        return (position.y > h + 100);
    };

    this.destroy = function() {
        World.remove(world, this.body);
    };

    this.show = function() {
        this.body.bodies.forEach(body => {
            var position = body.position;
            
            liquidSketch.push();
            liquidSketch.translate(position.x, position.y);
            liquidSketch.rectMode(mainSketch.CENTER);
            liquidSketch.noStroke();
            liquidSketch.fill(this.color);
            liquidSketch.ellipse(0, 0, this.particleRadius*2);
            liquidSketch.pop();
        });
    };
};