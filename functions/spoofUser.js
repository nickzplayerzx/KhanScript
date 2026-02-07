plppdo.on('domChanged', () => {
    try {
        const pfpElement = document.querySelector('.avatar-pic');
        const nicknameElement = document.querySelector('.user-deets.editable h2');
        const desiredUsername = featureConfigs.customUsername || user.nickname;

        if (nicknameElement && nicknameElement.textContent !== desiredUsername) {
            nicknameElement.textContent = desiredUsername;
        }

        if (featureConfigs.customPfp && pfpElement) {
            if (pfpElement.src !== featureConfigs.customPfp) {
                pfpElement.src = featureConfigs.customPfp;
                pfpElement.alt = "Custom Profile";
                pfpElement.style.borderRadius = "50%";
            }
        }
    } catch (e) {
        if (typeof debug === 'function') {
            debug(`Erro @ spoofUser.js\n${e.message}`);
        }
    }
});
