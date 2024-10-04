document.addEventListener('DOMContentLoaded', function() {
    const addGuestBtn = document.getElementById('add-guest-btn');
    const guestInputsDiv = document.getElementById('guest-inputs');
    const generateInviteBtn = document.getElementById('generate-invite-btn');
    const sendInviteBtn = document.getElementById('send-invite-btn');
    const invitationSection = document.getElementById('invitation-section');
    const dateInput = document.getElementById('event-date');
    const dateError = document.getElementById('date-error');
    const guestError = document.getElementById('guest-error');

    let guestCount = 0;
    let invitationGenerated = false;
    let invitationText = '';

    function updateGuestError() {
        if (guestCount >= 10) {
            guestError.textContent = 'Limite de 10 convidados atingido.';
            guestError.style.display = 'block';
        } else {
            guestError.style.display = 'none';
        }
    }

    function addGuestInput() {
        if (guestCount >= 10) {
            updateGuestError();
            return;
        }

        const guestInputDiv = document.createElement('div');
        guestInputDiv.classList.add('guest-input');

        const guestInput = document.createElement('input');
        guestInput.type = 'text';
        guestInput.classList.add('guest-name');
        guestInput.placeholder = 'Nome do Convidado';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.classList.add('remove-guest-btn');
        // Ícone de lixeira
        removeBtn.innerHTML = `
            <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5l1 9h8l1-9M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M1 5h14" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        removeBtn.addEventListener('click', function() {
            guestInputsDiv.removeChild(guestInputDiv);
            guestCount--;
            updateGuestError();
        });

        guestInputDiv.appendChild(guestInput);
        guestInputDiv.appendChild(removeBtn);

        guestInputsDiv.appendChild(guestInputDiv);

        guestCount++;
        updateGuestError();
    }

    addGuestBtn.addEventListener('click', addGuestInput);

    generateInviteBtn.addEventListener('click', function() {
        let isValid = true;

        // Validação da data
        if (dateInput.value === '') {
            dateError.style.display = 'block';
            isValid = false;
        } else {
            dateError.style.display = 'none';
        }

        // Validação dos convidados
        const guestNames = [];
        const guestNameInputs = document.querySelectorAll('.guest-name');
        guestNameInputs.forEach(function(input) {
            if (input.value.trim() === '') {
                isValid = false;
                input.classList.add('input-error');
            } else {
                input.classList.remove('input-error');
                guestNames.push(input.value.trim());
            }
        });

        if (guestNames.length === 0) {
            guestError.textContent = 'Por favor, adicione pelo menos um convidado.';
            guestError.style.display = 'block';
            isValid = false;
        } else {
            guestError.style.display = 'none';
        }

        if (!isValid) {
            return;
        }

        // Gerar Convite
        invitationSection.innerHTML = '';
        const inviteTitle = document.createElement('h2');
        inviteTitle.textContent = 'Convite';
        invitationSection.appendChild(inviteTitle);

        const memberName = document.createElement('p');
        memberName.innerHTML = '<strong>Nome do Associado:</strong> Ruy Jorge Cecim Santos';
        invitationSection.appendChild(memberName);

        const memberNumber = document.createElement('p');
        memberNumber.innerHTML = '<strong>Matrícula do Sócio:</strong> 0101093';
        invitationSection.appendChild(memberNumber);

        // Formatar data para DD/MM/AAAA
        const dateParts = dateInput.value.split('-');
        const formattedDate = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];

        const eventDate = document.createElement('p');
        eventDate.innerHTML = '<strong>Data do Evento:</strong> ' + formattedDate;
        invitationSection.appendChild(eventDate);

        const guestListTitle = document.createElement('p');
        guestListTitle.innerHTML = '<strong>Lista de Convidados:</strong>';
        invitationSection.appendChild(guestListTitle);

        const guestList = document.createElement('ul');
        guestNames.forEach(function(name) {
            const listItem = document.createElement('li');
            listItem.textContent = name;
            guestList.appendChild(listItem);
        });
        invitationSection.appendChild(guestList);

        // Criar texto do convite para enviar via WhatsApp com formatação
        invitationText = `*Convite*\n\n*Nome do Associado:* Ruy Jorge Cecim Santos\n*Matrícula do Sócio:* 0101093\n*Data do Evento:* ${formattedDate}\n\n*Lista de Convidados:*\n`;
        guestNames.forEach(function(name) {
            invitationText += `- ${name}\n`;
        });

        invitationGenerated = true;
        sendInviteBtn.disabled = false;
    });

    sendInviteBtn.addEventListener('click', function() {
        if (!invitationGenerated) {
            alert('Por favor, gere o convite antes de enviar.');
            return;
        }

        // Codificar o texto do convite para URI
        const encodedText = encodeURIComponent(invitationText);

        // URL do WhatsApp
        const whatsappURL = `https://api.whatsapp.com/send?text=${encodedText}`;

        // Abrir o WhatsApp em uma nova janela
        window.open(whatsappURL, '_blank');
    });

    // Desabilitar o botão "Enviar Convite" inicialmente
    sendInviteBtn.disabled = true;

    // Adicionar primeiro campo de convidado ao carregar a página
    addGuestInput();
});
