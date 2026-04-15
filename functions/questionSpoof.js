// ==UserScript==
// @name        KhanScript (Atualizado 2026)
// @namespace   nickzplayerzx
// @match       *://pt.khanacademy.org/*
// @grant       none
// @version     3.1
// @author      Nickz (Yudi Matheus), Kovez (Washinley Samuel), Unleasher (Victor Souza)
// @icon        https://raw.githubusercontent.com/nickzplayerzx/KhanScript/main/logo.png
// @description KhanScript V3.1 — Compatível com a API atual do Khan Academy (2026)
// ==/UserScript==

const originalFetch = window.fetch;
const correctAnswers = new Map();

// --- Suas frases e identidade ---
const phrases = [
    "☄️ KhanScript: Todos os direitos reservados a Washinley e Yudi"
];

// --- Helper: Converte frações ---
const toFraction = (d) => {
    if (d === 0 || d === 1) return String(d);
    const decimals = (String(d).split('.')[1] || '').length;
    let num = Math.round(d * Math.pow(10, decimals)), den = Math.pow(10, decimals);
    const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
    const div = gcd(Math.abs(num), Math.abs(den));
    return den / div === 1 ? String(num / div) : `${num / div}/${den / div}`;
};

// --- Helper: Detecta se widget está em uso ---
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

// --- Função principal: Intercepta fetch ---
window.fetch = async function(input, init) {
    const url = input instanceof Request ? input.url : input;
    let body = input instanceof Request ? await input.clone().text() : init?.body;
    // --------------------------------------------------------
    // ETAPA 1: CAPTURA DE QUESTÃO (getAssessmentItem)
    // --------------------------------------------------------
    if (url.includes('getAssessmentItem') && body) {
        try {
            const res = await originalFetch.apply(this, arguments);
            const clone = res.clone();
            const text = await clone.text();
            const data = JSON.parse(text);

            // 🔍 Nova estrutura: procura por `itemData` em `data[0]` ou `data.assessmentItem`
            let itemDataRaw = null;
            let item = null;

            // Tentativa 1: Estrutura moderna (array de items)
            if (Array.isArray(data.data)) {
                for (const itemEntry of data.data) {
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
            // Tentativa 2: Estrutura antiga (objeto com chave)
            else if (data.data?.assessmentItem?.item?.itemData) {
                item = data.data.assessmentItem.item;
                itemDataRaw = item.itemData;
            }
            else if (data.data?.assessmentItem?.item?.itemDataAnswerless) {
                item = data.data.assessmentItem.item;
                itemDataRaw = item.itemDataAnswerless;
            }

            if (!itemDataRaw) return res;

            let itemData;
            try {
                itemData = JSON.parse(itemDataRaw);
            } catch (e) {
                console.warn("[KhanScript] Falha ao parsear itemData:", e);
                return res;
            }
            // ✅ Detecção de nova questão: verifica se o conteúdo começa com letra maiúscula OU contém texto visível
            const hasVisibleContent = itemData.question?.content && typeof itemData.question.content === 'string' && itemData.question.content.trim().length > 0;
            const startsWithUpper = hasVisibleContent && itemData.question.content[0] === itemData.question.content[0].toUpperCase();

            // Se for uma nova questão, injeta o spoof
            if (hasVisibleContent) {
                // 🛠️ Limpa áreas indesejadas
                itemData.answerArea = {
                    calculator: false,
                    chi2Table: false,
                    periodicTable: false,
                    tTable: false,
                    zTable: false
                };

                // 📝 Insere seu branding
                itemData.question.content = phrases[0] + "[[☃ radio 1]]";

                // 🎯 Cria o widget de resposta
                itemData.question.widgets = {
                    "radio 1": {
                        type: "radio",
                        alignment: "default",
                        static: false,
                        graded: true,
                        options: {
                            choices: [
                                { content: "Respostα Corretα ✅.", correct: true, id: "correct-choice" },
                                { content: "Respostα Incorretα ❌.", correct: false, id: "incorrect-choice" }
                            ],
                            randomize: false,
                            multipleSelect: false,
                            displayCount: null,
                            deselectEnabled: false
                        },
                        version: { major: 1, minor: 0 }
                    }
                };

                // 🔁 Atualiza o JSON da resposta
                if (item.itemData) item.itemData = JSON.stringify(itemData);
                else if (item.itemDataAnswerless) item.itemDataAnswerless = JSON.stringify(itemData);

                // 📡 Envia a resposta modificada
                const modified = { ...data };
                if (Array.isArray(modified.data)) {
                    for (let i = 0; i < modified.data.length; i++) {
                        if (modified.data[i]?.item?.itemData === itemDataRaw) {
                            modified.data[i].item.itemData = JSON.stringify(itemData);
                            break;                        }
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

                // ✅ Notificação
                if (typeof sendToast === 'function') {
                    sendToast("🔓 Questão exploitada pelo KhanScript", 1000);
                }

                return new Response(JSON.stringify(modified), {
                    status: res.status,
                    statusText: res.statusText,
                    headers: res.headers
                });
            }

        } catch (e) {
            console.error("[KhanScript] Erro em getAssessmentItem:", e);
            // Não falha — retorna a resposta original
        }
    }

    // --------------------------------------------------------
    // ETAPA 2: APLICAÇÃO DE RESPOSTAS (attemptProblem)
    // --------------------------------------------------------
    if (url.includes('attemptProblem') && body) {
        try {
            let bodyObj;
            if (typeof body === 'string') {
                bodyObj = JSON.parse(body);
            } else {
                bodyObj = body;
            }

            const itemId = bodyObj.variables?.input?.assessmentItemId;
            const answers = correctAnswers.get(itemId);

            if (answers && answers.length > 0) {
                const content = [], userInput = {};
                let state = bodyObj.variables.input.attemptState ? JSON.parse(bodyObj.variables.input.attemptState) : {};

                // Validação de estado                const answerKeys = new Set(answers.map(a => a.widgetKey));
                const stateKeys = Object.keys(state);
                const hasInvalidWidgets = stateKeys.some(key => !answerKeys.has(key) && key !== 'hint');
                if (hasInvalidWidgets) {
                    state = {};
                    answers.forEach(a => { state[a.widgetKey] = {}; });
                }

                // Aplica as respostas
                answers.forEach(a => {
                    if (a.type === 'radio') {
                        const selectedIds = [a.choiceId];
                        content.push({ selectedChoiceIds: selectedIds });
                        userInput[a.widgetKey] = { selectedChoiceIds: selectedIds };
                    }
                });

                bodyObj.variables.input.attemptContent = JSON.stringify([content, []]);
                bodyObj.variables.input.userInput = JSON.stringify(userInput);
                if (state) bodyObj.variables.input.attemptState = JSON.stringify(state);

                // Atualiza o corpo da requisição
                const newBody = JSON.stringify(bodyObj);
                if (input instanceof Request) {
                    input = new Request(input, { body: newBody, method: 'POST' });
                } else {
                    init.body = newBody;
                }

                if (typeof sendToast === 'function') {
                    sendToast(`✨ ${answers.length} resposta(s) aplicada(s).`, 750);
                }
            }
        } catch (e) {
            console.error("[KhanScript] Erro em attemptProblem:", e);
        }
    }

    // Retorna a resposta original se não houver modificações
    return originalFetch.apply(this, arguments);
};
