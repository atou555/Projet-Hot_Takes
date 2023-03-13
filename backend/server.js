const http = require('http');
const app = require('./app');


// Normalise le port en nombre entier, en chaîne de caractères ou en faux
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Définit le port de l'application
const port = normalizePort(process.env.PORT ||'3000');
app.set('port', port);

// Gère les erreurs d'écoute du serveur HTTP
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Crée le serveur HTTP
const server = http.createServer(app);

// Écoute les événements "error" et "listening" du serveur HTTP
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Met le serveur en écoute sur le port spécifié
server.listen(port);
