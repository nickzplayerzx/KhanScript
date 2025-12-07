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

            // Só modifica se for uma pergunta real (começa com maiúscula)
            if (typeof itemData.question?.content === 'string' && itemData.question.content.length > 0 && itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
                // Remove campos problemáticos que fazem as opções sumirem
                delete itemData.answerArea;
                delete itemData.hints;
                delete itemData.answer;

                // Injeta sua mensagem e widget
                itemData.question.content = "☄️ KhanScript: Todos os direitos reservados a Washinley e Yudi[[☃ radio 1]]";
                itemData.question.widgets = {
                    "radio 1": {
                        type: "radio",
                        options: {
                            choices: [
                                { content: "Respostα Corretα ✅.", correct: true },
                                { content: "Respostα Incorretα ❌.", correct: false }
                            ]
                        }
                    }
                };

                // Atualiza o itemData
                responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);

                // Notificação
                if (typeof sendToast === 'function') {
                    sendToast("🔓 Questão exploitada pelo KhanScript", 1000);
                }

                // Retorna a resposta modificada
                return new Response(JSON.stringify(responseObj), {
                    status: originalResponse.status,
                    statusText: originalResponse.statusText,
                    headers: originalResponse.headers
                });
            }
        }
    } catch (e) {
        // Silencioso, mas loga se debug estiver ativo
        if (typeof debug === 'function') {
            debug(`Erro em questionSpoof.js: ${e.message}`);
        }
    }

    return originalResponse;
};
