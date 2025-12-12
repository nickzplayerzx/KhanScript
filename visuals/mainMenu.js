// URLs corrigidas para usar raw.githubusercontent.com
const logoUrl = "https://raw.githubusercontent.com/nickzplayerzx/KhanScript/main/logo.png";
const discordUrl = "https://raw.githubusercontent.com/nickzplayerzx/KhanScript/main/logo.png";

if (!window.features) {
  window.features = {
    autoAnswer: true,
    questionSpoof: true,
    videoSpoof: true,
    minuteFarmer: false,
    customBanner: false,
    rgbLogo: false,
    darkMode: true
  };
}

/* ====== TOP BAR ULTRA MODERNA ====== */
const topPanel = document.createElement('div');
topPanel.id = "ks-top-panel";
topPanel.style.cssText = `
  position: fixed;
  top: 22px;
  left: 30px;
  width: 330px;
  height: 68px;
  z-index: 10500;
  display: flex;
  align-items: center;
  padding: 0 22px 0 20px;
  gap: 16px;
  user-select: none;
  cursor: pointer;
  border-radius: 18px;
  background:
    radial-gradient(140% 180% at 0% 0%, rgba(191,146,255,0.36), transparent 60%),
    radial-gradient(150% 200% at 100% 0%, rgba(164,104,241,0.38), transparent 55%),
    linear-gradient(115deg, #120821 0%, #1a0e30 40%, #2a134d 100%);
  box-shadow:
    0 14px 40px rgba(0,0,0,0.70),
    0 0 40px rgba(147,51,234,0.35);
  border: 1px solid rgba(191,146,255,0.45);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  overflow: hidden;
  transform: translateY(-8px) scale(.96);
  opacity: 0;
  transition:
    box-shadow .20s ease,
    transform .18s ease,
    border-color .20s ease,
    background .25s ease;
`;

// glow animado do top
topPanel.innerHTML = `
  <div style="
    position:absolute;
    inset:-60%;
    background:
      radial-gradient(circle at 10% 0%, rgba(191,146,255,0.38), transparent 55%),
      radial-gradient(circle at 90% 0%, rgba(164,104,241,0.35), transparent 58%);
    opacity:.55;
    filter:blur(24px);
    pointer-events:none;
    animation: ksAuroraTop 8s ease-in-out infinite alternate;
  "></div>
`;

const topLogo = document.createElement('img');
topLogo.src = logoUrl;
topLogo.style.cssText = `
  position:relative;
  height:46px;
  width:46px;
  border-radius:15px;
  flex-shrink:0;
  box-shadow:
    0 6px 22px rgba(0,0,0,0.75),
    0 0 20px rgba(147,51,234,0.60);
  object-fit:cover;
  border:1px solid rgba(255,255,255,0.15);
  background:#1b1030;
  transform: translateY(2px);
`;

const topTextBox = document.createElement('div');
topTextBox.style.cssText = `
  position:relative;
  display:flex;
  flex-direction:column;
  gap:5px;
`;

const titleSpan = document.createElement('span');
titleSpan.textContent = "KHANSCRIPT";
titleSpan.style.cssText = `
  font-size:1.40rem;
  font-weight:900;
  letter-spacing:.15em;
  text-transform:uppercase;
  color:#ffffff;
  background: linear-gradient(90deg, #ffffff 0%, #e2d0ff 30%, #b892ff 70%, #a468f1 100%);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
  text-shadow:0 0 28px rgba(106,53,217,0.7);
`;

const subtitleSpan = document.createElement('span');
subtitleSpan.textContent = "by Nickz";
subtitleSpan.style.cssText = `
  font-size:1.02rem;
  font-weight:500;
  color:rgba(227,214,255,0.92);
  opacity:.94;
`;

topTextBox.appendChild(titleSpan);
topTextBox.appendChild(subtitleSpan);

const discordIcon = document.createElement('img');
discordIcon.src = discordUrl;
discordIcon.style.cssText = `
  position:relative;
  height:24px;
  width:24px;
  margin-left:auto;
  cursor:pointer;
  display:block;
  border-radius:7px;
  padding:2px;
  box-shadow:
    0 4px 12px rgba(0,0,0,0.8),
    0 0 16px rgba(180,130,230,0.7);
  opacity:.82;
  transition:
    opacity .15s ease,
    transform .16s ease,
    box-shadow .18s ease,
    background .16s ease;
  background: radial-gradient(circle at 30% 0%, rgba(255,255,255,0.3), transparent 60%);
  border:1px solid rgba(222,203,255,0.45);
`;

topPanel.appendChild(topLogo);
topPanel.appendChild(topTextBox);
topPanel.appendChild(discordIcon);
document.body.appendChild(topPanel);

// animação de entrada da top bar
requestAnimationFrame(() => {
  topPanel.style.transform = "translateY(0) scale(1)";
  topPanel.style.opacity = "1";
});

const globalStyle = document.createElement('style');
globalStyle.textContent = `
@keyframes ksAuroraTop {
  from { transform: translate3d(-3%, -4%, 0) scale(1.02); opacity:.60; }
  to   { transform: translate3d( 3%,  2%, 0) scale(1.06); opacity:.85; }
}

@keyframes ksMenuIn {
  from { opacity:0; transform:translateY(6px) scale(.97); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}

.ks-panel-elevated {
  box-shadow:
    0 18px 45px rgba(0,0,0,0.85),
    0 0 40px rgba(147,51,234,0.40);
  border-color: rgba(198,169,255,0.85) !important;
}

.ks-menu-gradient {
  background:
    radial-gradient(190% 150% at 0% 0%, rgba(164,104,241,0.30), transparent 55%),
    radial-gradient(150% 150% at 100% 0%, rgba(124,92,255,0.28), transparent 55%),
    linear-gradient(135deg, rgba(14,7,27,0.96), rgba(18,10,35,0.98));
}
`;
document.head.appendChild(globalStyle);

/* ====== MENU LATERAL (CONFIG) ====== */

const menuPanel = document.createElement('div');
menuPanel.id = "ks-menu-panel";
menuPanel.style.cssText = `
  position: fixed;
  top: 98px;
  left: 50px;
  min-width: 320px;
  max-width: min(380px, 96vw);
  z-index: 10502;
  padding: 18px 22px 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  color: #f5edff;
  border-radius: 18px;
  border: 1px solid rgba(191,146,255,0.28);
  box-shadow:
    0 20px 50px rgba(0,0,0,0.80),
    0 0 40px rgba(124,92,255,0.32);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  overflow: hidden;
  opacity: 0;
  transform: translateY(6px) scale(.97);
  animation: ksMenuIn .26s cubic-bezier(.25,.9,.25,1) forwards;
`;
menuPanel.innerHTML = `
  <div style="position:absolute;inset:-35%;opacity:.55;pointer-events:none;
      background:
        radial-gradient(circle at 0% 0%, rgba(164,104,241,0.37), transparent 55%),
        radial-gradient(circle at 100% 0%, rgba(147,51,234,0.34), transparent 58%);
      filter:blur(26px);">
  </div>
  <div style="position:relative;width:100%;display:flex;align-items:center;margin-bottom:6px;z-index:1;">
    <span style="color:#f5edff;font-weight:800;font-size:1.18rem;flex:1;
      letter-spacing:.05em;text-transform:uppercase;">Configurações</span>
    <button id="khantoolCloseBtn" style="
      font-size:1.15rem;
      width:30px;
      aspect-ratio:1/1;
      border:none;
      background:rgba(39,19,80,0.85);
      color:#f1ddff;
      border-radius:9px;
      font-weight:700;
      cursor:pointer;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:0 6px 16px rgba(0,0,0,0.65);
      transition:
        background .16s ease,
        transform .14s ease,
        box-shadow .18s ease;
    ">×</button>
  </div>
  <div id="khantoolSwitches" style="
    position:relative;
    z-index:1;
    display:flex;
    flex-direction:column;
    gap:11px;
    padding:6px 0 4px 0;
  "></div>
  <style>
    #ks-menu-panel label.ks-switch-row {
      display:flex;
      align-items:center;
      justify-content:space-between;
      font-size:1.02rem;
      color:#f1e6ff;
      font-weight:600;
      gap:16px;
      cursor:pointer;
      padding:7px 4px;
      border-radius:10px;
      transition:background .15s ease, transform .12s ease;
    }
    #ks-menu-panel label.ks-switch-row:hover {
      background:rgba(45,22,85,0.65);
      transform:translateY(-1px);
    }

    .ktswitch {
      width: 42px;
      height: 22px;
      background: rgba(46, 27, 87, 0.9);
      border-radius: 999px;
      display: inline-block;
      position: relative;
      transition: background 0.18s ease, box-shadow .18s ease, border-color .18s ease;
      vertical-align: middle;
      border:1px solid rgba(191,146,255,0.38);
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.75);
    }
    .ktswitch > span {
      display: block;
      width: 18px;
      height: 18px;
      background: linear-gradient(180deg, #f7f3ff 0%, #d7c4ff 100%);
      border-radius: 999px;
      position: absolute;
      left: 2px;
      top: 2px;
      transition: all 0.20s cubic-bezier(.3,1,.3,1);
      box-shadow: 0 8px 18px rgba(0,0,0,0.85);
    }
    input[type="checkbox"]:checked + .ktswitch > span {
      left: 22px;
      background: radial-gradient(circle at 30% 0%, #ffffff 0%, #f0e5ff 40%, #cba6ff 100%);
      box-shadow:
        0 0 14px rgba(191,146,255,0.9),
        0 8px 20px rgba(0,0,0,0.8);
    }
    input[type="checkbox"]:checked + .ktswitch {
      background: linear-gradient(135deg, #a468f1 0%, #9333ea 70%, #7c5cff 100%);
      box-shadow:
        0 0 18px rgba(164,104,241,0.8),
        inset 0 0 0 1px rgba(0,0,0,0.7);
      border-color:rgba(222,203,255,0.9);
    }
    label.ks-switch-row:hover .ktswitch {
      box-shadow:
        0 0 20px rgba(124,92,255,0.55),
        inset 0 0 0 1px rgba(0,0,0,0.8);
    }
    #khantoolCloseBtn:hover {
      background:rgba(63,31,111,0.98);
      transform:translateY(-1px) scale(1.02);
      box-shadow:0 8px 18px rgba(0,0,0,0.75);
    }
    #khantoolCloseBtn:active {
      transform:translateY(0) scale(.96);
      box-shadow:0 4px 10px rgba(0,0,0,0.6);
    }
  </style>
`;
document.body.appendChild(menuPanel);

// switches
const switchesList = [
  { id: "autoAnswer", text: "Respostas automáticas", var: "autoAnswer", checked: true },
  { id: "questionSpoof", text: "Spoof de Questão", var: "questionSpoof", checked: true },
  { id: "videoSpoof", text: "Vídeo Automático", var: "videoSpoof", checked: true },
  { id: "minuteFarmer", text: "Farming de Minutos", var: "minuteFarmer", checked: false },
  { id: "customBanner", text: "Banner Personalizado", var: "customBanner", checked: false },
  { id: "rgbLogo", text: "RGB Logo", var: "rgbLogo", checked: false },
  { id: "darkMode", text: "Modo Noturno", var: "darkMode", checked: true }
];

const switchesDiv = menuPanel.querySelector('#khantoolSwitches');
switchesList.forEach(sw => {
  const wrap = document.createElement('label');
  wrap.className = "ks-switch-row";

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = sw.id;
  checkbox.style.display = 'none';
  checkbox.checked = sw.checked;

  const textSpan = document.createElement('span');
  textSpan.textContent = sw.text;

  const switchSpan = document.createElement('span');
  switchSpan.className = 'ktswitch';
  switchSpan.innerHTML = '<span></span>';

  wrap.appendChild(textSpan);
  wrap.appendChild(checkbox);
  wrap.appendChild(switchSpan);

  const handleToggle = function(e) {
    e.preventDefault();
    e.stopPropagation();
    checkbox.checked = !checkbox.checked;
    window.features[sw.var] = checkbox.checked;

    if (sw.var === 'darkMode') {
      if (checkbox.checked && typeof DarkReader !== 'undefined') {
        DarkReader.enable();
      } else if (!checkbox.checked && typeof DarkReader !== 'undefined') {
        DarkReader.disable();
      }
    }

    if (typeof sendToast === 'function') {
      sendToast(`${sw.text} ${checkbox.checked ? "ativado" : "desativado"}!`, 1000);
    }
  };

  wrap.addEventListener('click', handleToggle);
  switchSpan.addEventListener('click', handleToggle);
  checkbox.addEventListener('change', function() {
    window.features[sw.var] = this.checked;
  });

  window.features[sw.var] = checkbox.checked;
  switchesDiv.appendChild(wrap);
});

function updateMenuPosition() {
  const rect = topPanel.getBoundingClientRect();
  menuPanel.style.left = (rect.left + 20) + "px";
  menuPanel.style.top = (rect.bottom + 16) + "px";
}

menuPanel.querySelector('#khantoolCloseBtn').onclick = function () {
  menuPanel.style.display = "none";
};

/* ====== DRAG + TOGGLE MENU ====== */

let isDragging = false;
let dragStarted = false;
let dragOffset = [0, 0];
let clickTimer = null;

discordIcon.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  window.open("https://discord.gg/KnBnfSDqxt", "_blank");
});

topPanel.addEventListener('mousedown', function(e) {
  if (e.target === discordIcon) return;
  isDragging = true;
  dragStarted = false;
  dragOffset = [e.clientX - topPanel.offsetLeft, e.clientY - topPanel.offsetTop];
  document.body.style.userSelect = "none";
  if (clickTimer) clearTimeout(clickTimer);
  topPanel.classList.add("ks-panel-elevated");
  e.preventDefault();
});

document.addEventListener('mousemove', function(e) {
  if (!isDragging) return;
  dragStarted = true;
  let x = Math.max(0, Math.min(e.clientX - dragOffset[0], window.innerWidth - topPanel.offsetWidth));
  let y = Math.max(0, Math.min(e.clientY - dragOffset[1], window.innerHeight - topPanel.offsetHeight));
  topPanel.style.left = x + "px";
  topPanel.style.top = y + "px";
  if (menuPanel.style.display === "flex") updateMenuPosition();
});

document.addEventListener('mouseup', function() {
  if (!isDragging) return;
  const wasDragStarted = dragStarted;
  isDragging = false;
  dragStarted = false;
  document.body.style.userSelect = "";
  topPanel.classList.remove("ks-panel-elevated");
  if (!wasDragStarted) {
    clickTimer = setTimeout(() => {
      updateMenuPosition();
      menuPanel.style.display = (menuPanel.style.display === "none" || !menuPanel.style.display) ? "flex" : "none";
    }, 10);
  } else {
    updateMenuPosition();
  }
});

window.addEventListener('resize', function () {
  const currentLeft = parseInt(topPanel.style.left) || 30;
  const currentTop = parseInt(topPanel.style.top) || 22;
  if (currentLeft + topPanel.offsetWidth > window.innerWidth) {
    topPanel.style.left = (window.innerWidth - topPanel.offsetWidth) + "px";
  }
  if (currentTop + topPanel.offsetHeight > window.innerHeight) {
    topPanel.style.top = (window.innerHeight - topPanel.offsetHeight) + "px";
  }
  updateMenuPosition();
});

setTimeout(() => {
  updateMenuPosition();
  menuPanel.style.display = "flex";
}, 500);
