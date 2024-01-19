require("dotenv").config()
const axios = require("axios");
const API_KEY = process.env.API_KEY;
const API_ACCOUNT = process.env.API_ACCOUNT;
const BASE_API_URL = "https://usa-api.idomoo.com/api/v3";


var accessToken = null;
var tokenExpiry = null;

// Function that requests a token
const getOAuthToken = async () => {
    try {
        const response = await axios.post(`${BASE_API_URL}/oauth/token`, {}, {
            auth: {
                username: API_ACCOUNT,
                password: API_KEY
            }
        })
        accessToken = response.data.access_token;
        // calculates when the token is going to expire
        const expiresInMs = response.data.expires_in * 1000
        tokenExpiry = new Date().getTime() + (response.data.expires_in * 1000);
        const expiresInMinutes = Math.floor(expiresInMs / 60000);
        console.log(`Token fetched, stored and expires in: ${expiresInMinutes} mins`)
        return accessToken
    } catch (error) {
        if (error.response) {
            error.message = error.response.data.errors;
            error.statusCode = error.response.status;
            throw error
        }
        else throw error
    }
}
// function to check whether the token has expired or not
const isTokenExpired = () => {
    return !tokenExpiry || new Date().getTime() > tokenExpiry;
};


//checks if token epxired, if it did, request a new one, otherwise return token
module.exports.getToken = async () => {
    if (isTokenExpired()) {
        return await getOAuthToken()
    }
    else {
        return accessToken
    }
};


