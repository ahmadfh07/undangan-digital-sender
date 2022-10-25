require("../utils/dbConnect");
const Reciever = require("../models/reciever");
const fs = require("fs");
const express = require("express");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const XLSX = require("xlsx");

const app = express();
const client = new Client();
const server = http.createServer(app);
const io = new Server(server);
const router = express.Router();
const upload = multer({ dest: "./temp" });

client.initialize();

router.get("/", (req, res) => {
  res.send("User home page");
});

router.get("/send", (req, res) => {
  res.render("send", {
    title: "Kirim PANGANAN",
    layout: "layout/main-layout",
  });
});

router.post("/send", upload.single("contacts-list"), function (req, res, next) {
  console.log(req.file);
  console.log(req.body.message);
  const contacts = XLSX.utils.sheet_to_json(XLSX.readFile(`temp/${req.file.filename}`).Sheets["Sheet1"]);
  contacts.forEach((contact) => {
    client.sendMessage(`${contact.NoHp}@c.us`, `Nama anda adalah : ${contact.Nama}, ${req.body.message}`);
    Reciever.insertMany({ Nama: contact.Nama, NoHp: contact.NoHp }, (err, result) => {
      console.log(result);
    });
  });
  fs.unlinkSync(`temp/${req.file.filename}`);
  res.render("send", {
    title: "Kirim PANGANAN",
    layout: "layout/main-layout",
  });
});

router.get("/logout", (req, res) => {
  client.logout();
  client.destroy();
  client.initialize();
  res.send("proses logout");
});

io.on("connection", (socket) => {
  // client.initialize();
  console.log("a user connected");
  socket.on("disconnect", (reason) => {
    // client.logout();
    console.log(`Client disconnected, reason : ${reason}`);
  });

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

module.exports = { router, server, app };
