let loadedPlugins = [];
const splashScreen = document.createElement('div'); // corrigido: não é tag customizada

// Fonte (opcional, mantido por compatibilidade)
document.head.appendChild(Object.assign(document.createElement("style"), {
    innerHTML: "@font-face{font-family:'Arial';}"
}));

// Scroll personalizado (atualizado para roxo)
document.head.appendChild(Object.assign(document.createElement('style'), {
    innerHTML: `
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1a0f2e; }
        ::-webkit-scrollbar-thumb { background: #9a7ed9; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #b288e6; }
    `
}));

// Ícone (mantido)
document.querySelector("link[rel~='icon']").href = "./logo.png";

// EventEmitter e plppdo
class EventEmitter {
    constructor() { this.events = {}; }
    on(t, e) {
        if (typeof t === 'string') t = [t];
        t.forEach(key => {
            this.events[key] = this.events[key] || [];
            this.events[key].push(e);
        });
    }
    off(t, e) {
        if (typeof t === 'string') t = [t];
        t.forEach(key => {
            if (this.events[key]) {
                this.events[key] = this.events[key].filter(fn => fn !== e);
            }
        });
    }
    emit(t, ...e) {
        if (this.events[t]) this.events[t].forEach(fn => fn(...e));
    }
    once(t, e) {
        if (typeof t === 'string') t = [t];
        const handler = (...args) => {
            e(...args);
            this.off(t, handler);
        };
        this.on(t, handler);
    }
}

const plppdo = new EventEmitter();
new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') plppdo.emit('domChanged');
    }
}).observe(document.body, { childList: true, subtree: true });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const playAudio = url => {
    const audio = new Audio(url.trim()); // remove espaços extras
    audio.play().catch(e => console.warn("Áudio não pôde ser reproduzido:", e));
};
const findAndClickBySelector = selector => {
    const element = document.querySelector(selector);
    if (element) {
        element.click();
        sendToast(`Ação automática: ${selector}`, 800);
    }
};

function sendToast(text, duration = 3000, gravity = 'bottom') {
    Toastify({
        text: text,
        duration: duration,
        gravity: gravity,
        position: "center",
        stopOnFocus: true,
        style: {
            background: "#8a5bd9", // roxo
            color: "#fff",
            borderRadius: "8px",
            fontFamily: "Arial, sans-serif",
            fontSize: "15px",
            boxShadow: "0 6px 22px 0 rgba(106, 44, 180, 0.4)"
        }
    }).showToast();
}

async function showSplashScreen() {
    splashScreen.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: linear-gradient(122deg, #1a0f2e 0%, #2d1b5e 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.5s ease;
        user-select: none;
        color: #d9b3ff;
        font-family: Arial, sans-serif;
        font-size: 34px;
        text-align: center;
        letter-spacing: .05em;
        flex-direction: column;
    `;
    splashScreen.innerHTML = `
        <img src="./logo.png" style="height:100px; margin-bottom:18px; filter: drop-shadow(0 0 8px rgba(138, 91, 217, 0.6));">
        <span style="font-weight:800; line-height:32px; letter-spacing:2.5px; font-size:30px; color:#c291ff;">KhanScript</span>
        <span style="margin-top:7px; font-size:14px; color:#b288e6; font-weight:500;">Carregando... by nickz</span>
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
        .then(response => response.text())
        .then(script => {
            loadedPlugins.push(label);
            eval(script);
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

function setupMain() {
    (function () {
        const phrases = [
            "KhanScript: Aprenda no roxo!",
            "KhanScript – by nickz",
            "Dominando a Khan Academy — KhanScript.",
            "Avance suas conquistas com KhanScript.",
            "Mais poder, mais roxo: KhanScript.",
            "Personalize sua jornada com KhanScript"
        ];
        const originalFetch = window.fetch;
        window.fetch = async function (input, init) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init && init.body) body = init.body;

            const originalResponse = await originalFetch.apply(this, arguments);
            const clonedResponse = originalResponse.clone();

            try {
                const responseBody = await clonedResponse.text();
                let responseObj = JSON.parse(responseBody);
                if (responseObj?.data?.assessmentItem?.item?.itemData) {
                    let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
                    if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
                        itemData.answerArea = {
                            "calculator": false,
                            "chi2Table": false,
                            "periodicTable": false,
                            "tTable": false,
                            "zTable": false
                        };
                        itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
                        itemData.question.widgets = {
                            "radio 1": {
                                type: "radio",
                                options: {
                                    choices: [
                                        { content: "Sim, KhanScript", correct: true },
                                        { content: "Não, errada.", correct: false }
                                    ]
                                }
                            }
                        };
                        responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                        sendToast("Questão resolvida automaticamente!", 1200, 'bottom');
                        return new Response(JSON.stringify(responseObj), {
                            status: originalResponse.status,
                            statusText: originalResponse.statusText,
                            headers: originalResponse.headers
                        });
                    }
                }
            } catch (e) {}
            return originalResponse;
        };
    })();

    (function () {
        const originalFetch = window.fetch;
        window.fetch = async function (input, init = {}) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init.body) body = init.body;

            if (body && body.includes('"operationName":"updateUserVideoProgress"')) {
                try {
                    let bodyObj = JSON.parse(body);
                    if (bodyObj.variables && bodyObj.variables.input) {
                        const durationSeconds = bodyObj.variables.input.durationSeconds;
                        bodyObj.variables.input.secondsWatched = durationSeconds;
                        bodyObj.variables.input.lastSecondWatched = durationSeconds;
                        body = JSON.stringify(bodyObj);
                        if (input instanceof Request) {
                            input = new Request(input, { body: body });
                        } else {
                            init.body = body;
                        }
                        sendToast("Vídeo concluído automaticamente.", 1100);
                    }
                } catch (e) {}
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    (function () {
        const originalFetch = window.fetch;
        window.fetch = async function (input, init = {}) {
            let body;
            if (input instanceof Request) body = await input.clone().text();
            else if (init.body) body = init.body;

            if (body && input.url.includes("mark_conversions")) {
                try {
                    if (body.includes("termination_event")) {
                        sendToast("Tempo mínimo de vídeo ignorado!", 1000);
                        return; // cancela a requisição
                    }
                } catch (e) {}
            }
            return originalFetch.apply(this, arguments);
        };
    })();

    (function () {
        const baseSelectors = [
            `[data-testid="choice-icon__library-choice-icon"]`,
            `[data-testid="exercise-check-answer"]`,
            `[data-testid="exercise-next-question"]`,
            `._1udzurba`,
            `._awve9b`
        ];
        window.khanwareDominates = true;
        (async () => {
            while (khanwareDominates) {
                for (const q of baseSelectors) {
                    findAndClickBySelector(q);
                    const summaryBtn = document.querySelector(q + "> div");
                    if (summaryBtn && summaryBtn.innerText === "Mostrar resumo") {
                        sendToast("Exercício finalizado!", 2500, 'bottom');
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                        await delay(800);
                    }
                }
                await delay(250);
            }
        })();
    })();
}

// Verificação de domínio
if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
    alert("KhanScript só pode ser executado na Khan Academy: https://pt.khanacademy.org/");
    window.location.href = "https://pt.khanacademy.org/";
}

// Inicialização
showSplashScreen();

// Carregar dependências (com URLs limpas)
loadScript('https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js', 'darkReaderPlugin')
    .then(() => {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable({
            brightness: 105,
            contrast: 109,
            sepia: 0,
            grayscale: 0,
            blue: 0, // removido excesso de azul
            darkSchemeBackgroundColor: '#1a0f2e',
            darkSchemeTextColor: '#d9b3ff'
        });
    });

loadCss('https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css');

loadScript('https://cdn.jsdelivr.net/npm/toastify-js', 'toastifyPlugin')
    .then(async () => {
        sendToast("KhanScript carregado!", 1800);
        playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/gcelzszy.wav');
        await delay(500);
        hideSplashScreen();
        setupMain();
        console.clear();
        console.log("%cKhanScript %cby nickz", "color:#c291ff;font-weight:bold;", "color:#9a7ed9;");
    });