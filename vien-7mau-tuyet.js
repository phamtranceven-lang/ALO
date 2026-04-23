(function () {
  if (window.__VIEN_7MAU_TUYET__) return;
  window.__VIEN_7MAU_TUYET__ = true;

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --v7-border-size: 2px;
      --v7-z-bg: 0;
      --v7-z-vignette: 1;
      --v7-z-noise: 2;
      --v7-z-orbs: 0;
      --v7-z-border: 9998;
      --v7-z-snow: 9997;
    }

    html, body {
      background: linear-gradient(270deg, #020617, #0f172a, #111827, #030712) !important;
      background-size: 400% 400% !important;
      animation: v7GradientMove 16s ease infinite;
    }

    .v7-bg,
    .v7-orbs,
    .v7-vignette,
    .v7-noise,
    .v7-border,
    .v7-snow {
      position: fixed;
      inset: 0;
      pointer-events: none;
    }

    .v7-bg {
      z-index: var(--v7-z-bg);
      overflow: hidden;
    }

    .v7-bg::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 20% 30%, rgba(0,255,180,0.14), transparent 22%),
        radial-gradient(circle at 70% 20%, rgba(0,180,255,0.14), transparent 24%),
        radial-gradient(circle at 60% 80%, rgba(140,0,255,0.12), transparent 24%);
      filter: blur(70px);
      animation: v7AuroraMove 18s ease-in-out infinite alternate;
    }

    .v7-orbs {
      z-index: var(--v7-z-orbs);
      overflow: hidden;
    }

    .v7-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(42px);
      opacity: 0.16;
      animation: v7OrbMove 20s ease-in-out infinite alternate;
      will-change: transform;
    }

    .v7-orb.one {
      width: 180px;
      height: 180px;
      background: #00d5ff;
      top: 10%;
      left: 8%;
    }

    .v7-orb.two {
      width: 220px;
      height: 220px;
      background: #7c3aed;
      bottom: 8%;
      right: 12%;
      animation-duration: 24s;
    }

    .v7-orb.three {
      width: 160px;
      height: 160px;
      background: #10b981;
      top: 35%;
      right: 25%;
      animation-duration: 22s;
    }

    .v7-vignette {
      z-index: var(--v7-z-vignette);
      background: radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.45) 100%);
    }

    .v7-noise {
      z-index: var(--v7-z-noise);
      opacity: 0.028;
      background-image: radial-gradient(rgba(255,255,255,0.9) 0.6px, transparent 0.6px);
      background-size: 8px 8px;
    }

    .v7-border {
      z-index: var(--v7-z-border);
    }

    .v7-border::before {
      content: "";
      position: absolute;
      inset: 0;
      padding: var(--v7-border-size);

      background: linear-gradient(
        90deg,
        #ff0000 0%,
        #ff7a00 14.28%,
        #ffd400 28.56%,
        #00d95f 42.84%,
        #00cfff 57.12%,
        #2f6bff 71.40%,
        #a100ff 85.68%,
        #ff0000 100%
      );
      background-size: 300% 300%;
      animation: v7BorderMove 6s linear infinite;

      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
    }

    .v7-snow {
      width: 100vw;
      height: 100vh;
      z-index: var(--v7-z-snow);
      background: transparent !important;
    }

    @keyframes v7BorderMove {
      0% { background-position: 0% 50%; }
      100% { background-position: 300% 50%; }
    }

    @keyframes v7GradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes v7AuroraMove {
      0% { transform: translate3d(0, 0, 0) scale(1); }
      100% { transform: translate3d(0, -20px, 0) scale(1.08); }
    }

    @keyframes v7OrbMove {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(20px, -18px) scale(1.08); }
    }

    @media (max-width: 768px) {
      :root {
        --v7-border-size: 2px;
      }

      .v7-bg::before {
        filter: blur(50px);
        opacity: 0.9;
      }

      .v7-orb.one {
        width: 120px;
        height: 120px;
      }

      .v7-orb.two {
        width: 150px;
        height: 150px;
      }

      .v7-orb.three {
        width: 110px;
        height: 110px;
      }

      .v7-noise {
        opacity: 0.02;
      }
    }
  `;
  document.head.appendChild(style);

  const bg = document.createElement("div");
  bg.className = "v7-bg";

  const orbs = document.createElement("div");
  orbs.className = "v7-orbs";
  orbs.innerHTML = `
    <div class="v7-orb one"></div>
    <div class="v7-orb two"></div>
    <div class="v7-orb three"></div>
  `;

  const vignette = document.createElement("div");
  vignette.className = "v7-vignette";

  const noise = document.createElement("div");
  noise.className = "v7-noise";

  const border = document.createElement("div");
  border.className = "v7-border";

  const canvas = document.createElement("canvas");
  canvas.className = "v7-snow";

  document.body.appendChild(bg);
  document.body.appendChild(orbs);
  document.body.appendChild(vignette);
  document.body.appendChild(noise);
  document.body.appendChild(border);
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = 1;
  let flakes = [];

  const CONFIG = {
    desktopCount: 65,
    mobileCount: 35,
    minSize: 0.8,
    maxSize: 2.6,
    minSpeed: 0.2,
    maxSpeed: 0.85,
    drift: 0.2
  };

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createFlake(initial = false) {
    return {
      x: rand(0, width),
      y: initial ? rand(0, height) : rand(-20, -5),
      r: rand(CONFIG.minSize, CONFIG.maxSize),
      vy: rand(CONFIG.minSpeed, CONFIG.maxSpeed),
      vx: rand(-0.1, 0.1),
      alpha: rand(0.18, 0.75),
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

    const count = width <= 768 ? CONFIG.mobileCount : CONFIG.desktopCount;
    flakes = Array.from({ length: count }, () => createFlake(true));
  }

  function update() {
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += f.vy;
      f.x += f.vx + Math.sin(f.phase + f.y * f.swing) * CONFIG.drift;

      if (f.y > height + 10 || f.x < -10 || f.x > width + 10) {
        flakes[i] = createFlake(false);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const f of flakes) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
      ctx.fill();
    }
  }

  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener("resize", resize, { passive: true });
})();  const CONFIG = {
    desktopCount: 65,
    mobileCount: 35,
    minSize: 0.8,
    maxSize: 2.6,
    minSpeed: 0.2,
    maxSpeed: 0.85,
    drift: 0.2
  };

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createFlake(initial = false) {
    return {
      x: rand(0, width),
      y: initial ? rand(0, height) : rand(-20, -5),
      r: rand(CONFIG.minSize, CONFIG.maxSize),
      vy: rand(CONFIG.minSpeed, CONFIG.maxSpeed),
      vx: rand(-0.1, 0.1),
      alpha: rand(0.18, 0.75),
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

    const count = width <= 768 ? CONFIG.mobileCount : CONFIG.desktopCount;
    flakes = Array.from({ length: count }, () => createFlake(true));
  }

  function update() {
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += f.vy;
      f.x += f.vx + Math.sin(f.phase + f.y * f.swing) * CONFIG.drift;

      if (f.y > height + 10 || f.x < -10 || f.x > width + 10) {
        flakes[i] = createFlake(false);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const f of flakes) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
      ctx.fill();
    }
  }

  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener("resize", resize, { passive: true });
})();
