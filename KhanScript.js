// KhanScript.js — versão estendida com fetch resiliente (timeout, retries, cache, fallback)
// Editado para adicionar timeout, retry exponencial com jitter, cache em localStorage, e fallback jsDelivr.

const ver = "V1.0";
let isDev = false;

// URLs corrigidas (sem espaços, usando raw)
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
    customPfp: "",
    // Configurações do fetch resiliente:
    githubToken: "",          // opcional: token pessoal do GitHub (coloque aqui ou em window.featureConfigs antes de injetar)
    fetchTimeoutMs: 10000,    // timeout padrão (ms)
    fetchRetries: 3,          // número de tentativas (retries)
    fetchCacheTtlMs: 1000 * 60 * 60 // 1h cache padrão
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

window.debug = function (text) { }; // stub
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => { const audio = new Audio(url.trim()); audio.play().catch(()=>{}); };
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
    setTimeout(() => {
        if (splashScreen && splashScreen.parentElement) splashScreen.remove();
    }, 800);
}

/*
  FUNÇÕES RESILIENTES DE FETCH
  - resilientFetch: faz fetch com timeout, retries exponencial com jitter, tratamento de 429, cache em localStorage e fallback para jsDelivr quando raw.githubusercontent falhar.
  - loadScript: carrega script via tag quando for CDN, ou via fetch+eval quando for script raw.
  - loadCss: carrega CSS via <link> ou injeta <style> se necessário.
*/

function parseRetryAfter(header) {
    if (!header) return null;
    // Retry-After pode ser segundos ou data HTTP
    const seconds = parseInt(header, 10);
    if (!isNaN(seconds)) return seconds * 1000;
    const date = Date.parse(header);
    if (!isNaN(date)) return date - Date.now();
    return null;
}

function jsDelivrFallback(rawUrl) {
    try {
        if (!rawUrl.startsWith('https://raw.githubusercontent.com/')) return null;
        const path = rawUrl.replace('https://raw.githubusercontent.com/', '');
        const parts = path.split('/');
        if (parts.length < 4) return null;
        const owner = parts[0];
        const repo = parts[1];
        const branch = parts[2];
        const rest = parts.slice(3).join('/');
        return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${rest}`;
    } catch (e) {
        return null;
    }
}

async function resilientFetch(url, opts = {}) {
    const timeoutMs = opts.timeoutMs || window.featureConfigs.fetchTimeoutMs || 10000;
    const maxRetries = (typeof opts.retries === 'number') ? opts.retries : (window.featureConfigs.fetchRetries || 3);
    const cacheTtl = (typeof opts.cacheTtlMs === 'number') ? opts.cacheTtlMs : (window.featureConfigs.fetchCacheTtlMs || (1000 * 60 * 60));
    const forceNoCache = !!opts.noCache;
    const method = (opts.method || 'GET').toUpperCase();

    const cacheKey = `khanscript_cache_${method}_${url}`;
    if (!forceNoCache && method === 'GET') {
        try {
            const raw = localStorage.getItem(cacheKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Date.now() - parsed._cachedAt < cacheTtl) {
                    return new Response(parsed.content, { status: 200, headers: parsed.headers || {} });
                } else {
                    localStorage.removeItem(cacheKey);
                }
            }
        } catch (e) { /* ignore cache errors */ }
    }

    let attempt = 0;
    let lastError = null;
    let tryUrl = url;

    while (attempt <= maxRetries) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);

        const headers = Object.assign({}, opts.headers || {});
        if (window.featureConfigs && window.featureConfigs.githubToken) {
            // se o token existir e URL for api.github.com ou raw.githubusercontent, adiciona header
            try {
                const token = window.featureConfigs.githubToken;
                if (token && token.length) {
                    headers['Authorization'] = `token ${token}`;
                }
            } catch (e) {}
        }

        try {
            const response = await fetch(tryUrl, Object.assign({}, opts, { signal: controller.signal, headers }));
            clearTimeout(id);

            if (response.ok) {
                // cache GET responses
                if (!forceNoCache && method === 'GET') {
                    try {
                        const cloned = response.clone();
                        const text = await cloned.text();
                        const headersObj = {};
                        response.headers.forEach((v, k) => headersObj[k] = v);
                        localStorage.setItem(cacheKey, JSON.stringify({
                            _cachedAt: Date.now(),
                            content: text,
                            headers: headersObj
                        }));
                        // Recreate a Response from cached text so caller can await response.text()
                        return new Response(text, { status: response.status, headers: headersObj });
                    } catch (e) {
                        // se falhar cache, ainda retornamos response original
                        return response;
                    }
                }
                return response;
            } else if (response.status === 429) {
                // tratar Retry-After ou X-RateLimit-Reset
                const ra = response.headers.get('Retry-After') || response.headers.get('retry-after');
                const reset = response.headers.get('X-RateLimit-Reset') || response.headers.get('x-ratelimit-reset');
                let waitMs = parseRetryAfter(ra);
                if (!waitMs && reset) {
                    const epoch = parseInt(reset, 10);
                    if (!isNaN(epoch)) waitMs = Math.max(0, (epoch * 1000) - Date.now());
                }
                if (!waitMs) waitMs = Math.min(60000, 1000 * Math.pow(2, attempt)); // fallback
                await delay(waitMs + Math.floor(Math.random() * 300));
                lastError = new Error('429 Too Many Requests');
            } else if (response.status >= 500 && response.status < 600) {
                // erro de servidor, vamos retry com backoff
                const backoff = Math.min(30000, 200 * Math.pow(2, attempt)) + Math.floor(Math.random() * 200);
                await delay(backoff);
                lastError = new Error(`HTTP ${response.status}`);
            } else {
                // outros erros (4xx) — não vamos continuar fazendo retries
                const text = await response.text().catch(()=>null);
                const err = new Error(`HTTP ${response.status}: ${text || response.statusText}`);
                err.response = response;
                throw err;
            }
        } catch (err) {
            clearTimeout(id);
            if (err.name === 'AbortError') {
                // timeout, tenta novamente
                const backoff = Math.min(30000, 500 * Math.pow(2, attempt)) + Math.floor(Math.random() * 300);
                await delay(backoff);
                lastError = new Error('Timeout');
            } else {
                // erro de rede — tenta novamente com backoff
                const backoff = Math.min(30000, 500 * Math.pow(2, attempt)) + Math.floor(Math.random() * 300);
                await delay(backoff);
                lastError = err;
            }
        }

        // tentativa de fallback para jsDelivr se URL for raw.githubusercontent e estamos no último retry
        attempt++;
        if (attempt > Math.max(1, Math.floor(maxRetries/2))) {
            const fallback = jsDelivrFallback(url);
            if (fallback && fallback !== tryUrl) {
                tryUrl = fallback;
            }
        }
    }

    // se chegou aqui, todas as tentativas falharam
    throw lastError || new Error('resilientFetch: falha desconhecida');
}

// Carrega script: tenta criar tag <script> para CDNs (mais confiável/prático), caso contrário fetch+eval
async function loadScript(url, label) {
    const cleanUrl = url.trim();
    // se for CDN conhecido, preferimos tag script (não bloqueante e cache do browser)
    const preferTag = /cdn\.jsdelivr|cdnjs\.cloudflare|unpkg\.com|jsdelivr\.net|widgetbot/.test(cleanUrl);
    try {
        if (preferTag) {
            await new Promise((resolve, reject) => {
                const s = document.createElement('script');
                let done = false;
                const timeoutId = setTimeout(() => {
                    if (done) return;
                    done = true;
                    s.remove();
                    reject(new Error('loadScript timeout'));
                }, (window.featureConfigs.fetchTimeoutMs || 10000) + 2000);

                s.src = cleanUrl;
                s.async = true;
                s.onload = () => { if (done) return; done = true; clearTimeout(timeoutId); loadedPlugins.push(label); resolve(); };
                s.onerror = async () => {
                    if (done) return;
                    done = true;
                    clearTimeout(timeoutId);
                    // fallback: tentar via resilientFetch e eval
                    try {
                        const resp = await resilientFetch(cleanUrl, { timeoutMs: window.featureConfigs.fetchTimeoutMs });
                        const scriptText = await resp.text();
                        try { eval(scriptText); loadedPlugins.push(label + ' (eval)'); resolve(); }
                        catch (e) { reject(e); }
                    } catch (e2) {
                        reject(e2);
                    }
                };
                document.head.appendChild(s);
            });
        } else {
            // fetch + eval (usa cache automática do resilientFetch)
            const resp = await resilientFetch(cleanUrl, { timeoutMs: window.featureConfigs.fetchTimeoutMs });
            const script = await resp.text();
            try {
                eval(script);
                loadedPlugins.push(label);
            } catch (e) {
                // talvez raw não funcione; tenta fallback para refs/heads ou jsDelivr
                const alt = cleanUrl.includes('/main/') ? cleanUrl.replace('/main/', '/refs/heads/main/') : (cleanUrl.includes('/dev/') ? cleanUrl.replace('/dev/', '/refs/heads/dev/') : null);
                if (alt) {
                    try {
                        const r = await resilientFetch(alt, { timeoutMs: window.featureConfigs.fetchTimeoutMs, noCache: true });
                        const s2 = await r.text();
                        eval(s2);
                        loadedPlugins.push(label + ' (alt)');
                        sendToast('Carregado via refs/heads', 2500, 'top');
                        return;
                    } catch (e2) {
                        sendToast("Erro ao carregar: " + label, 5000, 'top');
                    }
                } else {
                    sendToast("Erro: " + label, 5000, 'top');
                }
            }
        }
    } catch (err) {
        // tentativa final: fallback jsDelivr
        const fallback = jsDelivrFallback(cleanUrl);
        if (fallback) {
            try {
                await loadScript(fallback, label + ' (jsDelivr)');
                sendToast('Carregado via jsDelivr', 2500, 'top');
                return;
            } catch (e) {
                sendToast("Erro ao carregar via jsDelivr: " + label, 5000, 'top');
            }
        } else {
            sendToast("Falha ao carregar: " + label, 5000, 'top');
        }
    }
}

// Carrega CSS: preferir tag <link>, com timeout e fallback
async function loadCss(url) {
    const cleanUrl = url.trim();
    return new Promise(async (resolve) => {
        try {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            let done = false;
            const timeoutId = setTimeout(async () => {
                if (done) return;
                done = true;
                link.remove();
                // fallback para fetch+injetar style
                try {
                    const resp = await resilientFetch(cleanUrl, { timeoutMs: window.featureConfigs.fetchTimeoutMs });
                    const css = await resp.text();
                    const style = document.createElement('style');
                    style.innerHTML = css;
                    document.head.appendChild(style);
                    resolve();
                } catch (e) {
                    resolve(); // não travar a execução
                }
            }, (window.featureConfigs.fetchTimeoutMs || 10000) + 2000);

            link.onload = () => { if (done) return; done = true; clearTimeout(timeoutId); resolve(); };
            link.onerror = async () => {
                if (done) return;
                done = true;
                clearTimeout(timeoutId);
                link.remove();
                // fallback para fetch+injetar style
                try {
                    const resp = await resilientFetch(cleanUrl, { timeoutMs: window.featureConfigs.fetchTimeoutMs });
                    const css = await resp.text();
                    const style = document.createElement('style');
                    style.innerHTML = css;
                    document.head.appendChild(style);
                } catch (e) { /* ignore */ }
                resolve();
            };
            link.href = cleanUrl;
            document.head.appendChild(link);
        } catch (e) {
            // fallback direto
            try {
                const resp = await resilientFetch(cleanUrl, { timeoutMs: window.featureConfigs.fetchTimeoutMs });
                const css = await resp.text();
                const style = document.createElement('style');
                style.innerHTML = css;
                document.head.appendChild(style);
            } catch (e2) {}
            resolve();
        }
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
    loadScript(repoPathDefault + 'functions/rgbLogo.js'
