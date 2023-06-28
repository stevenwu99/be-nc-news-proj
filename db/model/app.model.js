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

//Task4 GET /api/articles/:article_id
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

//Task 5 CORE: GET /api/articles
exports.selectAllArticles = () => {
    const selectSQLStr = "SELECT a.author,a.title,a.article_id, a.topic,a.created_at,a.votes,a.article_img_url, " +
                         "(SELECT count(b.article_id)::int FROM comments b WHERE b.article_id = a.article_id) AS comment_count " + 
                         "FROM articles a "+
                         "ORDER BY a.created_at DESC ;";
    return db
    .query(selectSQLStr)
    .then(({rows}) => { 
        return rows;
    })
}