const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

let lastChar;
const textSplit = (text) => {
    lastChar = text[text.length-1];
    if(/\W/.exec(lastChar)){
        text = text.substring(0, text.length - 1); // removing '.'
    }
    return text.split(/\s+/);
};

const textJoin = (translation) => {
    console.log('this is translation:');
    console.log(translation);
    translation = translation.join(' ');
    translation += lastChar;
    return translation;
};


class Translator {

    // For American English to British English
    us2uk(text) {
        let separatedText = textSplit(text);
        console.log('this is seperated text :')
        console.log(separatedText);
        let translation=[];
        let flag = false; // Whether translation word is found
        separatedText.map((word, index)=> {
            let found = null;
            let searchIndex;
            let result;
            for (let key in americanToBritishSpelling){
                if(word.toLowerCase()== key){
                    found = americanToBritishSpelling[key];
                    flag = true;
                    break;
                }
            }
            for (let key in americanToBritishTitles){
                if(word.toLowerCase() == key){
                    found = americanToBritishTitles[key];
                    flag = true;
                    break;
                }
            }
            for (let key in americanOnly){
                if(word.toLowerCase() == key){
                    found = americanOnly[key];
                    flag = true;
                    break;
                }
            };

            // detect multiple words
            

            // format time (ex: 10:30 to 10.30)
            let re = /([0-9]{1,2})([:])([0-9]{1,2})/g;
            if (re.exec(word)){
                word = word.replace(re, '$1.$3');
                word = `<span class=\"highlight\">${word}</span>`;
                flag= true;
            }
            if(found){
                // Char code of 'Z' equals to 90, code of 'a' equals to 97
                if(word[0].charCodeAt() <= 90){
                    found = found[0].toUpperCase() + found.substring(1);
                    translation[index] = `<span class=\"highlight\">${found}</span>`;
                } else {
                    translation[index] = `<span class=\"highlight\">${found}</span>`;
                }
            } else {
                translation[index] = word;
            }
        })
        if (flag){   
            translation = textJoin(translation);
        } else {
            translation='Everything looks good to me!';
        }
        return translation;
    };

    // For British English to American English
        uk2us(text) {
        let separatedText = textSplit(text);
        console.log('this is seperated text :')
        console.log(separatedText);
        let translation=[];
        let flag = false; // Whether translation word is found
        // const britishSpelliings = Object.values(americanToBritishSpelling);
        // const britishTitles = Object.values(americanToBritishTitles);
        separatedText.map((word, index)=> {
            let found = null;
            for (let key in americanToBritishSpelling){
                if(word.toLowerCase()== americanToBritishSpelling[key]){
                    found = key;
                    flag = true;
                    break;
                }
            }
            for (let key in americanToBritishTitles){
                if(word.toLowerCase() == americanToBritishTitles[key]){
                    found = key;
                    flag = true;
                    break;
                }
            }
            for (let key in britishOnly){
                if(word.toLowerCase() == key){
                    found = britishOnly[key];
                    flag = true;
                    break;
                }
            };
            // format time (ex: 10:30 to 10.30)
            let re = /([0-9]{1,2})([.])([0-9]{1,2})/g;
            if (re.exec(word)){
                word = word.replace(re, '$1:$3');
                word = `<span class=\"highlight\">${word}</span>`;
                flag= true;
            }
            if(found){
                // Char code of 'Z' equals to 90, code of 'a' equals to 97
                if(word[0].charCodeAt() <= 90){
                    found = found[0].toUpperCase() + found.substring(1);
                    translation[index] = `<span class=\"highlight\">${found}</span>`;
                } else {
                    translation[index] = `<span class=\"highlight\">${found}</span>`;
                }
            } else {
                translation[index] = word;
            }
        })
        if (flag){   
            translation = textJoin(translation);
        } else {
            translation='Everything looks good to me!';
        }
        return translation;
    }

}

module.exports = Translator;



        // for (let n in separatedText){
        //     for(let key in americanToBritishSpelling){
        //         if(separatedText[n]==key){
        //             console.log(americanToBritishSpelling[key]);
        //             let found = {};
        //             found[separatedText[n]] = americanToBritishSpelling[key]; 
        //             hilight.push(found);
        //         }
        //     }
        // }