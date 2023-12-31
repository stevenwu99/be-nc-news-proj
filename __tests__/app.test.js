const request = require('supertest');
const format = require('pg-format');
require('jest-sorted');
const app = require('../app');
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
          expect(comments).toHaveLength(11);
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
  
  test ('200:should return empty array if article_id found in article ,but not comment for this article',() => {
    return request(app)
    .get('/api/articles/2/comments')
    .expect(200)
    .then (({body}) => {
        const {comments} = body;
        expect(comments).toHaveLength(0); 
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
  
});

//Task 7 POST /api/articles/:article_id/comments
describe ('POST /api/articles/:article_id/comments',() => {
    test ('201:should return a new comment when add a new comment by user', () => {
        const newComment = {username:'butter_bridge',body:'Very Good'};
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then (({body}) => {
            const {comment} = body;
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", 0);   
            expect(comment).toHaveProperty("created_at",);   
            expect(comment.created_at).not.toBeNull();
            expect(comment).toHaveProperty("author", "butter_bridge");
            expect(comment).toHaveProperty("body", "Very Good");
            expect(comment).toHaveProperty("article_id",1);
        })
    });
    test ('201:should return a new comment when add a new comment with extra property by user', () => {
        const newComment = {username:'butter_bridge',body:'I like it',fruit:'apple'};
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then (({body}) => {
            const {comment} = body;
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", 0);   
            expect(comment).toHaveProperty("created_at",);   
            expect(comment.created_at).not.toBeNull();
            expect(comment).toHaveProperty("author", "butter_bridge");
            expect(comment).toHaveProperty("body", "I like it");
            expect(comment).toHaveProperty("article_id",1);
        })
    });

    test ("404:should return  an error respond when article_id is valid,but does not exist", () => {
        const newComment = {username:'butter_bridge',body:'Very Good'}; 
        return request(app)
            .post("/api/articles/9999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
       });

    test ("400: should return an error if invalid article_id", () => {
        const newComment = {username:'butter_bridge',body:'Very Good'};
        return request(app)
            .post("/api/articles/nonsense/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
    test ("404:should return  an error respond when username does not exist", () => {
        const newComment = {username:'Tommy',body:'Very Good'}; 
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
       });

       test ("422:should return an error respond when missing username property", () => {
        const newComment = {body:'Very Good'}; 
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(422)
            .then(({ body }) => {
                expect(body.msg).toBe("Unprocessable Entity");
            });
       });
       test ("422:should return an error respond when missing body property", () => {
        const newComment = {username:'Tommy'}; 
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(422)
            .then(({ body }) => {
                expect(body.msg).toBe("Unprocessable Entity");
            });
       });
})

//Task 8 PATCH /api/articles/:article_id
describe ('PATCH /api/articles/:article_id',() => {
    test ('200:should return a update article with correct vote when passed a positive vote number', () => {
        const  newVote = {inc_votes:1};
        return request(app)
        .patch('/api/articles/1')
        .send(newVote)
        .expect(200)
        .then (({body}) => {
            const {article} = body;
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("body", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));  
            expect(article).toHaveProperty("created_at");    
            expect(article).toHaveProperty("votes", 101);   
            expect(article).toHaveProperty("article_img_url", expect.any(String));   
        })
    });

    test ('200:should return a update article with correct vote when passed a negative vote number', () => {
        const  newVote = {inc_votes:-100};
        return request(app)
        .patch('/api/articles/1')
        .send(newVote)
        .expect(200)
        .then (({body}) => {
            const {article} = body;
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("body", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));  
            expect(article).toHaveProperty("created_at");    
            expect(article).toHaveProperty("votes", 0);   
            expect(article).toHaveProperty("article_img_url", expect.any(String));   
        })
    });

    test ('200:should return a update article with correct vote when passed a vote number with extra property', () => {
        const  newVote = {inc_votes:-100,username:"Tom"};
        return request(app)
        .patch('/api/articles/1')
        .send(newVote)
        .expect(200)
        .then (({body}) => {
            const {article} = body;
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("body", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));  
            expect(article).toHaveProperty("created_at");    
            expect(article).toHaveProperty("votes", 0);   
            expect(article).toHaveProperty("article_img_url", expect.any(String));   
        })
    });

    test ("400: should return an error when passed a invalid votes data type", () => {
        const  newVote = {inc_votes:'abc'};
        return request(app)
        .patch('/api/articles/1')
        .send(newVote)
        .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });

    test ("422:should return an error respond when missing inc_votes property", () => {
        const  newVote = {inc_vote:12};
        return request(app)
             .patch('/api/articles/1')
             .send(newVote)
            .expect(422)
            .then(({ body }) => {
                expect(body.msg).toBe("Unprocessable Entity");
            });
       });

    test ("404:should return an error respond when article_id is valid,but does not exist", () => {
        const  newVote = {inc_votes:12};
        return request(app)
            .patch("/api/articles/9999")
            .send(newVote)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
       });

    test ("400: should return an error if invalid article_id", () => {
        const  newVote = {inc_votes:12};
        return request(app)
            .patch("/api/articles/nonsense")
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
})

//Task 9 DELETE /api/comments/:comment_id
describe ("DELETE /api/comments/:comment_id", () => {
	test("204: should delete comment by comment_id", () => {
	return request(app)
      .delete("/api/comments/18")
      .expect(204)
  	});

    test ("404:should return an error respond when comment_id is valid,but does not exist", () => {
        return request(app)
            .delete("/api/comments/9999")
             .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
    });
    
    test ("400: should return an error if invalid comment_id", () => {
        return request(app)
            .delete("/api/comments/nonsense")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            });
    });
});

 //Task 10 CORE: GET /api/users
 describe ('GET /api/users', () => {
    test ('200:responses with all users ', () => { 
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            const {users} = body;  
            expect(users).toHaveLength(4);
            users.forEach((user) => {
                expect(user).toHaveProperty("username", expect.any(String));
                expect(user).toHaveProperty("name", expect.any(String));
                expect(user).toHaveProperty("avatar_url", expect.any(String));
  
            })        
        })
      }); 
  });

  //Task 11 CORE: GET /api/articles
  // Refer to Line 90 test (Task 5), if not specified topic for filtering ,should return all the articles an its default sort_by and order
  describe ('GET /api/articles', () => {
    // filters by topic with default sort_by and order 
    test ('200:responses articles filters by the topic,default sort by date and order by desc', () => { 
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({body}) => {
              const {articles} = body;  
               expect(articles).toHaveLength(4);
               expect(articles).toBeSortedBy("created_at",{descending: true,});
               articles.forEach((article) => {
                expect(article).toHaveProperty("author", expect.any(String));
                expect(article).toHaveProperty("title", expect.any(String));
                expect(article).toHaveProperty("article_id", expect.any(Number));
                expect(article).toHaveProperty("topic", 'mitch');  
                expect(article).toHaveProperty("created_at");    
                expect(article).toHaveProperty("votes", expect.any(Number));   
                expect(article).toHaveProperty("article_img_url", expect.any(String));
                expect(article).toHaveProperty("comment_count", expect.any(Number));
                expect(article).not.toHaveProperty("body"); 
            })        
        })
      }); 
 
      //validate the topic
      test ('200:should return empty array if topic was found in topics ,but articles have not this topic',() => {
        return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then (({body}) => {
            const {articles} = body;
            expect(articles).toHaveLength(0); 
        })
      })

      test ("404:should return an error respond when topic is valid,but does not exist", () => {
         return request(app)
            .get("/api/articles?topic=topicnotexist")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found");
            });
       });

      // Check default sort by date and specified ASC order
      test ('200:accepts a sort_by query with default sorts by created_at  and ASC order)',() => {
        return request(app)
        .get("/api/articles?order=ASC")
        .expect(200)
        .then(({body}) =>{
         const {articles} = body;
         expect(articles).toHaveLength(5);
         expect(articles).toBeSortedBy("created_at",{ascending: true,});
        })
       })

    // Sort_by any valid column and specified order   
   test ('200:accepts a sort_by query with sorts by title and ASC order)',() => {
    return request(app)
    .get("/api/articles?sort_by=title&order=ASC")
    .expect(200)
    .then(({body}) =>{
     const {articles} = body;
     expect(articles).toHaveLength(5);
     expect(articles).toBeSortedBy("title",{ascending: true,});
    })
   })
   
   test ('200:accepts a sort_by query with sorts by title and ASC order)',() => {
    return request(app)
    .get("/api/articles?sort_by=comment_count&order=ASC")
    .expect(200)
    .then(({body}) =>{
     const {articles} = body;
     expect(articles).toHaveLength(5);
     expect(articles).toBeSortedBy("comment_count",{ascending: true,});
    })
   })

     // Validate the sort_by to prevent SQL INJECTION
     test ('400:responds with bad request for an invalid sort_by',() => {
          return request(app)
         .get('/api/articles?sort_by=apple')
         .expect(400)
         .then(({body}) => {
         expect(body.msg).toBe("Bad request");
          })
    })
   // Validate the order to prevent SQL INJECTION
      test ('400:responds with bad request for an invalid order',() => {
        return request(app)
        .get("/api/articles?topic=mitch&order=ABC")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad request");
        })
      });
  })
//Task 12  GET /api/articles/:article_id (comment_count)
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
        expect(article).toHaveProperty("comment_count", expect.any(Number));   
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
