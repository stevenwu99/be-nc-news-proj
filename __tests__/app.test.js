const request = require('supertest');
const format = require('pg-format');
require('jest-sorted');
const app = require('../db/app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const endpointsData = require('../endpoints.json');

beforeEach(() => {
    return seed(data);
 });
 
 afterAll(() => {
     return db.end();
 })

 //Task 2 CORE: GET /api/topics
 describe ('GET /api/topics', () => {
    test ('200:responses with all topics ', () => { 
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            const {topics} = body;  
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
                expect(topic).toHaveProperty("slug", expect.any(String));
                expect(topic).toHaveProperty("description", expect.any(String));
  
            })        
        })
      }); 
  })

  //Task 3 Get /api
  describe ('Get /api',() => {
    test ('200:should respond contents of endpoints.json ',() =>{
    return request(app)
      .get('/api')
      .expect(200)
      .then(({body}) => {
           expect (body).toEqual(endpointsData);  
     
      })
    })

})

//Task 4 GET /api/articles/:article_id
describe ('GET /api/articles/:article_id',() => {
    test ('200:should return a single article by article_id',() => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then (({body}) => {
        const {article} = body;
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("article_id", expect.any(Number));
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));  
        expect(article).toHaveProperty("created_at");    
        expect(article).toHaveProperty("votes", expect.any(Number));   
        expect(article).toHaveProperty("article_img_url", expect.any(String));   
    })
  })

  test ("404:should return  an error respond when article_id is valid,but does not exist", () => {
    return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not found");
        });
   });

   test ("400: should return an error if invalid article_id", () => {
    return request(app)
        .get("/api/articles/nonsense")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
        });
    });


})

 //Task 5 CORE: GET /api/articles
 describe ('GET /api/articles', () => {
    test ('200:responses with all articles ', () => { 
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body}) => {
              const {articles} = body;  
               expect(articles).toHaveLength(5);
               expect(articles).toBeSortedBy("created_at",{descending: true,});
               articles.forEach((article) => {
                expect(article).toHaveProperty("author", expect.any(String));
                expect(article).toHaveProperty("title", expect.any(String));
                expect(article).toHaveProperty("article_id", expect.any(Number));
                expect(article).toHaveProperty("topic", expect.any(String));  
                expect(article).toHaveProperty("created_at");    
                expect(article).toHaveProperty("votes", expect.any(Number));   
                expect(article).toHaveProperty("article_img_url", expect.any(String));
                expect(article).toHaveProperty("comment_count", expect.any(Number));
                expect(article).not.toHaveProperty("body"); 
            })        
        })
      }); 
  })

  //Task 6 GET /api/articles/:article_id/comments
describe ('GET /api/articles/:article_id/comments',() => {
    test ('200:should return comments by article_id',() => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then (({body}) => {
        const {comments} = body;
        expect(comments).toBeSortedBy("created_at",{descending: true,});
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));   
          expect(comment).toHaveProperty("created_at");    
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
        })
    })
  })
  
  test ("404:should return  an error respond when article_id is valid,but does not exist", () => {
    return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not found");
        });
   });
  
   test ("400: should return an error if invalid article_id", () => {
    return request(app)
        .get("/api/articles/nonsense/comments")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
        });
    });
  
  
  })