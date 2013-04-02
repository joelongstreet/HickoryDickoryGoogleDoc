var fs          = require('fs');
var csv         = require('csv-string');
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
            key         : { description : 'What\'s the Google Doc Key for the file you\'d like to use? See the README for more information on how to obtain this...'},
            index       : { description : 'At what index (0 based) should the object keys be defined?'},
            file        : { description : 'Where should I store the outputted file (example - /assets/data.json)?'}
            //exports     : { description : 'Surround result in module.exports (true of false)?'}
        }
    }, function(err, result){
        if(err) { printError(err); }
        else {
            writeConfig(result, function(){
                console.log('Thanks, a new configuration file has been created at ' + process.cwd() + '/.hickorydickory');
                console.log('If you need to make changes, that\'s where you\'ll do it');
                // would be great to add to .gitignore here
                execute(result);
            });
        }
    });
};

var readConfig = function(){
    fs.readFile('.hickorydickory', 'utf-8', function(err, data){
        if(err) { makePrompt();  }
        else    { execute(JSON.parse(data)); }
    });
};

var writeConfig = function(data, next){
    fs.writeFile('.hickorydickory', JSON.stringify(data, null, 4), 'utf8', function(err){
        if(err)  { printError(err); }
        if(next) { next(); }
    });
};

var execute = function(options){

    var earl        = 'https://docs.google.com/spreadsheet/pub?key=' + options.key + '&output=csv';
    var jsonReturn  = [];
    var keys        = [];

    request.get(earl, function(err, response, body){

        if(err){ printError(err); }

        var rows = csv.parse(body);
        for(var i=0; i<rows.length; i++){
            var obj = {}
            for(var j=0; j<rows[i].length; j++){
                if(i == options.index) keys.push(rows[i][j]);
                else
                    if(rows[i][j].indexOf('[') == 0) {
                        var content = rows[i][j].replace('[', '').replace(']', '').split(',');
                        obj[keys[j]] = content;
                    } else{
                        obj[keys[j]] = rows[i][j];
                    }
            }

            if(i > options.index) jsonReturn.push(obj);
        }

        fs.writeFile(options.file, JSON.stringify(jsonReturn, null, 4), 'utf8', function(err){
            if(err) console.log('err');
            else console.log('\n\nDone writing json file, located at ' + options.file + '.\n\nObject keys are : \n' + JSON.stringify(keys, null, 4));
        });
    });
};

readConfig();