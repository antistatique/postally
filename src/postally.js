const path      = require('path');
const sgMail    = require('@sendgrid/mail');
const Twig      = require('twig');
const sass      = require('node-sass');
const Inky      = require('inky').Inky;
const inlineCss = require('inline-css');

const postallyHTML = require('./templates/html.js');
const postallySASS = require('./templates/sass.js');

const postally = async ({
  from,
  to,
  subject = '@antistatique/postally is amazing !',
  data = {},
  markup = '',
  variables = '',
  styles = '',
  sendgrid_api_key
}) => {
  // Build CSS from Foundation for Email
  const css = await new Promise((resolve, reject) => {
    return sass.render({
      data: postallySASS(variables, styles),
      outputStyle: 'compressed'
    }, (error, result) => {
      if (error) console.log(error);
      resolve(result.css.toString());
    });
  });

  // Create Email HTML using Twig, Inky and Zurb inline CSS
  const html = Twig.twig({data: postallyHTML(markup, css)}).render(data);
  const body = new Inky({}).releaseTheKraken(html);
  const sanitizedBody = await new Promise((resolve, reject) => {
    return inlineCss(body, { url: '/' }).then(html => resolve(html));
  });

  // Send Email via Sendgrid
  return new Promise((resolve, reject) => {
    sgMail.setApiKey(sendgrid_api_key);
    sgMail.send({
      to,
      from,
      subject,
      html: sanitizedBody,
    }, (err, res) => {
      if (err) reject(err);
      resolve(res[0].statusCode);
    });
  });
};

module.exports = postally;