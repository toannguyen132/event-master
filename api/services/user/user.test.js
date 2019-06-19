const request = require('supertest');
const connectDB = require('../../config/db');
const app = require('../../config/express');
const config = require('../../config/config');

describe('Event test', () => {
  let mongoose;

  beforeAll(async() => {
    mongoose = connectDB()
  })

  afterAll(async() => {
    mongoose.connection.close()
  })

  describe("user registration", () => {
    let token;// = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvYW5AZ21haWwuY29tIiwiaWF0IjoxNTYwODkwNjc1fQ.dm27TPZrwd8XH2w3Cov8bKitAHSGF5f-Rn40hFfljJE';
    let registerRequest;
    let headers;
    let event, event2;

    beforeAll(async(done) => {
      // login 
      const loginRes = await request(app).post('/api/auth/login').send({email: 'toan@gmail.com', password: '1234567'})

      token = loginRes.body.token;
      headers = {'x-access-token': token};

      //get the first event
      const eventRes = await request(app).get('/api/event/')

      event = eventRes.body.results[0];
      event2 = eventRes.body.results[1];
        
      done()
    })

    afterAll(() => {

    })

    test('skip', () => {
      
    });

  })
})