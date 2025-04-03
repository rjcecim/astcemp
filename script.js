document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const guestInputsDiv = document.getElementById('guest-inputs');
    const generateInviteBtn = document.getElementById('generate-invite-btn');
    const sendInviteBtn = document.getElementById('send-invite-btn');
    const invitationSection = document.getElementById('invitationSection');
    const dateInput = document.getElementById('event-date');
    const dateError = document.getElementById('date-error');
    const guestError = document.getElementById('guest-error');
    const headerImage = document.getElementById('headerImage');
    const formSection = document.getElementById('formSection');

    // Configurações
    const maxGuests = 4;
    let guestCount = 1;
    let invitationGenerated = false;
    let invitationText = '';

    // Timeline inicial
    const tl = gsap.timeline();
    
    tl.to(headerImage, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    })
    .to(formSection, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5');

    const updateGuestError = () => {
        if (guestCount >= maxGuests) {
            gsap.to(guestError, {
                display: 'block',
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            gsap.to(guestError, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => guestError.style.display = 'none'
            });
        }
    };

    const addGuestInput = () => {
        if (guestCount >= maxGuests) {
            updateGuestError();
            return;
        }

        const guestInputGroup = document.createElement('div');
        guestInputGroup.classList.add('input-group');
        guestInputGroup.style.opacity = '0';
        guestInputGroup.style.transform = 'translateY(20px)';

        const guestInput = document.createElement('input');
        guestInput.type = 'text';
        guestInput.classList.add('form-control', 'form-control-lg', 'guest-name');
        guestInput.placeholder = 'Nome do Convidado';
        guestInput.required = true;

        const appendBtn = document.createElement('button');
        appendBtn.type = 'button';
        appendBtn.classList.add('btn', 'btn-outline-danger', 'btn-lg');
        appendBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
        appendBtn.title = 'Remover Convidado';

        appendBtn.addEventListener('click', () => {
            gsap.to(guestInputGroup, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    guestInputsDiv.removeChild(guestInputGroup);
                    guestCount--;
                    updateGuestError();
                    const firstAddBtn = document.getElementById('add-guest-btn');
                    if (firstAddBtn && firstAddBtn.disabled && guestCount < maxGuests) {
                        firstAddBtn.disabled = false;
                        firstAddBtn.classList.remove('disabled');
                    }
                }
            });
        });

        guestInputGroup.appendChild(guestInput);
        guestInputGroup.appendChild(appendBtn);
        guestInputsDiv.appendChild(guestInputGroup);

        gsap.to(guestInputGroup, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out'
        });

        guestCount++;
        updateGuestError();

        if (guestCount >= maxGuests) {
            const firstAddBtn = document.getElementById('add-guest-btn');
            if (firstAddBtn) {
                firstAddBtn.disabled = true;
                firstAddBtn.classList.add('disabled');
            }
        }

        guestInput.focus();
    };

    const addGuestBtn = document.getElementById('add-guest-btn');
    addGuestBtn.addEventListener('click', addGuestInput);

    const generateInvite = () => {
        let isValid = true;

        if (dateInput.value === '') {
            dateInput.classList.add('is-invalid');
            dateError.style.display = 'block';
            isValid = false;
        } else {
            dateInput.classList.remove('is-invalid');
            dateError.style.display = 'none';
        }

        const guestNames = [];
        const guestNameInputs = document.querySelectorAll('.guest-name');

        guestNameInputs.forEach(input => {
            if (input.value.trim() === '') {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
                guestNames.push(input.value.trim());
            }
        });

        if (guestNames.length === 0) {
            guestError.style.display = 'block';
            guestError.textContent = 'Por favor, adicione pelo menos um convidado.';
            isValid = false;
        } else if (guestCount > maxGuests) {
            guestError.style.display = 'block';
            guestError.textContent = `Limite de ${maxGuests} convidados atingido.`;
            isValid = false;
        } else {
            guestError.style.display = 'none';
        }

        if (!isValid) {
            gsap.from(formSection, {
                x: [-5, 5, -5, 5, 0],
                duration: 0.4,
                ease: 'power2.out'
            });
            return;
        }

        const dateParts = dateInput.value.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        invitationSection.innerHTML = `
            <h2>Convite Gerado</h2>
            <div class="invite-card">
                <p><strong>Nome do Associado</strong><br>Ruy Jorge Cecim dos Santos</p>
                <p><strong>Matrícula do Sócio</strong><br>0101093</p>
                <p><strong>Data do Evento</strong><br>${formattedDate}</p>
                <div class="guests-list">
                    <strong>Lista de Convidados</strong>
                    <ul>
                        ${guestNames.map(name => `<li>${name}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        invitationText = `*Convite*\n\n*Nome do Associado:* Ruy Jorge Cecim dos Santos\n*Matrícula do Sócio:* 0101093\n*Data do Evento:* ${formattedDate}\n\n*Lista de Convidados:*\n${guestNames.map(name => `- ${name}`).join('\n')}`;

        // Timeline para animação do convite
        const tlInvite = gsap.timeline();
        
        invitationSection.style.display = 'block';

        tlInvite
            .to(invitationSection, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            });

        invitationGenerated = true;
        sendInviteBtn.disabled = false;

        // Scroll suave até o convite
        setTimeout(() => {
            invitationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    };

    generateInviteBtn.addEventListener('click', generateInvite);

    const sendInvite = () => {
        if (!invitationGenerated) {
            alert('Por favor, gere o convite antes de enviar.');
            return;
        }

        const encodedText = encodeURIComponent(invitationText);
        const whatsappURL = `https://api.whatsapp.com/send?text=${encodedText}`;

        gsap.to(sendInviteBtn, {
            scale: 0.95,
            duration: 0.1,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1,
            onComplete: () => window.open(whatsappURL, '_blank')
        });
    };

    sendInviteBtn.addEventListener('click', sendInvite);

    // Feedback visual nos botões
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            gsap.to(btn, {
                scale: 0.95,
                duration: 0.1,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseup mouseout', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.1,
                ease: 'power2.out'
            });
        });
    });

    updateGuestError();
});
