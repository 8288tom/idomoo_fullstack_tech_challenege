const oAuthToken = require("./token")
const axios = require("axios");
const BASE_API_URL = "https://usa-api.idomoo.com/api/v3";
const API_SECRET_HEADER = process.env.API_SECRET_HEADER;

module.exports.listStoryboards = async (req, res) => {
    const token = await oAuthToken.getToken();
    if (!token) {
        throw new Error(token.response);
    }
    const listStoryboardConfig = {
        method: "get",
        url: `${BASE_API_URL}/storyboards`,
        headers: { "Authorization": `Bearer ${token}` }
    };
    try {
        response = await axios(listStoryboardConfig);
        // loops over the response and extract necessary fields
        const simplifiedData = response.data.storyboards.map(storyboard => {
            return {
                storyboard_id: storyboard.storyboard_id,
                name: storyboard.name,
                thumbnail: storyboard.thumbnail,
            }
        })
        return simplifiedData
    }
    catch (error) {
        if (error.response) {
            error.message = error.response.data.errors;
            error.statusCode = error.response.status;
            throw error
        }
        else throw error
    }
};

module.exports.getStoryboardParams = async (storyboardId) => {
    const token = await oAuthToken.getToken()
    if (!token) {
        throw new Error(`Token not retrieved for API request ${token.response}`);
    }

    const config = {
        method: "get",
        url: `${BASE_API_URL}/storyboards/${storyboardId}`,
        headers: { "Authorization": `Bearer ${token}` }
    }
    try {
        const response = await axios(config)
        return response.data
    } catch (error) {
        if (error.response) {
            error.message = error.response.data.errors;
            error.statusCode = error.response.status;
            throw error
        }
        else throw error
    }
}

module.exports.generateStoryboard = async (storyboardId, format, height, body) => {
    if (!body) {
        let error = new Error("No data recieved in body of request");
        error.statusCode = 401;
        throw error
    }
    const token = await oAuthToken.getToken();
    if (!token) {
        throw new Error(token.response);
    }

    // construct the "data" array to be used in the "data" inside body of Idomoo API
    let dataFields = Object.entries(body).map(([key, value]) => ({ "key": key, "val": value }));
    const config = {
        method: "post",
        url: `${BASE_API_URL}/storyboards/generate`,
        headers: { "Authorization": `Bearer ${token}`, "x-idomoo-api-mode": API_SECRET_HEADER },
        data: {
            "storyboard_id": parseInt(storyboardId),
            "output": { "video": [{ "format": format || "mp4", "height": parseInt(height) || 720 }] },
            "data": dataFields
        }
    };
    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        if (error.response) {
            error.message = error.response.data.errors;
            error.statusCode = error.response.status;
            throw error
        }
        else throw error
    }
};