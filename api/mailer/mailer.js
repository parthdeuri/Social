const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

let config = {
  host: "smtp-relay.brevo.com",
  port: 2525, // Using 2525 as port 587 is often blocked by hosting providers
  secure: false,
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
}

let transporter = nodemailer.createTransport(config);


const sendMail = async ({ name, userEmail, text, subject, code }) => {

  let content = `Hello  ${name || userEmail},\n\n!!!!! Welcome to Social !!!!!!\n\n ${text} \n\n\n Yours truly,\nDeveloped by\nPartha`;

  var html_body = `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
          Welcome to Social 
        </a>
      </div>
      <p style="font-size:1.1em">Hi ${name || userEmail},</p>
      <p>Thank you for being part of Social: the media that connects you. Use the following OTP to verify yourself.</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
      <p style="font-size:0.9em;">
        Regards,
        <br/> 
        Parthapratim Deuri, 
        <br /> 
        Creator
      </p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Developed by</p>
        <p>Parthapratim Deuri</p>
        <p></p>
      </div>
    </div>
  </div>`

  let message = {
    from: EMAIL,
    to: userEmail,
    subject: subject || "OTP for verification",
    // text: content,
    html: html_body
  }

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return ({ error: error, msg: "mail not sent" })
    } else {
      console.log('Email sent:', info.response);
      return ({ msg: "You should receive an email from us." })
    }
  });
}

const sendTestMail = async ({ userEmail }) => {
  let message = {
    from: EMAIL,
    to: userEmail,
    subject: "Test Mail Service",
    text: "The mailing service is working."
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject({ error: error, msg: "mail not sent" });
      } else {
        console.log('Email sent:', info.response);
        resolve({ msg: "You should receive an email from us." });
      }
    });
  });
}

module.exports = { sendMail, sendTestMail };