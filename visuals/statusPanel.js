// ====== KhanScript Stats Panel (Ultra) ======
const statsPanel = document.createElement('div');
statsPanel.id = "ks-stats-panel";

// CSS completo (injetado uma vez)
const ksStatsStyle = document.createElement('style');
ksStatsStyle.textContent = `
  #ks-stats-panel {
    position: fixed;
    left: 18px;
    top: calc(100% - 62px); /* melhor que 92% (fica consistente) */
    width: auto;
    min-width: 320px;
    height: 38px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    padding: 0 14px;
    border-radius: 14px;

    color: rgba(245, 237, 255, 0.95);
    font-size: 13.5px;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;

    cursor: grab;
    user-select: none;
    z-index: 10510;

    background:
      radial-gradient(140% 240% at 0% 0%, rgba(191,146,255,0.30), transparent 55%),
      radial-gradient(130% 240% at 100% 0%, rgba(164,104,241,0.28), transparent 58%),
      linear-gradient(135deg, rgba(10,6,18,0.72), rgba(20,12,40,0.78));

    border: 1px solid rgba(191,146,255,0.22);
    box-shadow:
      0 14px 45px rgba(0,0,0,0.70),
      0 0 26px rgba(147,51,234,0.25),
      inset 0 0 0 1px rgba(0,0,0,0.25);

    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);

    transform: translateY(10px) scale(0.985);
    opacity: 0;
    transition:
      transform .18s ease,
      box-shadow .22s ease,
      border-color .22s ease,
      opacity .22s ease;
    animation: ksStatsIn 420ms cubic-bezier(.2,.9,.2,1) forwards;
  }

  #ks-stats-panel::before {
    content: "";
    position: absolute;
    inset: -40%;
    background:
      radial-gradient(circle at 20% 20%, rgba(164,104,241,0.22), transparent 50%),
      radial-gradient(circle at 80% 40%, rgba(147,51,234,0.18), transparent 55%);
    filter: blur(24px);
    opacity: .65;
    animation: ksStatsAurora 7s ease-in-out infinite alternate;
    pointer-events: none;
  }

  #ks-stats-panel:hover {
    transform: translateY(8px) scale(0.99);
    border-color: rgba(222,203,255,0.42);
    box-shadow:
      0 18px 55px rgba(0,0,0,0.75),
      0 0 34px rgba(147,51,234,0.32),
      inset 0 0 0 1px rgba(0,0,0,0.25);
  }

  #ks-stats-panel:active {
    transform: translateY(10px) scale(0.975);
  }

  #ks-stats-panel .ks-title {
    font-weight: 900;
    letter-spacing: .06em;
    text-transform: uppercase;
    background: linear-gradient(90deg, #ffffff 0%, #e2d0ff 32%, #b892ff 70%, #a468f1 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 18px rgba(147,51,234,0.25);
  }

  #ks-stats-panel .ks-sep {
    width: 1px;
    height: 16px;
    background: rgba(191,146,255,0.26);
    margin: 0 2px;
  }

  #ks-stats-panel .ks-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(191,146,255,0.14);
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.18);
    white-space: nowrap;
  }

  #ks-stats-panel .ks-label {
    color: rgba(255,255,255,0.72);
    font-size: 12px;
  }

  #ks-stats-panel .ks-value {
    color: rgba(245, 237, 255, 0.96);
    font-weight: 700;
  }

  #ks-stats-panel .ks-credit {
    margin-left: 2px;
    font-size: 12px;
    color: rgba(191,146,255,0.70);
    white-space: nowrap;
  }

  @keyframes ksStatsIn {
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes ksStatsAurora {
    from { transform: translate3d(-2%, -1%, 0) scale(1.02); opacity: .55; }
    to   { transform: translate3d( 2%,  1%, 0) scale(1.06); opacity: .85; }
  }

  @media (max-width: 520px) {
    #ks-stats-panel { min-width: 260px; left: 10px; right: 10px; width: auto; }
  }

  @media (prefers-reduced-motion: reduce) {
    #ks-stats-panel, #ks-stats-panel::before { animation: none !important; transition: none !important; }
  }
`;
document.head.appendChild(ksStatsStyle);

// aplica estilos base via CSS (sem Object.assign gigante)
document.body.appendChild(statsPanel);

/* ====== Ping / FPS / Time ====== */
const getPing = async () => {
  if (window.disablePing) return '-';
  try {
    const t = performance.now();
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

const update = async () => {
  const ping = await getPing();
  statsPanel.innerHTML = `
    <span class="ks-title">KhanScript</span>
    <span class="ks-sep"></span>
    <span class="ks-pill"><span class="ks-label">FPS</span><span class="ks-value">${fps}</span></span>
    <span class="ks-pill"><span class="ks-label">PING</span><span class="ks-value">${ping}ms</span></span>
    <span class="ks-pill"><span class="ks-label">HORA</span><span class="ks-value">${getTime()}</span></span>
    <span class="ks-credit">by Nickz</span>
  `;
};

update();
setInterval(update, 1000);

/* ====== Drag ====== */
let dragActive = false, dragOffsetX = 0, dragOffsetY = 0;

statsPanel.addEventListener('mousedown', function(e) {
  dragActive = true;
  dragOffsetX = e.clientX - statsPanel.offsetLeft;
  dragOffsetY = e.clientY - statsPanel.offsetTop;
  statsPanel.style.cursor = "grabbing";
  statsPanel.style.transition = "none";
  document.body.style.userSelect = "none";
  e.preventDefault();
});

document.addEventListener('mouseup', function() {
  if (!dragActive) return;
  dragActive = false;
  statsPanel.style.cursor = "grab";
  statsPanel.style.transition = "";
  document.body.style.userSelect = "";
});

document.addEventListener('mousemove', function(e) {
  if (!dragActive) return;
  const minX = 0;
  const minY = 0;
  const maxX = window.innerWidth - statsPanel.offsetWidth;
  const maxY = window.innerHeight - statsPanel.offsetHeight;
  const x = Math.max(minX, Math.min(e.clientX - dragOffsetX, maxX));
  const y = Math.max(minY, Math.min(e.clientY - dragOffsetY, maxY));
  statsPanel.style.left = x + "px";
  statsPanel.style.top = y + "px";
});

/* ====== Mobile visibility (mantido) ====== */
if (typeof device !== 'undefined' && device.mobile) {
  plppdo?.on?.('domChanged', () =>
    window.location.href.includes("khanacademy.org/profile")
      ? statsPanel.style.display = 'flex'
      : statsPanel.style.display = 'none'
  );
}
