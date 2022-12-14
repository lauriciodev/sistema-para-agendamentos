const express = require("express");
const app = express();
const mongoose = require("mongoose");

//usando arquivos staticos
app.use(express.static("public"));

//url encoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json);

app.set("view engine", "ejs");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/agendamento", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("teste");
});

app.listen(3000, () => {
  console.log("servidor iniciado");
});
