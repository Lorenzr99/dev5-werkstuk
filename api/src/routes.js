const {
    pg
} = require('./config/postgres');
const express = require('express');
const festivalRouter = express.Router();
const requestRouter = express.Router();

/**
 * Handler of the 'GET /festivals & GET /requests' endpoint.
 * Retrieves all rows of the specified 'table'
 * and sends these rows back as a JSON response.
 * @param {*} req contains the request of the user 
 * @param {*} res sends the response to the user
 * @param {string} table the table which will be targeted
 * @returns {object} all rows are returned as a JSON object
 */

const getAllFestivalsHandler = (req, res, table) => {
    pg.select().from(table)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((e) => {
            console.error(e);
            res.status(400).json({
                message: "Kon data niet ophalen!"
            });
        });
}

/**
 * Handler of the 'PUT /festivals & PUT /requests' endpoint.
 * Updates all values of a row with the specified 'id'
 * and sends the updated row back as a JSON response.
 * @param {*} req contains the request of the user 
 * @param {*} res sends the response to the user
 * @param {string} table the table which will be targeted
 * @returns {object} the updated row is returned as a JSON object
 */

const updateFestivalHandler = (req, res, table) => {
    pg(table)
        .where('id', req.body.id)
        .update({
            name: req.body.name,
            date_begin: req.body.date_begin,
            date_end: req.body.date_end,
            description: req.body.description,
        })
        .returning('*')
        .then(festival => {
            res.status(200).json(festival);
        })
        .catch((e) => {
            console.log(e);
            res.status(400).json({
                message: "Kon festival niet updaten!"
            })
        });
}

/**
 * Handler of the 'DELETE /festivals & DELETE /requests' endpoint.
 * Deletes a row with the specified 'id'
 * and sends the 'id' of the deleted row back as a JSON response.
 * @param {*} req contains the request of the user 
 * @param {*} res sends the response to the user
 * @param {string} table the table which will be targeted
 * @returns {object} the 'id' of the deleted row is returned as a JSON object
 */

const deleteFestivalHandler = (req, res, table) => {
    pg(table)
        .where('id', req.body.id)
        .del()
        .returning('id')
        .then(id => {
            res.status(200).json(id);
        })
        .catch((e) => {
            console.log(e);
            res.status(400).json({
                message: "Kon festival niet verwijderen!"
            })
        })
}

/**
 * All endpoints from the '/festivals' route.
 */

festivalRouter.route('/festivals')
    .get((req, res) => getAllFestivalsHandler(req, res, "festivals"))
    .put((req, res) => updateFestivalHandler(req, res, "festivals"))
    .delete((req, res) => deleteFestivalHandler(req, res, "festivals"));

/**
 * All endpoints from the '/requests' route.
 */

requestRouter.route('/requests')
    .get((req, res) => getAllFestivalsHandler(req, res, "requests"))
    .put((req, res) => updateFestivalHandler(req, res, "requests"))
    .delete((req, res) => deleteFestivalHandler(req, res, "requests"));

module.exports = {
    festivalRouter,
    requestRouter,
    getAllFestivalsHandler,
    updateFestivalHandler,
    deleteFestivalHandler,
};