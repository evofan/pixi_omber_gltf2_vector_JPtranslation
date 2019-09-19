const WIDTH = 800;
const HEIGHT = 600;
const APP_FPS = 60;

// init
let app = new PIXI.Application({
  width: WIDTH,
  height: HEIGHT,
  antialias: true // must. false = Sprite becomes jaggy.
});
let canvas = document.getElementById("canvas");
canvas.appendChild(app.view);
app.renderer.backgroundColor = 0x000033;
app.stage.interactive = true;
app.ticker.remove(app.render, app);
const fpsDelta = 60 / APP_FPS;

let bg;
let elapsedTime = 0;

let container = new PIXI.Container();
container.width = 800;
container.height = 600;
container.x = 0;
container.y = 0;
container.pivot.x = 0;
container.pivot.y = 0;
app.stage.addChild(container);

// asset property
/* const ASSET_BG = "images/sky_bg.jpg"; */
const ASSET_SNOW = "asset/snow4.glb";

// snow property
const ROTATE_LEFT = 1;
const ROTATE_RIGHT = 2;
const MAX_NUM = 10;
const MAX_SCALE = 1;
const MAX_ACCEL = 7;
const MIN_ALPHA = 0.3;
const MAX_ALPHA = 1;
const MAX_RADIUS = 5;
const MIN_RADIUS = 1;
let snows = [];
let radiusNums = [];
let angleNums = [];
let accelNums = [];
let rotateNums = [];

PIXI.loader
  /* .add("bg_data", ASSET_BG) */
  .add("snow_data", ASSET_SNOW)
  .load(onAssetsLoaded);

/**
 * Asset load Complete
 * @param { object } loader object
 * @param { object } res asset data
 */
function onAssetsLoaded(loader, res) {
  /*
  // BG
  bg = new PIXI.Sprite(res.bg_data.texture);
  container.addChild(bg);
  bg.x = 0;
  bg.y = 0;
  bg.width = 800;
  bg.height = 600;

  // Text
  let text = new PIXI.Text("Fall Snow", {
    fontFamily: "Arial",
    fontSize: 30,
    fill: 0xf0fff0,
    align: "center",
    fontWeight: "bold",
    stroke: "#000000",
    strokeThickness: 4,
    dropShadow: false,
    dropShadowColor: "#666666",
    lineJoin: "round"
  });
  container.addChild(text);
  text.x = 10;
  text.y = 10;
  */

  // Snow
  for (let i = 0; i < MAX_NUM; i++) {
    let snow = new PIXI.omber.VectorMesh(res.snow_data.gltf);
    snow.height = 32;
    snow.width = 32;

    // x position
    let xNum = Math.floor(Math.random() * WIDTH + 1);
    snow.x = xNum;

    // y position
    let yNum = -Math.floor(Math.random() * 100 + 1);
    snow.y = yNum;

    // xy scale
    let scaleNum = Math.random() * 0.5 + 0.1;
    snow.scale.x = scaleNum;
    snow.scale.y = scaleNum;

    // direction of rotation
    let rotateDirecNum = Math.floor(Math.random() * 2 + 1);
    rotateDirecNum === 1
      ? (rotateDirecNum = ROTATE_LEFT)
      : (rotateDirecNum = ROTATE_RIGHT);
    // console.log(rotateDirecNum);
    rotateNums.push(rotateDirecNum);

    // acceleration
    let accelNum = Math.floor(Math.random() * MAX_ACCEL + 1);
    accelNums.push(accelNum);

    // transparency
    let alphaNum =
      Math.floor((Math.random() * (MAX_ALPHA - MIN_ALPHA) + MIN_ALPHA) * 10) / 10;
    // console.log(alphaNum);
    snow.alpha = alphaNum;

    // radius
    let radiusNum = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
    radiusNums.push(radiusNum);

    // angle
    let angleNum = Math.floor(Math.random() * 360 + 1);
    angleNums.push(angleNum);

    snows.push(snow);
    container.addChild(snow);
  }

  let ticker = PIXI.ticker.shared;
  ticker.autoStart = false;
  ticker.stop();
  PIXI.settings.TARGET_FPMS = 0.06;
  app.ticker.add(tick);
}

/**
 * adjust fps
 * @param { number } delta time
 */
function tick(delta) {
  elapsedTime += delta;

  if (elapsedTime >= fpsDelta) {
    // enough time passed, update app
    update(elapsedTime);
    // reset
    elapsedTime = 0;
  }
}

/**
 * app rendering
 * @param { number } delta  time
 */
function update(delta) {
  for (let i = 0; i < MAX_NUM; i++) {
    // radian
    let radian = (angleNums[i] * Math.PI) / 180;
    snows[i].x += radiusNums[i] * Math.cos(radian);
    snows[i].y += 1 * accelNums[i];
    angleNums[i] += 5;

    // rotate left or right
    if (rotateNums[i] === ROTATE_LEFT) {
      snows[i].rotation -= 0.1;
    } else {
      snows[i].rotation += 0.1;
    }

    // moved out of screen
    if (HEIGHT + snows[i].height < snows[i].y) {
      let xNew = Math.floor(Math.random() * WIDTH + 1);
      snows[i].x = xNew;
      snows[i].y = -snows[i].height;
    }
  }

  //render the canvas
  app.render();
}
