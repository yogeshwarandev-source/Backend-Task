const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes/router.js");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const {rateLimit,ipKeyGenerator } = require("express-rate-limit");


const {
  notFoundHandler} = require("./helper/responseHandler.js");

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const incomingLimiter = rateLimit({
  windowMs: 5 * 1000,
  max: 5,
  keyGenerator: ipKeyGenerator ,
  message: { success: false, message: "Too many requests" }
});

app.use(incomingLimiter)


app.use(
  cors({
    origin: true, 
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// Initialize API routes

app.use("/api", routes);

// Testing API is alive
app.get("/", (req, res) => {
  res.send("api working");
});

// Invalid route handler
app.use(notFoundHandler);

module.exports = {app};