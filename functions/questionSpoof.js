reservados
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

                itemData.question.content = "☄️ KhanScript : Todos os direitos reservados a Washinley e Yudi | https://khanscript.netlify.app [[☃ radio 1]]";
                
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

                responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
                sendToast("🔓 Questão exploitada pelo KhanScript", 1000);

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
