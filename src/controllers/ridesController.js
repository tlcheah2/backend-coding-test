const { logger } = require('../logger');
const { getDatabase } = require('../bootstrap/dbConnection');

exports.createRide = async (req, res) => {
  logger.info('POST: Rides Request Body', req.body);
  const startLatitude = Number(req.body.start_lat);
  const startLongitude = Number(req.body.start_long);
  const endLatitude = Number(req.body.end_lat);
  const endLongitude = Number(req.body.end_long);
  const riderName = req.body.rider_name;
  const driverName = req.body.driver_name;
  const driverVehicle = req.body.driver_vehicle;

  if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
    });
  }

  if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
    });
  }

  if (typeof riderName !== 'string' || riderName.length < 1) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string',
    });
  }

  if (typeof driverName !== 'string' || driverName.length < 1) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string',
    });
  }

  if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message: 'Rider name must be a non empty string',
    });
  }

  const values = [
    req.body.start_lat,
    req.body.start_long,
    req.body.end_lat,
    req.body.end_long,
    req.body.rider_name,
    req.body.driver_name,
    req.body.driver_vehicle,
  ];

  const result = await getDatabase().run(
    'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
    values,
  );
  if (result && result.lastID) {
    const createdRide = await getDatabase().all('SELECT * FROM Rides WHERE rideID = ?', result.lastID);
    if (createdRide) {
      logger.info('Created ride', { createdRide });
      return res.send(createdRide);
    }
  }
  // Return unknow error
  return res.send({
    error_code: 'SERVER_ERROR',
    message: 'Unknown error',
  });
};

exports.getRides = async (req, res) => {
  const limit = Number(req.query.limit);
  const offset = Number(req.query.offset);

  if (Number.isNaN(limit) || Number.isNaN(offset)) {
    return res.send({
      error_code: 'VALIDATION_ERROR',
      message: 'Offset or Limit must be a number',
    });
  }
  const result = await getDatabase().all('SELECT * FROM Rides ORDER BY rideID LIMIT ? OFFSET ?', [limit, offset]);
  logger.info('Returned rides', result);

  if (!result) {
    return res.send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error',
    });
  }

  if (result && result.length === 0) {
    return res.send({
      error_code: 'RIDES_NOT_FOUND_ERROR',
      message: 'Could not find any rides',
    });
  }

  return res.send(result);
};

exports.getRide = async (req, res) => {
  const result = await getDatabase().all('SELECT * FROM Rides WHERE rideID=?', [req.params.id]);

  logger.info('Retrieved ride', result);
  if (!result) {
    return res.send({
      error_code: 'SERVER_ERROR',
      message: 'Unknown error',
    });
  }

  if (result && result.length === 0) {
    return res.send({
      error_code: 'RIDES_NOT_FOUND_ERROR',
      message: 'Could not find any rides',
    });
  }

  return res.send(result);
};
