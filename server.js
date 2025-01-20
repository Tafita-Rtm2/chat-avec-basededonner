const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuration email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'niainatafita85@gmail.com',
        pass: 'tafitaniaina1206', // Remplacez par le mot de passe
    },
});

// Stockage des utilisateurs et conversations
const users = {}; // { email: { conversations: [] } }

// Inscription
app.post('/register', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email requis.' });
    }

    if (!users[email]) {
        users[email] = { conversations: [] };

        // Envoyer une notification par email
        transporter.sendMail({
            from: 'niainatafita85@gmail.com',
            to: 'niainatafita85@gmail.com',
            subject: 'Nouvel utilisateur inscrit',
            text: `Un nouvel utilisateur s'est inscrit : ${email}`,
        });

        return res.json({ success: true, message: 'Inscription réussie.' });
    } else {
        return res.status(400).json({ error: 'Cet utilisateur est déjà inscrit.' });
    }
});

// Connexion
app.post('/login', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email requis.' });
    }

    if (users[email]) {
        return res.json({ success: true, conversations: users[email].conversations });
    } else {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
});

// Chat
app.post('/chat', async (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ error: 'Email et message requis.' });
    }

    if (!users[email]) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    try {
        const apiResponse = await fetch(
            `https://yt-video-production.up.railway.app/gpt4-omni?ask=${encodeURIComponent(message)}&userid=1`
        );
        const data = await apiResponse.json();

        const botResponse = data.response || 'Erreur lors de la réponse du bot.';
        users[email].conversations.push({ author: 'user', message });
        users[email].conversations.push({ author: 'bot', message: botResponse });

        return res.json({ response: botResponse });
    } catch (error) {
        console.error('Erreur API:', error);
        return res.status(500).json({ error: 'Erreur de communication avec l\'API.' });
    }
});

// Serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
