require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// Connexion à MongoDB
mongoose
  .connect(process.env.DB_CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS - partage de ressources entre serveurs
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(bodyParser.json()); // Middleware pour parser le body des requêtes en JSON

app.use(mongoSanitize()); // Middleware pour prévenir les injections de code
app.use(helmet()); // Middleware pour sécuriser l'application avec des en-têtes HTTP
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// Limite le nombre de tentatives de connexion
const passLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // Temps défini (en minutes) pour tester l'application
  max: 3 // essais max par adresse IP
});

app.use('/images', express.static(path.join(__dirname, 'images'))); // Middleware pour servir les fichiers statiques des images
app.use('/api/sauces', saucesRoutes); // Middleware pour les routes liées aux sauces
app.use('/api/auth', userRoutes); // Middleware pour les routes liées à l'authentification
app.post('/api/auth/login', passLimiter); // Limite le nombre de tentatives de connexion

// Export de l'application
module.exports = app;
