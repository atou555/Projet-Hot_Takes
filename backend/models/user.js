const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Adresse email unique requise
  password: { type: String, required: true } // Mot de passe requis
});

userSchema.plugin(uniqueValidator); // Utilisation du module mongoose-unique-validator pour garantir l'unicité de l'adresse email

module.exports = mongoose.model('User', userSchema); // Exportation du modèle User contenant le schéma utilisateur.


