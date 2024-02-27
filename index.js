const express = require("express");
const routes = require("./src/routes/routes");
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(express.json());
app.use(routes);

app.listen( process.env.PORT, () => {
  console.log("Server is running on", process.env.PORT);
});
