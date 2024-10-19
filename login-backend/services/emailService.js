// services/emailService.js
const nodemailer = require('nodemailer');

function sendMfaEmail(username, mfaCode, name) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'truongclone232@gmail.com',
            pass: 'kchl jlpx eodu phle'
        }
    });

    const mailOptions = {
        from: 'truongclone232@gmail.com',
        to: username,
        subject: 'Mã xác thực MFA',
        text: `Xin chào ${name},\n\nMã MFA của bạn là: ${mfaCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Lỗi khi gửi email: ' + error);
        } else {
            console.log('Email đã được gửi: ' + info.response);
        }
    });
}

module.exports = { sendMfaEmail };
