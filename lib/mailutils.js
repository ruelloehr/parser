const fs = require('fs');
const rfc2047 = require('rfc2047');
const os=require('os');

var exports = module.exports = {};

const TO_HEADER='to:';
const FROM_HEADER='from:';
const SUBJECT_HEADER='subject:';

function startsWithKnownHeader(text) {
    return ((text.toLowerCase().indexOf(TO_HEADER) === 0) || (text.toLowerCase().indexOf(FROM_HEADER) === 0) || (text.toLowerCase().indexOf(SUBJECT_HEADER) === 0));
}

function handleQuotes(text) {
    //TODO implement
    /* Some characters are reserved for special interpretation, such as
   delimiting lexical tokens.  To permit use of these characters as
   uninterpreted data, a quoting mechanism is provided.

quoted-pair     =       ("\" text) / obs-qp

   Where any quoted-pair appears, it is to be interpreted as the text
   character alone.  That is to say, the "\" character that appears as
   part of a quoted-pair is semantically "invisible".

   Note: The "\" character may appear in a message where it is not part
   of a quoted-pair.  A "\" character that does not appear in a
   quoted-pair is not semantically invisible.  The only places in this
   standard where quoted-pair currently appears are ccontent, qcontent,
   dcontent, no-fold-quote, and no-fold-literal.
   */
}

/**
 * Encoding headers spec: https://www.ietf.org/rfc/rfc2047.txt
 * @param text the string to decode
 * @returns {*}
 */
function decodeRFC2407(text) {

    //encoded-word = "=?" charset "?" encoding "?" encoded-text "?="

    //stolen
    var encodedWordRegExp = /\=\?([^\?]+)\?([QB])\?([^\?]*)\?=/gi;

    var itemsToReplace = text.match(encodedWordRegExp);

    if (!itemsToReplace)
        return text;

    //the first thing we want to do is break up the string into the distinct components, the following will execute for each encoded word
    //and replace it with its decoded version
    var decodedPhrase = text.replace(encodedWordRegExp, function(encodedWord, charset, encoding, encodedText, index) {

        if (encoding.toLowerCase()==='b') {
            return (new Buffer(encodedText, 'base64').toString('utf-8'));

        } else {

            //TODO: handle diff charsets (iso)

            var removedUnderscores = encodedText.replace(/_/g, ' ');

            var finalWord = '';

            for (var i = 0; i < removedUnderscores.length; i++) {
                if (encodedText.charAt(i) === '=') {
                    //if we hit an = we need the next values
                    var code = removedUnderscores.slice(i + 1, i + 3);   //no multi byte support yet
                    finalWord += String.fromCharCode(parseInt(code, 16));
                    i = i + 2;

                } else {
                    finalWord += removedUnderscores.charAt(i);
                }
            }

            return finalWord;
        }

    });

    return decodedPhrase;

    //bailout method
    //return rfc2047.decode(text);
}

/**
 * Remove comments from a string of text.   Comments are items within nested parenthesis
 * Example:   Subject (this is a comment) data
 * Example:   Subject "(this is not a comment)" data    //not yet supported
 * @param text the text to remove comments from
 * @returns {string}
 */
function stripComments(text) {

   /*
   Strings of characters enclosed in parentheses are considered comments
   so long as they do not appear within a "quoted-string", as defined in
   section 3.2.5.  Comments may nest.
   */


    //for explanation of regex, plug it into: https://regex101.com/
    //the goal here is to find all "(*)" and (*) patterns.  Then loop through the results, discard the quoted ones and replace the non quoted versions with nothing
    var potentialComments = (text.match(/\"([^\"]+)\"|'([^']+)'|\\S+| *\([^)]*\)*/g));

    if (potentialComments != null) {
        for (var i=0; i< potentialComments.length; i++) {
            var trimmedWord = potentialComments[i].trim();

            if ((trimmedWord.charAt(0) === '"') && (trimmedWord.charAt(trimmedWord.length-1)==='"')) {
                //leave them
            } else {
                text=text.replace(trimmedWord, '');
            }
        }
    }

    return text;
}

function processDataLine(line, prevHeaderLine, fd) {

    //We need to process each line of the mail data looking for the known headers.
    //According the spec: http://www.ietf.org/rfc/rfc2822.txt, header data can span multiple lines which is "header folding"
    //To handle this, we must consider the previous line and the current line

    //if the previous line and the next line both start with a known header, the previous line is safe to write
    if (startsWithKnownHeader(line) && startsWithKnownHeader(prevHeaderLine)) {
        fs.write(fd, stripComments(decodeRFC2407(prevHeaderLine)+os.EOL));
        return(line);
    }
    //otherwise, if the line simply starts with a known header we need to look at the next line
    else if (startsWithKnownHeader(line)) {
        return(line);
    }
    //if the previous line has data and the current line starts with a known header, we've started processing a new header.  Write the previous one.
    else if ((prevHeaderLine.length > 0) && startsWithKnownHeader(line)) {
        fs.write(fd, stripComments(decodeRFC2407(prevHeaderLine)+os.EOL));
        return(line);
    }
    //if the line start with a space and we have previously seen a header, we have header folding
    else if ((line.indexOf(' ') === 0) && prevHeaderLine.length > 0)  {
        return (prevHeaderLine+line);
    }
    //the previous lines were header data but the current line is not.
    else if (prevHeaderLine.length > 0) {
        fs.write(fd, stripComments(decodeRFC2407(prevHeaderLine)+os.EOL));
        return('');
    }
    //we've encountered non header data and can discard it
    else
    {
        return '';
    }
}

exports.startsWithKnownHeader = startsWithKnownHeader;
exports.processDataLine = processDataLine;
exports.stripComments = stripComments;
exports.decodeRFC2407= decodeRFC2407;