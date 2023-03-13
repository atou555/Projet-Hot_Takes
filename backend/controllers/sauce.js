const Sauce = require('../models/Sauce'); // import du modèle Sauce
const fs = require('fs'); // package pour interagir avec le système de fichiers

// Fonction pour créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; // On supprime l'ID envoyé par le frontend car il sera créé automatiquement par MongoDB
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // On génère l'URL de l'image à partir des informations fournies par Multer
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour modifier une sauce existante
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file // On vérifie s'il y a une nouvelle image dans la requête
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]; // On récupère le nom du fichier à supprimer
      fs.unlink(`images/${filename}`, () => { // On supprime le fichier
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Fonction pour récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour récupérer une seule sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Fonction pour ajouter ou supprimer un like/dislike
exports.likeSauce = (req, res, next) => {    
    const like = req.body.like;
    if (like === 1) { // bouton j'aime
        Sauce.updateOne({ _id: req.params.id }, { 
            $inc: { likes: 1 }, 
            $push: { usersLiked: req.body.userId }, 
            _id: req.params.id 
        })
        .then(() => res.status(200).json({ message: 'Vous aimez cette sauce' }))
        .catch(error => res.status(400).json({ error }))

    } else if (like === -1) { // bouton je n'aime pas
        Sauce.updateOne({ _id: req.params.id }, { 
            $inc: { dislikes: 1 }, 
            $push: { usersDisliked: req.body.userId }, 
            _id: req.params.id 
        })
        .then(() => res.status(200).json({ message: 'Vous n’aimez pas cette sauce' }))
        .catch(error => res.status(400).json({ error }))

    } else {    // annulation du bouton j'aime ou alors je n'aime pas
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.usersLiked.includes(req.body.userId)) {
                Sauce.updateOne({ _id: req.params.id }, { 
                    $inc: { likes: -1 },
                    $pull: { usersLiked: req.body.userId }, 
                    _id: req.params.id 
                })
                .then(() => res.status(200).json({ message: 'Vous n’aimez plus cette sauce' }))
                .catch(error => res.status(400).json({ error }))

            } else if (sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne({ _id: req.params.id }, { 
                    $inc: { dislikes: -1 }, 
                    $pull: { usersDisliked: req.body.userId }, 
                    _id: req.params.id 
                })
                .then(() => res.status(200).json({ message: 'Vous aimerez peut-être cette sauce à nouveau' }))
                .catch(error => res.status(400).json({ error }))
            }           
        })
        .catch(error => res.status(400).json({ error }))             
    }   
};