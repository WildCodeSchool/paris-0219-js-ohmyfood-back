const connection = require('./conf'); //a decommenter une fois conf.js configure
// ***** liste des modules installes + nodemon
const bodyParser = require("body-parser");
const cors = require('cors')
const express = require('express');
const morgan = require("morgan");

const app = express();
const port = 3000;


// ***** my routes *****
const routes = require("./routes");


app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded + // parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded + // parse application/json

app.use(morgan("dev"));
app.use(morgan(":method :url :status :res[content-length] - :response-time "));

app.use(cors());


app.use('/pizzas', routes.pizzas);
app.use('/beverages', routes.beverages);
app.use('/desserts', routes.desserts);
// app.use('/salads', routes.salads);

app.use('/saladsSauces', routes.saladsSauces);
app.use('/saladsIngredients', routes.saladsIngredients);
app.use('/saladsBase', routes.saladsBase);
app.use('/saladsToppings', routes.saladsToppings);


app.get('/', (req, res) => {
  res.status(200).send('je suis a la racine /');
})

app.use('/confirmOrder', routes.confirmOrder);
app.use('/users', routes.users);
app.use('/login', routes.login);

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  };
  console.log(`Server is listening on port ${port}`);
});