plppdo.on('domChanged', () => {
  if (document.getElementById('khanwareTab')) return;

  function createTab(name, href = '#') {
    const li = document.createElement('li');
    li.innerHTML = `<a class="_8ry3zep" href="${href}" target="_blank"><span class="_xy39ea8">${name}</span></a>`;
    return li;
  }

  const nav = document.querySelector('nav[data-testid="side-nav"]');
  if (!nav) return;

  const section = document.createElement('section');
  section.id = 'khanwareTab';
  section.className = '_1ozlbq6';
  section.innerHTML = '<h2 class="_18undph9" style="color:#c291ff;">KhanScript</h2>';
  const ul = document.createElement('ul');

  const devTab = createTab('Developer', '#');

  devTab.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();

    window.khanwareWin = window.open("", "_blank");
    if (!window.khanwareWin) return;

    window.khanwareWin.document.write(`
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>KhanScript — Developer</title>
  <style>
    /* KhanScript — Developer (Ultra Dark Purple UI)
       Drop-in replacement for the <style> inside window.open().document.write()
    */

    :root{
      color-scheme: dark;

      --bg0: #07040f;
      --bg1: #0b0620;
      --bg2: #120a2f;

      --surface: rgba(16, 10, 32, 0.62);
      --surface-2: rgba(20, 12, 44, 0.70);
      --stroke: rgba(191, 146, 255, 0.16);

      --text: rgba(255,255,255,0.92);
      --muted: rgba(255,255,255,0.66);

      --p1: #a468f1;
      --p2: #9333ea;
      --p3: #7c5cff;

      --shadow: 0 18px 70px rgba(0,0,0,0.55);
      --glow: 0 0 0 1px rgba(164,104,241,0.18),
              0 0 22px rgba(147,51,234,0.30),
              0 0 70px rgba(124,92,255,0.18);
    }

    *{ box-sizing:border-box; }
    html, body { height: 100%; }

    body{
      margin:0;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", "Liberation Sans", sans-serif;
      color: var(--text);
      overflow:hidden;

      background:
        radial-gradient(1200px 800px at 12% 10%, rgba(164,104,241,0.23), transparent 55%),
        radial-gradient(900px 700px at 88% 30%, rgba(147,51,234,0.22), transparent 60%),
        radial-gradient(1000px 900px at 45% 95%, rgba(124,92,255,0.14), transparent 60%),
        linear-gradient(120deg, var(--bg0), var(--bg2));
      position:relative;

      display:flex;
      justify-content:center;
      align-items:center;
      padding: 18px;
    }

    body::before{
      content:"";
      position:absolute;
      inset:-40%;
      background:
        radial-gradient(circle at 20% 30%, rgba(164,104,241,0.20), transparent 40%),
        radial-gradient(circle at 70% 40%, rgba(147,51,234,0.18), transparent 42%),
        radial-gradient(circle at 40% 75%, rgba(124,92,255,0.14), transparent 45%);
      filter: blur(28px);
      opacity: 0.9;
      animation: aurora 10s ease-in-out infinite alternate;
      pointer-events:none;
    }

    body::after{
      content:"";
      position:absolute;
      inset:0;
      background-image: linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
      background-size: 40px 40px;
      opacity: 0.07;
      mask-image: radial-gradient(circle at 50% 40%, rgba(0,0,0,1), rgba(0,0,0,0.2) 55%, rgba(0,0,0,0) 80%);
      pointer-events:none;
    }

    @keyframes aurora{
      from { transform: translate3d(-2.5%, -1.5%, 0) rotate(-2deg) scale(1.02); }
      to   { transform: translate3d( 2.5%,  1.5%, 0) rotate( 2deg) scale(1.06); }
    }

    .container{
      width: min(94vw, 620px);
      min-height: 390px;
      padding: 22px 22px 18px 22px;
      border-radius: 18px;

      background: linear-gradient(135deg, rgba(20, 12, 44, 0.74), rgba(12, 8, 26, 0.55));
      border: 1px solid var(--stroke);
      box-shadow: var(--shadow), var(--glow);
      backdrop-filter: blur(14px) saturate(120%);
      -webkit-backdrop-filter: blur(14px) saturate(120%);

      display:flex;
      flex-direction:column;
      gap: 14px;

      position: relative;
      isolation: isolate;

      transform: translateY(10px) scale(0.985);
      opacity: 0;
      animation: panelIn 520ms cubic-bezier(.2,.9,.2,1) forwards;
    }

    @keyframes panelIn{
      to{ transform: translateY(0) scale(1); opacity: 1; }
    }

    .container::before{
      content:"";
      position:absolute;
      inset:-1px;
      border-radius: 18px;
      background: linear-gradient(135deg,
        rgba(164,104,241,0.55),
        rgba(147,51,234,0.35),
        rgba(124,92,255,0.20)
      );
      filter: blur(14px);
      opacity: 0.35;
      z-index: -1;
      animation: borderPulse 2.6s ease-in-out infinite;
      pointer-events:none;
    }

    @keyframes borderPulse{
      0%,100% { opacity: 0.26; transform: scale(0.995); }
      50%     { opacity: 0.42; transform: scale(1.005); }
    }

    h2{
      margin: 4px 0 2px 0;
      text-align:center;
      font-size: 18px;
      font-weight: 750;
      letter-spacing: 0.2px;

      background: linear-gradient(90deg, rgba(255,255,255,0.95), rgba(191,146,255,0.95), rgba(164,104,241,0.95));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;

      text-shadow: 0 0 18px rgba(147,51,234,0.18);
    }

    .toggle-container{
      flex: 1;
      overflow: auto;
      padding: 6px 6px 0 6px;
      border-radius: 14px;
      background: rgba(7, 4, 15, 0.22);
      border: 1px solid rgba(191,146,255,0.10);
    }

    .toggle{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap: 16px;

      padding: 12px 12px;
      margin: 10px 4px;

      border-radius: 14px;
      border: 1px solid rgba(191,146,255,0.10);
      background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
      box-shadow: 0 10px 22px rgba(0,0,0,0.22);

      transform: translateY(6px);
      opacity: 0;
      animation: itemIn 420ms cubic-bezier(.2,.9,.2,1) forwards;
    }

    .toggle:nth-child(1){ animation-delay: 40ms; }
    .toggle:nth-child(2){ animation-delay: 90ms; }
    .toggle:nth-child(3){ animation-delay: 140ms; }
    .toggle:nth-child(4){ animation-delay: 190ms; }
    .toggle:nth-child(5){ animation-delay: 240ms; }

    @keyframes itemIn{
      to{ transform: translateY(0); opacity: 1; }
    }

    .toggle:hover{
      border-color: rgba(191,146,255,0.22);
      box-shadow: 0 14px 30px rgba(0,0,0,0.28), 0 0 0 1px rgba(164,104,241,0.10);
      transform: translateY(-1px);
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }

    .toggle strong{
      display:inline-block;
      color: rgba(255,255,255,0.92);
      font-size: 14px;
      font-weight: 720;
      letter-spacing: 0.2px;
    }

    .toggle small{
      display:inline-block;
      margin-top: 4px;
      color: var(--muted);
      font-size: 12.6px;
      line-height: 1.35;
    }

    input[type="checkbox"]{
      -webkit-appearance: none;
      appearance: none;
      width: 54px;
      height: 32px;
      border-radius: 999px;
      border: 1px solid rgba(191,146,255,0.22);
      background: rgba(255,255,255,0.06);
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.22);
      cursor: pointer;
      position: relative;
      outline: none;
      transition: background .2s ease, border-color .2s ease, box-shadow .2s ease, transform .15s ease;
    }

    input[type="checkbox"]::before{
      content:"";
      position:absolute;
      top: 50%;
      left: 6px;
      width: 22px;
      height: 22px;
      border-radius: 999px;
      transform: translateY(-50%);
      background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.62));
      box-shadow: 0 10px 22px rgba(0,0,0,0.30);
      transition: left .22s cubic-bezier(.2,.9,.2,1), transform .15s ease, filter .2s ease;
    }

    input[type="checkbox"]:hover{
      transform: scale(1.02);
      border-color: rgba(191,146,255,0.35);
    }

    input[type="checkbox"]:active{
      transform: scale(0.98);
    }

    input[type="checkbox"]:checked{
      background: linear-gradient(135deg, rgba(164,104,241,0.85), rgba(147,51,234,0.85));
      border-color: rgba(191,146,255,0.38);
      box-shadow: 0 0 0 4px rgba(164,104,241,0.10), inset 0 0 0 1px rgba(0,0,0,0.22);
    }

    input[type="checkbox"]:checked::before{
      left: 26px;
      background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.70));
      filter: drop-shadow(0 0 10px rgba(191,146,255,0.35));
    }

    .debug-box{
      width: 100%;
      height: 120px;
      overflow: auto;

      padding: 12px 12px;
      border-radius: 14px;
      border: 1px solid rgba(191,146,255,0.14);

      background:
        radial-gradient(700px 180px at 30% 0%, rgba(147,51,234,0.14), transparent 70%),
        rgba(6, 4, 14, 0.55);

      color: rgba(231, 211, 255, 0.92);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 12.6px;
      line-height: 1.35;
      white-space: pre-wrap;

      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.25);
    }

    .credit{
      text-align:center;
      margin-top: 2px;
      font-size: 11px;
      color: rgba(191,146,255,0.65);
      letter-spacing: 0.22px;
    }

    *::-webkit-scrollbar{ width: 10px; height: 10px; }
    *::-webkit-scrollbar-track{
      background: rgba(0,0,0,0.25);
      border-radius: 999px;
    }
    *::-webkit-scrollbar-thumb{
      background: linear-gradient(180deg, rgba(164,104,241,0.85), rgba(147,51,234,0.70));
      border-radius: 999px;
      border: 2px solid rgba(0,0,0,0.25);
    }
    *::-webkit-scrollbar-thumb:hover{
      background: linear-gradient(180deg, rgba(191,146,255,0.95), rgba(164,104,241,0.75));
    }

    @media (prefers-reduced-motion: reduce){
      *{ animation: none !important; transition: none !important; }
      body::before{ display:none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Ferramentas Avançadas</h2>
    <div class="toggle-container" id="toggles"></div>
    <div class="debug-box" id="debugBox"></div>
    <div class="credit">by Nickz</div>
  </div>
</body>
</html>
    `);

    // Cria os toggles (mantido igual)
    createToggle('Modo Debug', 'Ativa logs de depuração', 'debugMode', window.debugMode || false);
    createToggle('Desabilitar Segurança', 'Libera clique direito/F12', 'disableSecurity', window.disableSecurity || false);
    createToggle('Desabilitar Ping', 'Desativa requisição de ping', 'disablePing', 'disablePing', window.disablePing || false);
  });

  ul.appendChild(devTab);
  section.appendChild(ul);
  nav.appendChild(section);
});

// Funções globais (mantidas)
window.createToggle = function(name, desc, varName, toggled = false) {
  if (!window.khanwareWin || window.khanwareWin.closed) return;
  const toggleContainer = window.khanwareWin.document.getElementById('toggles');
  if (!toggleContainer) return;

  const toggleId = `toggle-${varName}`;
  const toggleElement = document.createElement('div');
  toggleElement.className = 'toggle';
  toggleElement.innerHTML = `
    <div>
      <strong>${name}</strong><br>
      <small>${desc}</small>
    </div>
    <input type="checkbox" id="${toggleId}" ${toggled ? "checked" : ""}>
  `;

  toggleElement.querySelector('input').addEventListener('change', (e) => {
    window[varName] = e.target.checked;
    debug(`${name} setado para ${window[varName]}!`);
  });

  toggleContainer.appendChild(toggleElement);
};

window.debug = function(message) {
  if (!window.khanwareWin || window.khanwareWin.closed || !window.debugMode) return;
  const debugBox = window.khanwareWin.document.getElementById('debugBox');
  if (debugBox) {
    debugBox.innerHTML += message + '\
';
    debugBox.scrollTop = debugBox.scrollHeight;
  }
};

window.onerror = function(message, source, lineno, colno, error) {
  debug(`Erro @ ${source}:${lineno},${colno} \
${error ? error.stack : message}`);
  return true;
};
