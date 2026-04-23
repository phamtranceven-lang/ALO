(function () {
  if (window.__FULL_SNOW_BORDER_7COLOR__) return;
  window.__FULL_SNOW_BORDER_7COLOR__ = true;

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --fx-border-size: 3px;
      --fx-radius: 18px;
      --fx-z-border: 9997;
      --fx-z-glow: 9996;
      --fx-z-snow: 9998;
    }

    .fx-border-7color {
      position: fixed;
      inset: 6px;
      pointer-events: none;
      z-index: var(--fx-z-border);
      border-radius: var(--fx-radius);
      padding: var(--fx-border-size);
      background:
        linear-gradient(
          135deg,
          #ff0000 0%,
          #ff7a00 14.28%,
          #ffd400 28.56%,
          #00d95f 42.84%,
          #00cfff 57.12%,
          #2f6bff 71.40%,
          #a100ff 85.68%,
          #ff0000 100%
        );
      background-size: 400% 400%;
      animation: fxBorderMove 8s linear infinite;
      box-shadow:
        0 0 10px rgba(255,255,255,0.10),
        0 0 22px rgba(0, 207, 255, 0.18),
        0 0 34px rgba(161, 0, 255, 0.14);
    }

    .fx-border-7color::before {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      border-radius: calc(var(--fx-radius) - var(--fx-border-size));
      background: transparent;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05);
    }

    .fx-corner-glow {
      position: fixed;
      inset: 0;
      z-index: var(--fx-z-glow);
      pointer-events: none;
      overflow: hidden;
    }

    .fx-corner-glow::before,
    .fx-corner-glow::after {
      content: "";
      position: absolute;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      filter: blur(55px);
      opacity: 0.18;
      animation: fxGlowPulse 4s ease-in-out infinite alternate;
    }

    .fx-corner-glow::before {
      top: -70px;
      left: -70px;
      background: radial-gradient(circle, #00d9ff 0%, rgba(0,217,255,0.08) 45%, transparent 75%);
    }

    .fx-corner-glow::after {
      right: -70px;
      bottom: -70px;
      background: radial-gradient(circle, #a100ff 0%, rgba(161,0,255,0.08) 45%, transparent 75%);
    }

    .fx-snow-canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      z-index: var(--fx-z-snow);
      pointer-events: none;
    }

    @keyframes fxBorderMove {
      0% { background-position: 0% 50%; }
      100% { background-position: 400% 50%; }
    }

    @keyframes fxGlowPulse {
      0% {
        transform: scale(1);
        opacity: 0.14;
      }
      100% {
        transform: scale(1.12);
        opacity: 0.24;
      }
    }

    @media (max-width: 768px) {
      :root {
        --fx-border-size: 2px;
        --fx-radius: 14px;
      }

      .fx-border-7color {
        inset: 4px;
      }

      .fx-corner-glow::before,
      .fx-corner-glow::after {
        width: 180px;
        height: 180px;
        filter: blur(40px);
      }
    }
  `;
  document.head.appendChild(style);

  const glow = document.createElement("div");
  glow.className = "fx-corner-glow";
  document.body.appendChild(glow);

  const border = document.createElement("div");
  border.className = "fx-border-7color";
  document.body.appendChild(border);

  const canvas = document.createElement("canvas");
  canvas.className = "fx-snow-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let flakes = [];
  let dpr = 1;

  const CONFIG = {
    desktopCount: 140,
    mobileCount: 75,
    minSize: 1.2,
    maxSize: 4.2,
    minSpeed: 0.35,
    maxSpeed: 1.7,
    drift: 0.45
  };

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = width <= 768 ? CONFIG.mobileCount : CONFIG.desktopCount;
    flakes = Array.from({ length: count }, () => createFlake(true));
  }

  function createFlake(initial) {
    return {
      x: rand(0, width),
      y: initial ? rand(0, height) : rand(-50, -10),
      r: rand(CONFIG.minSize, CONFIG.maxSize),
      vy: rand(CONFIG.minSpeed, CONFIG.maxSpeed),
      vx: rand(-0.18, 0.18),
      swing: rand(0.003, 0.018),
      alpha: rand(0.45, 0.95),
      blur: rand(0, 2),
      phase: rand(0, Math.PI * 2)
    };
  }

  function resetFlake(flake) {
    flake.x = rand(0, width);
    flake.y = rand(-40, -10);
    flake.r = rand(CONFIG.minSize, CONFIG.maxSize);
    flake.vy = rand(CONFIG.minSpeed, CONFIG.maxSpeed);
    flake.vx = rand(-0.18, 0.18);
    flake.swing = rand(0.003, 0.018);
    flake.alpha = rand(0.45, 0.95);
    flake.blur = rand(0, 2);
    flake.phase = rand(0, Math.PI * 2);
  }

  function updateFlakes() {
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += f.vy;
      f.x += f.vx + Math.sin(f.phase + f.y * f.swing) * CONFIG.drift;

      if (f.y > height + 12 || f.x < -30 || f.x > width + 30) {
        resetFlake(f);
      }
    }
  }

  function drawFlakes() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
      ctx.shadowBlur = f.blur ? 8 : 0;
      ctx.shadowColor = "rgba(255,255,255,0.35)";
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  }

  function animate() {
    updateFlakes();
    drawFlakes();
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();

  window.addEventListener("resize", resizeCanvas, { passive: true });
})();
