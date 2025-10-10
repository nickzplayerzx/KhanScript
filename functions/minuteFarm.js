const originalFetch_minuteFarm = window.fetch;
window.fetch = async function (input, init = {}) {
    let body;
    if (input instanceof Request) body = await input.clone().text();
    else if (init.body) body = init.body;
    if (features.minuteFarmer && body && input.url.includes("mark_conversions")) {
        try {
            if (body.includes("termination_event")) { sendToast("Limite de tempo ignorado!", 1100); return; }
        } catch (e) { debug(`Erro @ minuteFarm.js\n${e}`); }
    }
    return originalFetch_minuteFarm.apply(this, arguments);
};
