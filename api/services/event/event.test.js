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

  describe("fetch event", () => {
    test('get 200 status', (done) => {
      request(app).get('/api/event').then((res) => {
        expect(res.statusCode).toBe(200)
        done()
      })
    })

    test('get list event status', (done) => {
      request(app).get('/api/event').then((res) => {
        expect(res.body.results.length).toBeGreaterThan(0);
        done()
      })
    })
  })

  const register = async () => {
    const loginRes = await request(app).post('/api/auth/login').send({email: 'toan@gmail.com', password: '1234567'})
    token = loginRes.body.token;
    return token;
  }

  describe("register event", () => {
    let token;// = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvYW5AZ21haWwuY29tIiwiaWF0IjoxNTYwODkwNjc1fQ.dm27TPZrwd8XH2w3Cov8bKitAHSGF5f-Rn40hFfljJE';
    let registerRequest;
    let headers;
    let event, event2, event3;

    beforeAll(async(done) => {
      // login 
      const loginRes = await request(app).post('/api/auth/login').send({email: 'toan@gmail.com', password: '1234567'})

      token = loginRes.body.token;
      headers = {'x-access-token': token};

      //get the first event
      const eventRes = await request(app).get('/api/event/')

      event = eventRes.body.results[0];
      event2 = eventRes.body.results[1];
      event3 = eventRes.body.results[2];

      // register for event2
      await request(app).post(`/api/event/${event2.id}/register`).set(headers)
        
      done()
    })

    afterAll(async(done) => {
      await request(app).delete(`/api/event/${event2.id}/register`).set(headers)

      done()
    })

    test('should able to get profile', () => {
      return request(app).get('/api/user/profile').set(headers).then((res) => {
        expect(res.statusCode).toBe(200)
      })
    })

    test('should not register if not login', async (done) => {
      const res = await request(app).post(`/api/event/${event.id}/register`)
      expect(res.statusCode).toBe(401)
      done()
    })

    test('should register', async (done) => {
      const res = await request(app).post(`/api/event/${event.id}/register`).set(headers)
      expect(res.statusCode).toBe(200)
      done()
    })

    test('should deregister', async (done) => {
      const res = await request(app).delete(`/api/event/${event.id}/register`).set(headers)
      expect(res.statusCode).toBe(200)
      done()
    })

    test('should not register again', async (done) => {
      const res = await request(app).post(`/api/event/${event2.id}/register`).set(headers)
      expect(res.statusCode).toBe(400)
      expect(res.body.message).toContain('You have already registered for this event')
      done()
    })

    test('should not deregister invalid event', async (done) => {
      const res = await request(app).delete(`/api/event/${event3.id}/register`).set(headers)
      expect(res.statusCode).toBe(400)
      done()
    })
  })

  describe("event invoice", () => {
    let token;// = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRvYW5AZ21haWwuY29tIiwiaWF0IjoxNTYwODkwNjc1fQ.dm27TPZrwd8XH2w3Cov8bKitAHSGF5f-Rn40hFfljJE';
    let headers;
    let event;
    let eventId = '5d158d1f6789ce40aadb9a70';
    let sample = {
      name: "Toan Nguyen",
      address: "700 ave, New Westminster, BC, Canada",
      quantity: 2,
      price: 100,
      ticketType: 'VIP'
    }
    let createdId;

    beforeAll(async(done) => {
      token = await register();
      headers = {'x-access-token': token};

      //get the first event
      eventResp = await request(app).get(`/api/event/${eventId}`);
      event = eventResp.body;
      done()
    })

    test('should able to buy ticket', (done) => {
      return request(app).post(`/api/event/${event.id}/invoice`)
        .set(headers)
        .send(sample)
        .then((res) => {
          console.log(res.body);
          createdId = res._id
          expect(res.statusCode).toBe(200)
          done();
        })
    })
  });
})