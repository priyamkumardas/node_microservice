
const express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
function generateAccessToken() {
    let jwtSecretKey = "user_mgmt_jwt_secret_key";
    let data = {
        time: Date(),
        userId: 12,
    }

    const token = jwt.sign(data, jwtSecretKey);

    return token;
}


function verifyToken(next) {
    let tokenHeaderKey = "user_mgmt_token_header_key";
    let jwtSecretKey = "user_mgmt_jwt_secret_key";
    try {
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {

        } else {


        }
        console.log(verified);
    }
    catch (error) {

    }
}