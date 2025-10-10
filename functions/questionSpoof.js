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
                itemData.answerArea = { 
                    "calculator": false, 
                    "chi2Table": false, 
                    "periodicTable": false, 
                    "tTable": false, 
                    "zTable": false 
                };

                itemData.question.content = "🫐 KhanTool: https://discord.gg/tdy2jCWja2 [[☃ radio 1]]";
                
                itemData.question.widgets = { 
                    "radio 1": { 
                        type: "radio", 
                        options: { 
                            choices: [ 
                                { content: "Resposta correta.", correct: true }, 
                                { content: "Resposta incorreta.", correct: false } 
                            ] 
                        } 
                    } 
                };

                responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                sendToast("🔓 Questão exploitada pelo KhanTool.", 1000);

                return new Response(JSON.stringify(responseObj), { 
                    status: originalResponse.status, 
                    statusText: originalResponse.statusText, 
                    headers: originalResponse.headers 
                });
            }
        }
    } catch (e) { }

    return originalResponse;
};
