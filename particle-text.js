/* ByMelty — Particle Text Effect (vanilla JS port) */
(function () {
  "use strict";

  /* ---------- Particle class ---------- */
  function Particle() {
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.closeEnoughTarget = 100;
    this.maxSpeed = 1.0;
    this.maxForce = 0.1;
    this.particleSize = 10;
    this.isKilled = false;
    this.startColor = { r: 0, g: 0, b: 0 };
    this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0;
    this.colorBlendRate = 0.01;
  }

  Particle.prototype.move = function () {
    var proximityMult = 1;
    var dx = this.pos.x - this.target.x;
    var dy = this.pos.y - this.target.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    var tx = this.target.x - this.pos.x;
    var ty = this.target.y - this.pos.y;
    var mag = Math.sqrt(tx * tx + ty * ty);
    if (mag > 0) {
      tx = (tx / mag) * this.maxSpeed * proximityMult;
      ty = (ty / mag) * this.maxSpeed * proximityMult;
    }

    var sx = tx - this.vel.x;
    var sy = ty - this.vel.y;
    var sm = Math.sqrt(sx * sx + sy * sy);
    if (sm > 0) {
      sx = (sx / sm) * this.maxForce;
      sy = (sy / sm) * this.maxForce;
    }

    this.acc.x += sx;
    this.acc.y += sy;
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  };

  Particle.prototype.draw = function (ctx) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }
    var r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight);
    var g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight);
    var b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight);
    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
  };

  Particle.prototype.kill = function (width, height) {
    if (!this.isKilled) {
      var rp = randomPos(width / 2, height / 2, (width + height) / 2);
      this.target.x = rp.x;
      this.target.y = rp.y;
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0;
      this.isKilled = true;
    }
  };

  /* ---------- Helpers ---------- */
  function randomPos(cx, cy, mag) {
    var rx = Math.random() * 1000;
    var ry = Math.random() * 400;
    var dx = rx - cx;
    var dy = ry - cy;
    var m = Math.sqrt(dx * dx + dy * dy);
    if (m > 0) { dx = (dx / m) * mag; dy = (dy / m) * mag; }
    return { x: cx + dx, y: cy + dy };
  }

  /* Warm chocolate-brand palette — cream, caramel, amber, toffee, gold */
  var WARM_COLORS = [
    { r: 250, g: 235, b: 200 }, // cream
    { r: 220, g: 170, b: 90  }, // caramel
    { r: 202, g: 138, b:   4 }, // brand gold  (#CA8A04)
    { r: 245, g: 215, b: 150 }, // golden cream
    { r: 180, g: 120, b:  50 }, // amber
    { r: 255, g: 200, b: 120 }, // warm glow
  ];

  function warmColor() {
    return WARM_COLORS[Math.floor(Math.random() * WARM_COLORS.length)];
  }

  /* ---------- Core engine ---------- */
  function ParticleEngine(canvas, words) {
    this.canvas   = canvas;
    this.words    = words;
    this.particles = [];
    this.frameCount = 0;
    this.wordIndex  = 0;
    this.animId     = null;
    this.pixelSteps = 6;
    this.mouse      = { x: 0, y: 0, pressed: false, right: false };

    canvas.width  = 1000;
    canvas.height = 400;

    this._bindMouse();
  }

  ParticleEngine.prototype._bindMouse = function () {
    var self = this;
    var c = this.canvas;

    c.addEventListener("mousedown", function (e) {
      self.mouse.pressed = true;
      self.mouse.right   = e.button === 2;
      var r = c.getBoundingClientRect();
      self.mouse.x = (e.clientX - r.left) * (c.width  / r.width);
      self.mouse.y = (e.clientY - r.top)  * (c.height / r.height);
    });
    c.addEventListener("mouseup",   function () { self.mouse.pressed = false; self.mouse.right = false; });
    c.addEventListener("mousemove", function (e) {
      var r = c.getBoundingClientRect();
      self.mouse.x = (e.clientX - r.left) * (c.width  / r.width);
      self.mouse.y = (e.clientY - r.top)  * (c.height / r.height);
    });
    c.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  };

  ParticleEngine.prototype.nextWord = function (word) {
    var canvas = this.canvas;
    var off    = document.createElement("canvas");
    off.width  = canvas.width;
    off.height = canvas.height;
    var ctx2   = off.getContext("2d");

    ctx2.fillStyle    = "white";
    ctx2.font         = "120px 'Lobster', cursive";
    ctx2.textAlign    = "center";
    ctx2.textBaseline = "middle";
    ctx2.fillText(word, canvas.width / 2, canvas.height / 2);

    var imgData = ctx2.getImageData(0, 0, canvas.width, canvas.height);
    var pixels  = imgData.data;
    var color   = warmColor();

    var particles = this.particles;
    var pIdx      = 0;
    var coords    = [];

    for (var i = 0; i < pixels.length; i += this.pixelSteps * 4) {
      coords.push(i);
    }
    /* shuffle for fluid motion */
    for (var j = coords.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = coords[j]; coords[j] = coords[k]; coords[k] = tmp;
    }

    for (var ci = 0; ci < coords.length; ci++) {
      var idx   = coords[ci];
      var alpha = pixels[idx + 3];
      if (alpha === 0) continue;

      var x = (idx / 4) % canvas.width;
      var y = Math.floor((idx / 4) / canvas.width);
      var p;

      if (pIdx < particles.length) {
        p = particles[pIdx];
        p.isKilled = false;
        pIdx++;
      } else {
        p = new Particle();
        var rp = randomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2);
        p.pos.x = rp.x;
        p.pos.y = rp.y;
        p.maxSpeed       = Math.random() * 6 + 4;
        p.maxForce       = p.maxSpeed * 0.05;
        p.particleSize   = Math.random() * 6 + 6;
        p.colorBlendRate = Math.random() * 0.0275 + 0.0025;
        particles.push(p);
      }

      p.startColor = {
        r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
        g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
        b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
      };
      p.targetColor  = color;
      p.colorWeight  = 0;
      p.target.x     = x;
      p.target.y     = y;
    }

    for (var ri = pIdx; ri < particles.length; ri++) {
      particles[ri].kill(canvas.width, canvas.height);
    }
  };

  ParticleEngine.prototype.tick = function () {
    var canvas    = this.canvas;
    var ctx       = canvas.getContext("2d");
    var particles = this.particles;
    var mouse     = this.mouse;

    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.move();
      p.draw(ctx);
      if (p.isKilled &&
          (p.pos.x < 0 || p.pos.x > canvas.width ||
           p.pos.y < 0 || p.pos.y > canvas.height)) {
        particles.splice(i, 1);
      }
    }

    if (mouse.pressed && mouse.right) {
      for (var mi = 0; mi < particles.length; mi++) {
        var mp = particles[mi];
        var dx = mp.pos.x - mouse.x;
        var dy = mp.pos.y - mouse.y;
        if (Math.sqrt(dx * dx + dy * dy) < 50) {
          mp.kill(canvas.width, canvas.height);
        }
      }
    }

    this.frameCount++;
    if (this.frameCount % 240 === 0) {
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      this.nextWord(this.words[this.wordIndex]);
    }
  };

  ParticleEngine.prototype.start = function () {
    var self = this;
    function loop() {
      self.tick();
      self.animId = requestAnimationFrame(loop);
    }
    this.nextWord(this.words[0]);
    loop();
  };

  ParticleEngine.prototype.stop = function () {
    if (this.animId) cancelAnimationFrame(this.animId);
  };

  /* ---------- Boot ---------- */
  function boot() {
    var canvas = document.getElementById("particle-canvas");
    if (!canvas) return;

    /* Respect prefers-reduced-motion */
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      /* Show static text fallback instead */
      var fallback = document.getElementById("particle-fallback");
      if (fallback) fallback.hidden = false;
      canvas.hidden = true;
      return;
    }

    var words = ["BYMELTY", "MELT IT", "DIP IN", "FONDUE", "INDULGE"];

    /* Wait for Lobster font so offscreen canvas renders correctly */
    var ready = document.fonts
      ? document.fonts.ready.then(function () { return words; })
      : Promise.resolve(words);

    ready.then(function () {
      var engine = new ParticleEngine(canvas, words);
      engine.start();

      /* Pause when tab hidden — saves CPU */
      document.addEventListener("visibilitychange", function () {
        document.hidden ? engine.stop() : engine.start();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
