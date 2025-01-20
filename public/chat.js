const chatMessages = document.querySelector('#chat-messages');
const chatInput = document.querySelector('#chat-input');
const sendBtn = document.querySelector('#send-btn');

sendBtn.addEventListener('click', async () => {
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage('user', message);
    chatInput.value = '';

    const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    addMessage('bot', data.response || 'Pas de réponse.');
});

function addMessage(author, text) {
    const msg = document.createElement('div');
    msg.classList.add('message', author);
    msg.innerHTML = `
        <img src="images/${author}.jpg" alt="${author}">
        <div class="text">${text}</div>
    `;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
