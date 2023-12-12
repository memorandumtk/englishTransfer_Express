'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res, next) => {
      const body = req.body;
      const text = req.body.text;
      const locale = req.body.locale;
      if (text === undefined || locale === undefined) {
        res.send({ error: 'Required field(s) missing' });
      } else if (text == '') {
        res.send({ error: 'No text to translate' });
      } else if (locale !== "american-to-british" && locale !== "british-to-american") {
        res.send({ error: 'Invalid value for locale field' });
      } else if (locale === "american-to-british") {
        const result = translator.us2uk(text);
        res.send({ "text": text, "translation": result });
      } else if (locale === "british-to-american") {
        const result = translator.uk2us(text);
        res.send({ "text": text, "translation": result });
      }

    });
};


// switch (body) {
//   case (!text || !locale):
//     res.send({ error: 'Required field(s) missing' });
//     break;
//   case text == '':
//     res.send({ error: 'No text to translate' });
//     break;
//   case (locale !== "american-to-british"
//     && "british-to-american"):
//     res.send({ error: 'Invalid value for locale field' });
//     break;
//   case locale === "american-to-british":
//     // let result = translator.
//     res.send('ok');
//     break;
