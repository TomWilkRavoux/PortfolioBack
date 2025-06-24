// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware CORS — autorise uniquement le frontend déployé sur Vercel
app.use(cors({
    origin: 'https://portfolio-snowgous-projects.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'portfolio',
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Modèle Mongoose pour les messages de contact
const Contact = mongoose.model('Contact', new mongoose.Schema({
    name: String,
    email: String,
    message: String,
}));

// Route de ping (pour réveiller le backend depuis le frontend)
app.get('/api/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});

// Route POST /api/contact — enregistrement du formulaire
app.post('/api/contact', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(200).json({ success: true, message: 'Message saved successfully.' });
    } catch (err) {
        console.error('❌ Error saving contact:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Lancer le serveur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
