// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Charger les variables d'env (.env en local / Render en prod)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// CORS → autoriser ton site Vercel à appeler Render
app.use(cors({
    origin: 'https://portfolio-snowgous-projects.vercel.app', // ton frontend Vercel
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'portfolio',
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Schéma + Modèle
const Contact = mongoose.model('Contact', new mongoose.Schema({
    name: String,
    email: String,
    message: String,
}));

// Route API POST
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

// Lancement du serveur sur le port géré par Render
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
