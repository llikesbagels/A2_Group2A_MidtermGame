//  THROUGH THE TREES — Tutorial Level
// ─────────────────────────────────────────────────────────


let imgSky, imgBgTrees, imgBushes, imgGround, imgFgTrees;
let imgSprites, imgLog, imgRock, imgRacoon, imgRabbit;
let imgSign, imgPlatform, imgPlatform2, imgSpikes, imgFinishSign;


// ── Sound variables ────────────────────────────────────────
let sndMusic, sndJump, sndDamage, sndWin, sndWalk;
let walkSoundTimer = 0;
let audioStarted    = false;   // has the AudioContext been resumed yet?


// Loading the sound FILES doesn't need the AudioContext running —
// only actually *playing* them does. So they're loaded in preload()
// like everything else, guaranteeing they're ready by the time the
// game starts (no more racing the first jump/keypress).
function loadSounds() {
  if (typeof loadSound === 'undefined') return;   // p5.sound not included — bail safely
  // every call gets a success + error callback so a single missing/broken
  // sound file can NOT hang preload() forever (which would block setup()
  // from ever running — createCanvas lives there, so that means a blank screen)
  sndMusic  = loadSound('assets/sounds/music.mp3',   () => {}, () => { console.warn('music.mp3 failed to load');   sndMusic  = null; });
  sndJump   = loadSound('assets/sounds/jump.mp3',    () => {}, () => { console.warn('jump.mp3 failed to load');    sndJump   = null; });
  sndDamage = loadSound('assets/sounds/damage.mp3',  () => {}, () => { console.warn('damage.mp3 failed to load');  sndDamage = null; });
  sndWin    = loadSound('assets/sounds/win.mp3',     () => {}, () => { console.warn('win.mp3 failed to load');     sndWin    = null; });
  sndWalk   = loadSound('assets/sounds/walking.mp3', () => {}, () => { console.warn('walking.mp3 failed to load'); sndWalk   = null; });
}


// Browsers block audio until a real user gesture (keypress/click)
// resumes the AudioContext. This is almost always why sounds "don't
// work" even though everything else is wired up correctly — the
// files load fine, but .play() is silently ignored until this runs.
function startAudioOnce() {
  if (!audioStarted) {
    audioStarted = true;
    if (typeof userStartAudio === 'function') userStartAudio();
  }


  if (sndMusic && sndMusic.isLoaded() && !sndMusic.isPlaying()) {
    sndMusic.setVolume(0.4);
    sndMusic.loop();
  }
}


const NUM_FRAMES = 5;
const ANIM_SPEED = 8;


let charX, charY;
let velY       = 0;
let onGround   = false;
let animFrame  = 0;
let animTimer  = 0;
let facingLeft = false;
let isMoving   = false;


const GRAVITY    = 0.65;
const JUMP_FORCE = -18;
const WALK_SPEED = 7;


let worldX      = 0;
const LEVEL_END = 8500;
let gameWon     = false;
let gameLost    = false;


let debugMode = false;


let hp           = 3;
const MAX_HP     = 3;
let invTimer     = 0;
const INV_FRAMES = 80;


let levelTimer      = 0;
const TIME_LIMIT    = 90 * 60;


const INTRO_DISPLAY_FRAMES = 10;
const INTRO_FADE_FRAMES = 60;
let introTimer = INTRO_DISPLAY_FRAMES + INTRO_FADE_FRAMES;
let introFadeStarted = false;


const FLIP_AT       = [700, 5200];
let   flipIndex     = 0;
let   flipped       = false;
let   flipTimer     = 0;
const FLIP_DURATION = 320;
let   countdown     = 0;
let   countdownTimer = 0;
const COUNTDOWN_FRAMES = 55;


const LOGS = [
  { wx: 500 }, // log 1: edit x-position here
  { wx: 3600 }, // log 2: edit x-position here
  { wx: 7000 }, // log 2: edit x-position here

  //{ wx: 4800 }, // removed log before the platform section
];
const ROCKS = [
  { wx: 3000 }, // rock 1: edit x-position here
  { wx: 3500 }, // rock 2: edit x-position here
  { wx: 6000 }, // rock 3: edit x-position here
    { wx: 4000 }, // rock 3: edit x-position here
  { wx: 4200 }, // rock 3: edit x-position here

];

const TALLROCKS = [
  
  { wx: 6000 }, // rock 3: edit x-position here
];


let animals = [
  { wx:2600, type:'rabbit', dir: 1, range:110, speed:2.0, frame:0, ft:0, vx:0 },
  { wx:4000, type:'racoon', dir: 1, range: 90, speed:1.5, frame:0, ft:0, vx:0 },
  { wx:1300, type:'bear', dir: 1, range:100, speed:3, frame:0, ft:1, vx:2 },
  { wx:0, type:'bear', dir: 1, range:100, speed:5, frame:0, ft:1, vx:2 },
    { wx:8000, type:'bear', dir: 1, range:100, speed:5, frame:0, ft:1, vx:2 },


];
animals.forEach(a => a.startWx = a.wx);


const PIT_START  = 1500;
const PIT_END    = 3000;

let platdistance = 0;
let platdistanceDir = 1;
const PLAT_DISTANCE_MIN = 1500;
const PLAT_DISTANCE_MAX = 2250;



//4000 need to add something here


let PLATFORMS = [
  { baseWx: 1140, wx: 1140, wyOff: 0.20, speed: 0, dir: 1, minWx: 1140, maxWx: 1140 }, // static platform before blue pit

  { baseWx: 4500, wx: 5650, wyOff: 0.20, speed: 3, dir: 1, minWx: 1500, maxWx: 2000 }, // platform 1 speed 0.65
  { baseWx: 5920, wx: 5920, wyOff: 0.28, speed: 4, dir: 1, minWx: 1750, maxWx: 2250 }, // platform 2 speed 0.85
  { baseWx: 6480, wx: 6480, wyOff: 0.50, speed: 5, dir: 1, minWx: 2300, maxWx: 2700 }, // platform 4 speed 1.25
   
    { baseWx: 7000, wx: 7000, wyOff: 0.50, speed: 6, dir: 1, minWx: 2300, maxWx: 2700 }, // platform 4 speed 1.25
  { baseWx: 8000, wx: 8000, wyOff: 0.50, speed: 6, dir: 1, minWx: 2300, maxWx: 2700 }, // platform 4 speed 1.25
  { baseWx: 6480, wx: 6480, wyOff: 0.50, speed: 6, dir: 1, minWx: 2300, maxWx: 2700 }, // platform 4 speed 1.25

  
  { baseWx: 6480, wx: 6480, wyOff: 0.50, speed: 6, dir: 1, minWx: 5000, maxWx: 6000 }, // platform 4 speed 1.25

];
const PLAT_W = 350;
const PLAT_H = 10;

function updatePlatDistance() {
  for (let p of PLATFORMS) {
    p.wx += p.speed * p.dir;
    if (p.wx <= p.minWx || p.wx >= p.maxWx) {
      p.dir *= -1;
      p.wx = constrain(p.wx, p.minWx, p.maxWx);
    }
  }
}


function groundH() { return height * 0.44; }
function groundY() { return height - groundH() * 0.5; }
function toScreen(worldPos) { return worldPos - worldX; }
function platY(p) { return groundY() - groundY() * p.wyOff; }


// ─────────────────────────────────────────────────────────
let elerground, bear; // declare the variables used later


function preload() {
  function l(path, name) {
    return loadImage(path,
      img => console.log('loaded', name, img.width + 'x' + img.height),
      err => { console.error('failed to load', name, path, err); }
    );
  }
  imgBgTrees   = loadImage('assets/images/Stone2.png');
  //imgBushes    = loadImage('assets/images/Asset9.png');
  title        = loadImage('assets/images/title.PNG');
  elleground   = loadImage('assets/images/Stone.png');


  imgFgTrees   = loadImage('assets/images/Caving.png');
  imgSprites   = loadImage('assets/images/sprites2.png');
  imgLog       = loadImage('assets/images/log.png');
  imgRock      = loadImage('assets/images/rock.png');
  imgRacoon    = loadImage('assets/images/racoon.png');
  imgRabbit    = loadImage('assets/images/rabbit.png');
  imgSign      = loadImage('assets/images/sign.png');
  imgPlatform  = loadImage('assets/images/Plat.png');
  imgPlatform2 = loadImage('assets/images/Plat.png');
  imgSpikes    = loadImage('assets/images/spikes.png');
  imgFinishSign= loadImage('assets/images/village.jpg');
  bear = loadImage('assets/images/Beardouble.png');
  wall = loadImage('assets/images/IMG_5152.PNG');
  tallrock = loadImage('assets/images/tallrock.png');


  // NOTE: sounds are deliberately NOT loaded here. p5.sound's preload
  // tracking does not reliably resolve on a failed/missing file even
  // with an error callback, which can hang preload() forever and
  // block setup() — and therefore createCanvas() — from ever running.
  // Sounds are loaded separately in setup() instead, fully decoupled
  // from preload's blocking wait. Every .play()/.stop() call already
  // checks .isLoaded(), so this is safe even if a file never arrives.
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);
  charX = width * 0.25;
  charY = groundY();
  loadSounds();   // decoupled from preload — can't block canvas creation
 
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  charX = width * 0.25;
  if (onGround) charY = groundY();
}




// ─────────────────────────────────────────────────────────
function draw() {
  startAudioOnce();


  if (gameWon)  { drawWinScreen();  return; }
  if (gameLost) { drawLoseScreen(); return; }


  if (introTimer > 0) {
    introTimer--;
    drawBG();
    drawStartSign();
     drawChar();
     drawFG();
     drawIntroOverlay();
    return;
  }


  isMoving = false;
  let movingInput = keyIsDown(65) || keyIsDown(37) || keyIsDown(68) || keyIsDown(39);


  let goLeft  = flipped ? (keyIsDown(68)||keyIsDown(39)) : (keyIsDown(65)||keyIsDown(37));


  let goRight = flipped ? (keyIsDown(65)||keyIsDown(37)) : (keyIsDown(68)||keyIsDown(39));
  charX = width * 0.25;
  if (goLeft)  {
    worldX = max(0, worldX - WALK_SPEED);
    facingLeft = true;
    isMoving = true;
  }
  if (goRight) {
    worldX = min(LEVEL_END, worldX + WALK_SPEED);
    facingLeft = false;
    isMoving = true;
  }

  updatePlatDistance();

  // Jump sound
  if ((keyIsDown(32)||keyIsDown(87)||keyIsDown(38)) && onGround) {
    velY=JUMP_FORCE; onGround=false;
    if (sndJump && sndJump.isLoaded()) { sndJump.stop(); sndJump.setVolume(0.1); sndJump.play(); }
  }


  // Walking sound


  if (movingInput && isMoving && onGround) {
    walkSoundTimer++;
    if (walkSoundTimer >= 22) {
      walkSoundTimer = 0;
      if (sndWalk && sndWalk.isLoaded() && !sndWalk.isPlaying()) {
        sndWalk.stop();
        sndWalk.setVolume(2);
        sndWalk.play();
      }
    }
  } else { walkSoundTimer = 0; }


  if (isMoving) {
    animTimer++;
    if (animTimer>=ANIM_SPEED) { animTimer=0; animFrame=(animFrame+1)%NUM_FRAMES; }
  } else { animFrame=0; animTimer=0; }


  velY  += GRAVITY;
  charY += velY;
  let gy = groundY();


  onGround = false;
  for (let p of PLATFORMS) {
    let psx = toScreen(p.wx);
    let py  = platY(p);
    let prevFeet = charY - velY;
    if (charX > psx && charX < psx + PLAT_W) {
      if (prevFeet <= py && charY >= py && velY > 0) {
        charY = py; velY = 0; onGround = true;
      }
    }
  }
  if (charY >= gy) { charY=gy; velY=0; onGround=true; }


  updateFlip();


  for (let a of animals) {
    if (a.type === 'bear') {
      let playerWorldX = worldX + charX;
      let toPlayer = playerWorldX - a.wx;
      let attackRange = 80;
      let desiredSpeed = Math.sign(toPlayer) * (Math.abs(toPlayer) < attackRange ? 3 : 1.5);

      a.vx = lerp(a.vx, desiredSpeed, 0.12);
      let newWx = a.wx + a.vx;

      // compute screen width for the bear (same as used for drawing/collision)
      let bearScreenW = height * 0.13 * 2 * 1.05;
      let sxNew = toScreen(newWx);

      // check for pit / blue rectangle
      let blocked = false;
      if (newWx > PIT_START && newWx < PIT_END) blocked = true;

      // check LOGS
      let logH = height * 0.20, logW = logH * (139/88);
      for (let o of LOGS) {
        let osx = toScreen(o.wx);
        if (sxNew + bearScreenW*0.5 > osx + 12 && sxNew - bearScreenW*0.5 < osx + logW - 12) { blocked = true; break; }
      }
      // check ROCKS
      let rockH = height * 0.08, rockW = rockH * (117/66);
      if (!blocked) for (let o of ROCKS) {
        let osx = toScreen(o.wx);
        if (sxNew + bearScreenW*0.5 > osx + 12 && sxNew - bearScreenW*0.5 < osx + rockW - 12) { blocked = true; break; }
      }

      if (!blocked) for (let o of TALLROCKS) {
        let osx = toScreen(o.wx);
        let tallRockW = rockW * 3;
        if (sxNew + bearScreenW*0.5 > osx + 12 && sxNew - bearScreenW*0.5 < osx + tallRockW - 12) { blocked = true; break; }
      }

      if (blocked) {
        // reverse direction so bears don't cross obstacles / pit
        a.vx = -a.vx; a.dir = a.vx >= 0 ? 1 : -1;
      } else {
        a.wx = newWx;
        a.dir = a.vx >= 0 ? 1 : -1;
      }
    } else {
      a.wx += a.dir * a.speed;
      if (a.wx > a.startWx + a.range || a.wx < a.startWx - a.range) a.dir *= -1;
    }


    a.ft++;
    if (a.ft >= 8) {
      a.ft = 0;
      a.frame = (a.frame + 1) % 2;
    }
  }


  if (worldX >= LEVEL_END) {
    gameWon=true;
    if (sndWin && sndWin.isLoaded()) sndWin.play();
    if (sndMusic && sndMusic.isLoaded()) sndMusic.stop(); sndMusic.setVolume(0.01);
    return;
  }
  levelTimer++;
  if (levelTimer >= TIME_LIMIT) { gameLost=true; if (sndMusic && sndMusic.isLoaded()) sndMusic.stop(); sndMusic.setVolume(0.01);return; }
  if (invTimer > 0) invTimer--;
  else checkDamage();
 
  drawBG();
  //drawStartSign();
  drawPit();
  drawPlatforms();
  drawObstacles();
  drawAnimals();
  drawFinishSign();
  drawChar();
  drawFG();
  drawHUD();
  drawFlipHUD();
  
  if (debugMode) drawDebugPanel();

  fill('brown');
  rect(7000,gy,1000,height*2);
}


// ─────────────────────────────────────────────────────────
function updateFlip() {
  if (flipped) { flipTimer--; if (flipTimer<=0) flipped=false; return; }
  if (countdownTimer > 0) {
    countdownTimer--;
    countdown = ceil(countdownTimer / COUNTDOWN_FRAMES);
    if (countdownTimer <= 0) {
      flipped = true;
      flipTimer = FLIP_DURATION;
      countdown = 0;
      countdownTimer = 0;
      flipIndex++;
    }
    return;
  }
  if (flipIndex >= FLIP_AT.length) return;
  let trigger = FLIP_AT[flipIndex];
  if (worldX >= trigger) {
    countdownTimer = COUNTDOWN_FRAMES * 3;
    countdown = 3;
  }
}


// ─────────────────────────────────────────────────────────
function tileLayer(img, destH, destY, scrollAmt) {
  if (!img) return;
  let scale=destH/img.height, tileW=img.width*scale;
  let offset=((scrollAmt*scale)%tileW+tileW)%tileW;
  let n=ceil(width/tileW)+2;
  for (let i=-1;i<n;i++) image(img,i*tileW-offset,destY,tileW,destH);
}


function drawBG() {
  let bgScroll = min(worldX, LEVEL_END - 800);
  let progress = levelTimer / TIME_LIMIT;


  let skyTop, skyBot;
  if (progress < 0.35) {
    let t = progress / 0.5;
    skyTop = lerpColor(color(0,0,0), color(155,130,100), t);
    skyBot = lerpColor(color(145,185,180), color(210,175,120), t);
  } else if (progress < 0.65) {
    let t = (progress - 0.35) / 0.30;
    skyTop = lerpColor(color(155,130,100), color(155,115,115), t);
    skyBot = lerpColor(color(210,175,120), color(215,155,130), t);
  } else if (progress < 0.85) {
    let t = (progress - 0.65) / 0.20;
    skyTop = lerpColor(color(155,115,115), color(90,85,110), t);
    skyBot = lerpColor(color(215,155,130), color(135,115,130), t);
  } else {
    let t = (progress - 0.85) / 0.15;
    skyTop = lerpColor(color(0,0,0), color(30,28,42), t);
    skyBot = lerpColor(color(135,115,130), color(55,48,65), t);
  }


  noStroke();
  for (let i = 0; i <= height; i++) {
    stroke(lerpColor(skyTop, skyBot, i/height));
    line(0, i, width, i);
  }
  noStroke();


  let sunAngle = PI + progress * PI;
  let sunCx    = width*0.5 + cos(sunAngle)*width*0.38;
  let sunCy    = height*0.55 - sin(sunAngle)*height*0.55;
  let sunR     = height*0.055;
  let sunAlpha = progress < 0.8 ? 200 : map(progress, 0.8, 1.0, 200, 60);


  for (let r = sunR*2.5; r > sunR; r -= sunR*0.3) {
    let a = map(r, sunR, sunR*2.5, sunAlpha*0.5, 0);
    fill(progress < 0.5 ? color(245,220,160,a) : color(220,170,140,a));
    ellipse(sunCx, sunCy, r*2, r*2);
  }
  fill(progress < 0.5 ? color(248,228,175,sunAlpha) : progress < 0.8 ? color(235,185,130,sunAlpha) : color(180,165,195,sunAlpha));
  ellipse(sunCx, sunCy, sunR*2, sunR*2);


  tileLayer(imgBgTrees, height, 0, bgScroll*0.12);
  let bushH = height*0.30;
  //tileLayer(imgBushes, bushH, height-bushH-groundH()*0.50, bgScroll*0.04);
  tileLayer(elleground, groundH(), height-groundH(), worldX*0.45);
}


function drawFG() { tileLayer(imgFgTrees, height, 0, worldX*1.15); }


// ─────────────────────────────────────────────────────────
function drawPit() {
  
  let gy  = groundY();
  let psx = toScreen(PIT_START);
  let pex = toScreen(PIT_END);
  let pitW = pex - psx;
  if (pex < -10 || psx > width+10) return;

  image(wall,psx, 0, pitW, 600);

  fill('blue');
  rect(psx-6, gy, 1500, height*2);

  fill('brown');
  rect(psx+ 4000,gy,1000,height*2);
//fish
 

}


// ─────────────────────────────────────────────────────────
function drawPlatforms() {
  let srcX2=3, srcY2=100, srcW2=148, srcH2=229;
  imageMode(CORNER);
  for (let p of PLATFORMS) {
    let sx=toScreen(p.wx);
    let py=platY(p);
    if (sx < -PLAT_W-20 || sx > width+20) continue;
    let ih=groundY()-py+PLAT_H;
    image(imgPlatform, sx, py, PLAT_W, ih, srcX2, srcY2, srcW2, srcH2);
  }
  imageMode(CENTER);
}


// ─────────────────────────────────────────────────────────
function drawObstacles() {
  let gy=groundY();
  let logH=height*0.20, logW=logH*(139/88);
  let rockH=height*0.08, rockW=rockH*(117/66);


  imageMode(CORNER);
  for (let o of LOGS) {
    let sx=toScreen(o.wx);
    if (sx<-200||sx>width+200) continue;
    image(imgLog,sx,gy-logH,logW,logH,258,46,139,88);
  }
  for (let o of ROCKS) {
    let sx=toScreen(o.wx);
    if (sx<-200||sx>width+200) continue;
    image(imgRock,sx,gy-rockH*1.5,rockW*1.5,rockH,115,56,117,66);
  }

   for (let o of TALLROCKS) {
    let sx=toScreen(o.wx);
    if (sx<-200||sx>width+200) continue;
    let tallRockW = rockW * 5;
    image(tallrock, sx, 0, tallRockW, height, 400, 56, 500, 500);
  }

}






// ─────────────────────────────────────────────────────────
function drawAnimals() {
  let gy=groundY();
  imageMode(CORNER);
  for (let a of animals) {
    let sx=toScreen(a.wx);
    if (sx<-200||sx>width+200) continue;
    if (a.type==='racoon') {
      let dh=height*0.09, dw=dh*(74/72), srcX=18+a.frame*74;
      if (a.dir<0) { push(); translate(sx+dw,gy-dh); scale(-1,1); image(imgRacoon,0,0,dw,dh,srcX,288,74,72); pop(); }
      else         { image(imgRacoon,sx,gy-dh,dw,dh,srcX,288,74,72); }
    } else if (a.type==='bear') {
      if (bear) {
        let dh = height * 0.13 * 3; // doubled size
        let dw = dh * 1.05;
        let frames = 4;
        let srcW = bear.width / frames;
        let srcH = bear.height;
        let frameIndex = a.dir < 0 ? a.frame : 2 + a.frame;
        let srcX = frameIndex * srcW;
        image(bear, sx, gy - dh + 60, dw, dh, srcX, 0, srcW, srcH);
      }
    } else {
      let dh=height*0.08, dw=dh*(95/80), srcX=a.frame*95;
      if (a.dir<0) { push(); translate(sx+dw,gy-dh); scale(-1,1); image(imgRabbit,0,0,dw,dh,srcX,80,95,80); pop(); }
      else         { image(imgRabbit,sx,gy-dh,dw,dh,srcX,80,95,80); }
    }
  }
}


// ─────────────────────────────────────────────────────────
function drawStartSign() {
  let sx=toScreen(120), gy=groundY();
  if (sx<-300||sx>width+300) return;
  let dh=height*0.28, dw=dh*(197/268);
  imageMode(CORNER);
  image(imgSign, sx-dw*0.3 + 1100, gy-dh, dw, dh, 47, 71, 197, 268);
  imageMode(CENTER);
}


// ─────────────────────────────────────────────────────────
function drawFinishSign() {
  let sx=toScreen(LEVEL_END + 50), gy=groundY();
  if (sx<-300||sx>width+300) return;
  let dh=height*0.28, dw=dh*(300/400);
  imageMode(CORNER);
  image(imgFinishSign, sx-dw*0.3, gy-dh, 300, 300);
  imageMode(CENTER);
}


// ─────────────────────────────────────────────────────────
function drawChar() {
  let dispH=height*0.20, dispW=dispH*(119/135);
  let drawX=charX-dispW/2, drawY=charY-dispH;
  imageMode(CORNER);
  push();
  if (facingLeft) { translate(drawX+dispW,drawY); scale(-1,1); }
  else            { translate(drawX,drawY); }
  image(imgSprites,0,0,dispW,dispH,animFrame*119,0,119,135);
  pop();
}


// ─────────────────────────────────────────────────────────
function checkDamage() {
  let gy=groundY();
  let worldPlayerX = worldX + charX;
  // immediate death if player is over the blue pit area and at/near ground level
  let playerInPit = worldPlayerX > PIT_START && worldPlayerX < PIT_END;
  if (playerInPit && charY >= gy - height*0.05) { gameLost=true; if (sndMusic && sndMusic.isLoaded()) sndMusic.stop(); return; }
  // also keep falling-into-pit detection
  let fallingIn = !onGround && charY > gy - height*0.10 && velY > 2;
  if (playerInPit && fallingIn) { gameLost=true; if (sndMusic && sndMusic.isLoaded()) sndMusic.stop(); return; }


  if (charY<gy-height*0.05) return;


  let pw=width*0.010, px1=charX-pw, px2=charX+pw;
  let logH=height*0.10, logW=logH*(139/88);
  let rockH=height*0.08, rockW=rockH*(117/66);


  for (let o of LOGS) {
    let sx=toScreen(o.wx);
    if (px2>sx+16&&px1<sx+logW-16) { takeDamage(); return; }
  }
  for (let o of ROCKS) {
    let sx=toScreen(o.wx);
    if (px2>sx+16&&px1<sx+rockW-16) { takeDamage(); return; }
  }
  for (let a of animals) {
    let sx=toScreen(a.wx);
    let dw = a.type === 'racoon'
      ? height * 0.09 * (74 / 72)
      : a.type === 'bear'
        ? height * 0.13 * 2 * 1.05 // bear is drawn twice as big; match draw size
        : height * 0.08 * (95 / 80);
    if (px2 > sx + 12 && px1 < sx + dw - 12) {
      if (a.type === 'bear' || a.type === 'racoon' || a.type === 'rabbit') {
        takeDamage();
        return;
      }
    }
  }
}


function takeDamage() {
  hp--; invTimer=INV_FRAMES;
  if (sndDamage && sndDamage.isLoaded()) { sndDamage.stop(); sndDamage.setVolume(0.15); sndDamage.play(); }
  if (hp<=0) { hp=0; gameLost=true; if (sndMusic && sndMusic.isLoaded()) sndMusic.stop(); }
}


// ─────────────────────────────────────────────────────────
function drawHUD() {
  let pad=width*0.018, hs=height*0.038;
  for (let i=0;i<MAX_HP;i++) drawPixelHeart(pad+i*(hs*1.4), pad, hs, i<hp);


  let timeLeft=max(0,TIME_LIMIT-levelTimer), pct=timeLeft/TIME_LIMIT;
  let barW=width*0.18, barH=height*0.018;
  let bx=width-barW-pad, by=pad;
  noStroke(); fill(20,30,18,180); rect(bx-2,by-2,barW+4,barH+4,3);
  let bc=pct>0.5?lerpColor(color(180,210,80),color(220,180,40),map(pct,1,0.5,0,1))
        :pct>0.2?lerpColor(color(220,180,40),color(210,80,40),map(pct,0.5,0.2,0,1))
        :color(210,60,40);
  fill(bc); rect(bx,by,barW*pct,barH,2);
  stroke(20,30,18,120); strokeWeight(1);
  for (let t=1;t<6;t++) { let tx=bx+barW*(t/6); line(tx,by,tx,by+barH); }
  noStroke();
  fill(190,215,160); textFont('monospace'); textStyle(BOLD); textSize(height*0.016);
  textAlign(RIGHT,TOP); text('TIME',width-pad,by+barH+3); textStyle(NORMAL);


  let progress=levelTimer/TIME_LIMIT;
  if (progress>0.82) {
    let a=map(progress,0.82,1.0,0,200);
    fill(200,185,215,a);
    textAlign(CENTER,TOP); textFont('Georgia'); textStyle(ITALIC);
    textSize(height*0.020);
    if (floor(frameCount/25)%2===0||progress<0.92) text('the light is fading...',width/2,pad);
    textStyle(NORMAL);
  }
}


function drawPixelHeart(x,y,s,full) {
  let p=s/4;
  let g=[[0,1,0,1,0],[1,1,1,1,1],[1,1,1,1,1],[0,1,1,1,0],[0,0,1,0,0]];
  noStroke();
  for (let r=0;r<5;r++) for (let c=0;c<5;c++) {
    if (!g[r][c]) continue;
    if (full) fill(r<2&&c<2?color(230,100,110):color(195,48,58));
    else fill(60,45,45);
    rect(x+c*p,y+r*p,p,p);
  }
  if (invTimer>0&&floor(invTimer/5)%2===0) {
    fill(255,255,255,160);
    for (let r=0;r<5;r++) for (let c=0;c<5;c++) if (g[r][c]) rect(x+c*p,y+r*p,p,p);
  }
}


// ─────────────────────────────────────────────────────────
function drawFlipHUD() {
  if (!flipped && countdown > 0) {
    noStroke(); fill(0,0,0,55); rect(0,0,width,height);
    let cx=width/2, cy=height/2;
    if (floor(frameCount/6)%2===0) { noFill(); stroke(200,220,180,140); strokeWeight(3); ellipse(cx,cy,height*0.38,height*0.38); noStroke(); }
    fill(20,35,18,180); ellipse(cx,cy,height*0.32,height*0.32);
    stroke(120,160,90,200); strokeWeight(2); noFill(); ellipse(cx,cy,height*0.32,height*0.32); noStroke();
    textAlign(CENTER,CENTER); textFont('Georgia'); textStyle(BOLD); textSize(height*0.14);
    fill(0,0,0,160); text(str(countdown),cx+3,cy+3);
    fill(210,230,185); text(str(countdown),cx,cy);
    textSize(height*0.024); textStyle(NORMAL);
    fill(0,0,0,140); text('controls changing',cx+2,cy+height*0.21+2);
    fill(190,215,165); text('controls changing',cx,cy+height*0.21);
  }


  if (flipped) {
    let cx=width/2, ty=height*0.38, msg='controls flipped';
    textFont('Georgia'); textStyle(BOLD); textSize(height*0.040);
    let tw=textWidth(msg), pw=tw+60, ph=height*0.072;
    let px=cx-pw/2, py=ty-ph/2;
    noStroke(); fill(0,0,0,100); rect(px+3,py+3,pw,ph,ph/2);
    fill(32,48,28,210); rect(px,py,pw,ph,ph/2);
    stroke(110,155,80,200); strokeWeight(2); noFill(); rect(px+3,py+3,pw-6,ph-6,ph/2); noStroke();
    fill(90,140,65,200); ellipse(px+14,ty,12,7); ellipse(px+pw-14,ty,12,7);
    textAlign(CENTER,CENTER);
    fill(0,0,0,160); text(msg,cx+2,ty+2);
    fill(210,235,175); text(msg,cx,ty);
    textStyle(NORMAL);


    let timeLeft=flipTimer;
    if (timeLeft<=180) {
      let endMsg=timeLeft<=60?'1':timeLeft<=120?'2':'3';
      let warningAlpha=timeLeft<=60?255:map(timeLeft,180,120,100,220);
      textFont('Georgia'); textStyle(BOLD); textSize(height*0.022);
      let ww=textWidth('controls returning')+40, wh=height*0.042;
      let wx2=cx-ww/2, wy=ty+ph/2+12;
      noStroke(); fill(0,0,0,80); rect(wx2+2,wy+2,ww,wh,wh/2);
      fill(80,55,28,warningAlpha); rect(wx2,wy,ww,wh,wh/2);
      stroke(180,140,60,warningAlpha); strokeWeight(1); noFill();
      rect(wx2+2,wy+2,ww-4,wh-4,wh/2); noStroke();
      textAlign(CENTER,CENTER); fill(235,200,130,warningAlpha);
      text('controls returning in '+endMsg, cx, wy+wh/2);
      if (timeLeft<=60&&floor(frameCount/6)%2===0) {
        noFill(); stroke(210,165,40,180); strokeWeight(5);
        rect(4,4,width-8,height-8); noStroke();
      }
      textStyle(NORMAL);
    }
    if (floor(frameCount/12)%2===0) { noFill(); stroke(110,155,80,80); strokeWeight(3); rect(4,4,width-8,height-8); noStroke(); }
  }
}


function drawDebugPanel() {
  fill(0, 0, 0, 200);
  noStroke();
  rect(0, height - 80, width, 80);


  fill(255, 220, 50);
  textSize(11);
  textAlign(LEFT);
  text("DEBUG MODE (O to close)", 12, height - 62);


  let buttons = [
    { label: "O: Start", x: 10 },
    { label: "1: Level 1", x: 110 },
    { label: "2: Level 2", x: 210 },
    { label: "3: Level 3", x: 310 },
    { label: "K: Win", x: 410 },
    { label: "L: Game Over", x: 510 },
  ];


  for (let i = 0; i < buttons.length; i++) {
    let b = buttons[i];


    fill(60, 60, 90);
    stroke(100, 100, 140);
    strokeWeight(1);
    rect(b.x, height - 50, 88, 34, 4);


    fill(200);
    noStroke();
    textSize(12);
    textAlign(LEFT);
    text(b.label, b.x + 8, height - 28);
  }
}
// ─────────────────────────────────────────────────────────
function drawIntroOverlay() {
  let alpha = introTimer <= INTRO_FADE_FRAMES
    ? constrain(map(introTimer, INTRO_FADE_FRAMES, 0, 220, 0), 0, 220)
    : 220;


  imageMode(CORNER);
  if (title) {
    image(title, 0, 0, width, height);
  }


  noStroke();
  fill(15, 22, 14, alpha);
  rect(0, 0, width, height);


  if (introTimer > INTRO_FADE_FRAMES) {
    let ta = 255;
    textAlign(CENTER, CENTER);
    textFont('Georgia');


    fill(0, 0, 0, ta * 0.6);
    textStyle(NORMAL);
    textSize(height * 0.022);
    text('level 3', width / 2 + 2, height / 2 - height * 0.06 + 2);
    


    if (introTimer > INTRO_FADE_FRAMES + 20) {
      fill(150, 185, 130, ta * 0.8);
      textStyle(NORMAL);
      textSize(height * 0.020);
      text('use A / D to move    SPACE to jump', width / 2, height / 2 + height * 0.08);
    }


    textStyle(NORMAL);
  }
}


// ─────────────────────────────────────────────────────────
function drawLoseScreen() {
  drawBG(); drawFG();
  noStroke(); fill(10,18,10,195); rect(0,0,width,height);
  fill(28,38,24); stroke(80,110,60); strokeWeight(2);
  rectMode(CENTER); rect(width/2,height/2,min(width*0.5,560),210,10); rectMode(CORNER);
  stroke(60,90,45,140); strokeWeight(1); noFill();
  rectMode(CENTER); rect(width/2,height/2,min(width*0.5,560)-12,198,8); rectMode(CORNER);

  let cx=width/2, cy=height/2;
  noStroke(); fill(0,0,0,160);
  textAlign(CENTER,CENTER); textFont('Georgia'); textStyle(BOLD); textSize(height*0.052);
  text('lost in the forest',cx+2,cy-50+2);
  fill(195,215,165); text('lost in the forest',cx,cy-50);
  textStyle(NORMAL); textSize(height*0.022); fill(140,168,115);
  text('she never made it home.',cx,cy+2);
  textSize(height*0.018); fill(100,130,80);

  let reason=levelTimer>=TIME_LIMIT?'the forest swallowed the last of the light.':'the cold crept in. try again';
  text(reason,cx,cy+30);
  if (floor(frameCount/30)%2===0) { textSize(height*0.019); fill(160,190,130); text('press SPACE to try again',cx,cy+68); }
  textStyle(NORMAL);
}


// ─────────────────────────────────────────────────────────
function drawWinScreen() {
  drawBG(); drawFG();
  noStroke(); fill(245,230,210,200); rect(0,0,width,height);
  fill(255,248,235); stroke(180,140,90); strokeWeight(3);
  rectMode(CENTER); rect(width/2,height/2,min(width*0.5,580),200,12); rectMode(CORNER);
  noStroke();
  let cx=width/2,cy=height/2,cw=min(width*0.5,580)/2;
  for (let [px,py] of [[cx-cw+30,cy-75],[cx+cw-30,cy-75],[cx-cw+30,cy+75],[cx+cw-30,cy+75]]) {
    fill(240,160,180); ellipse(px,py,14,14); fill(255,220,80); ellipse(px,py,6,6);
  }
  fill(90,55,20); textAlign(CENTER,CENTER); textFont('Georgia'); textStyle(BOLD);
  textSize(height*0.055); text('You made it home!',width/2,height/2-28);
  textStyle(NORMAL); textSize(height*0.024); fill(120,80,40);
  text('She found her way through the forest.',width/2,height/2+22);
  if (floor(frameCount/30)%2===0) { textSize(height*0.020); fill(160,110,60); text('press SPACE to play again',width/2,height/2+60); }
}


// ─────────────────────────────────────────────────────────
function keyPressed() {
  startAudioOnce();


  if (key === 'o' || key === 'O') {
    debugMode = !debugMode;
    return;
  }


  if (key === 'l' || key === 'L') {
    gameLost = true;
    return;
  }


  if (key === 'k' || key === 'K') {
    gameWon = true;
    return;
  }


  if (introTimer > 0 && !introFadeStarted) {
    introFadeStarted = true;
    introTimer = INTRO_FADE_FRAMES;
    return;
  }


  if (key===' ' && (gameWon||gameLost)) {
    gameWon=false; gameLost=false;
    worldX=0; flipped=false; flipTimer=0; flipIndex=0;
    introTimer=INTRO_DISPLAY_FRAMES + INTRO_FADE_FRAMES; introFadeStarted=false; countdown=0; countdownTimer=0;
    hp=MAX_HP; invTimer=0; levelTimer=0;
    velY=0; onGround=true;
    charX=width*0.25; charY=groundY();
    animals.forEach(a=>{a.wx=a.startWx;a.frame=0;a.ft=0;});
    if (sndMusic && sndMusic.isLoaded()) { sndMusic.stop(); sndMusic.loop(); }
  }
}


// Some browsers only count a mouse/touch interaction as the
// unlocking gesture, not a keypress — cover both.
function mousePressed() {
  startAudioOnce();
}

