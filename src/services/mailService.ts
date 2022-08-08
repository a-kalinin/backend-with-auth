import nodemailer from 'nodemailer';

// https://nodemailer.com/plugins/
// These are some existing public plugins for Nodemailer
//
// express-handlebars – this plugin uses the express-handlebars view
//    engine to generate html emails
// inline-base64 – This plugin will convert base64-encoded images in your
//    nodemailer email to be inline (“CID-referenced”) attachments within the email

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_SSL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendActivationCode(email, code) {
  const link = `${process.env.PROJECT_URL}/api/users/activate/${code}`;
  return transporter.sendMail({
    // from: '"Fred Foo 👻" <foo@example.com>', // sender address
    from: process.env.SMTP_USER,
    to: email, // list of receivers
    subject: `Registration on ${process.env.PROJECT_NAME}`, // Subject line
    text: '', // plain text body
    // html body
    html: `
      <div>
        <h3>Activate account with this link:</h3>
        <div style="font-size 16px; text-align: center">
          <a href="${link}" target="_blank">Activate</a>
        </div>
      </div>
    `,
  });
}
