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

const topPanel = document.createElement('div');
topPanel.style.cssText = `
    position: fixed;
    top: 22px;
    left: 30px;
    width: 310px;
    height: 60px;
    background: linear-gradient(94deg, #6a35d9 0%, #4a1fb8 60%, #8a5bd9 100%);
    z-index: 10500;
    box-shadow: 0 6px 20px rgba(106, 53, 217, 0.4);
    display: flex;
    align-items: center;
    border-radius: 15px;
    user-select: none;
    cursor: pointer;
    padding: 0 24px 0 22px;
    gap: 16px;
`;
topPanel.innerHTML = `
    <img src="${logoUrl}" style="height:44px;width:44px;border-radius:15px;flex-shrink:0;box-shadow:0 4px 22px rgba(106, 53, 217, 0.5);">
    <div style="display:flex;flex-direction:column;gap:6px;">
        <span style="font-size:1.37rem;color:#f0e6ff;font-weight:900;letter-spacing:.10em;text-shadow:0 3px 22px rgba(106, 53, 217, 0.4);">KHANSCRIPT</span>
        <span style="color:#d9c6ff;opacity:.85;font-size:1.09rem;font-weight:400;">by Nickz</span>
    </div>`;

const discordIcon = document.createElement('img');
discordIcon.src = discordUrl;
discordIcon.style.cssText = `
    height:22px;
    width:22px;
    margin-left:auto;
    cursor:pointer;
    display:block;
    border-radius:5px;
    padding:2px;
    box-shadow:0 1.5px 6px rgba(180, 130, 230, 0.3);
    opacity:.78;
    transition:box-shadow .12s, opacity .15s;
`;
discordIcon.onmouseover = () => discordIcon.style.opacity = ".98";
discordIcon.onmouseout = () => discordIcon.style.opacity = ".78";
topPanel.appendChild(discordIcon);
document.body.appendChild(topPanel);

const menuPanel = document.createElement('div');
menuPanel.style.cssText = `
    position: fixed;
    top: 98px;
    left: 50px;
    min-width: 320px;
    max-width: 99vw;
    background: rgba(18, 10, 35, 0.92);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 9px 38px rgba(106, 53, 217, 0.25);
    border-radius: 18px;
    z-index: 10502;
    padding: 20px 27px;
    display: flex;
    flex-direction: column;
    gap: 13px;
    font-family: Roboto, Arial, sans-serif;
    color: #e0d0ff;
`;
menuPanel.innerHTML = `
    <div style="width:100%;display:flex;align-items:center;margin-bottom:5px;">
        <span style="color:#d9c6ff;font-weight:800;font-size:1.21rem;flex:1;">Configurações</span>
        <button id="khantoolCloseBtn" style="font-size:1.30rem;width:29px;aspect-ratio:1/1;border:none;background:rgba(60, 30, 100, 0.4);color:#d9b3ff;border-radius:7px;font-weight:700;cursor:pointer;">×</button>
    </div>
    <div id="khantoolSwitches" style="display:flex;flex-direction:column;gap:11px;padding:6px 0 2px 0;"></div>
    <style>
        .ktswitch {
            width: 36px;
            height: 18px;
            background: #4a2a7a;
            border-radius: 13px;
            display: inline-block;
            position: relative;
            transition: background 0.13s;
            vertical-align: middle;
        }
        .ktswitch > span {
            display: block;
            width: 15px;
            height: 15px;
            background: linear-gradient(120deg, #8a5bd9 0%, #6a35d9 90%);
            border-radius: 17px;
            position: absolute;
            left: 2px;
            top: 2px;
            transition: all 0.15s;
        }
        input[type="checkbox"]:checked + .ktswitch > span {
            left: 17px;
            background: linear-gradient(135deg, #b288e6 0%, #9a7ed9 62%);
        }
        label:hover .ktswitch {
            background: #5a3a8a;
        }
        #khantoolCloseBtn:hover {
            background: rgba(80, 40, 120, 0.6);
        }
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
    wrap.style.cssText = "display:flex;align-items:center;justify-content:space-between;font-size:1.09rem;color:#d9c6ff;font-weight:600;gap:17px;cursor:pointer;";
    
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
    window.open("https://discord.gg/KnBnfSDqxt", "_blank");
});

topPanel.addEventListener('mousedown', function(e) {
    if (e.target === discordIcon) return;
    isDragging = true;
    dragStarted = false;
    dragOffset = [e.clientX - topPanel.offsetLeft, e.clientY - topPanel.offsetTop];
    document.body.style.userSelect = "none";
    if (clickTimer) clearTimeout(clickTimer);
    e.preventDefault();
});

document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    dragStarted = true;
    topPanel.style.boxShadow = "0 13px 33px rgba(106, 53, 217, 0.5)";
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
    topPanel.style.boxShadow = "0 6px 20px rgba(106, 53, 217, 0.4)";
    document.body.style.userSelect = "";
    if (!wasDragStarted) {
        clickTimer = setTimeout(() => {
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

setTimeout(() => {
    updateMenuPosition();
    menuPanel.style.display = "flex";
}, 500);
