const { loadContact } = require("./utils/contacts");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const path = require("path");
const user = require("./controller/user");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const upload = multer({ dest: "./temp" });

const port = 3000;
const app = express();
const client = new Client();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);

client.initialize();

//@desc routes
app.get("/", async (req, res) => {
  res.render("home", {
    title: "HOME",
    layout: "layout/main-layout",
  });
});

app.use("/user", user);

app.post("/send", upload.single("contacts-list"), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  contacts = loadContact(req.file.filename);
  contacts.forEach((contact) => {
    client.sendMessage(`${contact.nohp}@c.us`, `Nama anda adalah : ${contact.nama}, ${req.body.message}`);
  });
  res.redirect("/user/send");
  console.log(req.body.message);
});

app.use((req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

//@desc socket io and whatsapp web
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("message", "Connecting..");

  client.once("qr", (qr) => {
    console.log("QR RECEIVED");
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit("qr", url);
      socket.emit("message", "QR Code received");
    });
  });

  client.on("ready", () => {
    socket.emit("ready", "Whatsapp is ready!");
    socket.emit("message", "Whatsapp is ready!");
  });

  client.on("authenticated", () => {
    socket.emit("authenticated", "Whatsapp is authenticated!");
    socket.emit("message", "Whatsapp is authenticated!");
    console.log("AUTHENTICATED");
  });

  client.on("auth_failure", function (session) {
    socket.emit("message", "Auth failure, restarting...");
  });

  client.on("disconnected", (reason) => {
    socket.emit("message", "Whatsapp is disconnected!");
    client.destroy();
    client.initialize();
  });
});

server.listen(process.env.PORT || port, () => {
  console.log(`Express server listening on http://localhost:${port}/`);
});
