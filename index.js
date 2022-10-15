const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const ejs = require("express");
const path = require("path");
const user = require("./controller/user");

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);

app.get("/", (req, res) => {
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

app.listen(process.env.PORT || port, () => {
  console.log(`Express server listening on http://localhost:${port}/`);
});
