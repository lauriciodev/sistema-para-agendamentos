const appointment = require("../models/appointment");
const AppointmentsFactory = require("../factories/AppointmentsFactory");

class AppointmentService {
  async Create(name, email, description, cpf, date, time) {
    let newAppo = appointment.create({
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
      const data = await appointment.find();
      return data
    } else {
      let appos = await appointment.find({ finished: false });
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
      let event = appointment.findById(id);
      return event;
    } catch (erro) {
      console.log(erro);
    }
  }
}

module.exports = new AppointmentService;
