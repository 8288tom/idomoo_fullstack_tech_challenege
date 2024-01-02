const express = require("express");
const storyboard = require("./controller/storyboard")
const { uploadToS3 } = require("./utils/s3upload")
require("dotenv").config()


const app = express();



// to parse POST/PUT requests bodies and JSON properly
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true }))




// ROUTES:
app.get("/api/list_storyboards", async (req, res) => {
    try {
        const data = await storyboard.listStoryboards()
        res.status(200).json(data)
    } catch (error) {
        console.error("ERROR", error);
        res.status(500).json("AN ERROR OCCURED TRYING TO USE BACKEND CONTROLLER", error)
    }

})

app.get("/api/:id", async (req, res) => {
    try {
        const data = await storyboard.getStoryboardParams(req, res)
        res.status(200).json(data)
    } catch (error) {
        console.error("ERROR", error);
        res.status(500).json("AN ERROR OCCURED TRYING TO USE BACKEND CONTROLLER", error)

    }

})


app.post("/api/:id", uploadToS3.single('media'), async (req, res) => {
    try {
        const response = await storyboard.generateStoryboard(req, res)
        res.status(200).json(response)
    } catch {
        console.error("ERROR", error)
        res.status(500).json("AN ERROR OCCURED TRYING TO USE BACKEND CONTROLLER", error)
    }
})




app.listen(5172, () => {
    console.log("Serving on port 5172")
})