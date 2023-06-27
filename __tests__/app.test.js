const request = require('supertest');
const format = require('pg-format');

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