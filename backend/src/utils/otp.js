
import nodemailer from "nodemailer";


function sendOTPByEmail(email, otp) {
    // Configure nodemailer with your email service provider details
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      port: 465,
      auth: {
        user: "krishpatelk123@gmail.com",
        pass: "keug uazq fygo ffzk",
      },
    });
  
    // Email message options
    const mailOptions = {
      from: "krishpatelk123@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP: ${otp}`,
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Failed to send OTP:", error);
      } else {
        console.log("OTP sent successfully:", info.response);
      }
    });
  }


  const generateOTP = () => {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  };

  export{sendOTPByEmail, generateOTP}