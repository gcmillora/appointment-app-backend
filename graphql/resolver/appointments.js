const Appointment = require("../../models/appointment");
const User = require("../../models/user");
const { transformAppointment } = require("./merge");

module.exports = {
  appointments: async () => {
    try {
      const appointments = await Appointment.find();

      return appointments.map((appointment) => {
        return transformAppointment(appointment);
      });
    } catch (err) {
      throw err;
    }
  },

  createAppointment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }

    const appointment = new Appointment({
      comments: args.appointmentInput.comments,
      fromDate: new Date(args.appointmentInput.fromDate),
      toDate: new Date(args.appointmentInput.toDate),
      createdBy: req.userId,
    });

    let createdAppointment;
    try {
      const result = await appointment.save();

      createdAppointment = transformAppointment(result);

      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error("User not found.");
      }
      creator.createdAppointments.push(appointment);
      await creator.save();

      return createdAppointment;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  deleteAppointment: async (args) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    try {
      const appointment = await Appointment.findById(args.appointmentId);
      await Appointment.deleteOne({ _id: args.appointmentId });
      return appointment;
    } catch (err) {
      throw err;
    }
  },

  //only update filled fields
  updateAppointment: async (args) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    try {
      const appointment = await Appointment.findById(args.appointmentId);
      if (args.appointmentInput.comments) {
        appointment.comments = args.appointmentInput.comments;
      }
      if (args.appointmentInput.fromDate) {
        appointment.fromDate = args.appointmentInput.fromDate;
      }
      if (args.appointmentInput.toDate) {
        appointment.toDate = args.appointmentInput.toDate;
      }
      await appointment.save();
      return appointment;
    } catch (err) {
      throw err;
    }
  },
};
