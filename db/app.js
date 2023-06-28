const express = require("express");
const app = express();
const endpointsData = require('../endpoints.json')
app.use(express.json());



//Require error handle
const {handlePsqlErrors,handleCustomErrors,handleServerErrors} = require('../db/error')

//require controllers
const {getAllTopics,getArticleByArticleId,getAllArticles} = require('../db/controller/app.controller');

//Task 2 Get All topics
app.get("/api/topics", getAllTopics);

//Task 3 Get /api
app.get('/api',(req,res) => {
    res.status(200).send(endpointsData)
})

//Task 4 GET /api/articles/:article_id
app.get('/api/articles/:article_id',getArticleByArticleId)

//Task 5 CORE: GET /api/articles
app.get('/api/articles',getAllArticles)



//Error handle
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app; 