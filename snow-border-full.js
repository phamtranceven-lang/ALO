(function () {
  if (window.__SNOW_BORDER_FIXED__) return;
  window.__SNOW_BORDER_FIXED__ = true;

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --sbf-radius: 18px;
      --sbf-border: 3px;
    }

    .sbf-border {
      position: fixed;
      inset: 4px;
      pointer-events: none;
      z-index: 9998;
      border-radius: var(--sbf-radius);
    }

    .sbf-border::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: var(--sbf-border);
      background: linear-gradient(
        135deg,
        #ff0000 0%,
        #ff7a00 16.66%,
        #ffd400 33.33%,
        #00d95f 50%,
        #00cfff 66.66%,
        #2f6bff 83.33%,
        #a100ff 100%
      );
      background-size: 300% 300%;
      animation: sbfMove 8s linear infinite;
      box-shadow:
        0 0 8px rgba(255,255,255,0.08),
        0 0 14px rgba(0,207,255,0.08);
      -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
    }

    .sbf-snow {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9997;
      background: transparent !important;
    }

    @keyframes sbfMove {
      0% { background-position: 0% 50%; }
      100% { background-position: 300% 50%; }
    }

    @media (max-width: 768px) {
      :root {
        --sbf-radius: 14px;
        --sbf-border: 2px;
      }

      .sbf-border {
        inset: 3px;
      }
    }
  `;
  document.head.appendChild(style);

  const border = document.createElement("div");
  border.className = "sbf-border";
  document.body.appendChild(border);

  const canvas = document.createElement("canvas");
  canvas.className = "sbf-snow";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let dpr = 1;
  let flakes = [];

  const DESKTOP_COUNT = 60;
  const MOBILE_COUNT = 30;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeFlake(initial = false) {
    return {
      x: rand(0, w),
      y: initial ? rand(0, h) : rand(-20, -5),
      r: rand(0.8, 2.6),
      vy: rand(0.25, 0.9),
      vx: rand(-0.15, 0.15),
      alpha: rand(0.18, 0.7),
      swing: rand(0.002, 0.01),
      phase: rand(0, Math.PI * 2)
    };
  }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = w <= 768 ? MOBILE_COUNT : DESKTOP_COUNT;
    flakes = Array.from({ length: count }, () => makeFlake(true));
  }

  function update() {
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += f.vy;
      f.x += f.vx + Math.sin(f.phase + f.y * f.swing) * 0.2;

      if (f.y > h + 10 || f.x < -10 || f.x > w + 10) {
        flakes[i] = makeFlake(false);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const f of flakes) {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
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
