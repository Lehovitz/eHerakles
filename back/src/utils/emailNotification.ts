
import nodemailer from "nodemailer";
export default (emailAddress: string) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "eHeraklesTeam@gmail.com",
      pass: "pass@word1",
    },
  });

  var mailOptions = {
    from: "eHerakles",
    to: emailAddress,
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
