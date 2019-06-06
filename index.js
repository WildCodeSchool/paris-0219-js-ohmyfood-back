// ***** liste des modules installes + nodemon
const express = require('express');
const app = express();
const port = 3000;

const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes/allroutes");// ***** my routes *****

// *** app.use

app.use(morgan("dev"));
app.use(morgan(":method :url :status :res[content-length] - :response-time "));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded + // parse application/json
app.use(bodyParser.json());

app.use("/pizzas", routes.pizzas);
app.use('/desserts', routes.desserts);

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  };
  console.log(`Server is listening on port ${port}`);
});
