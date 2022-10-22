const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const path = require("path");
const { router: user, server, app } = require("./controller/user");
const XLSX = require("xlsx");

const port = 3000;
const contacts = XLSX.utils.sheet_to_json(XLSX.readFile(`temp/contact.xlsx`).Sheets["Sheet1"]);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);

//@desc routes
app.get("/", async (req, res) => {
  res.render("home", {
    title: "HOME",
    layout: "layout/main-layout",
  });
});

app.use("/user", user);

app.use((req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

console.log(contacts);

server.listen(process.env.PORT || port, () => {
  console.log(`Express server listening on http://localhost:${port}/`);
});
