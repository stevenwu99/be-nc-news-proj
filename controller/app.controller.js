const {selectAllTopics,selectArticleByArticleId,selectAllArticles,selectCommentsByArticleId, checkExists,AddCommentByArticleId} = require('../model/app.model')

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


//Task 5 CORE: GET /api/articles
exports.getAllArticles = (req,res,next) => {
   selectAllArticles().then((articles) => {  
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