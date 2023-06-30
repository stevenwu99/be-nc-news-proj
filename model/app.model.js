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
/*
(1)Task 12 and the Task 11 are  same endpoint.
(2)Modified the query statement to add the comment_count by article_id from comments table;
*/
exports.selectArticleByArticleId = (article_id) => {
    const selectSQLStr = "SELECT a.*, count(c.article_id) ::int AS comment_count " +
                         "FROM articles a inner join comments c ON a.article_id = c.article_id " +
                         "WHERE a.article_id = $1 " + 
                         "GROUP BY a.article_id ;"
    return db
    .query(selectSQLStr,[article_id])
    .then(({rows}) => {
          if (rows.length === 0) {
           return Promise.reject({status:404,msg:'Not found'})
         }
         return rows
    })
}
 
//Task 5 and Task 11 CORE: GET /api/articles
/*
Task 5 and the Task 11 are same endpoint.
So modified the Task 5 model function to match the Task 11
(1)Accept the parameters and with its default value,keep the original test for Task 5 work as well
(2)Valid the sort_by and order checking to avoid the SQL injection and return an error respond
(3) According the sort_by and order and its value to decide which SQL should be sent to database.
    -- sort by which column
    -- if without sort_by value, use its default sort_by
    -- if without specified order, user its default order
    -- if not specified topic for filtering, should return all the articles. this will match the Task 5 requirement and its 
        original test work
*/
exports.selectAllArticles = (sort_by = 'created_at',order = 'DESC',topic) => {
    const validSortBy = ['article_id','title','topic','author','created_at','votes','article_img_url'];
    const validSortOrder = ['ASC','DESC'];
    const queryValues = [];
  
    if (!validSortBy.includes(sort_by)) {
        return Promise.reject({status:400,msg:"Bad request"});
    };

    if (!validSortOrder.includes(order)) {
        return Promise.reject({status:400,msg:"Bad request"});
    };  

    let selectSQLStr = "SELECT a.author,a.title,a.article_id, a.topic,a.created_at,a.votes,a.article_img_url, count(c.article_id) ::int AS comment_count " +
                        "FROM articles a inner join comments c ON a.article_id = c.article_id ";
                        
    if (topic) {
        selectSQLStr += ' WHERE a.topic = $1 ';
        queryValues.push(topic);
    }
  
    selectSQLStr +=  "GROUP BY a.article_id " ;
    selectSQLStr += `ORDER By a.${sort_by} ${order} `;
         
    return db
        .query(selectSQLStr,queryValues)
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

//Task 7 POST /api/articles/:article_id/comments
exports.AddCommentByArticleId = (article_id,newComment) => {
    const {username,body} = newComment;
    const insertSQLStr = "INSERT INTO comments (article_id,author,body) VALUES ($1,$2,$3) RETURNING *;"
    return db
    .query(insertSQLStr,[article_id,username,body])
    .then(({rows}) => {
        return rows;
    })
}

//Task 8 PATCH /api/articles/:article_id
exports.updateArticleById = (article_id,votes) => {
    const updateSQLStr = "UPDATE articles SET votes =(votes + $1) WHERE article_id = $2 RETURNING *; ";
    return db
    .query(updateSQLStr,[votes,article_id])
    .then(({rows}) => {
          if (rows.length === 0) {
           return Promise.reject({status:404,msg:'Not found'})
         }
         return rows
    })
 } 

 //Task 9 DELETE /api/comments/:comment_id
exports.deleteCommentById = (comment_id) => {
    const deleteSQLStr = "DELETE FROM comments WHERE comment_id = $1 RETURNING *; ";
    return db
    .query(deleteSQLStr,[comment_id])
    .then(({rows}) => {
          if (rows.length === 0) {
           return Promise.reject({status:404,msg:'Not found'})
         }
         return rows
    })
 } 

 //Task 10 CORE: GET /api/users
exports.selectAllUsers = () => {
    const selectSQLStr = "SELECT * FROM users;";
    return db
    .query(selectSQLStr)
    .then(({rows}) => {
        return rows;
    })
}