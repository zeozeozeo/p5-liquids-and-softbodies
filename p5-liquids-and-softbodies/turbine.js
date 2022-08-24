function Turbine(x, y, width, height) {
    var options = {
        friction: 0.0,
        restitution: 1.0,
        mass: 0.25,
        angle: (90 * Math.PI) / 180,
    };
    this.turbine = Bodies.rectangle(x, y, width, height, options);
    this.width = width;
    this.height = height;
    this.rounding = 3;
    this.hingeRadius = 10;
    this.hinge = Constraint.create({
        pointA: {
            x: x,
            y: y,
        },
        bodyB: this.turbine,
        length: 0,
    });
    World.add(world, [this.turbine, this.hinge]);

    this.destroy = function () {
        World.remove(world, [this.turbine, this.hinge]);
    };

    this.show = function () {
        var position = this.turbine.position;
        var angle = this.turbine.angle;

        // draw turbine
        mainSketch.push();
        mainSketch.translate(position.x, position.y);
        mainSketch.rotate(angle);
        mainSketch.rectMode(mainSketch.CENTER);
        mainSketch.noStroke();
        mainSketch.fill(255);
        mainSketch.rect(0, 0, this.width, this.height, this.rounding);
        mainSketch.pop();

        // draw hinge
        mainSketch.push();
        mainSketch.translate(position.x, position.y);
        mainSketch.rotate(angle);
        mainSketch.rectMode(mainSketch.CENTER);
        mainSketch.noStroke();
        mainSketch.fill(0);
        mainSketch.ellipse(0, 0, this.hingeRadius);
        mainSketch.pop();
    };
}
