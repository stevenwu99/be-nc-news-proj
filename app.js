const express = require("express");
const app = express();
const endpointsData = require('./endpoints.json')
app.use(express.json());



//Require error handle
const {handlePsqlErrors,handleCustomErrors,handleServerErrors} = require('./error')

//require controllers
const {getAllTopics,getArticleByArticleId,getAllArticles,getCommentsByArticleId,addComment,
    updateArticle,deleteComment,getAllUsers} = require('./controller/app.controller');

//Task 2 Get All topics
app.get("/api/topics", getAllTopics);

//Task 3 Get /api
app.get('/api',(req,res) => {
    res.status(200).send(endpointsData)
})

//Task 4 GET /api/articles/:article_id
app.get('/api/articles/:article_id',getArticleByArticleId)

//Task 5 and Task 11 CORE: GET /api/articles
app.get('/api/articles',getAllArticles)

//Task 6 GET /api/articles/:article_id/comments
app.get('/api/articles/:article_id/comments',getCommentsByArticleId)

//Task 7 POST /api/articles/:article_id/comments
app.post("/api/articles/:article_id/comments",addComment);

//Task 8 PATCH /api/articles/:article_id
app.patch ("/api/articles/:article_id",updateArticle);

//Task 9 DELETE /api/comments/:comment_id
app.delete('/api/comments/:comment_id',deleteComment);

 //Task 10 CORE: GET /api/users
 app.get("/api/users", getAllUsers);

 //Task 11  CORE: GET /api/articles, the endpoint is same as Task 5


//Error handle
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app; 