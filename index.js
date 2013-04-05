#!/usr/bin/env node

var fs          = require('fs');
var csv         = require('csv');
var prompt      = require('prompt');
var request     = require('request');
var color       = require('cli-color');


var printHelp = function(){
    console.log('\nUsage: hickorydickory [options]');
    console.log('\nOptions:');
    console.log('  -k, --key            set the value of the google doc key ot be used');
    console.log('  -i, --index          set the row to be used as the object key index');
    console.log('  -h, --help           see help');
    console.log('\nDocumentation at https://github.com/joelongstreet/HickoryDickoryGoogleDoc');
};

var printError = function(err){
    console.log(color.red.bold(err));
    process.exit();
};

var makePrompt = function(){
    prompt.start();
    prompt.get({
        properties : {
            key         : { description : 'Google Doc Key'},
            index       : { description : 'Object Key Index'},
            file        : { description : 'Output File'}
        }
    }, function(err, result){
        if(err) { printError(err); }
        else {
            writeConfig(result, function(){
                console.log('Thanks, a new configuration file has been created at ' + process.cwd() + '/.hickorydickory');
                console.log('If you need to make changes, that\'s where you\'ll do it');
                // would be great to add .hickorydickory to .gitignore here
                execute(result);
            });
        }
    });
};

var readConfig = function(){
    fs.readFile('.hickorydickory', 'utf-8', function(err, data){
        if(err || data.length == 0) { makePrompt();  }
        else    { execute(JSON.parse(data)); }
    });
};

var writeConfig = function(data, next){
    fs.writeFile('.hickorydickory', JSON.stringify(data, null, 4), 'utf8', function(err){
        if(err)  { printError(err); }
        if(next) { next(); }
    });
};

var parseKeys = function(row){
    var keys = [];
    for(var i=0; i<row.length; i++){
        keys.push(row[i]);
    }
    return keys;
};

var parseRow = function(keys, row){

    var obj = {};

    for(var i=0; i<row.length; i++){
        if(i < keys.length) {
            // If content in the cell looks like an array
            if(row[i].indexOf('[') == 0) {
                var content = row[i].replace('[', '').replace(']', '').split(',');
                var arr     = [];
                for(var k=0; k<content.length; k++){
                    arr.push(content[k].replace(' ', ''));
                }
                obj[keys[i]] = arr;
            } else {
                obj[keys[i]] = row[i];
            }
        }
    }

    return obj;
};

var parseDocument = function(options, csvBody, next){
    var jsonReturn  = [];
    var keys        = [];
    var iterator    = 0;

    csv().from(csvBody).transform(function(row){
        if(iterator == options.index){
            keys = parseKeys(row);
        } else if(iterator > options.index) {
            jsonReturn.push(parseRow(keys, row));
        }
        iterator++;
    }).on('end', function(){
        if(next) {
            next({
                parsed  : jsonReturn,
                keys    : keys
            });
        }
    }).on('error', function(err){
        printError(err);
    });
};

var writeFile = function(options, data){

    var fileContents = JSON.stringify(data.parsed, null, 4);
    if(options.exports){
        fileContents = 'exports.' + options.exports + ' = ' + fileContents;
    }

    fs.writeFile(options.file, fileContents, 'utf8', function(err){
        if(err) console.log('err');
        else console.log('\n\nDone writing json file, located at ' + options.file + '.\n\nObject keys are : \n' + JSON.stringify(data.keys, null, 4));
    });
};

var execute = function(options){

    // Set defaults if config doesn't exist
    if(!options.key)   { printError('There is no Google Doc Key specified in the configuration. Please see the .hickorydickory file to add one.'); }
    if(!options.index) { options.index = 0; }
    if(!options.file)  { options.file  = 'data.json'; };

    var earl = 'https://docs.google.com/spreadsheet/pub?key=' + options.key + '&output=csv';

    request.get(earl, function(err, response, body){

        if(err) { printError(err); }
        else    {
            parseDocument(options, body, function(data){
                writeFile(options, data);
            });
        }
    });
};

readConfig();