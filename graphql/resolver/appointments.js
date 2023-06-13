const appointment = require("../../models/appointment");
const Appointment = require("../../models/appointment");
const User = require("../../models/user");
const { transformAppointment } = require("./merge");

module.exports = {
  appointments: async (args) => {
    try {
      const appointments = await Appointment.find().sort({ fromDate: 1 });
      return appointments
        .filter((appointment) => {
          return appointment.createdBy._id == args.id;
        })
        .map((appointment) => {
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
      patient: args.appointmentInput.patient,
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

  deleteAppointment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    try {
      const appointment = await Appointment.findById(
        args.appointmentId
      ).populate("createdBy");
      const transf = transformAppointment(appointment);
      await Appointment.deleteOne({ _id: args.appointmentId });
      return transf;
    } catch (err) {
      throw err;
    }
  },

  //only update filled fields
  updateAppointment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("User is not authenticated");
    }
    try {
      const appointment = await Appointment.findById(args.id);
      if (!appointment) {
        throw new Error("Appointment not found.");
      }

      if (args.updateAppointment.comments != "undefined") {
        appointment.comments = args.updateAppointment.comments;
      }
      if (args.updateAppointment.fromDate != "undefined") {
        appointment.fromDate = args.updateAppointment.fromDate;
      }
      if (args.updateAppointment.toDate != "undefined") {
        appointment.toDate = args.updateAppointment.toDate;
      }
      if (args.updateAppointment.patient != "undefined") {
        appointment.patient = args.updateAppointment.patient;
      }
      await appointment.save();
      return appointment;
    } catch (err) {
      throw err;
    }
  },
};
