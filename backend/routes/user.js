const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // package pour prévenir les attaques par force brute
const userCtrl = require('../controllers/user'); // import des fonctions du controleur user

const passLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // Temps défini (en minutes) pour tester l'application
  max: 3 // essais max par adresse IP
});

// Route POST pour créer un compte utilisateur ou se connecter (envoyé depuis le frontend)
router.post('/signup', userCtrl.signup);
router.post('/login', passLimiter, userCtrl.login);

// Export du router
module.exports = router;
