document.addEventListener('DOMContentLoaded', () => {
    const addGuestBtn = document.getElementById('add-guest-btn');
    const guestInputsDiv = document.getElementById('guest-inputs');
    const generateInviteBtn = document.getElementById('generate-invite-btn');
    const sendInviteBtn = document.getElementById('send-invite-btn');
    const invitationSection = document.getElementById('invitation-section');
    const dateInput = document.getElementById('event-date');
    const dateError = dateInput.nextElementSibling;
    const guestError = document.getElementById('guest-error');
    const formattedDateSpan = document.getElementById('formatted-date');
    const guestList = document.getElementById('guest-list');

    let guestCount = 0;
    const maxGuests = 4;
    let invitationGenerated = false;
    let invitationText = '';

    // Função para adicionar um campo de convidado
    const addGuestInput = () => {
        if (guestCount >= maxGuests) {
            guestError.style.display = 'block';
            return;
        }

        const guestDiv = document.createElement('div');
        guestDiv.classList.add('input-group', 'mb-2');

        const guestInput = document.createElement('input');
        guestInput.type = 'text';
        guestInput.classList.add('form-control', 'guest-name');
        guestInput.placeholder = 'Nome do Convidado';
        guestInput.required = true;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.classList.add('btn', 'btn-danger');
        removeBtn.innerHTML = '<i class="bi bi-trash"></i>';
        removeBtn.addEventListener('click', () => {
            guestInputsDiv.removeChild(guestDiv);
            guestCount--;
            guestError.style.display = guestCount >= maxGuests ? 'block' : 'none';
        });

        guestDiv.appendChild(guestInput);
        guestDiv.appendChild(removeBtn);
        guestInputsDiv.appendChild(guestDiv);

        guestCount++;
        guestError.style.display = guestCount >= maxGuests ? 'block' : 'none';
    };

    // Adicionar o primeiro campo de convidado ao carregar a página
    addGuestInput();

    // Evento para adicionar mais convidados
    addGuestBtn.addEventListener('click', addGuestInput);

    // Função para gerar o convite
    generateInviteBtn.addEventListener('click', () => {
        // Resetar mensagens de erro
        let isValid = true;
        if (dateInput.value === '') {
            dateInput.classList.add('is-invalid');
            isValid = false;
        } else {
            dateInput.classList.remove('is-invalid');
        }

        const guestNameInputs = document.querySelectorAll('.guest-name');
        const guestNames = [];
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
            guestError.textContent = 'Por favor, adicione pelo menos um convidado.';
            guestError.style.display = 'block';
            isValid = false;
        } else {
            guestError.style.display = 'none';
        }

        if (!isValid) return;

        // Formatar a data para DD/MM/AAAA
        const dateParts = dateInput.value.split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        formattedDateSpan.textContent = formattedDate;

        // Atualizar a lista de convidados na seção de convite
        guestList.innerHTML = '';
        guestNames.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            guestList.appendChild(li);
        });

        // Criar o texto do convite com formatação para WhatsApp
        invitationText = `*Convite*\n\n*Nome do Associado:* Ruy Jorge Cecim Santos\n*Matrícula do Sócio:* 0101093\n*Data do Evento:* ${formattedDate}\n\n*Lista de Convidados:*\n`;
        guestNames.forEach(name => {
            invitationText += `- ${name}\n`;
        });

        // Mostrar a seção do convite
        invitationSection.scrollIntoView({ behavior: 'smooth' });

        invitationGenerated = true;
        sendInviteBtn.disabled = false;
    });

    // Função para enviar o convite via WhatsApp
    sendInviteBtn.addEventListener('click', () => {
        if (!invitationGenerated) {
            alert('Por favor, gere o convite antes de enviar.');
            return;
        }

        const encodedText = encodeURIComponent(invitationText);
        const whatsappURL = `https://api.whatsapp.com/send?text=${encodedText}`;
        window.open(whatsappURL, '_blank');
    });
});
