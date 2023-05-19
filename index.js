const express = require("express");
const sockeio = require("socket.io");

const path = require("path");

const http = require("http");
const session = require("express-session");
const { log } = require("console");

const app = express();

app.use(express.static(path.join(__dirname, "puclic")));

const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});

const server = http.createServer(app);
const io = sockeio(server);

app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
  console.log("a user connected");
  // get session id from socket
  const session = socket.request.session;
  const sessionId = session.id;
  socket.join(sessionId);
  io.to(sessionId).emit("Chat Message:", {
    sender: "bot",
    message: "Welcome to the chatBot, say hi to the bot",
  });
  let progress = 0;
  socket.on("Chat Message", (message) => {
    io.to(sessionId).emit("Chat Message", { sender: "User", message });
    switch (progress) {
      case 0:
        io.to(sessionId).emit("Chat Message", {
          sender: "bot",
          message: `Press any of the following keys: <br>
                1. Place Order <br>
                2. Checkout Order <br>
                3. Order History <br>
                4. Cancel Order <br>
                `,
        });
        progress = 1;
        break;
      case 1:
        let botresponse = "";
        if (message === "1") {
          botresponse = "You selected option 1<br> Here is the menu";
        } else if (message === "2") {
          botresponse = "You selected option 2 <br> Checkout your order";
        } else if (message === "3") {
          botresponse = "You selected option 3 <br> Here is your order history";
        } else if (message === "4") {
          botresponse = "You selected option 4 <br> Order canceled";
        } else {
            botresponse = "Invalid option <br> Press any of the above options.";
            progress = 1;
            io.to(sessionId).emit('Chat Message', {sender: 'bot', message: botresponse});
            return
        }
        io.to(sessionId).emit('Chat Message', {sender:'bot', message: botresponse});
        progress = 0;
        break;
    }
  });
});

server.listen(3000, () => {
  console.log("listening on * 3000");
});
