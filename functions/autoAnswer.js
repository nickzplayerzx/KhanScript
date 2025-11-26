const baseSelectors = [
    `.perseus_hm3uu-sq`, // Container das opções do novo layout
    `[data-testid="exercise-check-answer"]`,
    `[data-testid="exercise-next-question"]`,
    `._1wi2tma4`
];

let lastActionTime = 0;
let isProcessing = false;
let toastCooldown = false;
let answerSelected = false;
let scriptInitialized = false;
let consecutiveFailures = 0;

function resetState() {
    answerSelected = false;
    isProcessing = false;
    consecutiveFailures = 0;
    lastActionTime = 0;
}

function waitForPageReady() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve, { once: true });
        }
    });
}

if (features.autoAnswer) {
    khanwareDominates = true;

    (async () => {
        await waitForPageReady();

        setTimeout(() => {
            scriptInitialized = true;
            if (typeof sendToast === 'function') {
                sendToast("🤖 AutoAnswer ativado!", 1000);
            }
        }, 1000);

        while (khanwareDominates) {
            if (!scriptInitialized) {
                await delay(100);
                continue;
            }

            if (isProcessing) {
                await delay(500);
                continue;
            }

            const currentTime = Date.now();
            if (currentTime - lastActionTime < 600) {
                await delay(200);
                continue;
            }

            let actionTaken = false;

            // 🔍 Procura pela opção com "Resposta Correta ✅."
            const correctOption = Array.from(document.querySelectorAll('.perseus_hm3uu-sq'))
                .find(el => el.textContent?.includes("Resposta Correta ✅."));

            const checkButton = document.querySelector(`[data-testid="exercise-check-answer"]`);
            const nextButton = document.querySelector(`[data-testid="exercise-next-question"]`);

            if (correctOption && !answerSelected && correctOption.offsetParent !== null) {
                try {
                    correctOption.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await delay(200);
                    correctOption.click();
                    answerSelected = true;
                    actionTaken = true;
                    lastActionTime = currentTime;
                    consecutiveFailures = 0;
                } catch (e) {
                    consecutiveFailures++;
                }
            }
            else if (checkButton && answerSelected && checkButton.offsetParent !== null && !checkButton.disabled) {
                try {
                    checkButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await delay(200);
                    checkButton.click();
                    answerSelected = false;
                    actionTaken = true;
                    lastActionTime = currentTime;
                    consecutiveFailures = 0;
                } catch (e) {
                    consecutiveFailures++;
                }
            }
            else if (nextButton && nextButton.offsetParent !== null && !nextButton.disabled) {
                const buttonText = (nextButton.textContent || nextButton.innerText || "").trim();

                if (buttonText.includes("Mostrar resumo") || buttonText.includes("Ver resumo") || buttonText.includes("Summary")) {
                    if (!toastCooldown) {
                        toastCooldown = true;
                        isProcessing = true;

                        if (typeof sendToast === 'function') {
                            sendToast("🎉 Exercício concluído, Agradeça o Nickz!", 2000);
                        }

                        if (typeof playAudio === 'function') {
                            playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                        }

                        setTimeout(() => {
                            try {
                                nextButton.click();
                                setTimeout(() => {
                                    resetState();
                                    toastCooldown = false;
                                }, 3000);
                            } catch (e) {
                                resetState();
                                toastCooldown = false;
                            }
                        }, 1500);
                    }
                } else {
                    try {
                        nextButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        await delay(200);
                        nextButton.click();
                        answerSelected = false;
                        actionTaken = true;
                        lastActionTime = currentTime;
                        consecutiveFailures = 0;
                    } catch (e) {
                        consecutiveFailures++;
                    }
                }
            }

            // 🔁 Outros seletores (recomendação, repetir, etc.)
            const extraSelectors = [];
            if (features.nextRecomendation) extraSelectors.push("._g9riz5o");
            if (features.repeatQuestion) extraSelectors.push("._10goqnzn");

            if (!actionTaken) {
                for (const selector of extraSelectors) {
                    const el = document.querySelector(selector);
                    if (el && el.offsetParent !== null && !el.disabled) {
                        try {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            await delay(200);
                            el.click();
                            actionTaken = true;
                            lastActionTime = currentTime;
                            consecutiveFailures = 0;
                            break;
                        } catch (e) {
                            consecutiveFailures++;
                        }
                    }
                }
            }

            // ✅ Indicador de conclusão
            const completionIndicators = [
                `[data-testid="exercise-complete"]`,
                `.exercise-complete`,
                `[aria-label*="completo"]`,
                `[aria-label*="concluído"]`,
                `[aria-label*="completed"]`,
                `[aria-label*="finished"]`
            ];

            for (const indicator of completionIndicators) {
                if (document.querySelector(indicator)) {
                    if (!toastCooldown) {
                        toastCooldown = true;
                        if (typeof sendToast === 'function') {
                            sendToast("✅ Atividade finalizada com sucesso!", 2000);
                        }
                        setTimeout(() => {
                            toastCooldown = false;
                            resetState();
                        }, 5000);
                    }
                    break;
                }
            }

            // 🔄 Reinício automático em falhas
            if (consecutiveFailures > 10) {
                resetState();
                await delay(2000);
                if (typeof sendToast === 'function') {
                    sendToast("🔄 AutoAnswer reiniciado!", 1000);
                }
            }

            if (!features.autoAnswer) {
                khanwareDominates = false;
                break;
            }

            await delay(actionTaken ? 800 : 400);
        }
    })();
}

// Reset ao voltar ao foco
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && features.autoAnswer) {
        resetState();
        setTimeout(() => {
            scriptInitialized = true;
        }, 500);
    }
});

// Cleanup ao sair
window.addEventListener('beforeunload', () => {
    resetState();
});
