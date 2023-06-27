const db = require('../connection');

//Task 2 Get All topics
exports.selectAllTopics = () => {
    const selectSQLStr = "SELECT * FROM topics;";
    return db
    .query(selectSQLStr)
    .then(({rows}) => {
        return rows;
    })
}

//GET /api/articles/:article_id
exports.selectArticleByArticleId = (article_id) => {
    const selectSQLStr = "SELECT * FROM articles WHERE article_id = $1 ;";
    return db
    .query(selectSQLStr,[article_id])
    .then(({rows}) => {
          if (rows.length === 0) {
           return Promise.reject({status:404,msg:'Not found'})
         }
         return rows
    })
}