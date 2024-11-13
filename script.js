document.addEventListener('DOMContentLoaded', () => {
    const addGuestBtn = document.getElementById('add-guest-btn');
    const guestInputsDiv = document.getElementById('guest-inputs');
    const generateInviteBtn = document.getElementById('generate-invite-btn');
    const sendInviteBtn = document.getElementById('send-invite-btn');
    const invitationSection = document.querySelector('section');
    const dateInput = document.getElementById('event-date');
    const dateError = document.getElementById('date-error');
    const guestError = document.getElementById('guest-error');
    const formattedDateSpan = document.getElementById('formatted-date');
    const guestListUl = document.getElementById('guest-list');

    const maxGuests = 4;
    let guestCount = 1; // Inicia com 1 pois o primeiro convidado já está presente
    let invitationGenerated = false;
    let invitationText = '';

    // Função para atualizar a mensagem de erro de convidados
    const updateGuestError = () => {
        if (guestCount >= maxGuests) {
            guestError.style.display = 'block';
            guestError.textContent = `Limite de ${maxGuests} convidados atingido.`;
            addGuestBtn.disabled = true;
        } else {
            guestError.style.display = 'none';
            addGuestBtn.disabled = false;
        }
    };

    // Função para adicionar um novo campo de convidado
    const addGuestInput = () => {
        if (guestCount >= maxGuests) {
            updateGuestError();
            return;
        }

        const guestInputGroup = document.createElement('div');
        guestInputGroup.classList.add('input-group', 'mb-3');

        const guestInput = document.createElement('input');
        guestInput.type = 'text';
        guestInput.classList.add('form-control', 'guest-name');
        guestInput.placeholder = 'Nome do Convidado';
        guestInput.required = true;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.classList.add('btn', 'btn-outline-secondary');
        removeBtn.title = 'Remover Convidado';
        removeBtn.innerHTML = '<i class="bi bi-dash"></i>';

        removeBtn.addEventListener('click', () => {
            guestInputsDiv.removeChild(guestInputGroup);
            guestCount--;
            updateGuestError();
        });

        guestInputGroup.appendChild(guestInput);
        guestInputGroup.appendChild(removeBtn);

        guestInputsDiv.appendChild(guestInputGroup);

        guestCount++;
        updateGuestError();
    };

    // Evento para adicionar convidados via botão de adição
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
        formattedDateSpan.textContent = formattedDate;

        // Gerar a lista de convidados na página
        guestListUl.innerHTML = '';
        guestNames.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            guestListUl.appendChild(li);
        });

        // Gerar o texto do convite para enviar via WhatsApp com formatação
        invitationText = `*Convite*\n\n*Nome do Associado:* Ruy Jorge Cecim dos Santos\n*Matrícula do Sócio:* 0101093\n*Data do Evento:* ${formattedDate}\n\n*Lista de Convidados:*\n${guestNames.map(name => `- ${name}`).join('\n')}`;

        invitationGenerated = true;
        sendInviteBtn.disabled = false;

        // Scroll para a seção do convite gerado
        invitationSection.scrollIntoView({ behavior: 'smooth' });
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

    // Inicializar com o primeiro campo de convidado (fixo)
    // O primeiro campo já está presente no HTML e não deve ser removido
    // Apenas adicionamos um listener para o botão bi-plus do primeiro campo
});