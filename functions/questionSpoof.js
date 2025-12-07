const originalFetch = window.fetch;
const correctAnswers = new Map();

const toFraction = (d) => { if (d === 0 || d === 1) return String(d); const decimals = (String(d).split('.')[1] || '').length; let num = Math.round(d * Math.pow(10, decimals)), den = Math.pow(10, decimals); const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; }; const div = gcd(Math.abs(num), Math.abs(den)); return den / div === 1 ? String(num / div) : `${num / div}/${den / div}`; };
const isWidgetUsed = (widgetKey, questionContent, hints) => {
    const widgetPattern = `☃ ${widgetKey.replace(/\s+/g, ' ')}`;
    
    if (questionContent.includes(widgetPattern)) return true;
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

window.fetch = async function(input, init) {
    const url = input instanceof Request ? input.url : input;
    let body = input instanceof Request ? await input.clone().text() : init?.body;
    
    if (features.questionSpoof && url.includes('getAssessmentItem') && body) {
        const res = await originalFetch.apply(this, arguments);
        const clone = res.clone();
        
        try {
            const data = await clone.json();

            let item = null;
            if (data?.data) {
                for (const key in data.data) {
                    if (data.data[key]?.item) {
                        item = data.data[key].item;
                        break;
                    }
                }
            }
            
            if (!item?.itemData) return res;
            
            let itemData = JSON.parse(item.itemData);
            const answers = [];
            
            for (const [key, w] of Object.entries(itemData.question.widgets)) {
                if (!isWidgetUsed(key, itemData.question.content, itemData.hints)) { continue; }
                if ((w.type === 'radio') && w.options?.choices) {
                    const choices = w.options.choices.map((c, i) => ({ ...c, id: c.id || `radio-choice-${i}` }));
                    const correct = choices.find(c => c.correct);
                    if (correct) answers.push({ type: 'radio', choiceId: correct.id, widgetKey: key });
                }
            }
            
            if (answers.length > 0) {
                correctAnswers.set(item.id, answers);
            }
            
            if (itemData.question.content?.[0] === itemData.question.content[0].toUpperCase()) {
                itemData.answerArea = { calculator: false, chi2Table: false, periodicTable: false, tTable: false, zTable: false };
                itemData.question.content = "☄️ KhanScript: Todos os direitos reservados a Washinley e Yudi[[☃ radio 1]]";
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
                
                const modified = { ...data };
                if (modified.data) {
                    for (const key in modified.data) {
                        if (modified.data[key]?.item?.itemData) {
                            modified.data[key].item.itemData = JSON.stringify(itemData);
                            break;
                        }
                    }
                }
                
                sendToast("🔓 Questão exploitada pelo KhanScript", 1000);
                return new Response(JSON.stringify(modified), { 
                    status: res.status, statusText: res.statusText, headers: res.headers 
                });
            }
        } catch (e) { debug(`Erro @ questionSpoof.js\n${e}`); }
        return res;
    }
    
    if (features.questionSpoof && body?.includes('"operationName":"attemptProblem"')) {
        try {
            let bodyObj = JSON.parse(body);
            const itemId = bodyObj.variables?.input?.assessmentItemId;
            const answers = correctAnswers.get(itemId);
            
            if (answers?.length > 0) {
                const content = [], userInput = {};
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
                        const selectedIds = [a.choiceId];
                        content.push({ selectedChoiceIds: selectedIds });
                        userInput[a.widgetKey] = { selectedChoiceIds: selectedIds };
                    }
                    if (state?.[a.widgetKey]) state[a.widgetKey].selectedChoiceIds = [a.choiceId];
                });
                
                bodyObj.variables.input.attemptContent = JSON.stringify([content, []]);
                bodyObj.variables.input.userInput = JSON.stringify(userInput);
                if (state) bodyObj.variables.input.attemptState = JSON.stringify(state);
                
                body = JSON.stringify(bodyObj);
                if (input instanceof Request) input = new Request(input, { body });
                else init.body = body;
                sendToast(`✨ ${answers.length} resposta(s) aplicada(s).`, 750);
            }
        } catch (e) { debug(`Erro @ questionSpoof.js\n${e}`); }
    }
    
    return originalFetch.apply(this, arguments);
};
