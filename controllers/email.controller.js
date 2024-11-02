const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");


let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    // logger: true,
    // debug: true,
    secureConnection: false,
    auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASS
    },
    tls: {
        rejectUnAuthorized: true
    }
});

const sendEmail = expressAsyncHandler(async (req, res) => {

    transporter.sendMail(req.body.mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            res.json({ message: "Email Sent Successfully."});
        }
    });

});

module.exports = sendEmail;