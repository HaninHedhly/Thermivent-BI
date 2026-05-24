const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./config/db');   // Assurez-vous que le chemin est correct

const app = express();

// ── Middlewares ──
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Limite pour les photos Base64
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ── Routes ──
// Important : on déclare les routes AVANT de démarrer le serveur
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.get('/', (req, res) => res.send('Thermivent BI API running'));

// ── Connexion DB + Démarrage du serveur ──
const startServer = async () => {
  try {
    await connectDB();                    // ← On attend que MongoDB soit connecté
    console.log('✅ MongoDB connecté avec succès');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur fatale lors du démarrage :', error.message);
    process.exit(1);
  }
};

// Lancer le serveur
startServer();