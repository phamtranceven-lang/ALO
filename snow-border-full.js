(function () {
  if (window.__SNOW_BORDER_LITE__) return;
  window.__SNOW_BORDER_LITE__ = true;

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --sbl-border-size: 2px;
      --sbl-radius: 16px;
    }

    .sbl-border {
      position: fixed;
      inset: 4px;
      pointer-events: none;
      z-index: 9998;
      border-radius: var(--sbl-radius);
      padding: var(--sbl-border-size);
      background: linear-gradient(
        135deg,
        #ff0000 0%,
        #ff7a00 16.6%,
        #ffd400 33.2%,
        #00d95f 49.8%,
        #00cfff 66.4%,
        #2f6bff 83%,
        #a100ff 100%
      );
      background-size: 300% 300%;
      animation: sblMove 8s linear infinite;
      box-shadow: 0 0 8px rgba(255,255,255,0.08);
    }

    .sbl-border::before {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      border-radius: calc(var(--sbl-radius) - var(--sbl-border-size));
      background: transparent;
    }

    .sbl-canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9997;
      background: transparent !important;
    }

    @keyframes sblMove {
      0% { background-position: 0% 50%; }
      100% { background-position: 300% 50%; }
    }

    @media (max-width: 768px) {
      :root {
        --sbl-border-size: 2px;
        --sbl-radius: 12px;
      }

      .sbl-border {
        inset: 3px;
      }
    }
  `;
  document.head.appendChild(style);

  const border = document.createElement("div");
  border.className = "sbl-border";
  document.body.appendChild(border);

  const canvas = document.createElement("canvas");
  canvas.className = "sbl-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = 1;
  let flakes = [];

  const COUNT_DESKTOP = 55;
  const COUNT_MOBILE = 28;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeFlake(initial = false) {
    return {
      x: rand(0, width),
      y: initial ? rand(0, height) : rand(-20, -5),
      r: rand(0.8, 2.4),
      vy: rand(0.25, 0.9),
      vx: rand(-0.12, 0.12),
      alpha: rand(0.2, 0.7),
      swing: rand(0.002, 0.01),
      phase: rand(0, Math.PI * 2)
    };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = width < 768 ? COUNT_MOBILE : COUNT_DESKTOP;
    flakes = Array.from({ length: count }, () => makeFlake(true));
  }

  function update() {
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += f.vy;
      f.x += f.vx + Math.sin(f.phase + f.y * f.swing) * 0.18;

      if (f.y > height + 10 || f.x < -10 || f.x > width + 10) {
        flakes[i] = makeFlake(false);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const f of flakes) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = \`rgba(255,255,255,\${f.alpha})\`;
      ctx.fill();
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  resize();
  loop();
  window.addEventListener("resize", resize, { passive: true });
})();
