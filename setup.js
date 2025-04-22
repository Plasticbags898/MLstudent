const express = require("express");
const { createServer } = require("http");
const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");
const session = require("express-session");
const path = require("path");
const { createBareServer } = require("@tomphttp/bare-server-node");
const uv = require("ultraviolet");

const app = express();
const server = createServer();
const bare = createBareServer("/bare/");
const PORT = process.env.PORT || 3000;

const USERNAME = "MLstudent";
const PASSWORD = "lowbum2023";

app.use(
  session({
    secret: "stealth-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.sendFile(path.join(__dirname, "public", "login.html"));
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    req.session.loggedIn = true;
    res.redirect("/");
  } else {
    res.send("Incorrect login.");
  }
});

app.use("/uv", express.static(uvPath));
app.use(express.static("public"));

uv(http => app, { prefix: "/service/" });

bare.attach(server);
server.on("request", app);
server.listen(PORT, () => {
  console.log(`Stealth proxy running on port ${PORT}`);
});