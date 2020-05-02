var express = require('express');
var router = express.Router();
var user = require('../Model/userModel');
const mongoose = require('mongoose');

router.post('/newUser', async function (req, res, next) {
    let newUser = new user(req.body);
    console.log(newUser)
    let userExist = await user.findOne({ id: req.body.id })
    if (!userExist) {
        newUser.save(function (err) {
            if (err) {
                res.json({ response: err.message });

            }
            else
                res.json({ status: 200, response: 'User saved successfully!' });
        });
    }
    else
        res.json({ status: 200, response: 'user already exist' });
});

router.get('/:id', async function (req, res, next) {

    let userExist = await user.findOne({ id: req.params.id })
    if (!userExist) {
        res.json({ status: 404, response: 'user not found' });
    }
    else
        res.json({ status: 200, response: userExist });
});


module.exports = router;
