const express = require('express'),
    app = express(),
    port = 3000,
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    cors = require('cors');


// ***** my routes *****
const routes = require("./routes");

// *** app.use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded + // parse application/json

app.use(morgan("dev"));
app.use(morgan(":method :url :status :res[content-length] - :response-time "));

app.use(cors());

app.use('/saladsBase', routes.saladsBase);
app.use('/saladsSauces', routes.saladsSauces);
app.use('/saladsToppings', routes.saladsToppings);
app.use('/saladsIngredients', routes.saladsIngredients);
app.use('/pizzas', routes.pizzas);
app.use('/beverages', routes.beverages);
app.use('/desserts', routes.desserts);
app.use('/confirmOrder', routes.confirmOrder);
app.use('/users', routes.users);

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  };
  console.log(`Server is listening on port ${port}`);
});