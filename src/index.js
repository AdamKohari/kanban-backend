const express = require('express');
const app = express();
const cors = require('cors');
const httpServer = require("http").createServer(app);

app.use(cors());
app.use(express.json());

// MONGO INIT
const initMongo = require('./other/mongo').initMongo;
initMongo().catch(console.dir);

// SOCKET INIT
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const moveCard = require('./other/cardMove').moveCard;
io.on("connection", (socket) => {
  socket.on('message', (packet) => {

    if (packet.messageType === 'CONNECT') {
      console.log('Connected with token: ' + packet.message);
      // store the socket associated with a connected user
      global.authedSessions.find(session => session.authToken === packet.message)['socket'] = socket;
    }

    if (packet.messageType === 'CARD_MOVED') {
      moveCard(packet.message);
    }
  });
});

// AUTHED USERS LIST
global.authedSessions = [];

// ENDPOINTS IMPORT
const loginModule = require('./endpoints/login');
const registerModule = require('./endpoints/register');
const projectsModule = require('./endpoints/projects');
const boardModule = require('./endpoints/projectBoard');

// ENDPOINTS ROUTING
app.post('/rest/login', loginModule.login);
app.post('/rest/register', registerModule.register);

app.get('/rest/projects', projectsModule.getProjects);
app.post('/rest/projects', projectsModule.createProject);
app.post('/rest/projects/checkMail', projectsModule.checkEmail);

app.get('/rest/board', boardModule.getBoard);
app.post('/rest/board', boardModule.createCard);

httpServer.listen(1337, () => console.log('Listening on :1337'));
