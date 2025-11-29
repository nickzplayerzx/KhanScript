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
                // Remove áreas problemáticas
                delete itemData.answerArea;
                delete itemData.hints;
                delete itemData.answer;

                // Mensagem padrão (sem LivePix, sem Khanware)
                itemData.question.content = "☄️ KhanScript: Todos os direitos reservados a Washinley e Yudi[[☃ radio 1]]";

                // Widgets exatamente como no seu código original
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

                // Atualiza o JSON
                responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);

                // Notificação
                if (typeof sendToast === 'function') {
                    sendToast("🔓 Questão exploitada pelo KhanScript", 1000);
                }

                // Retorna resposta modificada
                return new Response(JSON.stringify(responseObj), {
                    status: originalResponse.status,
                    statusText: originalResponse.statusText,
                    headers: originalResponse.headers
                });
            }
        }
    } catch (e) {
        // Silencioso em produção
    }

    return originalResponse;
};
