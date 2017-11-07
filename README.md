# 📯 Postally

> AiO email creator and delivery system

## Prerequisites

Your project need [NodeJS 8+](https://nodejs.org/en/).

**Postally** are using the following libraries to offer an AiO email system :
- **[Twig.js](https://github.com/twigjs/twig.js)** as the main template engine
- **[Inky](https://github.com/zurb/inky)** as the Email template engine
- **[Foundation for Emails](https://github.com/zurb/foundation-emails/)** as HTML/CSS framework
- **[Sendgrid](https://github.com/sendgrid/sendgrid-nodejs)** to send Email *(free account up to 40k/mo)*

To **help** your Email creation process, you can take a look at :
- [Twig documentation](https://twig.symfony.com/doc/2.x/)
- [Inky templates examples](https://github.com/zurb/foundation-emails/tree/develop/templates)
- [Available Sass variables](https://github.com/zurb/foundation-emails/blob/develop/scss/_global.scss)

## Usage

Then, you can simply use it this way :

```javascript
const postally = require('@antistatique/postally');

// Email (Twig/Inky) markup
const markup = `
  <container>
    <row>
      <columns align="left">
        <h1>Hello {{name}}</h1>
      </columns>
    </row>
  </container>
`;

// Custom and Foundation Email SASS variables
const variables = `
  $primary-color: #0ECEE1 !default;
`

// Custom (S)CSS
const styles = `
  body { background: $primary-color; }
  h1 { font-family: Georgia, serif;}
`

postally({
  from: 'from@example.org',
  to: 'to@example.org',
  subject: 'Postally is amazing !',
  data: { name: 'You' },
  markup,
  variables,
  styles,
  sendgrid_api_key: 'XXXXXXXXXXXXX',
}).then((status) => { console.log('Success !', status); });
```