const appointment = require("../models/appointment");
const mongoose = require("mongoose");
const AppointmentsFactory = require("../factories/AppointmentsFactory");
const mailer = require("nodemailer");

const Appo = mongoose.model("Appointment", appointment);


let transporter = mailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "05f6a4b330b448",
    pass: "7be6dc5cc464f2"
  }
});



class AppointmentService {
  async Create(name, email, description, cpf, date, time) {
    let newAppo = new Appo({
      name,
      email,
      description,
      cpf,
      date,
      time,
      finished: false,
      notified:false
    });
    try {
      await newAppo.save();
      return true;
    } catch (erro) {
      console.log(erro);
      return false;
    }
  }

  async GetAll(showFinished) {
    if (showFinished) {
      return await Appo.find();
    } else {
      let appos = await Appo.find({ finished: false });
      let appointments = [];

      appos.forEach((appointment) => {
        if (appointment.date != undefined) {
          appointments.push(AppointmentsFactory.Build(appointment));
        }
      });

      return appointments;
    }
  }

  async GetById(id) {
    try {
      let event = Appo.findOne({ "_id": id });
      return event;
    } catch (erro) {
      console.log(erro);
    }
  }

  async FinishAppointment(id){
    try{
     await Appo.findByIdAndUpdate(id,{finished: true});
      return true;
    }catch(erro){
      console.log(erro);
      return false;
    }
  }

  //busca
  async Search(busca){
    try{
      let result = await Appo.find().or([{email:busca},{cpf:busca},{name:busca}]);
      return result;
    }catch(erro){
      console.log(erro);
    }
  }



  //enviando email
  async SendNotification(){
    let appos = await this.GetAll(false);
    appos.forEach( async app =>{
      let date = app.start.getTime();
      let hour = 1000 * 60 * 60;
      let gap = date - Date.now();

      if(gap <= hour){
        if(!app.notified){
         await Appo.findByIdAndUpdate(app.id,{notified:true});
          transporter.sendMail({
            from: '<lauricio@gmail.com>', // sender address
            to: app.email, // receiver (use array of string for a list)
            subject: app.name + "   " + ' Em 1 hora você será atendido(a)!', // Subject line
            html: '<div style="background-color:black; padding:30px; color:white;"><p>Falta apenas 1 hora para a sua consulta.</div>'// plain text body
          }).then(() =>{
          console.log("email enviado com sucesso");
          }).catch(erro =>{
             console.log("erro ao enviar email")
          })
        }
      
      }
    })
  }

}

module.exports = new AppointmentService();
