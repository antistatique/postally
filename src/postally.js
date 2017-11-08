const path      = require('path');
const sgMail    = require('@sendgrid/mail');
const Twig      = require('twig');
const sass      = require('node-sass');
const Inky      = require('inky').Inky;
const inlineCss = require('inline-css');

const postallyHTML = require('./templates/html.js');
const postallySASS = require('./templates/sass.js');

/**
 * Create and send custom HTML Email using Twig, Foundation for Emails and Sendgrid
 * 
 * @param {Object} {
 *   from {string} email to send from
 *   to {string} email to send to
 *   subject {string} email subject
 *   data {Object} data to pass to Twig template
 *   markup {string} Email Inky/Twig markup
 *   variables {string} Foundation for Emails and custom Sass variables
 *   styles {string} Custom (S)CSS
 *   sendgrid_api_key {string} Sendgrid API Key (can send mails)
 * } 
 * @returns {Promise} status code (201 is OK) 
 */
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