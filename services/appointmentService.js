const appointment = require("../models/appointment");
const mongoose = require("mongoose");

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
}

module.exports = new AppointmentService();
