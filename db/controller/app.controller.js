const {selectAllTopics} = require('../model/app.model')

//Task 2 Get All topics
exports.getAllTopics = (req, res,next) => {
   selectAllTopics().then((topics) => {  
      res.status(200).send({topics});    
   })
   .catch(next);
};

