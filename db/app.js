const express = require("express");
const app = express();
app.use(express.json());

//Require error handle
const {handlePsqlErrors,handleCustomErrors,handleServerErrors} = require('../db/error')

//require controllers
const {getAllTopics} = require('../db/controller/app.controller');

//Task 2 Get All topics
app.get("/api/topics", getAllTopics);





//Error handle
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app; 