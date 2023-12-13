const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {

    const validForm = {
        text: "Mangoes are my favorite fruit.",
        locale: "american-to-british"
    }
    const invalidForm = {
        text: "invalid text",
        locale: "invalid"
    }
    const missingText = {
        missingtext: "",
        locale: "american-to-british"
    }
    const missingLocale = {
        text: "Mangoes are my favorite fruit.",
        missinglocale: ""
    }
    const emptyText = {
        text: "",
        locale: "american-to-british"
    }
    const noTranslateForm = {
        text: "Mangoes are my favourite fruit.",
        locale: "american-to-british"
    }

    test('#1 Translation with text and locale fields: POST request to /api/translate'
        , function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/translate')
                .send(validForm)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.propertyVal(res.body,
                        "translation", 'Mangoes are my <span class="highlight">favourite</span> fruit.');
                    done();
                });
        });

    test('#2 Translation with text and invalid locale field: POST request to /api/translate'
        , function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/translate')
                .send(invalidForm)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body
                        , { error: 'Invalid value for locale field' });
                    done();
                });
        });

    test('#3 Translation with missing text field: POST request to /api/translate'
        , function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/translate')
                .send(missingText)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body
                        , { error: 'Required field(s) missing' });
                    done();
                });
        });

    test('#4 Translation with missing locale field: POST request to /api/translate'
        , function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/translate')
                .send(missingLocale)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body
                        , { error: 'Required field(s) missing' });
                    done();
                });
        });

    test('#5 Translation with empty text: POST request to /api/translate'
        , function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/translate')
                .send(emptyText)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body
                        , { error: 'No text to translate' });
                    done();
                });
        });

    test('#6 Translation with text that needs no translation: POST request to /api/translate'
        , function (done) {
            chai
                .request(server)
                .keepOpen()
                .post('/api/translate')
                .send(noTranslateForm)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.propertyVal(res.body
                        , "translation", "Everything looks good to me!");
                    done();
                });
        });
});
