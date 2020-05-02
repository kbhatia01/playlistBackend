const express = require('express');
const router = express.Router();
const jwtDecode = require('jwt-decode');
const user = require('../Model/userModel')
router.use("*", function (req, res, next) {
    if (req.headers['access-token']) {
        const decoded = jwtDecode(req.headers['access-token']);
        req.headers['user_id'] = decoded.sub;
        if (user.findOne({ id: decoded.sub }))
            next();
        else {
            res.json({ status: 404, response: "User not found" })
        }
    }
    else
        res.json({ status: 401, response: "UnAuthorized" })
})

module.exports = router;
