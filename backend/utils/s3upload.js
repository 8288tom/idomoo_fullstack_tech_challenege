const { S3 } = require('@aws-sdk/client-s3');

const multer = require('multer');
const multerS3 = require('multer-s3');


const s3 = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET
    },

    region: process.env.AWS_REGION
});

const uploadToS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'idomoofullstackchallenege',
        key: function (req, file, cb) {
            const uniqueFileName = Date.now().toString() + '-' + file.originalname;
            cb(null, uniqueFileName); // Use the file's original name as the S3 key
        }
    })
});

module.exports = {
    uploadToS3
}