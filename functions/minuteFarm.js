// minuteFarm.js — Corrigido e compatível com múltiplos overrides de fetch
if (!window.originalFetch) {
    window.originalFetch = window.fetch;
}

const minuteFarmFetch = window.fetch;
window.fetch = async function (input, init = {}) {
    // Captura o corpo da requisição, se possível
    let body = null;
    try {
        if (input instanceof Request) {
            const clone = input.clone();
            body = await clone.text();
        } else if (init.body) {
            // Se for FormData, não tenta converter (evita erro)
            if (typeof init.body === 'string') {
                body = init.body;
            }
        }
    } catch (err) {
        // Ignora erros de leitura do body — continua normalmente
    }

    // Intercepção do minuteFarmer
    if (features?.minuteFarmer && body && typeof input === 'string' && input.includes("mark_conversions")) {
        try {
            if (body.includes("termination_event")) {
                sendToast("Limite de tempo ignorado!", 1100);
                return; // Bloqueia a requisição de término
            }
        } catch (e) {
            debug(`Erro @ minuteFarm.js\n${e}`);
        }
    }

    // Chama a próxima camada de fetch (ou a original, se for a última)
    return minuteFarmFetch.call(this, input, init);
};
