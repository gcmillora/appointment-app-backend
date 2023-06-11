const authResolver = require("./auth");
const appointmentResolver = require("./appointments");

const rootResolver = {
  ...authResolver,
  ...appointmentResolver,
};

module.exports = rootResolver;
