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
  const html_body = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 40px 0; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px;">Connection Successful!</h1>
      </div>
      <div style="padding: 40px 30px; text-align: center;">
        <div style="background-color: #e8f5e9; color: #2e7d32; display: inline-block; padding: 15px 25px; border-radius: 50px; font-weight: 600; margin-bottom: 25px;">
          ✓ Mailing Service is Active
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 20px;">
          Hi there,
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #555; margin-bottom: 30px;">
          This is a confirmation that your backend email configuration is set up correctly and the mail service is working perfectly.
        </p>
        <a href="#" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: 500;">
          Awesome!
        </a>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
        <p style="font-size: 12px; color: #999; margin: 0;">
          © ${new Date().getFullYear()} Social App. All rights reserved.
        </p>
        <p style="font-size: 12px; color: #999; margin: 5px 0 0 0;">
          Developed by Parthapratim Deuri
        </p>
      </div>
    </div>
  </div>`;

  let message = {
    from: EMAIL,
    to: userEmail,
    subject: "✨ Social App: Mail Service is Working!",
    html: html_body,
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