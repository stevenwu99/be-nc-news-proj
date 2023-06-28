const {selectAllTopics,selectArticleByArticleId,selectAllArticles,selectCommentsByArticleId} = require('../model/app.model')

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
   selectCommentsByArticleId (article_id)
   .then ((comments) => {
      res.status(200).send({comments:comments})
   })
   .catch (next);
 }