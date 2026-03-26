const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const notificationRoutes = require('./routes/notificationRoutes');
const app = express();

// ── Middlewares ──
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
// Limite augmentée pour les photos Base64
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ── Routes ──
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => res.send('Thermivent BI API running'));

// ── Connexion DB + Démarrage ──
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));