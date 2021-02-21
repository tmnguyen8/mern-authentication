const Datauri = require("daturi");
const path = require("path");

const cloudinary = require("../config/cloudinary");
const sgMail = require("@sendgrid/mail");
const { resolve } = require("path");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// uploader
// used for uploading images to cloudinary, accepts the request as a parameter.
// the Datauri package is used to recreate the image using the 'buffer' key in 'req.file'. 
// The image's content is passed to cloudinary upload function. If the upload is successful, 
// the uploaded image url is returned.
function uploader(req) {
    return new Promise((resolve, reject) => {
        const dUri = new Datauri();
        let image = dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

        cloudinary.uploader.upload(image.content, (err, url) => {
            if (err) return reject(err);
            return resolve(url);
        })
    })
}

// sendEmail method
// used for sending emails using sendgrid package, accepts an object containing the from, 
// to, subject and text or html info, the object is passed to sendgrid send function to send 
// the the email. If successful, the result is returned
function sendEmail(emailOptions) {
    return new Promise((resolve, reject) => {
        sgMail.send(mailOptions, (error, result) => {
            if (error) return reject(error);
            return resolve(result
        })
    })
}

module.exports = {uploader, sendEmail}