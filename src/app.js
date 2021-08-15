'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


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

module.exports = (db) => {
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
    app.get('/health', (req, res) => res.send('Healthy'));

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
    app.post('/rides', jsonParser, (req, res) => {
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
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        var values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];
        
        const result = db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }

                res.send(rows);
            });
        });
    });

    /**
     * @swagger
     * /rides/:
     *   get:
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
    app.get('/rides', (req, res) => {
        db.all('SELECT * FROM Rides', function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.send(rows);
        });
    });

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
    app.get('/rides/:id', (req, res) => {
        db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function (err, rows) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.send(rows);
        });
    });

    return app;
};
