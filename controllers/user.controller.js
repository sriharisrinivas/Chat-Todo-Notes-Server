const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
let tokenGenerator = require("jsonwebtoken");
const sendEmail = require("./email.controller");
const otpModel = require("../models/otp.model");


const loginController = async (request, response) => {
    try {
        let userNameCheck = await userModel.findOne({ email: request.body.email });

        if (!userNameCheck) {
            response.status(400).json({ message: "User Not Registered. Register by clicking Sign Up" });
        } else {
            const validPassword = await bcrypt.compare(request.body.password, userNameCheck.password);
            if (validPassword) {
                const payload = { email: userNameCheck.email };
                let jwtToken = tokenGenerator.sign(payload, process.env.SECRET_TOKEN_KEY);

                response.status(200).json({ jwtToken });
            } else {
                response.status(400).json({ message: "Invalid Password. Try Again." });
            }
        }

    } catch (error) {
        response.status(400).json({ message: error.message });
    }
};

const getProfileController = async (request, response) => {
    try {
        let userDetails = await userModel.findOne({ email: request.email });
        response.status(200).json(userDetails);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
};

const createUserController = async (request, response) => {
    try {
        const duplicateUserCheck = await userModel.findOne({ email: request.body.email });

        if (duplicateUserCheck) {
            response.status(400).json({ message: "User Already Exists" });
        } else {
            const hashedPassword = await bcrypt.hash(request.body.password, 10);
            const userDetails = await userModel.create({ ...request.body, password: hashedPassword });
            response.status(200).json(userDetails);
        }

    } catch (error) {
        response.status(400).json({ message: error.message });
    }
};


const updateProfileController = async (request, response) => {
    try {

        const { profilePic, firstName, lastName, gender } = request.body;

        const updatedResponse = await userModel.updateOne({ email: request.email },
            {
                $set: {
                    profilePic: profilePic,
                    firstName: firstName,
                    lastName: lastName,
                    gender: gender
                }
            });

        response.status(200).json(updatedResponse);
    } catch (error) {
        response.status(400).json({ message: error.message });
    }

};

const changePasswordController = async (request, response) => {
    try {
        const { newPassword, oldPassword } = request.body;

        let userDetails = await userModel.findOne({ email: request.email });

        let isPasswordValid = await bcrypt.compare(oldPassword, userDetails.password);

        if (isPasswordValid) {
            let hashedPassword = await bcrypt.hash(newPassword, 10);
            const updatedResponse = await userModel.updateOne({ email: request.email }, { $set: { password: hashedPassword } });
            response.status(200).json(updatedResponse);
        } else {
            response.status(400).json({ message: "Invalid Old Password." });
        }
    } catch (error) {
        response.status(400).json({ message: error.message });
    }

};

function generatePass() {
    let pass = '';
    let str = '0123456789';

    for (let i = 1; i <= 5; i++) {
        let char = Math.floor(Math.random()
            * str.length + 1);

        pass += str.charAt(char);
    }

    return pass;
}

const generateOtpController = async (request, response) => {
    try {
        let userDetails = await userModel.findOne({ email: request.body.email });

        let otp = generatePass();
        let hashedOtp = await bcrypt.hash(otp, 10);

        if (userDetails) {

            // Saving OTP in DB.

            let isOtpPresent = await otpModel.findOne({ email: request.body.email });
            if (isOtpPresent) {
                await otpModel.updateOne({ email: request.body.email }, { $set: { otp: hashedOtp } });
            } else {
                await otpModel.create({ email: request.body.email, otp: hashedOtp });
            }

            // Sending Email with password
            request.body.mailOptions = {
                from: 'TO-DO <todocashbookapp@gmail.com>',
                to: request.body.email,
                subject: 'Reset Password',
                html: `<p>Your OTP is <strong>${otp}</strong>.</p>`
            };
            sendEmail(request, response);



        } else {
            response.status(400).json({ message: "User Not Registered. Please check your email address." });
        }
    } catch (error) {
        response.status(400).json({ message: error.message });
    }

};

const verifyOtpController = async (request, response) => {
    try {
        let userDetails = await otpModel.findOne({ email: request.body.email });

        if (userDetails) {
            if (await bcrypt.compare(request.body.otp, userDetails.otp)) {
                response.status(200).json({ message: "OTP Verified." });
            } else {
                response.status(400).json({ message: "Invalid OTP. Please try again." });
            }
        }

    } catch (error) {
        response.status(400).json({ message: error.message });
    }
};

const resetPasswordController = async (request, response) => {
    try {

        // Again Verifying OTP
        let userDetails = await otpModel.findOne({ email: request.body.email });

        if (userDetails) {
            if (await bcrypt.compare(request.body.otp, userDetails.otp)) {

                let hashedPassword = await bcrypt.hash(request.body.password, 10);
                userModel.updateOne({ email: request.body.email }, { $set: { password: hashedPassword } });
                response.status(200).json({ message: "Updated Password Successfully" });

            } else {
                response.status(400).json({ message: "Invalid OTP. Please try again." });
            }
        }
    } catch (error) {
        response.status(400).json({ message: error.message });
    }

};

const feedbackController = async (request, response) => {
    try {
        let userDetails = await userModel.findOne({ email: request.email });
        // Sending feeback email to admin
        request.body.mailOptions = {
            from: request.email,
            to: process.env.NODEMAILER_MAIL,
            subject: `Received feedback ${request.email}`,
            text: request.body.comment
        };
        sendEmail(request, response);

        // Sending greeting email to user
        request.body.mailOptions = {
            from: process.env.NODEMAILER_MAIL,
            to: request.email,
            subject: 'FeedBack',
            text: `We Received your feedback. Thank you.`,
            html: `<div>
                <p>Hi ${userDetails.firstName} ${userDetails.lastName}. Thank you for your feedback.</p>
                <p>We received your feedback as <strong>${request.body.comment}</strong></p>
                <span style='font-size:100px;'>&#128519;</span>
            </div>`
        };
        sendEmail(request, response);

    } catch (error) {
        response.status(400).json({ message: error.message });
    }
};


const contactController = async (request, response) => {
    try {
        request.body.mailOptions = {
            from: request.body.email,
            to: "sriharisrinivas995@gmail.com",
            subject: 'Portfolio Contact',
            text: request.body.message,
            html: `<p>Received message from ${request.body.email}.</p>
            <p>Message: ${request.body.message}</p>
            <p>Name: ${request.body.name}</p>`
        };
        sendEmail(request, response);

    } catch (error) {
        response.status(400).json({ message: error.message });
    }
};

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return {
            message: "session out",
            logout: true,
        };
    }

    const decode = await tokenGenerator.verify(token, process.env.SECRET_TOKEN_KEY);

    const user = await userModel.findOne({ email: decode.email }).select('-password');

    return user;
}


module.exports = {
    loginController,
    createUserController,
    changePasswordController,
    resetPasswordController,
    getProfileController,
    verifyOtpController,
    generateOtpController,
    feedbackController,
    contactController,
    updateProfileController,
    getUserDetailsFromToken
};
