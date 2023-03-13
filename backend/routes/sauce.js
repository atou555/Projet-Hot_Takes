const express = require('express');
const router = express.Router(); // Création d'un router Express

const sauceCtrl = require('../controllers/sauce'); // Importation du contrôleur des sauces
const auth = require('../middleware/auth'); // Middleware qui permet d'authentifier les pages de l'application
const multer = require('../middleware/multer-config'); // Middleware qui définit la destination et le nom de fichier des images

// Définition des routes avec leur fonction de contrôle, leur middleware et leur méthode HTTP associée
router.post('/', auth, multer, sauceCtrl.createSauce); // Route pour créer une nouvelle sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Route pour modifier une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Route pour supprimer une sauce existante
router.post('/:id/like', auth, sauceCtrl.likeSauce); // Route pour ajouter/supprimer un like/dislike

router.get('/', auth, sauceCtrl.getAllSauces); // Route pour récupérer toutes les sauces
router.get('/:id', auth, sauceCtrl.getOneSauce); // Route pour récupérer une seule sauce

module.exports = router; // Exportation du router contenant les routes définies
