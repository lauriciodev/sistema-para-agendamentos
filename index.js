const express = require("express");
const app = express();
const mongoose = require("mongoose");
const AppointmentService = require("./services/appointmentService");
const appointment = require("./models/appointment");
const appointmentService = require("./services/appointmentService");
const AppointmentsFactory = require("./factories/AppointmentsFactory");

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

app.get("/consultas" , async(req,res) =>{
  let consulta = await  appointmentService.GetAll(true);
  let user = consulta.map(response => ({
    ...response,day:response.date.getDate() +1,
    month:response.date.getMonth() +1,
    year:response.date.getFullYear()
  }))
   

  res.render("event",{user:user});
  //res.json(user)

  
   /* let day = consultas.date.getDate()+1
   let month = consultas.date.getMonth()+1
   let year = consultas.date.getFullYear()
   if(day < 10){
    day = `0${day}`
   }
   if(month < 10){
    month = `0${month}`
   }

   let data = day + "/ " + month + "/ " + year;  */

})

//rota especifica de cada evento clicado
app.get("/event/:id", async (req, res) => {
  
   let user = await AppointmentService.GetById(req.params.id)
   let day = user.start.getDate()+1
   let month = user.start.getMonth()+1
   let year = user.start.getFullYear()
   if(day < 10){
    day = `0${day}`
   }
   if(month < 10){
    month = `0${month}`
   }

   let data = day + "/ " + month + "/ " + year;
   
   

   res.render("event",{user:user,date:data})

   
});

app.listen(8080, () => {
  console.log("online");
});
