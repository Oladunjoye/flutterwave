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

    // it('should contain 3 subfields : condition, field and condition_value ', async (done) => {});

    // it('should not go beyond two nestings in rule[field]', async (done) => {});

    // it('rule[field] should be present in data', async (done) => {
    //   const error = {
    //     message: 'field age is missing from data.',
    //     status: 'error',
    //     data: null,
    //   };
    // });

    // it('should contain only accept 5 possible conditions ', async (done) => {});
  });

  // describe('the data field constraints', () => {
  //   it('should be a valid object, string or array ', async (done) => {
  //     const error = {
  //       message: '[field] should be a|an [type].',
  //       status: 'error',
  //       date: null,
  //     };
  //   });
  // });

  // describe('validation conditions', () => {
  //   it('should return positive response', async (done) => {
  //     // {
  //     //   "message: "field [name of field] successfully validated."
  //     //   "status: "success",
  //     //   "data: {
  //     //     "validation: {
  //     //       "error: false,
  //     //       "field: "[name of field]",
  //     //       "field_value: [value of field],
  //     //       "condition: "[rule condition]",
  //     //       "condition_value: [condition value]
  //     //     }
  //     //   }
  //     //status code should be 200
  //   });

  //   it('should return a negative response', async () => {
  //     const error = {
  //       message: 'field [name of field] failed validation.',
  //       status: 'error',
  //       data: {
  //         validation: {
  //           error: true,
  //           field: '[name of field]',
  //           field_value: ['value of field'],
  //           condition: '[rule condition]',
  //           condition_value: ['condition value'],
  //         },
  //       },
  //     };

  //     //status code should be 400
  //   });
  // });
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

// console.log(res.request._data);
