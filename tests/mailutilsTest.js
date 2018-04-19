const mock = require('mock-fs');
const fs = require('fs');
const assert = require('assert');
const mailutils = require('../lib/mailutils.js');

describe('Comment stripping', function() {
    describe('comments should be stripped when not in enclosed quotes', function() {
        it('Should strip comments in parenthesis', function(){
            assert.equal(mailutils.stripComments('This is (comment) a comment (with data) here.'), 'This is  a comment  here.');
        });
    });
    describe('comments should not be stripped when in enclosed quotes', function() {
        it('Should strip comments in parenthesis', function(){
            assert.equal(mailutils.stripComments('This is "(comment)" a comment (with data) here.'), 'This is "(comment)" a comment  here.');
        });
    });

    describe('quoted words should not be stripped as comments', function() {
        it('Should not strip quoted words', function(){
            assert.equal(mailutils.stripComments('This is "quote" in subject.'), 'This is "quote" in subject.');
        });
    });
});


describe('Processing headers', function() {

    mock({
        'output.txt': ''
    });

    var fd = fs.openSync('output.txt', 'w');

    describe('To headers should be detected and written to a file', function() {
        it('Should handle folded headers', function() {
            var results = mailutils.processDataLine('To: Ruel Loehr <ruelloehr@gmail.com>', '', fd);
            var secondLine = mailutils.processDataLine('  has a folded header', results, fd);
            assert.equal(secondLine, 'To: Ruel Loehr <ruelloehr@gmail.com>  has a folded header');
        });
    });

});


describe('RFC2074 encoding', function() {
    describe('Encoded headers should be decoded', function() {
        it('Should correctly decode header contents', function(){
            assert.equal(mailutils.decodeRFC2407('Subject: =?utf-8?q?=5BRetention_In_Life_ezine=5Fhome=5F050411=5D_Introducing_Your_?==?utf-8?q?Aviva_Essentials=3A_Win_4_tickets_to_the_Aviva_Premiership_Rugb?='
                +  '=?utf-8?q?y_Final=2C_Keep_the_cost_of_driving_down_and_more?='), 'Subject: [Retention In Life ezine_home_050411] Introducing Your Aviva Essentials: Win 4 tickets to the Aviva Premiership Rugby Final, Keep the cost of driving down and more');
        });
    });

    describe('Encoded headers should be decoded for partially encoded items', function() {
        it('Should correctly decode header contents', function(){
            assert.equal(mailutils.decodeRFC2407('From: =?utf-8?q?Aviva?= <aviva@avivaemail.co.uk>'),  'From: Aviva <aviva@avivaemail.co.uk>');
        });
    });

    describe('Base64 encoded headers be correctly decoded', function() {
        it('Should correctly decode base64 header contents', function(){
            assert.equal(mailutils.decodeRFC2407('Subject: =?UTF-8?B?4pyIIEJvc3RvbiBhaXJmYXJlIGRlYWxzIC0gd2hpbGUgdGhleSBsYXN0IQ==?='),  'Subject: ✈ Boston airfare deals - while they last!');
        });
    });

    describe('ASCII encoded headers be correctly decoded', function() {
        it('Should correctly decode ascii header contents', function(){
            assert.equal(mailutils.decodeRFC2407('From: =?US-ASCII?Q?Keith_Moore?= <moore@cs.utk.edu>'),  'From: Keith Moore <moore@cs.utk.edu>');
        });
    });

    describe('ISO-8859-1 encoded headers be correctly decoded', function() {
        it('Should correctly decode iso-8859-1 header contents', function(){
            assert.equal(mailutils.decodeRFC2407('To: =?ISO-8859-1?Q?Keld_J=F8rn_Simonsen?= <keld@dkuug.dk>'),  'To: Keld Jørn Simonsen <keld@dkuug.dk>');
        });

        it('Should correctly decode iso-8859-1 header contents case 2', function(){
            assert.equal(mailutils.decodeRFC2407('Subject: =?iso-8859-1?q?p=F6stal?='),  'Subject: pöstal');
        });


        it('Should correctly decode iso-8859-1  base 64 contents', function(){
            assert.equal(mailutils.decodeRFC2407('To: =?ISO-8859-1?B?RnLmZGVyaWsgSPhsbGplbg==?= <fh@ez.no>'),  'To: Fræderik Hølljen <fh@ez.no>');
        });
    });



});


