function applyRGBLogo() {
    if (!features.rgbLogo) return;
    
    const possibleSelectors = [
        'svg._1rt6g9t path:nth-last-of-type(2)',
        '[data-testid="khan-logo"] svg path',
        '.logo svg path',
        'svg[class*="logo"] path',
        'header svg path',
        '[aria-label*="Khan"] svg path',
        'svg path[fill="#00af93"]',
        'svg path[fill*="#"]'
    ];
    
    let khanLogo = null;
    
    for (const selector of possibleSelectors) {
        khanLogo = document.querySelector(selector);
        if (khanLogo) break;
    }
    
    if (khanLogo) {
        if (!document.querySelector('style.RGBLogo')) {
            const styleElement = document.createElement('style');
            styleElement.className = "RGBLogo";
            styleElement.textContent = `
            @keyframes colorShift { 
                0% { fill: #2196f3 !important; } 
                25% { fill: #e91e63 !important; } 
                50% { fill: #ffd600 !important; }
                75% { fill: #7ad878 !important; }
                100% { fill: #2196f3 !important; }
            }
            .rgb-logo-active {
                animation: colorShift 3.8s linear infinite !important;
                fill: #2196f3 !important;
            }`;
            document.head.appendChild(styleElement);
        }
        
        if (khanLogo.getAttribute('data-darkreader-inline-fill')) {
            khanLogo.removeAttribute('data-darkreader-inline-fill');
        }
        
        khanLogo.classList.add('rgb-logo-active');
        khanLogo.style.animation = 'colorShift 3.8s linear infinite';
        khanLogo.style.fill = '#2196f3';
    }
}

function removeRGBLogo() {
    const logos = document.querySelectorAll('.rgb-logo-active');
    logos.forEach(logo => {
        logo.classList.remove('rgb-logo-active');
        logo.style.animation = '';
        logo.style.fill = '';
    });
}

if (typeof plppdo !== 'undefined') {
    plppdo.on('domChanged', () => {
        try {
            if (features.rgbLogo) {
                applyRGBLogo();
            } else {
                removeRGBLogo();
            }
        } catch (e) {
            debug(`Erro @ rgbLogo.js\n${e}`);
        }
    });
} else {
    setInterval(() => {
        try {
            if (features.rgbLogo) {
                applyRGBLogo();
            } else {
                removeRGBLogo();
            }
        } catch (e) {
            debug(`Erro @ rgbLogo.js\n${e}`);
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (features.rgbLogo) {
        applyRGBLogo();
    }
});
