const express = require('express');
const app = express();
const cors = require('cors');
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const initMongo = require('./other/mongo').initMongo;
initMongo().catch(console.dir);

io.on("connection", (socket) => {
  console.log('user connected');
  socket.on('message', (message) => {
    console.log(message);
    socket.send(message);
  });
});

app.get('/',);

httpServer.listen(1337, () => console.log('Listening on :1337'));
