(function () {
    // đổi màu glow theo giờ
    const hour = new Date().getHours();
    const root = document.documentElement;

    if (hour >= 6 && hour < 12) {
        root.style.setProperty("--glow-cyan", "#00d5ff");
    } else if (hour >= 12 && hour < 18) {
        root.style.setProperty("--glow-cyan", "#00ff85");
    } else {
        root.style.setProperty("--glow-cyan", "#a855f7");
    }

    // particles
    const particleLayer = document.createElement("div");
    particleLayer.className = "vip-particles";
    document.body.appendChild(particleLayer);

    for (let i = 0; i < 24; i++) {
        const dot = document.createElement("span");
        dot.style.left = Math.random() * 100 + "vw";
        dot.style.animationDuration = (10 + Math.random() * 18) + "s";
        dot.style.animationDelay = (Math.random() * 8) + "s";
        dot.style.opacity = (0.2 + Math.random() * 0.5).toFixed(2);
        dot.style.transform = `scale(${0.6 + Math.random()})`;
        particleLayer.appendChild(dot);
    }

    // cursor glow
    if (window.innerWidth > 768) {
        const cursor = document.createElement("div");
        cursor.className = "vip-cursor";
        document.body.appendChild(cursor);

        window.addEventListener("mousemove", (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        });
    }
})();
