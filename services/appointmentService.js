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
}

module.exports = new AppointmentService();
