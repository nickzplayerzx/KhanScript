// ==UserScript==
// @name        KhanScript
// @namespace   nickzplayerzx
// @match       *://*.khanacademy.org/*
// @grant       none
// @version     3.1
// @author      Nickz (Yudi Matheus), Kovez (Washinley Samuel), Unleasher (Victor Souza)
// @icon        https://raw.githubusercontent.com/nickzplayerzx/KhanScript/main/logo.png
// @description KhanScript — O melhor script para Khan Academy (Atualizado 2026)
// @run-at      document-start
// ==/UserScript==

(function() {
    'use strict';

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
        toastTimer: null
    };

    // ===== UTILITÁRIOS =====
    const utils = {
        // Busca recursiva por chave em objeto aninhado (GraphQL)
        findKeyDeep(obj, targetKey) {
            if (!obj || typeof obj !== 'object') return null;
            if (targetKey in obj) return obj[targetKey];
            for (let key of Object.keys(obj)) {
                const found = utils.findKeyDeep(obj[key], targetKey);
                if (found) return found;
            }
            return null;
        },

        // Converte decimal para fração
        toFraction(d) {
            if (d === 0 || d === 1) return String(d);
            const decimals = (String(d).split('.')[1] || '').length;            let num = Math.round(d * Math.pow(10, decimals)), den = Math.pow(10, decimals);
            const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
            const div = gcd(Math.abs(num), Math.abs(den));
            return den / div === 1 ? String(num / div) : `${num / div}/${den / div}`;
        },

        // Verifica se widget está em uso (padrão KhanScript)
        isWidgetUsed(widgetKey, questionContent, hints) {
            const pattern = `☃ ${widgetKey.replace(/\s+/g, ' ')}`;
            if (questionContent?.includes(pattern)) return true;
            if (Array.isArray(hints)) {
                for (const hint of hints) {
                    if (hint.content?.includes(pattern)) return true;
                    if (hint.widgets) {
                        for (const w of Object.values(hint.widgets)) {
                            if (w.options?.content?.includes(pattern)) return true;
                        }
                    }
                }
            }
            return false;
        },

        // Notificação personalizada (fallback para Toastify)
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
                    } else {                        state.toastTimer = null;
                    }
                }, 100);
            }
        },

        // Fetch com timeout
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

        // Processa requisições relevantes
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

            // Busca recursiva por itemData (compatível com nova API)
            const itemDataRaw = utils.findKeyDeep(data, 'itemData') || utils.findKeyDeep(data, 'itemDataAnswerless');
            if (!itemDataRaw) return response;

            let itemData;
            try { itemData = JSON.parse(itemDataRaw); } catch (e) { return response; }

            // Captura respostas
            const answers = extractAnswers(itemData);
            if (answers.length > 0) {
                const itemId = utils.findKeyDeep(data, 'id');
                if (itemId) {
                    state.correctAnswers.set(itemId, answers);
                    utils.showToast(`📦 ${answers.length} resposta(s) capturada(s).`, 750);
                }
            }

            // Spoof visual
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

                // Atualiza resposta
                const modified = JSON.parse(text);
                const target = utils.findKeyDeep(modified, 'itemData') || utils.findKeyDeep(modified, 'itemDataAnswerless');
                if (target) Object.assign(target, JSON.parse(JSON.stringify(itemData)));

                utils.showToast("🔓 Questão exploitada pelo KhanScript.", 1000);
                return new Response(JSON.stringify(modified), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers                });
            }

        } catch (e) { console.error("[KhanScript] Erro em getAssessmentItem:", e); }
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
            }
        } catch (e) { console.error("[KhanScript] Erro em attemptProblem:", e); }
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
            }
        } catch (e) { console.error("[KhanScript] Erro em videoProgress:", e); }
        return originalFetch.apply(this, arguments);
    }

    // ===== EXTRAÇÃO DE RESPOSTAS =====
    function extractAnswers(itemData) {        const answers = [];
        const widgets = itemData.question?.widgets || {};
        for (const [key, w] of Object.entries(widgets)) {
            if (!utils.isWidgetUsed(key, itemData.question.content, itemData.hints)) continue;

            if (w.type === 'radio' && w.options?.choices) {
                const correct = w.options.choices.find(c => c.correct);
                if (correct) answers.push({ type: 'radio', choiceId: correct.id, widgetKey: key });
            }
            // Adicione outros tipos conforme necessário
        }
        return answers;
    }

    // ===== APLICAÇÃO DE RESPOSTAS =====
    function applyAnswersToBody(bodyObj, answers) {
        const userInput = {};
        const attemptContent = [];
        answers.forEach(a => {
            if (a.type === 'radio') {
                userInput[a.widgetKey] = { selectedChoiceIds: [a.choiceId] };
                attemptContent.push({ selectedChoiceIds: [a.choiceId] });
            }
            // Adicione outros tipos conforme necessário
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

    // ===== LOGO SPOOF =====    function applyLogoSpoof() {
        const svg = document.querySelector('svg');
        if (!svg || svg.dataset.ksSpoofed) return;
        const textEl = svg.querySelector('text') || svg.querySelector('tspan');
        if (textEl) {
            textEl.textContent = 'KS';
            textEl.setAttribute('fill', '#8a2be2');
        }
        svg.dataset.ksSpoofed = "true";
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLogoSpoof);
    } else {
        applyLogoSpoof();
    }

    new MutationObserver(() => applyLogoSpoof()).observe(document.body, { childList: true, subtree: true });

    // ===== INICIALIZAÇÃO =====
    utils.showToast("🤖 KhanScript V3.1 (Atualizado) ativado!");

})();
