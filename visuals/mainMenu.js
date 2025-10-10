const logoUrl = "https://raw.githubusercontent.com/OnePrism0/KhanTool/main/logo.png";
const discordUrl = "https://raw.githubusercontent.com/OnePrism0/KhanTool/main/discord.png";

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

const topPanel = document.createElement('div');
topPanel.style.cssText = "position:fixed;top:22px;left:30px;width:310px;height:60px;background:linear-gradient(94deg,#2196f3 0%,#176bd7 60%,#93cdfa 100%);z-index:10500;box-shadow:0 6px 20px #2196f667;display:flex;align-items:center;border-radius:15px;user-select:none;cursor:pointer;padding:0 24px 0 22px;gap:16px;";
topPanel.innerHTML =
  `<img src="${logoUrl}" style="height:44px;width:44px;border-radius:15px;flex-shrink:0;box-shadow:0 4px 22px #176bd780;">
   <div style="display:flex;flex-direction:column;gap:6px;">
      <span style="font-size:1.37rem;color:#f6fcff;font-weight:900;letter-spacing:.10em;text-shadow:0 3px 22px #176bd768;">KHANTOOL</span>
      <span style="color:#eaf4fe;opacity:.82;font-size:1.09rem;font-weight:400;">Desenvolvido por One Prism</span>
   </div>`;

const discordIcon = document.createElement('img');
discordIcon.src = discordUrl;
discordIcon.style.cssText = "height:22px;width:22px;margin-left:auto;cursor:pointer;display:block;border-radius:5px;padding:2px;box-shadow:0 1.5px 6px #c1dcfa50;opacity:.78;transition:box-shadow .12s, opacity .15s;";
discordIcon.onmouseover = function(){discordIcon.style.opacity=".98";};
discordIcon.onmouseout = function(){discordIcon.style.opacity=".78";};
topPanel.appendChild(discordIcon);
document.body.appendChild(topPanel);

const menuPanel = document.createElement('div');
menuPanel.style.cssText = "position:fixed;top:98px;left:50px;min-width:320px;max-width:99vw;background:rgba(239,248,255,.98);box-shadow:0 9px 38px #41a8ff22;border-radius:18px;z-index:10502;padding:20px 27px 20px 27px;display:flex;flex-direction:column;gap:13px;font-family:Roboto,Arial,sans-serif;align-items:stretch;";
menuPanel.innerHTML =
  `<div style="width:100%;display:flex;align-items:center;margin-bottom:5px;">
     <span style="color:#115ea8;font-weight:800;font-size:1.21rem;flex:1;">Configurações</span>
     <button id="khantoolCloseBtn" style="font-size:1.30rem;width:29px;aspect-ratio:1/1;border:none;background:none;cursor:pointer;color:#1976d2;border-radius:7px;background:rgba(226,239,254,.62);font-weight:700;">×</button>
   </div>
   <div id="khantoolSwitches" style="display:flex;flex-direction:column;gap:11px;padding:6px 0 2px 0;"></div>
   <style>
   .ktswitch{width:36px;height:18px;background:#c2e0fa;border-radius:13px;display:inline-block;position:relative;transition:background .13s;vertical-align:middle;}
   .ktswitch>span{display:block;width:15px;height:15px;background:linear-gradient(120deg,#41a8ff 0%,#176bd7 90%);border-radius:17px;position:absolute;left:2px;top:2px;transition:all .15s;}
   input[type="checkbox"]:checked+.ktswitch>span{left:17px;background:linear-gradient(135deg,#19baf0 0%,#41a8ff 62%);}
   label:hover .ktswitch{background:#e2effa;}
   #khantoolCloseBtn:hover{background:rgba(188,220,255,.88);}
   </style>`;
document.body.appendChild(menuPanel);

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
    wrap.style.cssText = "display:flex;align-items:center;justify-content:space-between;font-size:1.09rem;color:#124c8c;font-weight:670;gap:17px;cursor:pointer;";
    
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

let isDragging = false;
let dragStarted = false;
let dragOffset = [0, 0];
let clickTimer = null;

discordIcon.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.open("https://discord.gg/tdy2jCWja2", "_blank");
});

topPanel.addEventListener('mousedown', function(e) {
    if (e.target === discordIcon) return;
    
    isDragging = true;
    dragStarted = false;
    dragOffset = [e.clientX - topPanel.offsetLeft, e.clientY - topPanel.offsetTop];
    document.body.style.userSelect = "none";
    
    if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
    }
    
    e.preventDefault();
});

document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    dragStarted = true;
    topPanel.style.boxShadow = "0 13px 33px #176bd266";
    
    let x = Math.max(0, Math.min(e.clientX - dragOffset[0], window.innerWidth - topPanel.offsetWidth));
    let y = Math.max(0, Math.min(e.clientY - dragOffset[1], window.innerHeight - topPanel.offsetHeight));
    
    topPanel.style.left = x + "px";
    topPanel.style.top = y + "px";
    
    if (menuPanel.style.display === "flex") {
        updateMenuPosition();
    }
});

document.addEventListener('mouseup', function() {
    if (!isDragging) return;
    
    const wasDragStarted = dragStarted;
    isDragging = false;
    dragStarted = false;
    topPanel.style.boxShadow = "0 6px 20px #2196f667";
    document.body.style.userSelect = "";
    
    if (!wasDragStarted) {
        clickTimer = setTimeout(function() {
            updateMenuPosition();
            menuPanel.style.display = (menuPanel.style.display === "none" ? "flex" : "none");
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

setTimeout(function() {
    updateMenuPosition();
    menuPanel.style.display = "flex";
}, 500);
