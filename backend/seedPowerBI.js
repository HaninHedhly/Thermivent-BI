const mongoose = require('mongoose');
require('dotenv').config();

const Dashboard = require('./models/Dashboard');
const Rapport   = require('./models/Rapport');
const User      = require('./models/User');

const seedPowerBI = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connecté');

    // Récupérer l'admin pour l'idUtilisateur
    const admin = await User.findOne({ role: 'Admin' });
    if (!admin) {
      console.error('❌ Aucun admin trouvé. Lance d\'abord: node seed.js');
      process.exit(1);
    }

    // ── Supprimer les anciens ──────────────────────────────────────
    await Dashboard.deleteMany({});
    await Rapport.deleteMany({});
    console.log('✓ Anciens dashboards et rapports supprimés');

    // ── Créer les Dashboards ───────────────────────────────────────
    // ⚠️  Remplace les lienPowerBI par tes vraies URLs Power BI
    const dashboards = await Dashboard.insertMany([
      {
        type:        'Ventes',
        titre:       'Analyse des Ventes',
        lienPowerBI: 'https://app.powerbi.com/view?r=eyJrIjoiZGI0YTRmMDktNjFkNS00NmZhLTk4MTktNjIyNzY4YTA2OGNkIiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9',
        idUtilisateur: admin._id,
      },
      {
        type:        'Achats',
        titre:       'Analyse des Achats',
        lienPowerBI: 'https://app.powerbi.com/view?r=eyJrIjoiYTRhNzJmNDMtNGZlYS00YTJhLTgzMTgtZTFmZmY5OWE4OGUwIiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9',
        idUtilisateur: admin._id,
      },
      {
        type:        'Stock',
        titre:       'Analyse de Stock',
        lienPowerBI: 'https://app.powerbi.com/view?r=eyJrIjoiYTdjOWI3ZDAtOTZiMS00MWQzLTk4OGEtNDBjNTNkMTEyNDdkIiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9',
        idUtilisateur: admin._id,
      },
      {
        type:        'Production',
        titre:       'Analyse de Production',
        lienPowerBI: 'https://app.powerbi.com/view?r=eyJrIjoiYjllMzI5MTktZDcxZC00NWJkLTgxMjQtYTdjMTAwNGJkZjhiIiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9',
        idUtilisateur: admin._id,
      },
    ]);
    console.log(`✓ ${dashboards.length} dashboards créés`);

    // ── Créer les Rapports ─────────────────────────────────────────
    const rapports = await Rapport.insertMany([
      {
        type:        'Ventes',
        titre:       'Rapport de Ventes',
        lienPowerBI: 'https://app.powerbi.com/view?r=eyJrIjoiNGE0NGNiMDAtOGQ1YS00Mzc0LTg0ZGQtZjZlOGRjYTYzNjBlIiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9',
        idUtilisateur: admin._id,
      },
      {
        type:        'Achats',
        titre:       "Rapport d'Achats",
        lienPowerBI: 'https://app.powerbi.com/view?r=eyJrIjoiNmZiYTUzZjYtMzM0YS00MzkxLWI0NzItNTRmZDcwM2UxOTg0IiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9',
        idUtilisateur: admin._id,
      },
      {
        type:        'Stock',
        titre:       'Rapport de Stock',
        lienPowerBI: 'https://app.powerbi.com/view?r=eyJrIjoiZjhmODE3NjQtYmYxOS00NDcxLWFjNTctZjg3OGFjMjU3NjVkIiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9',
        idUtilisateur: admin._id,
      },
      {
        type:        'Production',
        titre:       'Rapport de Production',
        lienPowerBI: 'https://app.powerbi.com/view?r=eyJrIjoiNGNlZDMwOWUtM2Y4YS00YjVlLWEzN2QtNjQyMmMxZTIxYTY1IiwidCI6IjNlZDQ4MDA3LTIzYmEtNDdhNi1iNDRjLTMyNmRlYmJiZDMxZCJ9',
        idUtilisateur: admin._id,
      },
    ]);
    console.log(`✓ ${rapports.length} rapports créés`);

    console.log('\n✅ Seed Power BI terminé avec succès !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Dashboards : Ventes, Achats, Stock, Production');
    console.log('  Rapports   : Ventes, Achats, Stock, Production');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur seedPowerBI :', err.message);
    process.exit(1);
  }
};

seedPowerBI();