const ver = "V1.0";
let isDev = false;

// ✅ URLs corrigidas: SEM espaços
const logoUrl = "https://raw.githubusercontent.com/nickzplayerzx/KhanScript/main/logo.png";
const repoPathDefault = `https://raw.githubusercontent.com/nickzplayerzx/KhanScript/${isDev ? "dev" : "main"}/`;
const repoPathRefHeads = `https://raw.githubusercontent.com/nickzplayerzx/KhanScript/refs/heads/${isDev ? "dev" : "main"}/`;

let device = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile|Tablet|Kindle|Silk|PlayBook|BB10/i.test(navigator.userAgent),
    apple: /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent)
};

let user = {
    username: "Username",
    nickname: "Nickname",
    UID: 0
};

let loadedPlugins = [];

const unloader = document.createElement('div');
const dropdownMenu = document.createElement('div');
const watermark = document.createElement('div');
const statsPanel = document.createElement('div');
const splashScreen = document.createElement('div');

window.features = {
    questionSpoof: true,
    videoSpoof: true,
    showAnswers: false,
    autoAnswer: false,
    customBanner: false,
    nextRecomendation: false,
    repeatQuestion: false,
    minuteFarmer: false,
    rgbLogo: false,
    darkMode: true
};
window.featureConfigs = {
    autoAnswerDelay: 3,
    customUsername: "",
    customPfp: ""
};

// Segurança (opcional)
document.addEventListener('contextmenu', (e) => !window.disableSecurity && e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (!window.disableSecurity && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) {
        e.preventDefault();
    }
});

// Atualiza favicon
(function(){
    let favicon = document.querySelector("link[rel~='icon']");
    if(!favicon){
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
    }
    favicon.href = logoUrl;
})();

// Fonte e scroll personalizado (roxo dark)
document.head.appendChild(Object.assign(document.createElement("style"),{
    innerHTML: "@font-face{font-family:'Arial';}"
}));
document.head.appendChild(Object.assign(document.createElement('style'),{
    innerHTML: `
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #140c28; }
        ::-webkit-scrollbar-thumb { background: #9a7ed9; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #b288e6; }
    `
}));

// EventEmitter
class EventEmitter {
    constructor() { this.events = {} }
    on(t, e) { "string" == typeof t && (t = [t]), t.forEach(t => { this.events[t] || (this.events[t] = []), this.events[t].push(e) }) }
    off(t, e) { "string" == typeof t && (t = [t]), t.forEach(t => { this.events[t] && (this.events[t] = this.events[t].filter(t => t !== e)) }) }
    emit(t, ...e) { this.events[t] && this.events[t].forEach(t => { t(...e) }) }
    once(t, e) { "string" == typeof t && (t = [t]); let s = (...i) => { e(...i), this.off(t, s) }; this.on(t, s) }
}
const plppdo = new EventEmitter();

new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList)
        if (mutation.type === 'childList')
            plppdo.emit('domChanged');
}).observe(document.body, { childList: true, subtree: true });

window.debug = function (text) { };
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play().catch(()=>{}); };
const findAndClickBySelector = selector => {
    const element = document.querySelector(selector);
    if (element) {
        element.click();
        sendToast(`Ação automática: ${selector}`, 900);
    }
};

function sendToast(text, duration = 3000, gravity = 'bottom') {
    if (window.Toastify)
        Toastify({
            text: text,
            duration: duration,
            gravity: gravity,
            position: "center",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(100deg, #6a35d9, #8a5bd9)",
                color: "#f8f2ff",
                borderRadius: "10px",
                fontFamily: "Arial, sans-serif",
                fontSize: "15px",
                boxShadow: "0 6px 22px rgba(106, 53, 217, 0.45)"
            }
        }).showToast();
}

async function showSplashScreen() {
    splashScreen.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: linear-gradient(130deg, #140c28 0%, #25154a 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.5s ease;
        user-select: none;
        color: #e6ccff;
        font-family: Arial, sans-serif;
        font-size: 34px;
        text-align: center;
        letter-spacing: .05em;
        flex-direction: column;
    `;
    splashScreen.innerHTML = `
        <img src="${logoUrl}" style="height:100px; margin-bottom:18px; filter: drop-shadow(0 0 12px rgba(138, 91, 217, 0.7));">
        <span style="font-weight:800; line-height:32px; letter-spacing:2.5px; font-size:30px; color:#d9b3ff;">KhanScript</span>
        <span style="margin-top:7px; font-size:14px; color:#b288e6; font-weight:500;">Carregando... by Nickz</span>
    `;
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 10);
}

async function hideSplashScreen() {
    splashScreen.style.opacity = '0';
    setTimeout(() => splashScreen.remove(), 800);
}

async function loadScript(url, label) {
    const cleanUrl = url.trim();
    return fetch(cleanUrl)
        .then(r => {
            if (!r.ok) throw new Error(cleanUrl);
            return r.text();
        })
        .then(script => {
            loadedPlugins.push(label);
            eval(script);
        })
        .catch(async e => {
            let altUrl = cleanUrl.includes('/main/') 
                ? cleanUrl.replace('/main/', '/refs/heads/main/')
                : cleanUrl.includes('/dev/')
                ? cleanUrl.replace('/dev/', '/refs/heads/dev/')
                : null;
            if (altUrl) {
                try {
                    let altResp = await fetch(altUrl);
                    if (!altResp.ok) throw new Error(altUrl);
                    let script = await altResp.text();
                    loadedPlugins.push(label + ' (alt)');
                    eval(script);
                    sendToast('Carregado via refs/heads', 2500, 'top');
                    return;
                } catch (err) {
                    sendToast("Erro ao carregar: " + label, 5000, 'top');
                }
            } else {
                sendToast("Erro: " + label, 5000, 'top');
            }
        });
}

async function loadCss(url) {
    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url.trim();
        link.onload = () => resolve();
        document.head.appendChild(link);
    });
}

function setupMenu() {
    loadScript(repoPathDefault + 'visuals/mainMenu.js', 'mainMenu');
    loadScript(repoPathDefault + 'visuals/statusPanel.js', 'statusPanel');
    loadScript(repoPathDefault + 'visuals/widgetBot.js', 'widgetBot');
    if (isDev) loadScript(repoPathDefault + 'visuals/devTab.js', 'devTab');
}

function setupMain() {
    loadScript(repoPathDefault + 'functions/questionSpoof.js', 'questionSpoof');
    loadScript(repoPathDefault + 'functions/videoSpoof.js', 'videoSpoof');
    loadScript(repoPathDefault + 'functions/minuteFarm.js', 'minuteFarm');
    loadScript(repoPathDefault + 'functions/spoofUser.js', 'spoofUser');
    loadScript(repoPathDefault + 'functions/answerRevealer.js', 'answerRevealer');
    loadScript(repoPathDefault + 'functions/rgbLogo.js', 'rgbLogo');
    loadScript(repoPathDefault + 'functions/customBanner.js', 'customBanner');
    loadScript(repoPathDefault + 'functions/autoAnswer.js', 'autoAnswer');
}

(async function(){
    if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
        alert("KhanScript só pode ser executado na Khan Academy: https://pt.khanacademy.org/");
        window.location.href = "https://pt.khanacademy.org/";
        return;
    }

    await showSplashScreen();

    // Carrega dependências — ✅ URLs sem espaços
    await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin');
    if (window.DarkReader) {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable({
            brightness: 105,
            contrast: 109,
            darkSchemeBackgroundColor: '#140c28',
            darkSchemeTextColor: '#e6ccff'
        });
    }

    await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin');
    await loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.js', 'onekoJs');

    setTimeout(()=>{
        const onekoEl = document.getElementById('oneko');
        if(onekoEl){
            onekoEl.style.backgroundImage = `url('${logoUrl}')`;
            onekoEl.style.display = "none";
        }
    },1000);

    // Busca perfil — ✅ URL e body sem espaços
    fetch("https://pt.khanacademy.org/api/internal/graphql/getFullUserProfile", {
        referrer: "https://pt.khanacademy.org/profile/me",
        body: '{"operationName":"getFullUserProfile","query":"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    nickname\\n    username\\n  }\\n}"}',
        method: "POST",
        mode: "cors",
        credentials: "include"
    }).then(async response => {
        let data = await response.json();
        if(data?.data?.user){
            user = {
                nickname: data.data.user.nickname,
                username: data.data.user.username,
                UID: data.data.user.id.slice(-5)
            };
        }
    });

    sendToast("KhanScript injetado com sucesso!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    await delay(500);
    sendToast(`Bem-vindo(a) de volta: ${user.nickname}`);
    if (device.apple) {
        await delay(500);
        sendToast(`Que tal experimentar um Android?`);
    }

    loadedPlugins.forEach(plugin => sendToast(`${plugin} carregado!`, 2000, 'top'));

    hideSplashScreen();
    setupMenu();
    setupMain();

    console.clear();
    console.log("%cKhanScript %cby Nickz", "color:#d9b3ff;font-weight:bold;", "color:#9a7ed9;");

    // Widget do Discord (só em desktop)
    if (!device.mobile) {
        const script = Object.assign(document.createElement('script'), {
            src: 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3',
            async: true,
            onload: () => {
                const discEmbed = new Crate({
                    server: '1298477766290837554',
                    channel: '1310975104460656662',
                    location: ['bottom', 'right'],
                    notifications: true,
                    indicator: true,
                    allChannelNotifications: true,
                    defer: false,
                    color: '#9a7ed9'
                });
                plppdo.on('domChanged', () =>
                    window.location.href.includes("khanacademy.org/profile")
                        ? discEmbed.show()
                        : discEmbed.hide()
                );
            }
        });
        document.body.appendChild(script);
    }
})();
