# Mail Parser
This script takes a gzipped tar that contains mail messages as a parameter.
For each entry in the tar, we extract the To, From, and Subject headers and output them 
all into a file.

There are 2 relevant mail specs:
Mail headers spec: [http://www.ietf.org/rfc/rfc2822.txt]
Encoding headers spec: [https://www.ietf.org/rfc/rfc2047.txt]

To install:
 * brew install nvm
 * nvm install v4.6.2
 * nvm use v4.6.2
 * npm install
 * node index.js -f resources/sampleEmails4tar.gz 
 
 Output is written to the ./output.txt

