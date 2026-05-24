const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,   // 30 secondes pour se connecter (recommandé)
      socketTimeoutMS: 45000,            // 45 secondes pour les opérations
      // family: 4,                      // Décommentez si vous avez des problèmes IPv6
    });

    console.log("✅ MongoDB connecté avec succès");
    console.log("État de la connexion :", mongoose.connection.readyState); // 1 = connecté
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error.message);
    process.exit(1); // Arrête le serveur si la connexion échoue
  }
};

module.exports = connectDB;