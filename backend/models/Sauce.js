const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({ // définition du schéma du modèle Sauce
    name: { type: String, required: true }, // nom de la sauce (obligatoire)
    manufacturer: { type: String, required: true }, // fabricant de la sauce (obligatoire)
    description: { type: String, required: true }, // description de la sauce (obligatoire)
    mainPepper: { type: String, required: true }, // principal ingrédient de la sauce (obligatoire)
    imageUrl: { type: String  }, // URL de l'image de la sauce
    heat: { type: Number }, // nombre de piments de la sauce (de 1 à 10)
    likes: { type: Number, default: 0}, // nombre de likes de la sauce (par défaut : 0)
    dislikes: { type: Number, default: 0 }, // nombre de dislikes de la sauce (par défaut : 0)
    userId: { type: String }, // identifiant de l'utilisateur ayant créé la sauce
    usersLiked: [String], // tableau d'identifiants des utilisateurs ayant aimé la sauce
    usersDisliked: [String] , // tableau d'identifiants des utilisateurs ayant détesté la sauce
});

module.exports = mongoose.model('Sauce', sauceSchema); // export du modèle 'Sauce' avec le schéma défini ci-dessus
