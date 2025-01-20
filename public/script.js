document.querySelector('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (data.success) {
            localStorage.setItem('userEmail', email);
            document.querySelector('#login-container').style.display = 'none';
            document.querySelector('#chat-container').style.display = 'block';
        } else {
            alert('Erreur : ' + data.message);
        }
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
    }
});

const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('#chat-messages');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = document.querySelector('#chat-input').value;
    const email = localStorage.getItem('userEmail');

    if (!message || !email) return;

    addMessage('user', message);
    document.querySelector('#chat-input').value = '';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, message }),
        });

        const data = await response.json();
        if (data.response) {
            addMessage('bot', data.response);
        } else {
            addMessage('bot', 'Erreur lors de la réponse du bot.');
        }
    } catch (error) {
        console.error('Erreur de communication avec le bot :', error);
        addMessage('bot', 'Erreur de communication.');
    }
});

function addMessage(author, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', author);

    messageDiv.innerHTML = `
        <img src="${author === 'user' ? 'user.jpg' : 'robot.jpg'}" alt="${author}">
        <div class="text">${message}</div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
