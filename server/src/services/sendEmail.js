//Get the instance of sendgrdi

const SGmail = require('@sendgrid/mail');
const fs = require('fs'); //import fs module

//set up the API key
SGmail.setApiKey(process.env.SENDGRID_API_KEY);

// console.log(' ');
// console.log('SGmail: ', SGmail);
// console.log(' ');

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

module.exports = (email, { template_name, template_data, mailSubject }, isBulk) => {
  //get the path
  const readstream = fs.createReadStream(
    // process.cwd() + "/src/templates/" + template_name?template_name:"invoiceDue" + ".txt",
    template_name
      ? process.cwd() + '/src/templates/' + template_name + '.txt'
      : process.cwd() + '/src/templates/invoiceDue.txt',
    'utf8'
  );
  let template = '';

  readstream.on('data', function(chunk) {
    template = template + chunk.toString();
  });

  readstream.on('end', function() {
    let compiledTemplate = applyTemplate(template, template_data);

    const sendGridEmailObj = {
      to: isBulk ? 'ashishpixels@gmail.com' : email,
      bcc: isBulk ? email : [],
      from: 'ashishpixels@gmail.com',
      subject: mailSubject || 'Hello From oMg',
      text: ' ',
      html: compiledTemplate
    };

    SGmail.send(sendGridEmailObj).then((mailSentResponse) => {
      // console.log('SendGrid Response: ', mailSentResponse); //response
    });
  });
};
