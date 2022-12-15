const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/agendamentos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Oi!");
});

app.listen(8080, () => {
  console.log("online");
});
