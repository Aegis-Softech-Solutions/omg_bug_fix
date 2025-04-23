import AWS from 'aws-sdk';
import fs from 'fs';
import paymentReceivedTemplate from '../aws_ses_templates/payment-received.json';
import paymentFailedTemplate from '../aws_ses_templates/payment-failed.json';
import profileApprovedTemplate from '../aws_ses_templates/profile-approved.json';
import profileRejectedTemplate from '../aws_ses_templates/profile-rejected.json';
import TestTemplate from '../aws_ses_templates/test-template.json';

const SES_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

const AWS_SES = new AWS.SES(SES_CONFIG);

function escapeRegExp(input) {
  return (input || '').replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
}

//find regular expression to match with the {{ }}
function reduceTemplate(template, key) {
  return template.replace(new RegExp('{{\\s*' + escapeRegExp(key) + '\\s*}}', 'g'), this.data[key]);
}

//reduce the data and variables
function applyTemplate(template, data) {
  return Object.keys(data).reduce(reduceTemplate.bind({ data }), template);
}

const sendEmail = async ({ templateName, templateData, toAddress, subject }) => {
  // TO CHECK IF AWS CREDENTIALS ARE SET CORRECTLY
  //   AWS.config.getCredentials(function (err) {
  //     if (err) console.log(err.stack);
  //     // credentials not loaded
  //     else {
  //       console.log('Access key:', AWS.config.credentials.accessKeyId);
  //     }
  //   });

  if (!templateName) throw new UserInputError('Please specify a template to send e-mail.');

  const readstream = fs.createReadStream(process.cwd() + `/src/templates/${templateName}.txt`, 'utf8');
  let template = '';

  readstream.on('data', (chunk) => {
    template = template + chunk.toString();
  });

  readstream.on('end', async () => {
    let compiledTemplate = applyTemplate(template, {});

    if (templateData && Object.keys(templateData).length) {
      for (const [key, value] of Object.entries(templateData)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        compiledTemplate = compiledTemplate.replace(regex, value);
      }
    }

    const params = {
      Source: 'OMG <info@omgfaceoftheyear.com>',
      Destination: { ToAddresses: [toAddress] },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: compiledTemplate,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
    };

    return await AWS_SES.sendEmail(params).promise();
  });
};

const sendBulkEmail = async (toAddressArray, template) => {
  // TO CHECK IF AWS CREDENTIALS ARE SET CORRECTLY
  //   AWS.config.getCredentials(function (err) {
  //     if (err) console.log(err.stack);
  //     // credentials not loaded
  //     else {
  //       console.log('Access key:', AWS.config.credentials.accessKeyId);
  //     }
  //   });

  let destinations = [];
  if (toAddressArray && toAddressArray.length) {
    toAddressArray.forEach((email) => {
      destinations.push({
        Destination: { ToAddresses: [email] },
        ReplacementTemplateData: '{}',
      });
    });
  }

  const params = {
    Source: 'OMG <info@omgfaceoftheyear.com>',
    Template: template,
    Destinations: destinations,
    DefaultTemplateData: '{}',
  };

  return await AWS_SES.sendBulkTemplatedEmail(params).promise();
};

const sendTemplateEmail = async (toAddressArray, templateName, templateData) => {
  // TO CHECK IF AWS CREDENTIALS ARE SET CORRECTLY
  //   AWS.config.getCredentials(function (err) {
  //     if (err) console.log(err.stack);
  //     // credentials not loaded
  //     else {
  //       console.log('Access key:', AWS.config.credentials.accessKeyId);
  //     }
  //   });

  const params = {
    Source: 'OMG <info@omgfaceoftheyear.com>',
    Template: templateName,
    Destination: { ToAddresses: toAddressArray },
    TemplateData: templateData ? templateData : '{}',
  };
  return await AWS_SES.sendTemplatedEmail(params).promise();
};

const createTemplate = async () => {
  // TO CHECK IF AWS CREDENTIALS ARE SET CORRECTLY
  //   AWS.config.getCredentials(function (err) {
  //     if (err) console.log(err.stack);
  //     // credentials not loaded
  //     else {
  //       console.log('Access key:', AWS.config.credentials.accessKeyId);
  //     }
  //   });

  // return await AWS_SES.createTemplate(paymentReceivedTemplate).promise();
  // return await AWS_SES.createTemplate(paymentFailedTemplate).promise();
  // return await AWS_SES.createTemplate(profileApprovedTemplate).promise();
  // return await AWS_SES.createTemplate(profileRejectedTemplate).promise();
  return await AWS_SES.createTemplate(TestTemplate).promise();
};

const updateTemplate = async () => {
  // TO CHECK IF AWS CREDENTIALS ARE SET CORRECTLY
  //   AWS.config.getCredentials(function (err) {
  //     if (err) console.log(err.stack);
  //     // credentials not loaded
  //     else {
  //       console.log('Access key:', AWS.config.credentials.accessKeyId);
  //     }
  //   });

  // await AWS_SES.updateTemplate(paymentReceivedTemplate).promise();
  // await AWS_SES.updateTemplate(paymentFailedTemplate).promise();
  // await AWS_SES.updateTemplate(profileApprovedTemplate).promise();
  // await AWS_SES.updateTemplate(profileRejectedTemplate).promise();
  await AWS_SES.updateTemplate(TestTemplate).promise();

  return true;
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  sendTemplateEmail,
  createTemplate,
  updateTemplate,
};
