(function() {

                    // Atualiza o JSON da resposta
                    responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);

                    // Notificação
                    sendToast("🔓 Questão exploitada pelo KhanScript", 1000);

                    // Agora, tentamos clicar no botão "Verificar" automaticamente
                    setTimeout(() => {
                        const verifyButton = Array.from(document.querySelectorAll('button')).find(btn => 
                            btn.textContent.includes('Verificar') || btn.textContent.includes('Check')
                        );
                        if (verifyButton) {
                            verifyButton.click();
                            console.log('✅ Botão "Verificar" clicado automaticamente.');
                        }
                    }, 100); // Espera 100ms para garantir que o DOM foi atualizado

                    return new Response(JSON.stringify(responseObj), { 
                        status: originalResponse.status, 
                        statusText: originalResponse.statusText, 
                        headers: originalResponse.headers 
                    });
                }
            }
        } catch (e) {
            console.error('Erro ao modificar questão:', e);
        }

        return originalResponse;
    };

    // Monitora mudanças no DOM para detectar quando a questão aparece
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Se algum elemento contém "Verificar", tenta clicar
                    const verifyButton = node.querySelector('button') || document.querySelector('button');
                    if (verifyButton && (verifyButton.textContent.includes('Verificar') || verifyButton.textContent.includes('Check'))) {
                        setTimeout(() => {
                            verifyButton.click();
                            console.log('✅ Botão "Verificar" clicado por observação de DOM.');
                        }, 100);
                    }
                }
            });
        });
    });

    // Observa o corpo da página
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
