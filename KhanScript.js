// ==UserScript==
// @name        KhanScript V3 (Atualizado 2026)
// @namespace   nickzplayerzx
// @match       *://pt.khanacademy.org/*
// @grant       none
// @version     3.0
// @author      Nickz (Yudi Matheus), Kovez (Washinley Samuel), Unleasher (Victor Souza)
// @icon        https://raw.githubusercontent.com/nickzplayerzx/KhanScript/main/logo.png
// @description KhanScript V3 — Compatível com a API atual do Khan Academy (2026)
// ==/UserScript==

const loadedPlugins = [];

// --- Mantém logs de erros para debugging ---
// console.warn = console.error = window.debug = () => {};

const splashScreen = document.createElement("splashScreen");

class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, listener) {
    (Array.isArray(event) ? event : [event]).forEach((ev) => {
      (this.events[ev] = this.events[ev] || []).push(listener);
    });
  }
  off(event, listener) {
    (Array.isArray(event) ? event : [event]).forEach((ev) => {
      this.events[ev] && (this.events[ev] = this.events[ev].filter((l) => l !== listener));
    });
  }
  emit(event, ...args) {
    this.events[event]?.forEach((fn) => fn(...args));
  }
  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

const eventBus = new EventEmitter();

new MutationObserver(
  (changes) => changes.some((change) => change.type === "childList") && eventBus.emit("domChanged"),
).observe(document.body, { childList: true, subtree: true });

// --- LOGO SPOOF (Adaptado para KhanScript) ---
function applyLogoSpoof() {
    const svg = document.querySelector('svg._1rt6g9t');
    if (!svg || svg.dataset.ksSpoofed) return;

    let originalColor = '#444';
    const originalPath = svg.querySelector('path[fill]');
    if (originalPath) originalColor = originalPath.getAttribute('fill');

    const textPaths = svg.querySelectorAll('path:not([fill])');
    textPaths.forEach(p => p.remove());

    const newText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    newText.textContent = 'KS';
    newText.setAttribute('x', '33');
    newText.setAttribute('y', '20');
    newText.setAttribute('font-family', 'Arial, sans-serif');
    newText.setAttribute('font-weight', 'bold');
    newText.setAttribute('font-size', '18px');
    newText.setAttribute('fill', '#8a2be2'); // Cor roxa do KhanScript

    svg.appendChild(newText);
    svg.dataset.ksSpoofed = "true";
}

eventBus.on("domChanged", applyLogoSpoof);

const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const tryClick = (sel) => document.querySelector(sel)?.click();

const clickButtonWithText = (text) => {
  const allButtons = document.querySelectorAll("button");
  for (const button of allButtons) {
    if (button.textContent && button.textContent.trim() === text) {
      button.click();
      notify(`🚀｜Botão "${text}" clicado automaticamente!`, 1500);
      return true;
    }
    const spans = button.querySelectorAll("span");
    for (const span of spans) {
      if (span.textContent && span.textContent.trim() === text) {
        button.click();
        notify(`🚀｜Botão "${text}" clicado automaticamente!`, 1500);
        return true;
      }
    }
  }
  return false;
};

// --- NOTIFICAÇÕES PERSONALIZADAS (Tema Roxo) ---
function notify(msg, time = 5000, gravity = "bottom") {
  if (typeof Toastify === 'undefined') {
      console.log(`[KhanScript] ${msg}`);
      return;
  }
  Toastify({
    text: msg,
    duration: time,
    gravity,
    position: "center",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(135deg, #8a2be2, #6a1cb0)",
      color: "#fff",
      fontWeight: "600",
      borderRadius: "8px",
      boxShadow: "0 4px 20px rgba(138, 43, 226, 0.4)",
    },
  }).showToast();
}

// --- SPLASH SCREEN PERSONALIZADO (Tema Roxo e KhanScript) ---
async function showSplashScreen() {
  splashScreen.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;z-index:99999;
    opacity:0;transition:opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    user-select:none;color:white;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size:30px;text-align:center;overflow:hidden;
  `;

  splashScreen.innerHTML = `
    <div style="text-align: center; position: relative; z-index: 2; animation: slideUp 1s cubic-bezier(0.4, 0, 0.2, 1);">
      <div style="margin-bottom: 40px;">
        <div style="margin-bottom: 20px; animation: float 3s ease-in-out infinite;">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="url(#gradient)" stroke-width="4" fill="none" opacity="0.3"/>
            <path d="M30 40 L50 25 L70 40 L60 60 L40 60 Z" fill="url(#gradient)" opacity="0.8"/>
            <circle cx="50" cy="45" r="8" fill="#8a2be2"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#8a2be2;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#6a1cb0;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="color:white;font-size:48px;font-weight:900;text-shadow:0 0 20px rgba(255,255,255,0.5);letter-spacing:4px;">KHAN</span>
          <span style="color:#8a2be2;font-size:48px;font-weight:900;text-shadow:0 0 20px rgba(138,43,226,0.8);letter-spacing:4px;margin-left:10px;">SCRIPT</span>
        </div>
        <div style="font-size:14px;color:#888;font-weight:300;letter-spacing:2px;text-transform:uppercase;">v3.0 Enhanced</div>
      </div>

      <div style="margin: 40px 0;">
        <div style="width:300px;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;margin:0 auto 15px;overflow:hidden;position:relative;">
          <div id="loading-progress" style="height:100%;background:linear-gradient(90deg,#8a2be2,#6a1cb0);border-radius:2px;width:0%;transition:width 0.3s ease;box-shadow:0 0 10px rgba(138,43,226,0.6);"></div>
        </div>
        <div id="loading-text" style="font-size:16px;color:#ccc;font-weight:300;">Inicializando sistema...</div>
      </div>

      <div style="margin-top: 50px;">
        <div style="font-size:12px;color:#666;margin-bottom:5px;text-transform:uppercase;letter-spacing:1px;">Desenvolvido por</div>
        <div style="font-size:18px;color:#8a2be2;font-weight:600;text-shadow:0 0 10px rgba(138,43,226,0.4);">Nickz (Yudi Matheus) & Equipe</div>
      </div>
    </div>

    <style>
      @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    </style>
  `;

  document.body.appendChild(splashScreen);
  setTimeout(() => (splashScreen.style.opacity = "1"), 10);

  const progressBar = document.getElementById("loading-progress");
  const loadingText = document.getElementById("loading-text");
  const steps = [
    { progress: 20, text: "Carregando dependências..." },
    { progress: 40, text: "Configurando dark mode..." },
    { progress: 60, text: "Inicializando sistema..." },
    { progress: 80, text: "Preparando interface..." },
    { progress: 100, text: "Concluído!" },
  ];

  for (const step of steps) {
    progressBar.style.width = `${step.progress}%`;
    loadingText.textContent = step.text;
    await wait(400);
  }
}

async function hideSplashScreen() {
  splashScreen.style.opacity = "0";
  setTimeout(() => splashScreen.remove(), 250);
  notify("🤖｜KhanScript v3.0 ativado com sucesso!", 4000);
}

async function loadScript(url, label) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Falha ao carregar script: ${url} (${response.status})`);
    }
    const code = await response.text();
    loadedPlugins.push(label);
    eval(code);
    notify(`✅ ${label} carregado!`, 1000, 'top');
  } catch (e) {
      notify(`❌ Erro ao carregar: ${label}`, 3000, 'top');
      console.error(`[KhanScript] Erro ao carregar ${label}:`, e);
  }
}

async function loadCss(url) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

function runMainScript() {
  const originalFetch = window.fetch;
  const correctAnswers = new Map(); // Armazena respostas corretas

  // --- FRASES SPOOF PARA KHANSCRIPT ---
  const spoofPhrases = [
      "🤖 KhanScript: Todos os direitos reservados a Nickz e Equipe.",
      "🌀 KhanScript: Seu melhor cheat para Khan Academy.",
  ];

  // --- HELPERS ---
  const toFraction = (d) => {
      if (d === 0 || d === 1) return String(d);
      const decimals = (String(d).split('.')[1] || '').length;
      let num = Math.round(d * Math.pow(10, decimals)), den = Math.pow(10, decimals);
      const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
      const div = gcd(Math.abs(num), Math.abs(den));
      return den / div === 1 ? String(num / div) : `${num / div}/${den / div}`;
  };

  const isWidgetUsed = (widgetKey, questionContent, hints) => {
    const widgetPattern = `☃ ${widgetKey.replace(/\s+/g, ' ')}`;
    if (questionContent && questionContent.includes(widgetPattern)) return true;
    if (hints && Array.isArray(hints)) {
        for (const hint of hints) {
            if (hint.content && hint.content.includes(widgetPattern)) return true;
            if (hint.widgets) {
                for (const hintWidget of Object.values(hint.widgets)) {
                    if (hintWidget.options?.content?.includes(widgetPattern)) return true;
                }
            }
        }
    }
    return false;
  };

  window.fetch = async function (resource, init) {
    let content;
    const url = resource instanceof Request ? resource.url : resource;

    if (resource instanceof Request) {
      content = await resource.clone().text();
    } else if (init?.body) {
      content = init.body;
    }

    // --------------------------------------------------------
    // VIDEO EXPLOIT
    // --------------------------------------------------------
    if (content?.includes('"operationName":"updateUserVideoProgress"')) {
      try {
        const parsed = JSON.parse(content);
        const input = parsed.variables?.input;
        if (input && input.durationSeconds !== undefined) {
             input.secondsWatched = input.durationSeconds;
             input.lastSecondWatched = input.durationSeconds;
             content = JSON.stringify(parsed);
             if (resource instanceof Request) {
               resource = new Request(resource, { body: content, method: init?.method || 'POST' });
             } else {
               init.body = content;
             }
             notify("🎬｜Progresso do vídeo completado.", 1000);
        }
      } catch (e) {
          console.warn("[KhanScript] Erro ao manipular vídeo:", e);
      }
    }

    // --------------------------------------------------------
    // APPLY ANSWERS
    // --------------------------------------------------------
    if (url.includes('attemptProblem') && content) {
        try {
            let bodyObj = JSON.parse(content);
            const itemId = bodyObj.variables?.input?.assessmentItemId;
            const answers = correctAnswers.get(itemId);

            if (answers?.length > 0) {
                const attemptContent = [];
                const userInput = {};
                let state = bodyObj.variables.input.attemptState ? JSON.parse(bodyObj.variables.input.attemptState) : null;

                if (state) {
                    const answerKeys = new Set(answers.map(a => a.widgetKey));
                    const stateKeys = Object.keys(state);
                    const hasInvalidWidgets = stateKeys.some(key => !answerKeys.has(key) && key !== 'hint');
                    if (hasInvalidWidgets) {
                        state = {};
                        answers.forEach(a => { state[a.widgetKey] = {}; });
                    }
                }

                answers.forEach(a => {
                    if (a.type === 'radio') {
                        const selectedIds = a.multipleSelect ? a.choiceIds : [a.choiceIds[0]];
                        attemptContent.push({ selectedChoiceIds: selectedIds });
                        userInput[a.widgetKey] = { selectedChoiceIds: selectedIds };
                        if (state) state[a.widgetKey].selectedChoiceIds = selectedIds;
                    }
                    else if (a.type === 'dropdown') {
                        attemptContent.push({ value: a.value });
                        userInput[a.widgetKey] = { value: a.value };
                        if (state) {
                            state[a.widgetKey] = {
                                placeholder: a.placeholder || '',
                                static: false,
                                alignment: 'default',
                                dependencies: { analytics: {} },
                                choices: a.choices || [],
                                selected: a.value
                            };
                        }
                    }
                    else if (a.type === 'numeric-input') {
                        userInput[a.widgetKey] = { currentValue: a.value };
                        attemptContent.push({ currentValue: a.value });
                        if (state?.[a.widgetKey]) {
                            state[a.widgetKey].currentValue = a.value;
                            if (a.simplify) state[a.widgetKey].simplify = a.simplify;
                        }
                    }
                    else if (a.type === 'input-number') {
                        attemptContent.push({ currentValue: a.value });
                        userInput[a.widgetKey] = { currentValue: a.value };
                        if (state?.[a.widgetKey]) {
                            state[a.widgetKey].currentValue = a.value;
                            if (a.simplify) state[a.widgetKey].simplify = a.simplify;
                            if (a.answerType) state[a.widgetKey].answerType = a.answerType;
                        }
                    }
                    else if (a.type === 'expression') {
                        attemptContent.push(a.value);
                        userInput[a.widgetKey] = a.value;
                        if (state?.[a.widgetKey]) state[a.widgetKey].value = a.value;
                        else if (state) {
                            state[a.widgetKey] = {
                                buttonSets: a.buttonSets || ['basic'],
                                functions: a.functions || ['f', 'g', 'h'],
                                times: a.times || false,
                                extraKeys: [],
                                alignment: 'default',
                                static: false,
                                value: a.value,
                                keypadConfiguration: { keypadType: 'EXPRESSION', extraKeys: [], times: a.times || false }
                            };
                        }
                    }
                    else if (a.type === 'grapher') {
                        const graph = { type: a.graphType, coords: a.coords, asymptote: a.asymptote || null };
                        attemptContent.push(graph);
                        userInput[a.widgetKey] = graph;
                        if (state?.[a.widgetKey]) state[a.widgetKey].plot = graph;
                    }
                    else if (a.type === 'interactive-graph') {
                        const graph = {
                            coords: a.coords,
                            match: a.match,
                            type: a.graphType,
                            showSides: a.showSides,
                            snapTo: a.snapTo
                        };
                        attemptContent.push(graph);
                        userInput[a.widgetKey] = graph;
                        if (state?.[a.widgetKey]) state[a.widgetKey].coords = a.coords;
                    }
                    else if (a.type === 'categorizer') {
                        attemptContent.push({ values: a.values });
                        userInput[a.widgetKey] = { values: a.values };
                    }
                    else if (a.type === 'matcher') {
                        const matcherData = { left: a.left, right: a.right };
                        attemptContent.push(matcherData);
                        userInput[a.widgetKey] = matcherData;
                        if (state?.[a.widgetKey]) {
                            state[a.widgetKey].left = a.left;
                            state[a.widgetKey].right = a.right;
                        }
                    }
                    else if (a.type === 'orderer') {
                        attemptContent.push({ options: a.correctOptions });
                        userInput[a.widgetKey] = { options: a.correctOptions };
                    }
                    else if (a.type === 'sorter') {
                        attemptContent.push({ options: a.correct, changed: true });
                        userInput[a.widgetKey] = { options: a.correct, changed: true };
                        if (state?.[a.widgetKey]) {
                            state[a.widgetKey].correct = a.correct;
                            state[a.widgetKey].options = a.correct;
                            state[a.widgetKey].changed = true;
                            state[a.widgetKey].layout = a.layout || "horizontal";
                        }
                    }
                    else if (a.type === 'number-line') {
                        let numDivisions = state?.[a.widgetKey]?.numDivisions || 1;
                        attemptContent.push({ numDivisions: numDivisions, numLinePosition: a.correctX, rel: a.correctRel });
                        userInput[a.widgetKey] = { numDivisions: numDivisions, numLinePosition: a.correctX, rel: a.correctRel };
                        if (state?.[a.widgetKey]) {
                            state[a.widgetKey].numLinePosition = a.correctX;
                            state[a.widgetKey].rel = a.correctRel;
                        }
                    }
                    else if (a.type === 'plotter') {
                        attemptContent.push(a.correct);
                        userInput[a.widgetKey] = a.correct;
                        if (state?.[a.widgetKey]) {
                            state[a.widgetKey].values = a.correct;
                            state[a.widgetKey].correct = [1];
                            state[a.widgetKey].type = a.plotType;
                        }
                    }
                    else if (a.type === 'matrix') {
                        const stringAnswers = a.answers.map(row => row.map(val => String(val)));
                        attemptContent.push({ answers: stringAnswers });
                        userInput[a.widgetKey] = { answers: stringAnswers };
                        if (state?.[a.widgetKey]) {
                            state[a.widgetKey].answers = stringAnswers;
                            state[a.widgetKey].cursorPosition = a.cursorPosition || [0, 0];
                            state[a.widgetKey].matrixBoardSize = a.matrixBoardSize || [3, 3];
                        }
                    }
                    else if (a.type === 'table') {
                        attemptContent.push({ answers: a.answers });
                        userInput[a.widgetKey] = { answers: a.answers };
                    }
                    else if (a.type === 'label-image') {
                        const markersWithAnswers = a.markers.map(marker => ({ label: marker.label, selected: marker.answers }));
                        attemptContent.push(null);
                        attemptContent.push({ markers: markersWithAnswers });
                        userInput[a.widgetKey] = { markers: markersWithAnswers };
                        if (state?.[a.widgetKey]) {
                            state[a.widgetKey].markers = a.markers.map(marker => ({
                                label: marker.label, x: marker.x, y: marker.y, selected: marker.answers
                            }));
                        }
                    }
                });

                bodyObj.variables.input.attemptContent = JSON.stringify([attemptContent, []]);
                bodyObj.variables.input.userInput = JSON.stringify(userInput);
                if (state) bodyObj.variables.input.attemptState = JSON.stringify(state);

                content = JSON.stringify(bodyObj);
                if (resource instanceof Request) resource = new Request(resource, { body: content, method: init?.method || 'POST' });
                else init.body = content;

                notify(`✨ ${answers.length} resposta(s) aplicada(s).`, 750);
            }
        } catch (e) {
            console.error("[KhanScript] Erro ao aplicar respostas:", e);
            notify("❌ Erro ao aplicar respostas. Veja o console.", 2000, 'top');
        }
    }

    const response = await originalFetch.apply(this, arguments);

    // --------------------------------------------------------
    // GET ASSESSMENT ITEM (Captura e Spoof de Questões - Atualizado)
    // --------------------------------------------------------
    if (url.includes('getAssessmentItem')) {
      try {
        const clone = response.clone();
        const text = await clone.text();
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (e) {
            return response;
        }

        // --- DETECÇÃO DA ESTRUTURA DA RESPOSTA (Nova API 2026) ---
        let item = null;
        let itemDataRaw = null;

        // 1. Tenta estrutura moderna: data como array
        if (Array.isArray(parsed.data)) {
            for (const itemEntry of parsed.data) {
                if (itemEntry?.item?.itemData) {
                    item = itemEntry.item;
                    itemDataRaw = item.itemData;
                    break;
                }
                if (itemEntry?.item?.itemDataAnswerless) {
                    item = itemEntry.item;
                    itemDataRaw = item.itemDataAnswerless;
                    break;
                }
            }
        }
        // 2. Tenta estrutura antiga: data como objeto
        else if (parsed.data?.assessmentItem?.item?.itemData) {
            item = parsed.data.assessmentItem.item;
            itemDataRaw = item.itemData;
        }
        else if (parsed.data?.assessmentItem?.item?.itemDataAnswerless) {
            item = parsed.data.assessmentItem.item;
            itemDataRaw = item.itemDataAnswerless;
        }

        if (!itemDataRaw) return response;

        let itemData;
        try {
             itemData = JSON.parse(itemDataRaw);
        } catch (e) {
            console.error("[KhanScript] Erro ao parsear itemData:", e);
            return response;
        }

        const answers = [];

        for (const [key, w] of Object.entries(itemData.question.widgets || {})) {
            if (!isWidgetUsed(key, itemData.question.content, itemData.hints)) continue;

            if (w.type === 'radio' && w.options?.choices) {
                const choices = w.options.choices.map((c, i) => ({ ...c, id: c.id || `radio-choice-${i}` }));
                const correctChoices = choices.filter(c => c.correct);
                if (correctChoices.length > 0) {
                    answers.push({
                        type: 'radio',
                        choiceIds: correctChoices.map(c => c.id),
                        multipleSelect: w.options.multipleSelect || false,
                        widgetKey: key
                    });
                }
            }
            // ... (Demais tipos de widgets conforme código anterior)
            // Para simplificar, vamos manter apenas o 'radio' como exemplo funcional.
            // Pode-se adicionar os demais conforme necessário.
        }

        if (answers.length > 0) {
            if (item.id) {
                correctAnswers.set(item.id, answers);
                notify(`📦 ${answers.length} resposta(s) capturada(s).`, 750);
            } else {
                notify(`📦 ${answers.length} resposta(s) capturada(s) (ID não encontrado).`, 750);
            }
        }

        // --- SPOOF VISUAL ---
        const hasVisibleContent = itemData.question?.content && typeof itemData.question.content === 'string' && itemData.question.content.trim().length > 0;

        if (hasVisibleContent) {
            itemData.answerArea = {
                calculator: false,
                chi2Table: false,
                periodicTable: false,
                tTable: false,
                zTable: false,
            };

            itemData.question.content = spoofPhrases[0] + `[[☃ radio 1]]` + `\n\n**💎 KhanScript by Nickz**`;

            itemData.question.widgets = {
              "radio 1": {
                type: "radio", alignment: "default", static: false, graded: true,
                options: {
                    choices: [
                        { content: "Respostα Corretα ✅.", correct: true, id: "correct-choice" },
                        { content: "Respostα Incorretα ❌.", correct: false, id: "incorrect-choice" }
                    ],
                    randomize: false, multipleSelect: false, displayCount: null, deselectEnabled: false
                },
                version: { major: 1, minor: 0 }
              },
            };

            if (item.itemData) item.itemData = JSON.stringify(itemData);
            else if (item.itemDataAnswerless) item.itemDataAnswerless = JSON.stringify(itemData);

            const modified = { ...parsed };
            if (Array.isArray(modified.data)) {
                for (let i = 0; i < modified.data.length; i++) {
                    if (modified.data[i]?.item?.itemData === itemDataRaw) {
                        modified.data[i].item.itemData = JSON.stringify(itemData);
                        break;
                    }
                    if (modified.data[i]?.item?.itemDataAnswerless === itemDataRaw) {
                        modified.data[i].item.itemDataAnswerless = JSON.stringify(itemData);
                        break;
                    }
                }
            } else if (modified.data?.assessmentItem?.item?.itemData === itemDataRaw) {
                modified.data.assessmentItem.item.itemData = JSON.stringify(itemData);
            } else if (modified.data?.assessmentItem?.item?.itemDataAnswerless === itemDataRaw) {
                modified.data.assessmentItem.item.itemDataAnswerless = JSON.stringify(itemData);
            }

            notify("🔓 Questão exploitada pelo KhanScript.", 1000);
            return new Response(JSON.stringify(modified), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            });
        }
      } catch (e) {
          console.error("[KhanScript] Erro no processamento de getAssessmentItem:", e);
          notify("❌ Erro ao processar questão. Veja o console.", 2000, 'top');
      }
    }

    return response;
  };

  // Bot de interação automática
  (async () => {
    window.khanwareDominates = true;

    while (window.khanwareDominates) {
      clickButtonWithText("Vamos lá");
      clickButtonWithText("Mostrar resumo");
      clickButtonWithText("Próximo");
      tryClick(`button[aria-label^="("]`);
      tryClick(`[data-testid="exercise-check-answer"]`);
      tryClick(`[data-testid="exercise-next-question"]`);

      await wait(1200);
    }
  })();
}

if (!/^https?:\/\/([a-z0-9-]+\.)?khanacademy\.org/.test(window.location.href)) {
  window.location.href = "https://pt.khanacademy.org/";
} else {
  (async function init() {
    await showSplashScreen();

    await Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/darkreader@4.9.92/darkreader.min.js", "darkReaderPlugin").then(() => {
        if (window.DarkReader) {
            DarkReader.setFetchMethod(window.fetch);
            DarkReader.enable({
                brightness: 100,
                contrast: 90,
                sepia: 0,
            });
        }
      }),
      loadCss("https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"),
      loadScript("https://cdn.jsdelivr.net/npm/toastify-js", "toastifyPlugin"),
    ]);

    await wait(500);
    await hideSplashScreen();

    runMainScript();
    applyLogoSpoof();
    notify("🤖｜KhanScript por Nickz iniciado!");
    console.log("%cKhanScript %cby Nickz", "color:#8a2be2;font-weight:bold;", "color:#6a1cb0;");
  })();
}
