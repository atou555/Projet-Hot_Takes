const multer = require('multer');

// Définition des types d'images autorisés et des extensions associées
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration de Multer pour le stockage des images
const storage = multer.diskStorage({
  // Définition du dossier de destination des images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Définition du nom du fichier image
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Export de la configuration de Multer avec l'utilisation de la méthode single pour gérer l'upload d'un seul fichier image
module.exports = multer({storage: storage}).single('image');
