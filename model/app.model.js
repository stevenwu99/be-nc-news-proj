const db = require('../db/connection');
const format = require('pg-format');


//Check exists
exports.checkExists = (tableName,colName,colValue) => {
    const queryStr = format ('SELECT * FROM %I WHERE %I = $1;',tableName,colName)
    return db
    .query(queryStr,[colValue])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({status:404,msg:'Not found'})
        }
    });
}

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
    const selectSQLStr = "SELECT a.author,a.title,a.article_id, a.topic,a.created_at,a.votes,a.article_img_url, count(c.article_id) ::int AS comment_count " +
                         "FROM articles a inner join comments c ON a.article_id = c.article_id " + 
                         "GROUP BY a.article_id " +
                         "ORDER BY a.created_at DESC ;";
    return db
    .query(selectSQLStr)
    .then(({rows}) => { 
        return rows;
    })
}

//Task 6 GET /api/articles/:article_id/comments
exports.selectCommentsByArticleId = (article_id) => {
    const selectSQLStr = "SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC ;";  
    return db
    .query(selectSQLStr,[article_id])
    .then(({rows}) => {
         return rows
    })
}
