const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const connect = require("./database/conn");

const bodyParser = require("body-parser");

const isAuth = require("./middleware/is-auth");

const schema = require("./graphql/schema/index");
const resolvers = require("./graphql/resolver/index");
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // * means any domain can send request))
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.get("/", function (req, res) {
  res.send("Hello World");
});

connect()
  .then(() => {
    app.listen(8080, function () {
      console.log("Server started on port 8080");
    });
  })
  .catch((err) => {
    console.log("Cannot connect to the database", err);
  });
