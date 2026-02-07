// Variável de controle para o autoAnswer
let khanScriptDominates = true;

(async () => {
    while (khanScriptDominates) {
        if (features.autoAnswer && features.questionSpoof) {
            const baseSelectors = [
                `.perseus_hm3uu-sq`,
                `[data-testid="exercise-check-answer"]`,
                `[data-testid="exercise-next-question"]`,
                `._1wi2tma4`
            ];

            const selectorsToCheck = [...baseSelectors];

            if (features.nextRecomendation) selectorsToCheck.push("._g9riz5o");
            if (features.repeatQuestion) selectorsToCheck.push("._10goqnzn");

            for (const selector of selectorsToCheck) {
                findAndClickBySelector(selector);

                const element = document.querySelector(selector);
                if (element) {
                    const innerDiv = element.querySelector("div");
                    if (innerDiv && innerDiv.innerText === "Mostrar resumo") {
                        sendToast("🎉 Exercício concluído, Agradeça o Nickz!", 3000);
                        playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
                    }
                }
            }
        }
        await delay(featureConfigs.autoAnswerDelay * 800);
    }
})();
