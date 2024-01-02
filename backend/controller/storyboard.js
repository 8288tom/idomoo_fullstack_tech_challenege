const oAuthToken = require("./token")
const axios = require("axios");
const BASE_API_URL = "https://usa-api.idomoo.com/api/v3";
const API_SECRET_HEADER = process.env.API_SECRET_HEADER;

module.exports.listStoryboards = async (req, res) => {
    try {
        const token = await oAuthToken.getToken();
        if (!token) {
            throw new Error("Failed to retrieve token in List Storyboards")
        }
        const listStoryboardConfig = {
            method: "get",
            url: `${BASE_API_URL}/storyboards`,
            headers: { "Authorization": `Bearer ${token}` }
        }
        const response = await axios(listStoryboardConfig)
        console.log(response.data)
        const simplifiedData = response.data.storyboards.map(storyboard => {
            return {
                storyboard_id: storyboard.storyboard_id,
                name: storyboard.name,
                thumbnail: storyboard.thumbnail,
            }
        })
        return simplifiedData
    } catch (error) {
        return { "Error in listStoryboards:": error }
    }

}


module.exports.getStoryboardParams = async (req, res) => {
    const { id: storyboardId } = req.params;
    try {
        const token = await oAuthToken.getToken()
        if (!token) {
            throw new Error("Failed to retrieve token in Get Storyboard Params")
        }

        const getStoryboardParamsConfig = {
            method: "get",
            url: `${BASE_API_URL}/storyboards/${storyboardId}`,
            headers: { "Authorization": `Bearer ${token}` }
        }

        const response = await axios(getStoryboardParamsConfig)
        return response.data
    } catch (error) {
        return { "Error in getStoryboardParams :": error }
    }
}


module.exports.generateStoryboard = async (req, res) => {
    if (!req.body || !req.file) {
        return "No data recieved in body of request"
    }
    const { id: storyboardId } = req.params;
    const { format, height } = req.query;
    const fileValUrl = req.file.location;
    let dataFields = [];

    // adding the text placeholders key-value (dynamic):
    for (const [key, value] of Object.entries(req.body)) {
        dataFields.push({ "key": key, "val": value })
    }
    //Adding the media placeholder key-value:
    dataFields.push({ "key": "Media1", "val": fileValUrl });
    /*
    this is static because of the challenege, if I'd want to make it dynamic 
    (i.e. multiple media placeholders) I would implement a middleware to check how many files uploaded
    then give them name (for multer to work) >upload them > add them to the API Call:
    */

    try {
        const token = await oAuthToken.getToken()
        if (!token) {
            throw new Error("Failed to retrieve token in Generate Storyboard")
        }
        const postGenerateStoryboardConfig = {
            method: "post",
            url: `${BASE_API_URL}/storyboards/generate`,
            headers: {
                "Authorization": `Bearer ${token}`,
                "x-idomoo-api-mode": API_SECRET_HEADER
            },
            data: {
                "storyboard_id": parseInt(storyboardId),
                "output": {
                    "video": [
                        {
                            "format": format || "mp4",
                            "height": parseInt(height) || 720
                        }
                    ]
                },
                "data": dataFields
            }
        }
        const response = await axios(postGenerateStoryboardConfig)
        const check_status_url = response.data.check_status_url

        return [response.data, { "check_status": check_status_url }]
    } catch (error) {
        return { "ERROR in generateStoryboard:": error }
    }

}
