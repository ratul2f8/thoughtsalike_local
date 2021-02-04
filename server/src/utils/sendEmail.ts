import nodemailer from "nodemailer";
// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, html: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();//uncomment for initial use and store the user and pass
  //console.log("test account", testAccount);//uncomment fro initial use

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      // //uncomment for initial use
      // user: testAccount.user, // generated ethereal user
      // //uncomment fro initial use
      // pass: testAccount.pass, // generated ethereal password
      user: "na3bbya4l75nwdr3@ethereal.email",
      pass: "Rnedpcu4cFWTfJwude",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to, // list of receivers
    subject: "Change Password",
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
