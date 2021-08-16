const request = require('supertest');
const { initDatabase } = require('../src/bootstrap/dbConnection');
const app = require('../src/app');

describe('API tests', () => {
  before(async () => {
    await initDatabase();
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should return 200 with error code RIDES_NOT_FOUND_ERROR ', (done) => {
      const errMsg = {
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides',
      };
      request(app)
        .get('/rides')
        .query({ limit: 15, offset: 0 })
        .expect('Content-Type', /json/)
        .expect(200, JSON.stringify(errMsg), done);
    });

    it('should VALIDATION_ERROR for invalid limit/offset', (done) => {
      const errMsg = {
        error_code: 'VALIDATION_ERROR',
        message: 'Offset or Limit must be a number',
      };
      request(app)
        .get('/rides')
        .query({ limit: 'def', offset: 0 })
        .expect('Content-Type', /json/)
        .expect(200, JSON.stringify(errMsg), done);
    });
  });

  describe('GET /rides/:id', () => {
    it('should return 200 with error code RIDES_NOT_FOUND_ERROR ', (done) => {
      const errMsg = {
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides',
      };
      request(app)
        .get('/rides/1')
        .expect('Content-Type', /json/)
        .expect(200, JSON.stringify(errMsg), done);
    });
  });

  describe('POST /rides/', () => {
    it('should return Validation Error - Invalid Starting Latitude', (done) => {
      const sampleBody = {
        start_lat: 98,
        start_long: 0,
        end_lat: 0,
        end_long: 0,
        rider_name: 'Tek',
        driver_name: 'Tek',
        driver_vehicle: 'ABC123',
      };
      const expectedRes = {
        error_code: 'VALIDATION_ERROR',
        message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      };
      request(app)
        .post('/rides')
        .send(sampleBody)
        .expect('Content-Type', /json/)
        .expect(200, expectedRes, done);
    });

    it('should return Validation Error - Invalid Ending Latitude', (done) => {
      const sampleBody = {
        start_lat: 88,
        start_long: 120,
        end_lat: 98,
        end_long: 0,
        rider_name: 'Tek',
        driver_name: 'Tek',
        driver_vehicle: 'ABC123',
      };
      const expectedRes = {
        error_code: 'VALIDATION_ERROR',
        message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      };
      request(app)
        .post('/rides')
        .send(sampleBody)
        .expect('Content-Type', /json/)
        .expect(200, expectedRes, done);
    });

    it('should return Validation Error - Invalid Rider Name', (done) => {
      const sampleBody = {
        start_lat: 88,
        start_long: 120,
        end_lat: 85,
        end_long: 114,
        rider_name: '',
        driver_name: 'Tek',
        driver_vehicle: 'ABC123',
      };
      const expectedRes = {
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      };
      request(app)
        .post('/rides')
        .send(sampleBody)
        .expect('Content-Type', /json/)
        .expect(200, expectedRes, done);
    });

    it('should return Validation Error - Invalid Driver Name', (done) => {
      const sampleBody = {
        start_lat: 88,
        start_long: 120,
        end_lat: 85,
        end_long: 114,
        rider_name: 'Tek',
        driver_name: 1234456,
        driver_vehicle: 'ABC123',
      };
      const expectedRes = {
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      };
      request(app)
        .post('/rides')
        .send(sampleBody)
        .expect('Content-Type', /json/)
        .expect(200, expectedRes, done);
    });

    it('should return Validation Error - Invalid Driver Vehicle', (done) => {
      const sampleBody = {
        start_lat: 88,
        start_long: 120,
        end_lat: 85,
        end_long: 114,
        rider_name: 'Tek',
        driver_name: 'Tek',
        driver_vehicle: 9124123,
      };
      const expectedRes = {
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      };
      request(app)
        .post('/rides')
        .send(sampleBody)
        .expect('Content-Type', /json/)
        .expect(200, expectedRes, done);
    });

    it('should return 200 with created ride', (done) => {
      const sampleBody = {
        start_lat: 88,
        start_long: 120,
        end_lat: 85,
        end_long: 114,
        rider_name: 'Tek',
        driver_name: 'Tek',
        driver_vehicle: 'ABC1234',
      };
      request(app)
        .post('/rides')
        .send(sampleBody)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});
