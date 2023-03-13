const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // on récupère le token d'authentification de l'utilisateur, envoyé dans les headers de la requête
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // on vérifie la validité du token en le décodant avec la clé secrète
       const userId = decodedToken.userId; // on extrait l'ID de l'utilisateur du token décodé
       req.auth = {
           userId: userId // on stocke l'ID de l'utilisateur dans la propriété "auth" de l'objet "req" pour le récupérer dans les autres middlewares
       };
	next(); // on appelle le middleware suivant
   } catch(error) {
       res.status(401).json({ error }); // en cas d'erreur, on retourne une erreur d'authentification (401)
   }
};
