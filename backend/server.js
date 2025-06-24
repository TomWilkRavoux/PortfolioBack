// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Charger les variables d'environnement (.env en local ou Render en prod)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// CORS → autoriser le frontend Vercel à accéder à l'API Render
app.use(cors({
    origin: 'https://portfolio-snowgous-projects.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'portfolio',
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Définition du modèle Contact
const Contact = mongoose.model('Contact', new mongoose.Schema({
    name: String,
    email: String,
    message: String,
}));

// Route POST /api/contact
app.post('/api/contact', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(200).json({ success: true, message: 'Message saved successfully.' });
    } catch (err) {
        console.error('Error saving contact:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.get('/api/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});

// Lancer le serveur (⚠️ obligatoire pour Render)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
