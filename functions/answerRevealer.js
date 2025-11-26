const originalParse = JSON.parse;

JSON.parse = function (e, t) {
    let body = originalParse(e, t);
    try {
        if (body?.data) {
            Object.keys(body.data).forEach(key => {
                const data = body.data[key];
                if (features.showAnswers && key === "assessmentItem" && data?.item) {
                    const itemData = JSON.parse(data.item.itemData);
                    if (
                        itemData.question &&
                        itemData.question.widgets &&
                        typeof itemData.question.content === 'string' &&
                        itemData.question.content.length > 0 &&
                        itemData.question.content[0] === itemData.question.content[0].toUpperCase()
                    ) {
                        Object.keys(itemData.question.widgets).forEach(widgetKey => {
                            const widget = itemData.question.widgets[widgetKey];
                            if (widget.options?.choices?.length) {
                                let revealed = false;
                                widget.options.choices.forEach(choice => {
                                    if (choice.correct && !choice.content.includes("✅")) {
                                        choice.content = "✅ " + choice.content;
                                        revealed = true;
                                    }
                                });
                                if (revealed) {
                                    sendToast("🔓 Respostas reveladas.", 1000);
                                }
                            }
                        });
                        data.item.itemData = JSON.stringify(itemData);
                    }
                }
            });
        }
    } catch (err) {
        debug(`🚨 Error @ answerRevealer.js\n${err}`);
    }
    return body;
};
