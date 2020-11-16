var express = require("express");
var path = require("path");
var logger = require("morgan");

var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
// not found in static files, so default to index.html
app.use((req, res, next) => {
  if (!req.path.startsWith("/api/"))
    return res.sendFile(`${__dirname}/public/index.html`);
  next();
});

app.use("/api/users", usersRouter);

module.exports = app;
