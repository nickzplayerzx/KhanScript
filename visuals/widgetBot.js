if (!device.mobile) {
    const script = Object.assign(document.createElement('script'), {
        src: 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3', // espaço removido
        async: true,
        onload: () => {
            const discEmbed = new Crate({
                server: '1298477766290837554',
                channel: '1310975104460656662',
                location: ['bottom', 'right'],
                notifications: true,
                indicator: true,
                allChannelNotifications: true,
                defer: false,
                color: '#9a7ed9' // roxo suave combinando com o tema KhanScript
            });

            plppdo.on('domChanged', () => {
                if (window.location.href.includes("khanacademy.org/profile")) {
                    discEmbed.show();
                } else {
                    discEmbed.hide();
                }
            });
        }
    });
    document.body.appendChild(script);
}