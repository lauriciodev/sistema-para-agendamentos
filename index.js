const express = require("express");
const app = express();
const mongoose = require("mongoose");
const AppointmentService = require("./services/appointmentService");
const appointment = require("./models/appointment");
const appointmentService = require("./services/appointmentService");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/agendamentos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//rota principal
app.get("/", (req, res) => {
  res.render("index");
});

//rota de cadastro
app.get("/cadastro", (req, res) => {
  res.render("create");
});

app.post("/create", async (req, res) => {
  let status = await AppointmentService.Create(
    req.body.name,
    req.body.email,
    req.body.description,
    req.body.cpf,
    req.body.date,
    req.body.time
  );

  if (status) {
    res.redirect("/");
  } else {
    res.send("ocorreu uma falha");
  }
});

//rota de busca
app.get("/getcalendar", async (req, res) => {
  let appointments = await appointmentService.GetAll(false);
  res.json(appointments);
});

app.listen(8080, () => {
  console.log("online");
});
