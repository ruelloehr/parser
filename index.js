const argv = require('yargs');
const fs = require('fs');
const stream = require('stream');
const readline = require('readline');
const os = require("os");
const tar = require('tar-stream');
const zlib = require('zlib');
const rfc2047 = require('rfc2047');

var args = argv.usage('Parse a zip file and produce an output file which contains a collection of mail headers for each entry in the zip. \nUsage: $0 -f filename')
    .example('$0 -f filename')
    .demand('f', 'Filename of zip archive')
    .alias('f', 'filename')
    .describe('f', 'Filename of zip archive containing mail data')
    .argv;

var errorFunc = err =>  console.log('Error occurred: ' + err);

var extract = tar.extract();

fd = fs.openSync('output.txt', 'w');

fs.createReadStream(args.f)
    .on('error', errorFunc)
    .pipe(zlib.createGunzip())
    .on('error', errorFunc)
    .pipe(extract)
    .on('entry', function (header, stream, next) {
        //header is metadata about the tar entry
        //stream is a stream pointing to the content of the tar entry
        //next is a function to call when we are done processing the entry

        var headerValue = '';


        //tars can contain files and directories, we only want to process files
        if (header.type === 'file') {

            console.log('Processing file: ' + header.name);
            var rl = readline.createInterface({
                input: stream
            });

            // Mail headers spec: http://www.ietf.org/rfc/rfc2822.txt
            // Encoding headers spec: https://www.ietf.org/rfc/rfc2047.txt
            rl.on('line', function (line) {
                if ((headerValue.length > 0) && ((line.toLowerCase().indexOf('to:') === 0) || (line.toLowerCase().indexOf('from:') === 0) || (line.toLowerCase().indexOf('subject:') === 0))) {
                    fs.write(fd, rfc2047.decode(headerValue)+os.EOL);
                    headerValue = line;
                }
                else if ((line.toLowerCase().indexOf('to:') === 0) || (line.toLowerCase().indexOf('from:') === 0) || (line.toLowerCase().indexOf('subject:') === 0)) {
                    headerValue = line;
                } else if ((line.indexOf(' ') === 0) && headerValue.length > 0)  {
                    headerValue +=line;
                } else if (headerValue.length > 0) {
                    fs.write(fd, rfc2047.decode(headerValue)+os.EOL);
                    headerValue='';
                }
            });

        }

        stream.on('end', function () {
            next();
        });

        stream.resume();
    })
    .on('error', errorFunc);

































