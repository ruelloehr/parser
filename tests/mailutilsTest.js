var assert = require('assert');
var mailutils = require('../lib/mailutils.js');

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


describe('RFC2074 encoding', function() {
    describe('Encoded headers should be decoded', function() {
        it('Should correctly decode header contents', function(){
            assert.equal(mailutils.decodeRFC2407('Subject: =?utf-8?q?=5BRetention_In_Life_ezine=5Fhome=5F050411=5D_Introducing_Your_?==?utf-8?q?Aviva_Essentials=3A_Win_4_tickets_to_the_Aviva_Premiership_Rugb?='
                +  '=?utf-8?q?y_Final=2C_Keep_the_cost_of_driving_down_and_more?='), 'Subject: [Retention In Life ezine_home_050411] Introducing Your Aviva Essentials: Win 4 tickets to the Aviva Premiership Rugby Final, Keep the cost of driving down and more');
        });
    });

    describe('Encoded headers should be decoded for paritally encoded items', function() {
        it('Should correctly decode header contents', function(){
            assert.equal(mailutils.decodeRFC2407('From: =?utf-8?q?Aviva?= <aviva@avivaemail.co.uk>'),  'From: Aviva <aviva@avivaemail.co.uk>');
        });
    });
});