// ********* script de connexion a la bdd ************
const connection = require('./conf'); //a decommenter une fois conf.js configure

// ***** liste des modules installes + nodemon
const express = require('express');
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();
const port = 3000;

// ***** my routes *****
const routes = require("./routes/allroutes");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(morgan("dev"));
app.use(morgan(":method :url :status :res[content-length] - :response-time "));

// page racine '/'
app.get('/', (req, res) => {
  res.status(200).send('je suis a la racine /');
})
app.use('/saladsBase', routes.saladsBase);
app.use('/saladsSauces', routes.saladsSauces);
app.use('/saladsToppings', routes.saladsToppings);
app.use('/saladsIngredients', routes.saladsIngredients);
app.use('/desserts', routes.desserts);



app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  };

  console.log(`Server is listening on port ${port}`);
});
