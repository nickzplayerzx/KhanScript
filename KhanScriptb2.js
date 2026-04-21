// ==UserScript==
// @name        KhanScript
// @namespace   nickzplayerzx
// @match       *://*.khanacademy.org/*
// @grant       none
// @version     3.2
// @author      Nickz (Yudi Matheus), Kovez (Washinley Samuel), Unleasher (Victor Souza)
// @icon        https://raw.githubusercontent.com/nickzplayerzx/KhanScript/main/logo.png
// @description KhanScript — O melhor script para Khan Academy (Com Debug Info)
// @run-at      document-start
// ==/UserScript==

(function() {
    'use strict';

    // ===== ASCII ART COM EMOJIS ROXOS 🟪 =====
    const purple = '🟪';
    const asciiNickz = `
${purple}${purple}${purple}${purple}${purple}${purple}${purple}${purple}${purple}${purple}${purple}${purple}
${purple}  ${purple}        ${purple}  ${purple}        ${purple}  ${purple}
${purple}  ${purple}  ${purple}${purple}${purple}${purple}  ${purple}  ${purple}${purple}  ${purple}  ${purple}
${purple}  ${purple}  ${purple}  ${purple}  ${purple}  ${purple}  ${purple}  ${purple}  ${purple}  ${purple}
${purple}  ${purple}  ${purple}${purple}${purple}${purple}  ${purple}  ${purple}${purple}${purple}  ${purple}  ${purple}
${purple}  ${purple}  ${purple}  ${purple}  ${purple}  ${purple}  ${purple}  ${purple}  ${purple}  ${purple}
${purple}  ${purple}  ${purple}  ${purple}  ${purple}  ${purple}  ${purple}${purple}${purple}  ${purple}  ${purple}
${purple}${purple}${purple}${purple}${purple}${purple}${purple}${purple}${purple}${purple}${purple}${purple}
    `.trim();

    console.log(`%c${asciiNickz}`, 'color: #8a2be2; font-weight: bold;');
    console.log('%c🤖 KhanScript V3.2 — Debug Mode Ativado!', 'color: #8a2be2; font-weight: bold;');

    // ===== SISTEMA DE CAPTURA DE LOGS =====
    const debugLogs = [];
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info
    };

    // Intercepta logs do console
    ['log', 'warn', 'error', 'info'].forEach(method => {
        console[method] = function(...args) {
            debugLogs.push({
                type: method,
                time: new Date().toLocaleTimeString(),
                message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '),
                stack: method === 'error' ? new Error().stack : null
            });
            originalConsole[method].apply(console, args);        };
    });

    // ===== CONFIGURAÇÕES =====
    const CONFIG = {
        spoofPhrases: [
            "☄️ KhanScript: Todos os direitos reservados a Washinley e Yudi.",
            "🤖 KhanScript: Seu melhor cheat para Khan Academy.",
            "⚡ KhanScript: Feito com ❤️ por Nickz."
        ],
        fetchTimeout: 10000,
        autoClickDelay: 1000
    };

    // ===== ESTADO INTERNO =====
    const state = {
        correctAnswers: new Map(),
        toastQueue: [],
        toastTimer: null,
        debugPanelOpen: false
    };

    // ===== UTILITÁRIOS =====
    const utils = {
        findKeyDeep(obj, targetKey) {
            if (!obj || typeof obj !== 'object') return null;
            if (targetKey in obj) return obj[targetKey];
            for (let key of Object.keys(obj)) {
                const found = utils.findKeyDeep(obj[key], targetKey);
                if (found) return found;
            }
            return null;
        },

        toFraction(d) {
            if (d === 0 || d === 1) return String(d);
            const decimals = (String(d).split('.')[1] || '').length;
            let num = Math.round(d * Math.pow(10, decimals)), den = Math.pow(10, decimals);
            const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
            const div = gcd(Math.abs(num), Math.abs(den));
            return den / div === 1 ? String(num / div) : `${num / div}/${den / div}`;
        },

        isWidgetUsed(widgetKey, questionContent, hints) {
            const pattern = `☃ ${widgetKey.replace(/\s+/g, ' ')}`;
            if (questionContent?.includes(pattern)) return true;
            if (Array.isArray(hints)) {
                for (const hint of hints) {
                    if (hint.content?.includes(pattern)) return true;
                    if (hint.widgets) {                        for (const w of Object.values(hint.widgets)) {
                            if (w.options?.content?.includes(pattern)) return true;
                        }
                    }
                }
            }
            return false;
        },

        showToast(msg, duration = 2000) {
            state.toastQueue.push({ msg, duration });
            if (!state.toastTimer) {
                state.toastTimer = setTimeout(() => {
                    const { msg, duration } = state.toastQueue.shift();
                    if (typeof Toastify !== 'undefined') {
                        Toastify({
                            text: msg,
                            duration: duration,
                            gravity: "bottom",
                            position: "right",
                            stopOnFocus: true,
                            style: {
                                background: "linear-gradient(135deg, #8a2be2, #6a1cb0)",
                                color: "#fff",
                                fontWeight: "600",
                                borderRadius: "8px",
                                boxShadow: "0 4px 20px rgba(138, 43, 226, 0.4)"
                            }
                        }).showToast();
                    } else {
                        console.log(`[KhanScript] ${msg}`);
                    }
                    if (state.toastQueue.length > 0) {
                        state.toastTimer = setTimeout(arguments.callee, 100);
                    } else {
                        state.toastTimer = null;
                    }
                }, 100);
            }
        },

        // Cria o painel de Debug Info
        createDebugPanel() {
            if (document.getElementById('khanscript-debug-panel')) return;

            const panel = document.createElement('div');
            panel.id = 'khanscript-debug-panel';
            panel.style.cssText = `
                position: fixed;
                bottom: 20px;                right: 20px;
                width: 400px;
                max-height: 500px;
                background: #0a0a0b;
                border: 2px solid #8a2be2;
                border-radius: 12px;
                z-index: 999999;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                color: #fff;
                display: none;
                flex-direction: column;
                box-shadow: 0 0 30px rgba(138, 43, 226, 0.5);
            `;

            panel.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: linear-gradient(135deg, #8a2be2, #6a1cb0); border-radius: 10px 10px 0 0; cursor: move;">
                    <span style="font-weight: bold;">🔍 Debug Info - KhanScript</span>
                    <button id="debug-close" style="background: none; border: none; color: #fff; font-size: 18px; cursor: pointer;">✕</button>
                </div>
                <div id="debug-logs" style="flex: 1; overflow-y: auto; padding: 10px; background: #141122;"></div>
                <div style="padding: 8px; border-top: 1px solid #8a2be2; display: flex; gap: 8px;">
                    <button id="debug-clear" style="flex: 1; padding: 6px; background: #8a2be2; border: none; border-radius: 4px; color: #fff; cursor: pointer;">Limpar</button>
                    <button id="debug-copy" style="flex: 1; padding: 6px; background: #6a1cb0; border: none; border-radius: 4px; color: #fff; cursor: pointer;">Copiar</button>
                </div>
            `;

            document.body.appendChild(panel);

            // Toggle do painel com atalho (Ctrl+Shift+D)
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                    e.preventDefault();
                    state.debugPanelOpen = !state.debugPanelOpen;
                    panel.style.display = state.debugPanelOpen ? 'flex' : 'none';
                    if (state.debugPanelOpen) utils.renderDebugLogs();
                }
            });

            // Botões do painel
            document.getElementById('debug-close').onclick = () => {
                state.debugPanelOpen = false;
                panel.style.display = 'none';
            };

            document.getElementById('debug-clear').onclick = () => {
                debugLogs.length = 0;
                utils.renderDebugLogs();
                utils.showToast('🗑️ Logs limpos!', 1500);
            };
            document.getElementById('debug-copy').onclick = () => {
                const text = debugLogs.map(l => `[${l.time}] [${l.type.toUpperCase()}] ${l.message}`).join('\n');
                navigator.clipboard.writeText(text).then(() => {
                    utils.showToast('📋 Logs copiados!', 1500);
                });
            };

            // Tornar painel arrastável
            const header = panel.querySelector('div[style*="gradient"]');
            let isDragging = false, startX, startY, initialX, initialY;

            header.onmousedown = (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = panel.getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
                e.preventDefault();
            };

            document.onmousemove = (e) => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                panel.style.left = `${initialX + dx}px`;
                panel.style.top = `${initialY + dy}px`;
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
            };

            document.onmouseup = () => { isDragging = false; };
        },

        renderDebugLogs() {
            const container = document.getElementById('debug-logs');
            if (!container) return;

            container.innerHTML = debugLogs.slice(-100).reverse().map(log => {
                const colors = { log: '#fff', warn: '#ffd600', error: '#ff4444', info: '#8a2be2' };
                return `<div style="margin: 4px 0; padding: 4px; border-left: 3px solid ${colors[log.type]}; background: rgba(138,43,226,0.1);">
                    <span style="color: #8a2be2;">[${log.time}]</span>
                    <span style="color: ${colors[log.type]}; font-weight: bold;">[${log.type.toUpperCase()}]</span>
                    <span style="margin-left: 8px;">${log.message}</span>
                </div>`;
            }).join('') || '<div style="color: #888; text-align: center; padding: 20px;">Nenhum log ainda...</div>';

            container.scrollTop = 0;
        },
        fetchWithTimeout(resource, options = {}) {
            return Promise.race([
                fetch(resource, options),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Fetch timeout')), CONFIG.fetchTimeout)
                )
            ]);
        }
    };

    // ===== INTERCEPTADOR FETCH =====
    const originalFetch = window.fetch;

    window.fetch = async function(resource, init) {
        const url = resource instanceof Request ? resource.url : resource;
        let body = null;

        if (resource instanceof Request) {
            body = await resource.clone().text();
        } else if (init?.body) {
            body = init.body;
        }

        if (url.includes('/api/') && body) {
            if (body.includes('getAssessmentItem')) {
                return handleGetAssessmentItem(originalFetch, resource, init, body);
            } else if (body.includes('attemptProblem')) {
                return handleAttemptProblem(originalFetch, resource, init, body);
            } else if (body.includes('updateUserVideoProgress')) {
                return handleUpdateVideoProgress(originalFetch, resource, init, body);
            }
        }

        return originalFetch.apply(this, arguments);
    };

    // ===== HANDLERS =====
    async function handleGetAssessmentItem(originalFetch, resource, init, bodyText) {
        try {
            const response = await originalFetch.apply(this, arguments);
            const clone = response.clone();
            const text = await clone.text();

            let data;
            try { data = JSON.parse(text); } catch (e) { return response; }

            const itemDataRaw = utils.findKeyDeep(data, 'itemData') || utils.findKeyDeep(data, 'itemDataAnswerless');
            if (!itemDataRaw) return response;
            let itemData;
            try { itemData = JSON.parse(itemDataRaw); } catch (e) { return response; }

            const answers = extractAnswers(itemData);
            if (answers.length > 0) {
                const itemId = utils.findKeyDeep(data, 'id');
                if (itemId) {
                    state.correctAnswers.set(itemId, answers);
                    utils.showToast(`📦 ${answers.length} resposta(s) capturada(s).`, 750);
                    console.log(`[KhanScript] Respostas capturadas para item ${itemId}:`, answers);
                }
            }

            if (itemData.question?.content && typeof itemData.question.content === 'string' && itemData.question.content.trim()) {
                const phrase = CONFIG.spoofPhrases[Math.floor(Math.random() * CONFIG.spoofPhrases.length)];
                itemData.answerArea = { calculator: false, chi2Table: false, periodicTable: false, tTable: false, zTable: false };
                itemData.question.content = `${phrase}\n\n[[☃ radio 1]]\n\n**💎 KhanScript by Nickz**`;
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
                    }
                };

                const modified = JSON.parse(text);
                const target = utils.findKeyDeep(modified, 'itemData') || utils.findKeyDeep(modified, 'itemDataAnswerless');
                if (target) Object.assign(target, JSON.parse(JSON.stringify(itemData)));

                utils.showToast("🔓 Questão exploitada pelo KhanScript.", 1000);
                console.log('[KhanScript] Questão exploitada com sucesso!');
                return new Response(JSON.stringify(modified), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            }

        } catch (e) { 
            console.error('[KhanScript] Erro em getAssessmentItem:', e);
            utils.showToast('❌ Erro ao processar questão', 2000);
        }
        return response;
    }
    async function handleAttemptProblem(originalFetch, resource, init, bodyText) {
        try {
            let bodyObj = JSON.parse(bodyText);
            const itemId = bodyObj.variables?.input?.assessmentItemId;
            const answers = state.correctAnswers.get(itemId);

            if (answers?.length > 0) {
                bodyObj = applyAnswersToBody(bodyObj, answers);
                const newBody = JSON.stringify(bodyObj);

                if (resource instanceof Request) {
                    resource = new Request(resource, { body: newBody });
                } else {
                    init.body = newBody;
                }
                utils.showToast(`✨ ${answers.length} resposta(s) aplicada(s).`, 750);
                console.log(`[KhanScript] Respostas aplicadas para item ${itemId}`);
            }
        } catch (e) { 
            console.error('[KhanScript] Erro em attemptProblem:', e);
        }
        return originalFetch.apply(this, arguments);
    }

    async function handleUpdateVideoProgress(originalFetch, resource, init, bodyText) {
        try {
            let bodyObj = JSON.parse(bodyText);
            const input = bodyObj.variables?.input;
            if (input && input.durationSeconds !== undefined) {
                input.secondsWatched = input.durationSeconds;
                input.lastSecondWatched = input.durationSeconds;
                const newBody = JSON.stringify(bodyObj);

                if (resource instanceof Request) {
                    resource = new Request(resource, { body: newBody });
                } else {
                    init.body = newBody;
                }
                utils.showToast("🎬 Vídeo completado.", 1000);
                console.log('[KhanScript] Vídeo exploitado com sucesso!');
            }
        } catch (e) { 
            console.error('[KhanScript] Erro em videoProgress:', e);
        }
        return originalFetch.apply(this, arguments);
    }

    // ===== EXTRAÇÃO E APLICAÇÃO DE RESPOSTAS =====
    function extractAnswers(itemData) {        const answers = [];
        const widgets = itemData.question?.widgets || {};
        for (const [key, w] of Object.entries(widgets)) {
            if (!utils.isWidgetUsed(key, itemData.question.content, itemData.hints)) continue;
            if (w.type === 'radio' && w.options?.choices) {
                const correct = w.options.choices.find(c => c.correct);
                if (correct) answers.push({ type: 'radio', choiceId: correct.id, widgetKey: key });
            }
        }
        return answers;
    }

    function applyAnswersToBody(bodyObj, answers) {
        const userInput = {};
        const attemptContent = [];
        answers.forEach(a => {
            if (a.type === 'radio') {
                userInput[a.widgetKey] = { selectedChoiceIds: [a.choiceId] };
                attemptContent.push({ selectedChoiceIds: [a.choiceId] });
            }
        });
        bodyObj.variables.input.userInput = JSON.stringify(userInput);
        bodyObj.variables.input.attemptContent = JSON.stringify([attemptContent, []]);
        return bodyObj;
    }

    // ===== CLIQUE AUTOMÁTICO =====
    function clickButtonWithText(text) {
        for (const btn of document.querySelectorAll("button")) {
            if (btn.textContent?.trim() === text) { btn.click(); return true; }
            for (const span of btn.querySelectorAll("span")) {
                if (span.textContent?.trim() === text) { btn.click(); return true; }
            }
        }
        return false;
    }

    setInterval(() => {
        clickButtonWithText("Vamos lá");
        clickButtonWithText("Mostrar resumo");
        clickButtonWithText("Próximo");
        document.querySelector(`[data-testid="exercise-check-answer"]`)?.click();
        document.querySelector(`[data-testid="exercise-next-question"]`)?.click();
    }, CONFIG.autoClickDelay);

    // ===== LOGO SPOOF =====
    function applyLogoSpoof() {
        const svg = document.querySelector('svg');
        if (!svg || svg.dataset.ksSpoofed) return;
        const textEl = svg.querySelector('text') || svg.querySelector('tspan');        if (textEl) {
            textEl.textContent = 'KS';
            textEl.setAttribute('fill', '#8a2be2');
        }
        svg.dataset.ksSpoofed = "true";
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLogoSpoof);
    } else {
        applyLogo
