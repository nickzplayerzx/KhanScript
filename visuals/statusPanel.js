plppdo.on('domChanged', () => {
    if (document.getElementById('khanwareTab')) return;

    function createTab(name, href = '#') {
        const li = document.createElement('li');
        li.innerHTML = `<a class="_8ry3zep" href="${href}" target="_blank"><span class="_xy39ea8">${name}</span></a>`;
        return li;
    }

    const nav = document.querySelector('nav[data-testid="side-nav"]');
    if (!nav) return;

    const section = document.createElement('section');
    section.id = 'khanwareTab';
    section.className = '_1ozlbq6';
    section.innerHTML = '<h2 class="_18undph9" style="color:#c291ff;">KhanScript</h2>'; // nome atualizado + cor roxa
    const ul = document.createElement('ul');
    const devTab = createTab('Developer', '#');

    devTab.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        window.khanwareWin = window.open("", "_blank");
        if (window.khanwareWin) {
            window.khanwareWin.document.write(`
                <html>
                <head>
                    <title>KhanScript — Developer</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background: linear-gradient(120deg, #1a0f2e 0%, #2d1b5e 100%);
                            color: #e0cfff;
                            margin: 0;
                        }
                        .container {
                            width: min(96vw, 560px);
                            min-height: 360px;
                            padding: 22px 18px 22px 28px;
                            border-radius: 16px;
                            background: rgba(20, 12, 40, 0.85);
                            box-shadow: 0 0 20px rgba(106, 44, 180, 0.5),
                                        inset 0 0 12px rgba(60, 20, 100, 0.4);
                            backdrop-filter: blur(8px);
                            -webkit-backdrop-filter: blur(8px);
                            border: 1px solid rgba(120, 60, 200, 0.4);
                            display: flex;
                            flex-direction: column;
                        }
                        h2 {
                            text-align: center;
                            margin-bottom: 20px;
                            color: #d9b3ff;
                            font-weight: 600;
                        }
                        .toggle-container {
                            flex: 1;
                            overflow-y: auto;
                            padding-right: 8px;
                        }
                        .toggle {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 10px 0;
                            border-bottom: 1px solid rgba(120, 60, 200, 0.2);
                        }
                        .toggle strong { color: #e6ccff; }
                        .toggle small { color: #b288e6; font-size: 13px; }
                        .debug-box {
                            width: 93%;
                            height: 105px;
                            overflow-y: auto;
                            background: rgba(15, 8, 30, 0.7);
                            color: #d9b3ff;
                            padding: 7px 12px;
                            font-family: 'Courier New', monospace;
                            white-space: pre-wrap;
                            border-radius: 8px;
                            border: 1px solid rgba(120, 60, 200, 0.3);
                            margin: 15px auto 4px auto;
                            font-size: 13px;
                        }
                        input[type="checkbox"] {
                            transform: scale(1.25);
                            cursor: pointer;
                            accent-color: #9a7ed9;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Ferramentas Avançadas</h2>
                        <div class="toggle-container" id="toggles"></div>
                        <div class="debug-box" id="debugBox"></div>
                        <div style="text-align:center;margin-top:8px;font-size:11px;color:#9a7ed9;">by nickz</div>
                    </div>
                    <script>
                        document.head.appendChild(Object.assign(document.createElement('style'), {
                            innerHTML: 
                                "::-webkit-scrollbar { width: 10px; } " +
                                "::-webkit-scrollbar-track { background: rgba(10, 5, 20, 0.3); } " +
                                "::-webkit-scrollbar-thumb { background: #8a5bd9; border-radius: 10px; } " +
                                "::-webkit-scrollbar-thumb:hover { background: #a070d9; }"
                        }));
                    </script>
                </body>
                </html>
            `);
        }

        // Cria os toggles
        createToggle('Modo Debug', 'Ativa logs de depuração', 'debugMode', window.debugMode || false);
        createToggle('Desabilitar Segurança', 'Libera clique direito/F12', 'disableSecurity', window.disableSecurity || false);
        createToggle('Desabilitar Ping', 'Desativa requisição de ping', 'disablePing', window.disablePing || false);
    });

    ul.appendChild(devTab);
    section.appendChild(ul);
    nav.appendChild(section);
});

// Função global para criar toggles
window.createToggle = function(name, desc, varName, toggled = false) {
    if (!window.khanwareWin || window.khanwareWin.closed) return;
    const toggleContainer = window.khanwareWin.document.getElementById('toggles');
    if (!toggleContainer) return;

    const toggleId = `toggle-${varName}`;
    const toggleElement = document.createElement('div');
    toggleElement.className = 'toggle';
    toggleElement.innerHTML = `
        <div>
            <strong>${name}</strong><br>
            <small>${desc}</small>
        </div>
        <input type="checkbox" id="${toggleId}" ${toggled ? "checked" : ""}>
    `;
    toggleElement.querySelector('input').addEventListener('change', (e) => {
        window[varName] = e.target.checked;
        debug(`${name} setado para ${window[varName]}!`);
    });
    toggleContainer.appendChild(toggleElement);
};

// Função de debug
window.debug = function(message) {
    if (!window.khanwareWin || window.khanwareWin.closed || !window.debugMode) return;
    const debugBox = window.khanwareWin.document.getElementById('debugBox');
    if (debugBox) {
        debugBox.innerHTML += message + '\\n';
        debugBox.scrollTop = debugBox.scrollHeight;
    }
};

// Captura erros globais
window.onerror = function(message, source, lineno, colno, error) {
    debug(`Erro @ ${source}:${lineno},${colno} \\n${error ? error.stack : message}`);
    return true;
};