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
    section.innerHTML = '<h2 class="_18undph9" style="color:#176bd7;">KhanTool Dev</h2>';
    const ul = document.createElement('ul');
    const devTab = createTab('Developer', '#');
    devTab.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        window.khanwareWin = window.open("", "_blank");
        if (window.khanwareWin) {
            window.khanwareWin.document.write(`
                <html>
                <head>
                    <title>KhanTool — Developer</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background: linear-gradient(110deg, #e4f1fd 0%, #176bd7 100%);
                            color: #1851a8;
                            margin: 0;
                        }
                        .container {
                            width: min(96vw, 560px); min-height: 360px; padding: 22px 18px 22px 28px;
                            border-radius: 16px;
                            background: #fafdff;
                            box-shadow: 0px 0px 12px 1px #9acef5;
                            display: flex;
                            flex-direction: column;
                        }
                        h2 {
                            text-align: center;
                            margin-bottom: 20px;
                            color: #176bd7;
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
                            padding: 8px 0;
                            border-bottom: 1px solid #daeaff;
                        }
                        .toggle strong { color: #1851a8; }
                        .toggle small { color: #4877b9; }
                        .debug-box {
                            width: 93%; height: 105px; overflow-y: auto; background: #1356ad;
                            color: #fff;
                            padding: 7px 12px; font-family: monospace; white-space: pre-wrap;
                            border-radius: 7px; border: 1px solid #afd6fa; margin: 15px auto 4px auto;
                        }
                        input[type="checkbox"] { transform: scale(1.18); cursor: pointer;}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Ferramentas Avançadas</h2>
                        <div class="toggle-container" id="toggles"></div>
                        <div class="debug-box" id="debugBox"></div>
                    </div>
                    <script>
                        document.head.appendChild(Object.assign(document.createElement('style'), {
                            innerHTML: "::-webkit-scrollbar { width: 11px; } ::-webkit-scrollbar-track { background: #fafdff; } ::-webkit-scrollbar-thumb { background: #176bd7; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #1b468b; }"
                        }));
                    </script>
                </body>
                </html>
            `);
        }
        createToggle('Modo Debug', 'Ativa logs de depuração', 'debugMode', window.debugMode || false);
        createToggle('Desabilitar Segurança', 'Libera clique direito/F12', 'disableSecurity', window.disableSecurity || false);
        createToggle('Desabilitar Ping', 'Desativa requisição de ping', 'disablePing', window.disablePing || false);
    });
    ul.appendChild(devTab);
    section.appendChild(ul);
    nav.appendChild(section);
});
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
window.debug = function(message) {
    if (!window.khanwareWin || window.khanwareWin.closed || !window.debugMode) return;
    const debugBox = window.khanwareWin.document.getElementById('debugBox');
    if (debugBox) {
        debugBox.innerHTML += message + '\n';
        debugBox.scrollTop = debugBox.scrollHeight;
    }
};
window.onerror = function(message, source, lineno, colno, error) {
    debug(`Erro @ ${source}:${lineno},${colno} \n${error ? error.stack : message}`);
    return true;
};
