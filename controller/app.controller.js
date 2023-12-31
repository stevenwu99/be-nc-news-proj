const {selectAllTopics,selectArticleByArticleId,selectAllArticles,selectCommentsByArticleId, checkExists,
   AddCommentByArticleId,updateArticleById,deleteCommentById,selectAllUsers } = require('../model/app.model')

//Task 2 Get All topics
exports.getAllTopics = (req, res,next) => {
   selectAllTopics().then((topics) => {  
      res.status(200).send({topics});    
   })
   .catch(next);
};

//Task 4 GET /api/articles/:article_id
exports.getArticleByArticleId = (req,res,next) => {
   const article_id  = req.params.article_id;
   selectArticleByArticleId (article_id)
   .then ((article) => {
      res.status(200).send({article:article[0]})
   })
   .catch (next);
}

//Task 5 and Task 11 CORE: GET /api/articles
/* 
Task 5 and the Task 11 is same endpoint.
So modified the Task 5 controller function to match the Task 11
(1)Access the query and pass to its model
(2)If filtered the articles by the topic value, check the topic exist or not 
(3)Add the promise,if the topic not exist return custom error 404 and message
*/

exports.getAllArticles = (req,res,next) => {
   const {sort_by,order,topic} = req.query;    
   const promises = [selectAllArticles(sort_by,order,topic)];

   if (topic) {
      promises.push(checkExists('topics','slug',topic));
   }
   Promise.all(promises).then((resolvedPromises) => {   
      const articles = resolvedPromises[0]
      res.status(200).send({articles});    
   })
   .catch(next);  
}

//Task 6 GET /api/articles/:article_id/comments
exports.getCommentsByArticleId = (req,res,next) => {
   const article_id = req.params.article_id;

   const promises = [selectCommentsByArticleId (article_id)]
   if (article_id) {
      promises.push(checkExists('articles','article_id',article_id));
   }
   Promise.all(promises)
   .then ((resolvedPromises) => {
      const comments = resolvedPromises[0]
      res.status(200).send({comments:comments})
   })
   .catch (next);
 }

//Task 7 POST /api/articles/:article_id/comments
exports.addComment = (req,res,next) => {
   const article_id = req.params.article_id
   const newComment = req.body;

    if (!newComment.username || !newComment.body) {
      return Promise.reject({status:422,msg:'Unprocessable Entity'})
      .catch(next)
   }

   checkExists('articles','article_id',article_id)
   .catch(next);

   checkExists('users','username',newComment.username)
   .catch(next);
  
  AddCommentByArticleId(article_id,newComment).then((comment) => {  
   res.status(201).send({comment:comment[0]}) 
  })
  .catch(next);

}

//Task 8 PATCH /api/articles/:article_id
exports.updateArticle = (req,res,next) => {
   const article_id  = req.params.article_id;
   
   if (!req.body.inc_votes) {
      return Promise.reject({status:422,msg:'Unprocessable Entity'})
      .catch(next)
   }
   const votes = req.body.inc_votes;
   updateArticleById(article_id,votes)
   .then ((article) => {
      res.status(200).send({article:article[0]})
   })
   .catch (next);
}

//Task 9 DELETE /api/comments/:comment_id
exports.deleteComment = (req,res,next) => {
   const comment_id  = req.params.comment_id;
    deleteCommentById(comment_id)
   .then ((comment) => {
      res.status(204).send();
   })
   .catch (next);
}

//Task 10 CORE: GET /api/users
exports.getAllUsers = (req, res,next) => {
   selectAllUsers().then((users) => {  
      res.status(200).send({users});    
   })
   .catch(next);
};

 //Task 11  CORE: GET /api/articles, the endpoint is same as Task 5