const express = require("express");
const cors = require("cors");
const app = express();

const routes = require("./routes/travelsRoutes");

// necessário por causa da política de same-origin entre cliente e servidor
app.use(cors())

// body parse = analisa o que foi escrito no "body" do Postman e interpreta como um json que pode ser chamado com notação de ponto
app.use(express.json())


app.use("/", routes);


module.exports = app;