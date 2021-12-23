const {
    pg
} = require('./config/postgres');
const express = require('express');
const festivalRouter = express.Router();
const requestRouter = express.Router();
const signUpRouter = express.Router();
const loginRouter = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Checks if the signup request body is valid.
 * @param {request} body the request body sent by the user
 * @returns {boolean} true if request is valid, false if request is invalid
 */

const isSignUpRequestValid = (body) => {
    if (body && JSON.stringify(body) !== '{}') {
        const usernameRegex = /^[a-zA-Z0-9 ]{3,25}$/;
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

        if (usernameRegex.test(body.username) &&
            emailRegex.test(body.email) &&
            body.date_birth.match(dateRegex) &&
            passwordRegex.test(body.password)) {
                const birthDateTime = new Date(body.date_birth).getTime();

            if (!birthDateTime &&
                birthDateTime !== 0) {
                    return false;
            }
            return true;
        }
    }
    return false;
}

/**
 * Handler of the 'POST /signup' endpoint.
 * Hashes the password, inserts the user data
 * and sends the email of the new user back as a JSON response.
 * @param {*} req contains the request of the user 
 * @param {*} res sends the response to the user
 * @returns {object} the inserted email is returned as a JSON object
 */

const postSignUpHandler = (req, res) => {
    if(isSignUpRequestValid(req.body)) {
        bcrypt.hash(req.body.password, 10, (error, hashedPassword) => {
            if (error) {
                console.log(error);
                res.status(400).json({
                    error
                });
            }

            pg('users')
                .insert({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                    date_birth: req.body.date_birth,
                }, 'email')
                .then(email => {
                    res.status(200).json(email);
                })
                .catch((e) => {
                    console.log(e);
                    res.status(400).json({
                        message: "Kon user niet registreren!"
                    })
                });
        });        
    } else {
        console.log("Ongeldige request body!");
        res.status(400).json({
            message: "Ongeldige request body!"
        });
    }
}

const postLoginHandler = (req, res) => {
    pg('users')
        .where('email', req.body.email)
        .then((user) => {
            if(user) {
                bcrypt.compare(req.body.password, user.password, (error, result) => {
                    if (error) {
                        console.log(error);
                        res.status(400).json({
                            error
                        });
                    }

                    if(result) {
                        const token = jwt.sign({
                            email: user.email
                        }, process.env.SECRET, {
                            expiresIn: '24h'
                        });
                        res.status(200).json({
                            user: user.email,
                            token,
                        });
                    } else {
                        res.status(401).json({
                            message: 'Het wachtwoord is niet juist!'
                        });
                    }
                })
            } else {
                res.status(404).json({
                    message: 'User is niet gevonden!'
                })
            }
        })
}

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
            res.status(404).json({
                message: "Kon data niet ophalen!"
            });
        });
}

/**
 * Checks if the request body is valid.
 * @param {request} body the request body sent by the user
 * @returns {boolean} true if request is valid, false if request is invalid
 */

const isFestivalRequestValid = (body) => {
    if (body && JSON.stringify(body) !== '{}') {
        const nameRegex = /^[a-zA-Z ]{2,30}$/;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const descriptionRegex = /^['.",\/#!%\^&\*;:=\-()a-zA-Z0-9\n _]*$/;

        if (nameRegex.test(body.name) &&
            body.date_begin.match(dateRegex) &&
            body.date_end.match(dateRegex) &&
            descriptionRegex.test(body.description)) {
                const beginDateTime = new Date(body.date_begin).getTime();
                const endDateTime = new Date(body.date_end).getTime();

            if (!beginDateTime &&
                beginDateTime !== 0 ||
                !endDateTime &&
                endDateTime !== 0) {
                    return false;
            }
            return true;
        }
    }
    return false;
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
    if(isFestivalRequestValid(req.body)) {
        pg(table)
            .where('id', req.body.id)
            .update({
                name: req.body.name,
                date_begin: req.body.date_begin,
                date_end: req.body.date_end,
                description: req.body.description,
            }, '*')
            .then(festival => {
                res.status(200).json(festival);
            })
            .catch((e) => {
                console.log(e);
                res.status(404).json({
                    message: "Kon festival niet updaten!"
                })
            });        
    } else {
        console.log("Ongeldige request body!");
        res.status(400).json({
            message: "Ongeldige request body!"
        });
    }
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
        .del('id')
        .then(id => {
            res.status(200).json(id);
        })
        .catch((e) => {
            console.log(e);
            res.status(404).json({
                message: "Kon festival niet verwijderen!"
            })
        })
}

/**
 * Endpoint from the '/signup' route.
 */

signUpRouter.route('/signup')
    .post(postSignUpHandler);

/**
 * Endpoint from the '/login' route.
 */

loginRouter.route('/login')
    .post(postLoginHandler);

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
    signUpRouter,
    loginRouter,
    isFestivalRequestValid,
    isSignUpRequestValid,
};