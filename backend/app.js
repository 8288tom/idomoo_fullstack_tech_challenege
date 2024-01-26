const express = require("express");
const storyboard = require("./controller/storyboard")
const { uploadToS3 } = require("./utils/s3upload")
//using multer to parse multipart/form
const multer = require('multer');
const rateLimit = require('express-rate-limit');
require("dotenv").config()
const cors = require('cors');

const PORT = process.env.PORT || 5172;





const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// cors restirctions from the same host only.
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();



// Middleware to parse URL-encoded data and JSON data
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true }))

app.use(cors(corsOptions));






// ROUTES:
//API route to list storyboards
app.get("/api/list_storyboards", async (req, res, next) => {
    try {
        const data = await storyboard.listStoryboards()
        return res.status(200).json(data)
    } catch (error) {
        next(error)
    }
})
//API route to get SB parameters
app.get("/api/:id", async (req, res, next) => {
    try {
        const { id: storyboardId } = req.params;
        const data = await storyboard.getStoryboardParams(storyboardId)
        return res.status(200).json(data)
    } catch (error) {
        next(error)
    }

})
//API route for uploading images to S3
app.post("/api/upload", uploadToS3.single('media'), async (req, res, next) => {
    try {
        if (req.file && ["image/jpg", "image/png", "image/jpeg"].includes(req.file.mimetype)) {
            return res.status(200).json({ "url": req.file.location })
        }
        throw new Error("File has to be one of: [png, jpg, jpeg]")
    } catch (error) {
        next(error)
    }
})
// API route to generate a SB
app.post("/api/:id", multer().none(), async (req, res, next) => {
    const { format, height } = req.query;
    const { id } = req.params;
    // To remove the null object created by multer (upload.none() middleware)
    const body = { ...req.body };

    try {
        const response = await storyboard.generateStoryboard(id, format, height, body)
        return res.status(200).json(response)
    } catch (error) {
        next(error)
    }
})

// Centralized error handling middleware
function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Oops, something went wrong! check the logs"
    const stack = process.env.NODE_ENV === 'dev' ? err.stack : null

    console.error("An error occured:", err)

    res.status(statusCode).json({
        error: {
            message: errorMessage,
            stack
        }
    });
}

app.use(errorHandler);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});