const { italic } = require('colors');
const app = require('../server');
const request = require('supertest');

describe('Test the get route on the base url', () => {
  it('should return user data', async (done) => {
    try {
      const res = await request(app).get('/');
      const status = 'success';
      const message = 'My Rule-Validation API';
      const data = {
        name: 'Joye Shonubi',
        github: '@oladunjoye',
        email: 'shonubij@gmail.com',
        mobile: '08159614339',
        twitter: '@Oladunjoye_',
      };
      const response = { message, data, status };
      expect(res.body).toEqual(response);
      expect(res.status).toBe(200);
      done();
    } catch (err) {
      done();
    }
  });
});
