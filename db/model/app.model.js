const db = require('../connection');

//Task 2 Get All topics
exports.selectAllTopics = () => {
    const selectSQLStr = "SELECT * FROM topics;";
    return db
    .query(selectSQLStr)
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status:404,msg:"Not found"})
         };
        return rows;
    })
}