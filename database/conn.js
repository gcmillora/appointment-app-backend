const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

module.exports = async function connect() {
  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "testDB",
  };

  await mongoose.connect(uri, mongooseOpts);
  console.log(`In-memory MongoDB successfully connected to ${uri}`);
};
