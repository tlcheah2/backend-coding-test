const express = require('express');
const ridesController = require('../controllers/ridesController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Ride:
 *       type: object
 *       properties:
 *         rideID:
 *           type: integer
 *           description: auto-generated ride id from db
 *         startLat:
 *           type: number
 *           description: Latitude of starting position
 *         startLong:
 *           type: number
 *           description: Longitude of starting position
 *         endLat:
 *           type: number
 *           description: Latitude of ending position
 *         endLong:
 *           type: number
 *           description: Longitude of ending position
 *         riderName:
 *           type: string
 *           description: Rider Name
 *         driverName:
 *           type: string
 *           description: Driver Name
 *         driverVehicle:
 *           type: string
 *           description: Vehicle No of the Driver
 *         created:
 *           type: string
 *           description: Created date time in ISO format
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error_code:
 *           type: string
 *           description: Error type
 *         message:
 *           type: string
 *           description: Details of the error
*/

/**
  * @swagger
  * /health:
  *   get:
  *     description: Health Check API
  *     responses:
  *       200:
  *         description: Returns string of 'Healthy' to inform the Backend Application is in healthy condition
  *         content:
  *           text/plain:
  *             schema:
  *               type: string
  */
router.get('/health', (req, res) => res.send('Healthy'));

/**
 * @swagger
 * /rides/:
 *   post:
 *     summary: Create a new ride
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_lat:
 *                 type: number
 *                 description: Latitude of starting position
 *               start_long:
 *                 type: number
 *                 description: Longitude of starting position
 *               end_lat:
 *                 type: number
 *                 description: Latitude of ending position
 *               end_long:
 *                 type: number
 *                 description: Longitude of ending position
 *               rider_name:
 *                 type: string
 *                 description: Rider name
 *               driver_name:
 *                 type: string
 *                 description: Driver name
 *               driver_vehicle:
 *                 type: string
 *                 description: Driver vehicle number
 *     responses:
 *       200:
 *        description: Return created ride object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Ride'
 *       Error:
 *         description: Error response structure
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/rides', ridesController.createRide);

/**
 * @swagger
 * /rides/:
 *   get:
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: The number of items to skip before starting to collect the result set
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The numbers of items to return
 *     description: Returns all rides
 *     summary: Return all rides from DB
 *     responses:
 *       200:
 *        description: Lists of rides
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Ride'
 *       Error:
 *         description: Error response structure
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/rides', ridesController.getRides);

/**
 * @swagger
 * /rides/{id}:
 *   get:
 *     description: Returns rides based on ID
 *     summary: Find ride by ID
 *     operationId: getRideById
 *     responses:
 *       200:
 *        description: ride response
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Ride'
 *       Error:
 *         description: Error response structure
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ErrorResponse'
 *   parameters:
 *   - name: id
 *     in: path
 *     required: true
 *     description: the user identifier, as userId
 *     schema:
 *       type: string
 */
router.get('/rides/:id', ridesController.getRide);

module.exports = router;
