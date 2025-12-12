// ====== KhanScript — Discord Widget (WidgetBot Crate) ======
if (!device.mobile) {
  // evita injetar duas vezes se o script rodar de novo
  if (!window.__ksWidgetbotLoaded) window.__ksWidgetbotLoaded = false;
  if (!window.__ksWidgetbotCrate) window.__ksWidgetbotCrate = null;

  const shouldShowDiscord = () => window.location.href.includes("khanacademy.org/profile");

  const setDiscordVisible = (visible) => {
    const crate = window.__ksWidgetbotCrate;
    if (!crate) return;
    if (visible) crate.show();
    else crate.hide();
  };

  const initCrate = () => {
    // se por algum motivo ainda não tiver carregado
    if (typeof Crate === 'undefined') return;

    // cria uma vez
    if (!window.__ksWidgetbotCrate) {
      window.__ksWidgetbotCrate = new Crate({
        server: '1298477766290837554',
        channel: '1310975104460656662',
        location: ['bottom', 'right'],
        notifications: true,
        indicator: true,
        allChannelNotifications: true,
        defer: false,
        color: '#9a7ed9' // roxo suave do tema KhanScript
      });
    }

    // aplica regra inicial
    setDiscordVisible(shouldShowDiscord());

    // Mostra apenas na página de perfil da Khan Academy
    plppdo.on('domChanged', () => {
      setDiscordVisible(shouldShowDiscord());
    });
  };

  // se já carregou antes, só inicializa
  if (window.__ksWidgetbotLoaded) {
    initCrate();
  } else {
    // injeta o script (mantendo a URL exatamente como você passou)
    const script = Object.assign(document.createElement('script'), {
      src: 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3',
      async: true,
      onload: () => {
        window.__ksWidgetbotLoaded = true;
        initCrate();
      }
    });

    document.body.appendChild(script);
  }
}
