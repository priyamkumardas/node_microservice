const AWS = require("aws-sdk");
const MailComposer = require("nodemailer/lib/mail-composer");
const fs = require("fs");
const { env } = require("@config");
// const {
//   ACCESSKEYID,
//   SECRETACCESSKEY,
//   REGION,
//   FROM,
// } = require("@root/src/config");
const ACCESSKEYID = "AKIAUYATD66FHRHBHFXC";
const SECRETACCESSKEY = "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";
const REGION = "ap-south-1";
const FROM = "info@sarvm.ai";

const awsConfig = {
  accessKeyId: ACCESSKEYID,
  secretAccessKey: SECRETACCESSKEY,
  region: REGION,
};

const SES = new AWS.SES(awsConfig);
let ses = new AWS.SESV2(awsConfig);

const sendEmail = async ({ to, subject, body }) => {
  const params = {
    Source: FROM,
    Destination: {
      ToAddresses: to,
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<p> ${body} </p>`,
        },
      },
    },
  };

  try {
    if (env == "production") {
      const emailSent = await SES.sendEmail(params).promise();
      console.log("Email sent successfully ");
      console.log(emailSent);
    }
  } catch (err) {
    console.log(err);
    //throw new SEND_EMAIL_ERROR();
  }
};
const sendEmailWithAttachments = async ({ to, subject, body, attachments }) => {
  const params = {
    Content: {
      Raw: { Data: await generateRawMailData(to, subject, body, attachments) },
    },
    Destination: {
      ToAddresses: to,
    },
    FromEmailAddress: FROM,
  };
  try {
    // const emailSent = await ses.sendEmail(params).promise();
    console.log("Email sent successfully ");
    // console.log(emailSent);
  } catch (err) {
    console.log(err);
    throw new SEND_EMAIL_ERROR();
  }
};
const generateRawMailData = (to, subject, body, attachments) => {
  let mailOptions = {
    from: FROM,
    to: to,
    subject: subject,
    text: body,
    attachments: attachments.map((a) => ({
      filename: a.name,
      content: a.data,
      encoding: "base64",
    })),
  };
  return new MailComposer(mailOptions).compile().build();
};
// sendEmail({
//   to: ["aditya.jha@sarvm.ai"],
//   subject: "Test subject",
//   body: "Test Email",
// });
// sendEmailWithAttachments({
//   to: ["aditya.jha@sarvm.ai"],
//   subject: "- SSO Number- State - PIN code - Retailer Phone -  Ret Name -",
//   body: "Please Find the attached report",
//   attachments: [
//     {
//       data: fs.readFileSync(
//         `src/reports/CatalogPending_Thu_Nov_24_2022_12_50_19.csv`,
//         {
//           encoding: "base64",
//         }
//       ),
//       name: "CatalogPending_Thu_Nov_24_2022_12_50_19.csv",
//     },
//   ],
// });
module.exports = {
  sendEmail,
  sendEmailWithAttachments,
};
