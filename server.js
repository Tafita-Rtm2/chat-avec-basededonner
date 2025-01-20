const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

// Simulated database
let users = [];
if (fs.existsSync('./database.json')) {
    users = JSON.parse(fs.readFileSync('./database.json'));
}

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'niainatafita85@gmail.com', pass: 'tafitaniaina1206' }
});

// Registration
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (users.find(user => user.email === email)) return res.status(400).send('Email déjà utilisé.');

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword, conversations: [] });
    fs.writeFileSync('./database.json', JSON.stringify(users));

    await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: 'niainatafita85@gmail.com',
        subject: 'Nouvel utilisateur inscrit',
        text: `Email: ${email}`
    });

    res.send('Inscription réussie.');
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send('Email ou mot de passe incorrect.');
    }

    res.send('Connexion réussie.');
});

// Chat
app.post('/chat', async (req, res) => {
    const { email, message } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) return res.status(400).send('Utilisateur non trouvé.');

    const response = await fetch(`https://yt-video-production.up.railway.app/gpt4-omni?ask=${encodeURIComponent(message)}&userid=${email}`);
    const data = await response.json();

    user.conversations.push({ from: 'user', message });
    user.conversations.push({ from: 'bot', message: data.response });
    fs.writeFileSync('./database.json', JSON.stringify(users));

    res.send({ response: data.response });
});

app.listen(3000, () => console.log('Serveur démarré sur http://localhost:3000'));
