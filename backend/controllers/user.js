const bcrypt = require('bcrypt'); // package de chiffrement
const User = require('../models/User'); // modele user
const jwt = require('jsonwebtoken'); // package de génération de token
const emailValidator = require('email-validator'); // package de validation d'email
const Joi = require('joi'); // package de validation de données

// Création d'un schema de validation de mot de passe
const passwordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'))
    .required()
    .messages({
      'string.base': 'Le mot de passe doit être une chaîne de caractères',
      'string.empty': 'Le mot de passe ne doit pas être vide',
      'string.min': 'Le mot de passe doit contenir au moins {{#limit}} caractères',
      'string.max': 'Le mot de passe ne doit pas contenir plus de {{#limit}} caractères',
      'string.pattern.base': 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre',
      'any.required': 'Le mot de passe est requis'
    })
});

// Fonction d'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  if (!emailValidator.validate(req.body.email)) { // on vérifie que l'adresse email est valide
    return res.status(400).json({ error: 'Adresse email non valide' });
  }
  if (!passwordSchema.validate(req.body.password)) { // on vérifie que le mot de passe est valide selon le schéma de validation défini
    return res.status(400).json({ error: 'Mot de passe non valide' });
  }
  bcrypt.hash(req.body.password, 10) // on chiffre le mot de passe avec un sel de 10 caractères
    .then(hash => {
      const user = new User({ // on crée un nouvel utilisateur avec l'adresse email et le mot de passe haché
        email: req.body.email,
        password: hash
      });
      user.save() // on enregistre l'utilisateur dans la base de données
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Fonction de connexion d'un utilisateur existant
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // on cherche l'utilisateur correspondant à l'adresse email fournie
    .then(user => {
      if (!user) { // si l'utilisateur n'est pas trouvé, on renvoie une erreur 401
        return res.status(401).json({ error: 'Utilisateur non trouvé' });
      }
      bcrypt.compare(req.body.password, user.password) // on compare le mot de passe fourni avec le mot de passe enregistré dans la base de données
        .then(valid => {
          if (!valid) { // si les mots de passe ne correspondent pas, on renvoie une erreur 401
            return res.status(401).json({ error: 'Mot de passe incorrect' });
          }
          res.status(200).json({ // si la comparaison est valide, on envoie une réponse 200 avec un token d'authentification pour le client
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

   
