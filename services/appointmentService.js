const appointment = require("../models/appointment");
const mongoose = require("mongoose");
const AppointmentsFactory = require("../factories/AppointmentsFactory");

const Appo = mongoose.model("Appointment", appointment);
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
    appos.forEach( app =>{
      let date = app.start.getTime();
      let hour = 1000 * 60 * 60;
      let gap = date - Date.now();

      if(gap <= hour){
        console.log(app.title)
      console.log("falta menos de 1hora");
      }
    })
  }

}

module.exports = new AppointmentService();
