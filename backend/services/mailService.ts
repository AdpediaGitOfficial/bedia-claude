import nodemailer from 'nodemailer';
import logger from '../config/logger';
import configKeys from '../configKeys';

interface Attachment {
  filename: string;
  path: string;
}

// export const sendEmail = async (
//   to: string,
//   subject: string,
//   text: string,
//   html?: string,
//   attachments?: Attachment[],
// ) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: configKeys.CLIENT_MAIL,
//       pass: configKeys.CLIENT_PASSWORD,
//     },
//     socketTimeout: 60000,
//   });

//   const mailOptions = {
//     from: `Bediapottery <${configKeys.CLIENT_MAIL}>`,
//     to,
//     subject,
//     text,
//     html,
//     attachments,

//     headers: {
//       'List-Unsubscribe': `<mailto:${configKeys.CLIENT_MAIL}?subject=unsubscribe>`,
//       'X-Priority': '3 (Normal)',
//       'X-Mailer': 'Nodemailer',
//     },
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);

//     logger.info(`Mail sent successfully to ${to}`);

//     return info;
//   } catch (error) {
//     logger.error('Error sending email:', error);

//     throw error;
//   }
// };

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
  attachments?: Attachment[],
  cc?: string | string[],
) => {
  console.log('================ EMAIL START ================');
  console.log('TO:', to);
  console.log('SUBJECT:', subject);
  console.log('CLIENT_MAIL:', configKeys.CLIENT_MAIL);
  console.log('CLIENT_PASSWORD:', configKeys.CLIENT_PASSWORD ? 'CONFIGURED' : 'MISSING');

  /////////////// Use for Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: configKeys.CLIENT_MAIL,
      pass: configKeys.CLIENT_PASSWORD,
    },
    socketTimeout: 60000,
    logger: true,
    debug: true,
  });

  //Live one
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,

  //   port: Number(process.env.SMTP_PORT),

  //   secure: false, // 587 uses TLS

  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASSWORD,
  //   },

  //   tls: {
  //     rejectUnauthorized: false,
  //   },

  //   socketTimeout: 60000,

  //   logger: true,
  //   debug: true,
  // });

  try {
    console.log('Verifying SMTP connection...');

    await transporter.verify();

    console.log('SMTP CONNECTION SUCCESSFUL');

    const mailOptions = {
      //   from: `Bediapottery <${configKeys.CLIENT_MAIL}>`,
      from: {
        name: process.env.MAIL_NAME!,
        address: process.env.MAIL_FROM!,
      },
      to,
      cc,
      subject,
      text,
      html,
      attachments,

      headers: {
        'List-Unsubscribe': `<mailto:${configKeys.CLIENT_MAIL}?subject=unsubscribe>`,
        'X-Priority': '3 (Normal)',
        'X-Mailer': 'Nodemailer',
      },
    };

    console.log('Sending email...');

    const info = await transporter.sendMail(mailOptions);

    console.log('EMAIL SENT SUCCESSFULLY');
    console.log('MESSAGE ID:', info.messageId);
    console.log('ACCEPTED:', info.accepted);
    console.log('REJECTED:', info.rejected);
    console.log('RESPONSE:', info.response);

    logger.info(`Mail sent successfully to ${to}`);

    console.log('================ EMAIL END ================');

    return info;
  } catch (error: any) {
    console.error('================ EMAIL ERROR ================');
    console.error('TO:', to);
    console.error('SUBJECT:', subject);
    console.error('ERROR MESSAGE:', error?.message);
    console.error('ERROR CODE:', error?.code);
    console.error('ERROR COMMAND:', error?.command);
    console.error('FULL ERROR:', error);
    console.error('================ EMAIL ERROR END ================');

    logger.error('Error sending email:', error);

    throw error;
  }
};
