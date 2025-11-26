function applyRGBLogo() {
    if (!features.rgbLogo) return;

    // Seletores atualizados com base no HTML da Khan Academy (2025)
    const possibleSelectors = [
        'svg._1rt6g9t path:nth-last-of-type(2)', // Seletor principal atual
        '[data-testid="khan-logo"] svg path',
        '.perseus-header-logo svg path',
        'header svg path[fill]',
        'svg path[fill="#00af93"]',
        'svg path[fill*="#"]'
    ];

    let khanLogo = null;
    for (const selector of possibleSelectors) {
        try {
            khanLogo = document.querySelector(selector);
            if (khanLogo && khanLogo.offsetParent !== null) break;
        } catch (e) {}
    }

    if (!khanLogo) return;

    // Garante que o estilo RGB só seja inserido uma vez
    if (!document.querySelector('style.RGBLogo')) {
        const style = document.createElement('style');
        style.className = 'RGBLogo';
        style.textContent = `
            @keyframes colorShift {
                0%   { fill: #ff0000 !important; }
                25%  { fill: #00ff00 !important; }
                50%  { fill: #0000ff !important; }
                75%  { fill: #ffff00 !important; }
                100% { fill: #ff0000 !important; }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove interferência do DarkReader
    if (khanLogo.hasAttribute('data-darkreader-inline-fill')) {
        khanLogo.removeAttribute('data-darkreader-inline-fill');
    }

    // Aplica animação
    khanLogo.style.animation = 'colorShift 3.5s linear infinite';
    khanLogo.style.fill = '#ff0000';
}

function removeRGBLogo() {
    const animatedLogos = document.querySelectorAll('[style*="colorShift"]');
    animatedLogos.forEach(el => {
        el.style.animation = '';
        el.style.fill = '';
    });
}

// Sistema de observação compatível com seu EventEmitter (plppdo)
if (typeof plppdo !== 'undefined') {
    plppdo.on('domChanged', () => {
        try {
            if (features.rgbLogo) {
                applyRGBLogo();
            } else {
                removeRGBLogo();
            }
        } catch (e) {
            if (typeof debug === 'function') debug(`Erro @ rgbLogo.js\n${e}`);
        }
    });
} else {
    // Fallback para ambientes sem plppdo
    let rgbInterval = setInterval(() => {
        try {
            if (features.rgbLogo) {
                applyRGBLogo();
            } else {
                removeRGBLogo();
                clearInterval(rgbInterval);
            }
        } catch (e) {
            if (typeof debug === 'function') debug(`Erro @ rgbLogo.js (fallback)\n${e}`);
        }
    }, 1200);
}

// Inicialização inicial
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyRGBLogo);
} else {
    applyRGBLogo();
}
