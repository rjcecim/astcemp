document.addEventListener('DOMContentLoaded', () => {
    const guestInputsDiv = document.getElementById('guest-inputs');
    const generateInviteBtn = document.getElementById('generate-invite-btn');
    const sendInviteBtn = document.getElementById('send-invite-btn');
    const invitationSection = document.querySelector('.invitation-section');
    const dateInput = document.getElementById('event-date');
    const dateError = document.getElementById('date-error');
    const guestError = document.getElementById('guest-error');

    const maxGuests = 4;
    let guestCount = 1; // Começa com 1 porque o primeiro convidado já está presente
    let invitationGenerated = false;
    let invitationText = '';

    // Função para atualizar a mensagem de erro de convidados
    const updateGuestError = () => {
        if (guestCount >= maxGuests) {
            guestError.style.display = 'block';
            guestError.textContent = `Limite de ${maxGuests} convidados atingido.`;
        } else {
            guestError.style.display = 'none';
        }
    };

    // Função para adicionar um novo campo de convidado
    const addGuestInput = () => {
        if (guestCount >= maxGuests) {
            updateGuestError();
            return;
        }

        const guestInputGroup = document.createElement('div');
        guestInputGroup.classList.add('input-group', 'mb-2');

        const guestInput = document.createElement('input');
        guestInput.type = 'text';
        guestInput.classList.add('form-control', 'guest-name');
        guestInput.placeholder = 'Nome do Convidado';
        guestInput.required = true;

        const appendBtn = document.createElement('button');
        appendBtn.type = 'button';
        appendBtn.classList.add('btn', 'btn-outline-secondary', 'append-btn');
        appendBtn.innerHTML = '<i class="bi bi-dash"></i>';
        appendBtn.title = 'Remover Convidado';

        appendBtn.addEventListener('click', () => {
            guestInputsDiv.removeChild(guestInputGroup);
            guestCount--;
            updateGuestError();
            // Reabilitar o botão de adicionar caso o limite foi anteriormente atingido
            const firstAddBtn = document.getElementById('add-guest-btn');
            if (firstAddBtn && firstAddBtn.disabled && guestCount < maxGuests) {
                firstAddBtn.disabled = false;
                firstAddBtn.classList.remove('disabled');
            }
        });

        guestInputGroup.appendChild(guestInput);
        guestInputGroup.appendChild(appendBtn);

        guestInputsDiv.appendChild(guestInputGroup);

        guestCount++;
        updateGuestError();

        // Se já atingiu o máximo, desativa o botão de adicionar no primeiro convidado
        if (guestCount >= maxGuests) {
            const firstAddBtn = document.getElementById('add-guest-btn');
            if (firstAddBtn) {
                firstAddBtn.disabled = true;
                firstAddBtn.classList.add('disabled');
            }
        }
    };

    // Evento para adicionar convidados via botão de adição
    const addGuestBtn = document.getElementById('add-guest-btn');
    addGuestBtn.addEventListener('click', addGuestInput);

    // Função para gerar o convite
    const generateInvite = () => {
        let isValid = true;

        // Validação da data
        if (dateInput.value === '') {
            dateInput.classList.add('is-invalid');
            dateError.style.display = 'block';
            isValid = false;
        } else {
            dateInput.classList.remove('is-invalid');
            dateError.style.display = 'none';
        }

        // Validação dos convidados
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
            return;
        }

        // Formatar data para DD/MM/AAAA
        const dateParts = dateInput.value.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        // Gerar o conteúdo do convite na página
        invitationSection.innerHTML = `
            <h2>Convite</h2>
            <p><strong>Nome do Associado:</strong> Ruy Jorge Cecim dos Santos</p>
            <p><strong>Matrícula do Sócio:</strong> 0101093</p>
            <p><strong>Data do Evento:</strong> ${formattedDate}</p>
            <p><strong>Lista de Convidados:</strong></p>
            <ul>
                ${guestNames.map(name => `<li>${name}</li>`).join('')}
            </ul>
        `;

        // Gerar o texto do convite para enviar via WhatsApp com formatação
        invitationText = `*Convite*\n\n*Nome do Associado:* Ruy Jorge Cecim dos Santos\n*Matrícula do Sócio:* 0101093\n*Data do Evento:* ${formattedDate}\n\n*Lista de Convidados:*\n${guestNames.map(name => `- ${name}`).join('\n')}`;

        invitationGenerated = true;
        sendInviteBtn.disabled = false;
    };

    // Evento para gerar convite
    generateInviteBtn.addEventListener('click', generateInvite);

    // Função para enviar o convite via WhatsApp
    const sendInvite = () => {
        if (!invitationGenerated) {
            alert('Por favor, gere o convite antes de enviar.');
            return;
        }

        const encodedText = encodeURIComponent(invitationText);
        const whatsappURL = `https://api.whatsapp.com/send?text=${encodedText}`;

        window.open(whatsappURL, '_blank');
    };

    // Evento para enviar convite
    sendInviteBtn.addEventListener('click', sendInvite);
});
