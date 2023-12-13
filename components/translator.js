const { readFile } = require('@babel/core/lib/gensync-utils/fs.js');
const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')


const keyHandler = (text, data, flag) => {
    for (let key in data) {
        let regex = new RegExp('(?<![\\w-])' + key + '(?![\\w-])', 'gi');
        let regexArray = regex.exec(text);
        if (regexArray) {
            flag = true;
            let found = data[key];
            // Adjust the initial case, since each char code is :
            // 'A' >> 65, 'Z' >> '90', 'a' >> 97, 'z' >> 122
            if (regexArray[0].charCodeAt() <= 90) { // regexArray[0] is going to be matched string
                text = text.replace(regex, '<span class="highlight">' + found[0].toUpperCase() + found.substring(1) + '</span>');
            } else {
                text = text.replace(regex, '<span class="highlight">' + found + '</span>');
            }
        }
    }
    return [text, flag];
}

const valueHandler = (text, data, flag) => {
    for (let key in data) {
        let regex = new RegExp('(?<![\\w-])' + data[key] + '(?![\\w-])', 'gi');
        let regexArray = regex.exec(text);
        if (regexArray) {
            flag = true;
            let found = key;
            // Adjust the initial case, since each char code is :
            // 'A' >> 65, 'Z' >> '90', 'a' >> 97, 'z' >> 122
            if (regexArray[0].charCodeAt() <= 90) { // regexArray[0] is going to be matched string
                text = text.replace(regex, '<span class="highlight">' + found[0].toUpperCase() + found.substring(1) + '</span>');
            } else {
                text = text.replace(regex, '<span class="highlight">' + found + '</span>');
            }
        }
    }
    return [text, flag];
}

class Translator {

    // For American English to British English
    us2uk(text) {
        const initText = text;
        let flag = false; // Whether translation word is found
        // format american to british
        [text, flag] = keyHandler(text, americanToBritishSpelling, flag);
        [text, flag] = keyHandler(text, americanToBritishTitles, flag);
        [text, flag] = keyHandler(text, americanOnly, flag);
        // format time (ex: 10:30 to 10.30)
        let re = /([0-9]{1,2})([:])([0-9]{1,2})/g;
        let reArray;
        reArray = re.exec(text);
        while (reArray) {
            text = text.replace(reArray[0], `<span class=\"highlight\">${reArray[1]}.${reArray[3]}</span>`);
            reArray = re.exec(text);
            flag = true;
        }
        if (!flag) {
            text = 'Everything looks good to me!';
        }
        return text;
    };

    uk2us(text) {
        const initText = text;
        let flag = false; // Whether translation word is found
        // format american to british
        [text, flag] = valueHandler(text, americanToBritishSpelling, flag);
        [text, flag] = valueHandler(text, americanToBritishTitles, flag);
        [text, flag] = keyHandler(text, britishOnly, flag);
        // format time (ex: 10:30 to 10.30)
        let re = /([0-9]{1,2})([.])([0-9]{1,2})/g;
        let reArray;
        reArray = re.exec(text);
        while (reArray) {
            text = text.replace(reArray[0], `<span class=\"highlight\">${reArray[1]}:${reArray[3]}</span>`);
            reArray = re.exec(text);
            flag = true;
        }
        if (!flag) {
            text = 'Everything looks good to me!';
        }
        return text;
    };

}
module.exports = Translator;


