const assert = require('assert');
const request = require('supertest');
const { initDatabase, getDatabase } = require('../src/bootstrap/dbConnection');
const app = require('../src/app');

describe('API Security tests', () => {
  before(async () => {
    await initDatabase();
  });

  it('X-Powered-By is hidden', (done) => {
    request(app)
      .get('/health')
      .expect('Content-Type', /text/)
      .expect(200)
      .end((err, res) => {
        assert.strictEqual(res.headers['x-powered-by'], undefined);
        done();
      });
  });

  it('Set X-Frame Options to same-origin', (done) => {
    request(app)
      .get('/health')
      .expect('Content-Type', /text/)
      .expect(200)
      .end((err, res) => {
        assert.strictEqual(res.headers['x-frame-options'], 'SAMEORIGIN');
        done();
      });
  });

  it('Successfully prevent SQL Injection', async () => {
    const sampleBody = {
      start_lat: 88,
      start_long: 120,
      end_lat: 85,
      end_long: 114,
      rider_name: 'Tek',
      driver_name: 'Tek',
      driver_vehicle: 'ABC1234',
    };
    const values = [
      sampleBody.start_lat,
      sampleBody.start_long,
      sampleBody.end_lat,
      sampleBody.end_long,
      sampleBody.rider_name,
      sampleBody.driver_name,
      sampleBody.driver_vehicle,
    ];

    // Create 2 rides
    await getDatabase().run(
      'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values,
    );
    await getDatabase().run(
      'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
      values,
    );

    request(app)
      .get('/rides/1 OR rideID = 2')
      .expect('Content-Type', /text/)
      .expect(200)
      .end((err, res) => {
        const parseResponse = JSON.parse(res.text);
        assert.deepStrictEqual(parseResponse, { error_code: 'RIDES_NOT_FOUND_ERROR', message: 'Could not find any rides' });
      });
  });
});
