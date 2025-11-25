// questionspoof.js — Corrigido por Nickz ✅
const originalFetch = window.fetch;

window.fetch = async function (input, init) {
    let body;
    if (input instanceof Request) {
        body = await input.clone().text();
    } else if (init && init.body) {
        body = init.body;
    }

    const originalResponse = await originalFetch.apply(this, arguments);
    const clonedResponse = originalResponse.clone();

    try {
        const responseBody = await clonedResponse.text();
        let responseObj;

        try {
            responseObj = JSON.parse(responseBody);
        } catch (e) {
            return originalResponse;
        }

        // Detecta se a resposta é de uma questão
        if (responseObj?.data?.assessmentItem?.item?.itemData) {
            let itemData;

            try {
                itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
            } catch (e) {
                return originalResponse;
            }

            // Só modifica se for uma pergunta real (começa com letra maiúscula)
            if (typeof itemData.question?.content === 'string' && itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
                // Remove campos problemáticos que causam o sumiço
                delete itemData.answerArea;
                delete itemData.hints;
                delete itemData.answer;

                // Injeta widget de rádio diretamente no conteúdo
                itemData.question.content = "☄️ KhanScript: Respostas abaixo [[☃ radio 1]]";

                // Define o widget com as opções corretas
                itemData.question.widgets = {
                    "radio 1": {
                        type: "radio",
                        options: {
                            choices: [
                                { content: "Resposta Correta ✅", correct: true },
                                { content: "Resposta Incorreta ❌", correct: false }
                            ]
                        }
                    }
                };

                // Atualiza o JSON da resposta
                responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);

                // Notificação opcional (só se Toastify estiver carregado)
                if (typeof sendToast === 'function') {
                    sendToast("🔓 Questão exploitada pelo KhanScript", 1000);
                } else {
                    console.log("🔓 KhanScript: Questão modificada com sucesso!");
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
        console.warn("⚠️ KhanScript: Erro no questionspoof.js", e);
    }

    return originalResponse;
};
