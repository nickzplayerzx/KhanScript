const ver = "V1.0";
let isDev = false;

const logoUrl = "https://github.com/nickzplayerzx/KhanScript/blob/main/logo.png";
const repoPathDefault = `https://raw.githubusercontent.com/OnePrism0/KhanTool/${isDev ? "dev" : "main"}/`;
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

const unloader = document.createElement('unloader');
const dropdownMenu = document.createElement('dropDownMenu');
const watermark = document.createElement('watermark');
const statsPanel = document.createElement('statsPanel');
const splashScreen = document.createElement('splashScreen');

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

document.addEventListener('contextmenu', (e) => !window.disableSecurity && e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (!window.disableSecurity && (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)))) {
        e.preventDefault();
    }
});
console.log(Object.defineProperties(new Error, {toString: {value() {(new Error).stack.includes('toString@') && location.reload();}},message: {get() {location.reload();}},}));

(function(){
    let favicon = document.querySelector("link[rel~='icon']");
    if(!favicon){
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
    }
    favicon.href = logoUrl;
})();

document.head.appendChild(Object.assign(document.createElement("style"),{innerHTML:"@font-face{font-family:'Arial';}"}));
document.head.appendChild(Object.assign(document.createElement('style'),{innerHTML:"::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #e4f1fd; } ::-webkit-scrollbar-thumb { background: #176bd7; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #06376b; }"}));

class EventEmitter {
    constructor() { this.events = {} }
    on(t, e) { "string" == typeof t && (t = [t]), t.forEach(t => { this.events[t] || (this.events[t] = []), this.events[t].push(e) }) }
    off(t, e) { "string" == typeof t && (t = [t]), t.forEach(t => { this.events[t] && (this.events[t] = this.events[t].filter(t => t !== e)) }) }
    emit(t, ...e) { this.events[t] && this.events[t].forEach(t => { t(...e) }) }
    once(t, e) { "string" == typeof t && (t = [t]); let s = (...i) => { e(...i), this.off(t, s) }; this.on(t, s) }
};
const plppdo = new EventEmitter();

new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList)
        if (mutation.type === 'childList')
            plppdo.emit('domChanged');
}).observe(document.body, { childList: true, subtree: true });

window.debug = function (text) { };
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url); audio.play(); };
const findAndClickBySelector = selector => { const element = document.querySelector(selector); if (element) { element.click(); sendToast(`Ação automática: ${selector}`, 900); } };

function sendToast(text, duration = 3000, gravity = 'bottom') {
    if (window.Toastify)
        Toastify({
            text: text,
            duration: duration,
            gravity: gravity,
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#176bd7",
                color: "#fff",
                borderRadius: "8px",
                fontFamily: "Arial, sans-serif",
                fontSize: "15px",
                boxShadow: "0 6px 22px 0 rgba(28,81,164,0.16)"
            }
        }).showToast();
}

async function showSplashScreen() {
    splashScreen.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;background:linear-gradient(122deg,#e4f1fd 0%,#176bd7 100%);display:flex;" +
        "align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.5s ease;user-select:none;" +
        "color:#1851a8;font-family:Arial,sans-serif;font-size:34px;text-align:center;letter-spacing:.05em;flex-direction:column;";
    splashScreen.innerHTML =
        `<img src="${logoUrl}" style="height:100px;margin-bottom:18px;"><span style="font-weight:800;line-height:32px;letter-spacing:2.5px;font-size:30px;color:#176bd7">KhanTool</span>` +
        '<span style="margin-top:7px;font-size:14px;color:#2e5c94;font-weight:500;">Carregando...</span>';
    document.body.appendChild(splashScreen);
    setTimeout(() => splashScreen.style.opacity = '1', 10);
}

async function hideSplashScreen() { splashScreen.style.opacity = '0'; setTimeout(() => splashScreen.remove(), 800); }

async function loadScript(url, label) {
    return fetch(url)
        .then(r => {
            if (!r.ok) throw new Error(url);
            return r.text();
        })
        .then(script => { loadedPlugins.push(label); eval(script); })
        .catch(async e => {
            if (url.includes('/main/') && !url.includes('/refs/heads/')) {
                let altUrl = url.replace('/main/', '/refs/heads/main/');
                try {
                    let altResp = await fetch(altUrl);
                    if (!altResp.ok) throw new Error(altUrl);
                    let script = await altResp.text();
                    loadedPlugins.push(label + ' (alt)');
                    eval(script);
                    sendToast('Carregado via refs/heads: ' + altUrl, 3300, 'top');
                    return;
                } catch (err) {
                    sendToast("Erro: " + err, 8000, 'top');
                }
            } else if (url.includes('/dev/') && !url.includes('/refs/heads/')) {
                let altUrl = url.replace('/dev/', '/refs/heads/dev/');
                try {
                    let altResp = await fetch(altUrl);
                    if (!altResp.ok) throw new Error(altUrl);
                    let script = await altResp.text();
                    loadedPlugins.push(label + ' (alt)');
                    eval(script);
                    sendToast('Carregado via refs/heads: ' + altUrl, 3300, 'top');
                    return;
                } catch (err) {
                    sendToast("Erro: " + err, 8000, 'top');
                }
            } else {
                sendToast("Erro: " + e, 8000, 'top');
            }
        });
}

async function loadCss(url) {
    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
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
        alert("KhanTool só pode ser executado na Khan Academy: https://pt.khanacademy.org/");
        window.location.href = "https://pt.khanacademy.org/";
        return;
    }
    await showSplashScreen();
    await loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin');
    if (window.DarkReader) { DarkReader.setFetchMethod(window.fetch); DarkReader.enable(); }
    await loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin');
    await loadScript('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.js', 'onekoJs');
    setTimeout(()=>{
        const onekoEl = document.getElementById('oneko');
        if(onekoEl){
            onekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/OnePrism0/KhanTool/main/logo.png')";
            onekoEl.style.display = "none";
        }
    },1000);
    fetch("https://pt.khanacademy.org/api/internal/graphql/getFullUserProfile", {
        referrer: "https://pt.khanacademy.org/profile/me",
        body: '{"operationName":"getFullUserProfile","query":"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    nickname\\n    username\\n  }\\n}"}',
        method: "POST",
        mode: "cors",
        credentials: "include"
    }).then(async response => { 
        let data = await response.json();
        if(data && data.data && data.data.user){
            user = { nickname: data.data.user.nickname, username: data.data.user.username, UID: data.data.user.id.slice(-5) };
        }
    });
    sendToast("KhanTool injetado com sucesso!");
    playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
    await delay(500);
    sendToast(`Bem vindo(a) de volta: ${user.nickname}`);
    if (device.apple) { await delay(500); sendToast(`Que tal comprar um Samsung?`); }
    loadedPlugins.forEach(plugin => sendToast(`${plugin} Loaded!`, 2000, 'top'));
    hideSplashScreen();
    setupMenu();
    setupMain();
    console.clear();
    if(!device.mobile){
        const script = Object.assign(document.createElement('script'),
        {src:'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3',async:true,onload:()=>{const discEmbed=new Crate({server:'1298477766290837554',channel:'1310975104460656662',location:['bottom','right'],notifications:true,indicator:true,allChannelNotifications:true,defer:false,color:'#2480db'});plppdo.on('domChanged',()=>window.location.href.includes("khanacademy.org/profile")?discEmbed.show():discEmbed.hide());}});
        document.body.appendChild(script);
    }
})();
