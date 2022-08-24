/*
There are two sketches: the main sketch and the liquid sketch.
The liquid is rendered in a different sketch and overlayed on top
of the main sketch (see index.html)
The main sketch uses the WebGL mode, when the liquid sketch does not
(i couldn't get svg filters to work in WebGL mode).

Controls:
WASD to move
W or Space to jump
Hold mouse buttons to spawn liquid
*/

var w = window.innerWidth;
var h = window.innerHeight;

// matter
const Engine = Matter.Engine,
    World = Matter.World,
    Mouse = Matter.Mouse,
    Constraint = Matter.Constraint,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

// matter objects
let boundaries = [];
let particles = [];
let turbines = [];
let dummies = [];

let engine;
let world;
let deltaTime; // seconds
let globalTime = 0; // seconds
let camera;
let player;
let lastDummyCreationTime = 0.0;
const particleLifetime = 10.0; // lifetime of each liquid particle (in seconds)
const defaultParticleRadius = 10.0; // radius of liquid particles

// ui
let spawnLiquidCheckbox;
let spawnDummiesCheckbox;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// main sketch
var sketch1 = function (p) {
    p.setup = function () {
        // create ui elements
        spawnLiquidCheckbox = p.createCheckbox("Spawn liquid", true);
        spawnLiquidCheckbox.position(10, 10);
        spawnLiquidCheckbox.style("z-index: 2");

        spawnDummiesCheckbox = p.createCheckbox("Spawn dummies", false);
        spawnDummiesCheckbox.position(10, 10 * 3);
        spawnDummiesCheckbox.style("z-index: 2");

        // create a canvas
        var canvas = p.createCanvas(w, h, p.WEBGL);
        camera = p.createCamera();

        // don't ask me where i got camera.cameraFar/10 from
        camera.setPosition(w / 2, h / 2, camera.cameraFar / 10);
        canvas.parent("main");

        // initialize matter
        engine = Engine.create();
        world = engine.world;

        // create a turbine
        turbines.push(new Turbine(547, 390, 120, 15));

        // create boundaries
        boundaries.push(new Boundary(192, 240.75, 192.6, 28.8, 0));
        boundaries.push(new Boundary(96, 144.45, 192.6, 28.8, p.radians(90)));
        boundaries.push(
            new Boundary(368.64, 288.9, 192.6, 28.8, p.radians(30))
        );
        boundaries.push(new Boundary(576, 481.5, 963, 28.8, p.radians(-30)));

        // create the player
        player = new Player(200, 0);
    };

    p.draw = function () {
        deltaTime = p.deltaTime / 1000;
        globalTime += deltaTime;
        p.background(50);
        p.fill(255);

        createNewLiquidParticle(768 + p.random(0, 15), 192.6 + p.random(0, 15));

        if (
            globalTime - lastDummyCreationTime > 5 &&
            spawnDummiesCheckbox.checked()
        ) {
            dummies.push(
                new Dummy(200 + getRandomInt(0, 100), getRandomInt(0, 50))
            );
            lastDummyCreationTime = globalTime;
        }

        // next physics step
        Engine.update(engine);

        for (let boundary of boundaries) {
            boundary.show();
        }
        for (let turbine of turbines) {
            turbine.show();
        }
        document.title =
            world.bodies.length + " bodies, " + p.round(p.frameRate()) + " FPS";
    };

    p.keyPressed = function (event) {
        // console.log(event);
        player.handleInput(event.keyCode);
    };
};

// liquid sketch
var sketch2 = function (p) {
    p.setup = function () {
        // create a canvas and apply SVG liquid filters on it
        var canvas = p
            .createCanvas(w, h)
            .style("-webkit-filter", `url("#liquid-filter")`)
            .style("filter", `url("#liquid-filter")`);
        canvas.parent("liquid");
    };

    p.draw = function () {
        p.clear();
        player.clampVelocity();
        player.show();

        if (p.mouseIsPressed) {
            for (var i = 0; i < 2; i++) {
                createNewLiquidParticle(
                    p.mouseX + p.random(0, 10),
                    p.mouseY + p.random(0, 10)
                );
            }
        }

        for (var i = 0; i < particles.length; i++) {
            particles[i].existTime += deltaTime;
            particles[i].destroyIfNeeded();

            particles[i].show();
            if (particles[i].isOffScreen() || particles[i].destroyMe) {
                particles[i].destroy();
                particles.splice(i, 1);
                i--;
            }
        }

        for (var i = 0; i < dummies.length; i++) {
            dummies[i].show();
            if (dummies[i].isOffScreen()) {
                dummies[i].destroy();
                dummies.splice(i, 1);
                i--;
            }
        }
    };
};

window.onresize = function () {
    // assigns new values for width and height variables
    w = window.innerWidth;
    h = window.innerHeight;
    mainSketch.resizeCanvas(w, h);
    liquidSketch.resizeCanvas(w, h);
    camera.setPosition(w / 2, h / 2, camera.cameraFar / 10);
};

var mainSketch = new p5(sketch1);
var liquidSketch = new p5(sketch2);
