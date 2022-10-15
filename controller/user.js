const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User home page");
});

router.get("/send", (req, res) => {
  res.render("index", {
    title: "Kirim Undangan",
  });
});

module.exports = router;
