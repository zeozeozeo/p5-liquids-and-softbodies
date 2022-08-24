function Boundary(x, y, width, height, angle) {
    var options = {
        friction: 1.0, // 0.6
        restitution: 1.0, // 0.1
        angle: angle,
        isStatic: true,
    };
    this.body = Bodies.rectangle(x, y, width, height, options);
    this.width = width;
    this.height = height;
    World.add(world, this.body);

    this.show = function () {
        var position = this.body.position;
        var angle = this.body.angle;

        mainSketch.push();
        mainSketch.translate(position.x, position.y);
        mainSketch.rotate(angle);
        mainSketch.rectMode(mainSketch.CENTER);
        mainSketch.strokeWeight(1);
        mainSketch.noStroke();
        mainSketch.fill(0);
        mainSketch.rect(0, 0, this.width, this.height);
        mainSketch.pop();
    };
}
