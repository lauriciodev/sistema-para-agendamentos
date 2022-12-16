const { Schema, model } = require("mongoose");

const appointment = new Schema({
  name: String,
  email: String,
  description: String,
  cpf: String,
  date: Date,
  time: String,
  finished: Boolean,
});

module.exports = model("Appointment", appointment);
