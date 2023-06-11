const User = require("../../models/user");
const Appointment = require("../../models/appointment");

const appointments = async (appointmentIds) => {
  try {
    const appointments = await Appointment.find({
      _id: { $in: appointmentIds },
    });
    return appointments.map((appointment) => {
      return transformAppointment(appointment);
    });
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdAppointments: appointments.bind(
        this,
        user._doc.createdAppointments
      ),
    };
  } catch (err) {
    throw err;
  }
};

const transformAppointment = (appointment) => {
  return {
    ...appointment._doc,
    _id: appointment.id,
    createdBy: user.bind(this, appointment._doc.createdBy),
  };
};

exports.transformAppointment = transformAppointment;
