const phrases = [ 
    "Sem nota? Sem chance.",
    "KhanTool no topo.",
    "KhanTool mandou um salve!",
    "Queria tanto ter o KhanTool.",
    "Ganhe tempo, use KhanTool!",
    "KhanTool tá voando!"
];

setInterval(() => { 
    if (features.customBanner) {
        const possibleSelectors = [
            '.stp-animated-banner h2',
            '[data-testid="banner"] h2',
            '.banner h2',
            '.announcement-banner h2',
            'h2[class*="banner"]',
            '.hero-banner h2',
            'div[class*="banner"] h2'
        ];
        
        for (const selector of possibleSelectors) {
            const greeting = document.querySelector(selector);
            if (greeting) {
                greeting.textContent = phrases[Math.floor(Math.random() * phrases.length)];
                break;
            }
        }
    }
}, 2000);
