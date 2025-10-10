const statsPanel = document.createElement('div');

Object.assign(statsPanel.style, {
    position: 'fixed',
    top: '92%',
    left: '18px',
    width: 'auto',
    minWidth: '280px',
    height: '32px',
    background: 'rgba(20, 12, 40, 0.75)', // fundo roxo escuro translúcido
    color: '#d9b3ff', // texto claro roxo
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'grab',
    borderRadius: '10px',
    userSelect: 'none',
    zIndex: '1000',
    transition: 'transform 0.23s',
    boxShadow: '0 2px 22px 0 rgba(75, 30, 130, 0.4), 0 0 15px rgba(106, 44, 180, 0.3), inset 0 0 10px rgba(60, 20, 100, 0.5)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    padding: '0 15px',
    border: '1px solid rgba(120, 60, 200, 0.4)'
});

const getPing = async () => {
    if (window.disablePing) return '-';
    try {
        const t = performance.now();
        // Corrigido: removido espaço extra na URL
        await fetch('https://pt.khanacademy.org/', { method: 'HEAD' });
        return Math.round(performance.now() - t);
    } catch {
        return '--';
    }
};

let lastFrameTime = performance.now(), frameCount = 0, fps = 0;
(function calcFPS() {
    if (++frameCount && performance.now() - lastFrameTime >= 1000) {
        fps = Math.round(frameCount * 1000 / (performance.now() - lastFrameTime));
        frameCount = 0;
        lastFrameTime = performance.now();
    }
    requestAnimationFrame(calcFPS);
})();

const getTime = () => new Date().toLocaleTimeString();

const update = async () => statsPanel.innerHTML =
    `<span style="font-weight:bold;color:#c291ff;margin-right:6px;">KhanScript</span>
    <span style="margin: 0 6px;color:#a070d9;">|</span><span>${fps}fps</span>
    <span style="margin: 0 6px;color:#a070d9;">|</span><span>${await getPing()}ms</span>
    <span style="margin: 0 6px;color:#a070d9;">|</span><span>${getTime()}</span>
    <span style="margin-left:8px;font-size:12px;color:#9a7ed9;">by Nickz</span>`;

update();
document.body.appendChild(statsPanel);
setInterval(update, 1000);

let dragActive = false, dragOffsetX = 0, dragOffsetY = 0;

statsPanel.onmousedown = function(e) {
    dragActive = true;
    dragOffsetX = e.clientX - statsPanel.offsetLeft;
    dragOffsetY = e.clientY - statsPanel.offsetTop;
    statsPanel.style.cursor = "grabbing";
    statsPanel.style.transition = "none";
    document.body.style.userSelect = "none";
};

document.onmouseup = function() {
    if (dragActive) {
        dragActive = false;
        statsPanel.style.cursor = "grab";
        statsPanel.style.transition = "transform 0.23s";
        document.body.style.userSelect = "";
    }
};

document.onmousemove = function(e) {
    if (dragActive) {
        const minX = 0;
        const minY = 0;
        const maxX = window.innerWidth - statsPanel.offsetWidth;
        const maxY = window.innerHeight - statsPanel.offsetHeight;
        const x = Math.max(minX, Math.min(e.clientX - dragOffsetX, maxX));
        const y = Math.max(minY, Math.min(e.clientY - dragOffsetY, maxY));
        statsPanel.style.left = x + "px";
        statsPanel.style.top = y + "px";
    }
};

if (typeof device !== 'undefined' && device.mobile) {
    plppdo?.on?.('domChanged', () =>
        window.location.href.includes("khanacademy.org/profile")
            ? statsPanel.style.display = 'flex'
            : statsPanel.style.display = 'none'
    );
}
