const app = require('../server');
const request = require('supertest');

//rule and data fi
describe('the /validate-rule endpoint', () => {
  describe('the required fields', () => {
    it('requires the rule field', async (done) => {
      let postData = {
        data: {
          name: 'James Holden',
          crew: 'Rocinante',
          age: 34,
          position: 'Captain',
          missions: 45,
        },
      };
      const res = await request(app)
        .post('/validate-rule')
        .send(postData)
        .set('Accept', 'application/json');
      const error = {
        message: 'rule is required.',
        status: 'error',
        data: null,
      };
      expect(res.body).toEqual(error);
      expect(res.status).toEqual(400);
      done();
    });

    it('requires the data field', async (done) => {
      let postData = {
        rule: {
          field: 'missions',
          condition: 'gte',
          condition_value: 30,
        },
      };
      const res = await request(app)
        .post('/validate-rule')
        .send(postData)
        .set('Accept', 'application/json');
      const error = {
        message: 'data is required.',
        status: 'error',
        data: null,
      };
      expect(res.body).toEqual(error);
      expect(res.status).toEqual(400);
      done();
    });
  });

  describe('the rule field constraints', () => {
    it('should only accept an object in the rule field', async (done) => {
      let postData = {
        rule: 'string',
        data: {
          name: 'James Holden',
          crew: 'Rocinante',
          age: 34,
          position: 'Captain',
          missions: 45,
        },
      };
      const res = await request(app)
        .post('/validate-rule')
        .send(postData)
        .set('Accept', 'application/json');

      const error = {
        message: 'rule should be an object.',
        status: 'error',
        data: null,
      };
      expect(res.body).toEqual(error);
      expect(res.status).toEqual(400);
      done();
    });

    it('should contain 3 subfields : condition, field and condition_value ', async (done) => {
      let postData = {
        rule: {
          // field: 'missions',
          condition: 'gte',
          condition_value: 30,
        },
        data: {
          name: 'James Holden',
          crew: 'Rocinante',
          age: 34,
          position: 'Captain',
          missions: 45,
        },
      };
      const res = await request(app)
        .post('/validate-rule')
        .send(postData)
        .set('Accept', 'application/json');

      const error = {
        message: 'field is missing from rule.',
        status: 'error',
        data: null,
      };
      expect(res.body).toEqual(error);
      expect(res.status).toEqual(400);
      done();
    });

    it('should not go beyond two nestings in rule[field]', async (done) => {
      let postData = {
        rule: {
          field: 'missions.fish.meat.tom',
          condition: 'gte',
          condition_value: 30,
        },
        data: {
          name: 'James Holden',
          crew: 'Rocinante',
          age: 34,
          position: 'Captain',
          missions: 45,
        },
      };
      const res = await request(app)
        .post('/validate-rule')
        .send(postData)
        .set('Accept', 'application/json');

      const error = {
        message: 'rule field exceeds nesting limit.',
        status: 'error',
        data: null,
      };
      expect(res.body).toEqual(error);
      expect(res.status).toEqual(400);
      done();
    });

    it('rule[field] should be present in data', async (done) => {
      let postData = {
        rule: {
          field: 'age',
          condition: 'gte',
          condition_value: 30,
        },
        data: {
          name: 'James Holden',
          crew: 'Rocinante',
          // age: 34,
          position: 'Captain',
          missions: 45,
        },
      };
      const res = await request(app)
        .post('/validate-rule')
        .send(postData)
        .set('Accept', 'application/json');

      const error = {
        message: 'field age is missing from data.',
        status: 'error',
        data: null,
      };
      expect(res.body).toEqual(error);
      expect(res.status).toEqual(400);
      done();
    });

    it('should contain only accept 5 possible conditions ', async (done) => {
      let postData = {
        rule: {
          field: 'age',
          condition: 'gre',
          condition_value: 30,
        },
        data: {
          name: 'James Holden',
          crew: 'Rocinante',
          age: 34,
          position: 'Captain',
          missions: 45,
        },
      };
      const res = await request(app)
        .post('/validate-rule')
        .send(postData)
        .set('Accept', 'application/json');

      const error = {
        message: 'invalid condition rule.',
        status: 'error',
        data: null,
      };
      expect(res.body).toEqual(error);
      expect(res.status).toEqual(400);
      done();
    });
  });

  describe('the data field constraints', () => {
    it('should be a valid object, string or array ', async (done) => {
      let postData = {
        rule: {
          field: 'age',
          condition: 'gte',
          condition_value: 30,
        },
        data: 45,
      };
      const res = await request(app)
        .post('/validate-rule')
        .send(postData)
        .set('Accept', 'application/json');

      const error = {
        message: 'data should be an object, string or array.',
        status: 'error',
        data: null,
      };
      expect(res.body).toEqual(error);
      expect(res.status).toEqual(400);
      done();
    });
  });

  describe('validation conditions', () => {
    it('should return positive response', async (done) => {
      let postData = {
        rule: {
          field: 'age',
          condition: 'gte',
          condition_value: 30,
        },
        data: { age: 45 },
      };
      const res = await request(app)
        .post('/validate-rule')
        .send(postData)
        .set('Accept', 'application/json');

      const result = {
        message: 'field age successfully validated.',
        status: 'success',
        data: {
          validation: {
            error: false,
            field: 'age',
            field_value: 45,
            condition: 'gte',
            condition_value: 30,
          },
        },
      };
      expect(res.body).toEqual(result);
      expect(res.status).toEqual(200);
      done();
    });

    it('should return a negative response', async (done) => {
      let postData = {
        rule: {
          field: 'age',
          condition: 'neq',
          condition_value: 45,
        },
        data: { age: 45 },
      };
      const res = await request(app)
        .post('/validate-rule')
        .send(postData)
        .set('Accept', 'application/json');

      const error = {
        message: 'field age failed validation.',
        status: 'error',
        data: {
          validation: {
            error: true,
            field: 'age',
            field_value: 45,
            condition: 'neq',
            condition_value: 45,
          },
        },
      };
      expect(res.body).toEqual(error);
      expect(res.status).toEqual(200);
      done();

      //status code should be 400
    });
  });
});

// let postData = {
//   rule: {
//     field: 'missions',
//     condition: 'gte',
//     condition_value: 30,
//   },
//   data: {
//     name: 'James Holden',
//     crew: 'Rocinante',
//     age: 34,
//     position: 'Captain',
//     missions: 45,
//   },
// };

// console.log(res.request._data)
