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

io.on("connection", (socket) => {
  console.log('user connected');
  socket.on('message', (message) => {
    console.log(message);
    socket.send(message);
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

app.get('/rest/board', boardModule.getBoard);
app.post('/rest/board', boardModule.createCard);

httpServer.listen(1337, () => console.log('Listening on :1337'));
