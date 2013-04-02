var fs          = require('fs');
var csv         = require('csv-string');
var request     = require('request');
var color       = require('cli-color');


var printHelp = function(){
    console.log('\nUsage: hickorydickory [options]');
    console.log('\nOptions:');
    console.log('  -k, --key            set the value of the google doc key ot be used');
    console.log('  -r, --row            set the row to be used as the object key');
    console.log('  -h, --help           see help');
    console.log('\nDocumentation at https://github.com/joelongstreet/HickoryDickoryGoogleDoc');
};

var printError = function(err){
    console.log(color.red.bold(err));
    process.exit();
}

var executeScript = function(options){
    if(!(options.gdocKey)){ printError('Please specify a google doc path, see the readme for directions.') };

    var earl        = 'https://docs.google.com/spreadsheet/pub?key=' + options.gdocKey + '&output=csv';
    var fileName    = 'data.json';
    var filePath    = process.cwd() + '/';
    var keyIndex    = 0;

    if(process.env.FILE_NAME)   fileName = process.env.FILE_NAME;
    if(process.env.FILE_PATH)   filePath = process.env.FILE_PATH;
    if(process.env.START_INDEX) keyIndex = process.env.START_INDEX;

    var jsonReturn  = []
    var keys        = [];

    request.get(earl, function(err, response, body){

        if(err){ printError(err); }

        var rows = csv.parse(body);

        for(var i=0; i<rows.length; i++){
            var obj = {}
            for(var j=0; j<rows[i].length; j++){
                if(i == keyIndex) keys.push(rows[i][j]);
                else obj[keys[j]] = rows[i][j];
            }

            if(i > keyIndex) jsonReturn.push(obj);
        }

        fs.writeFile(filePath + fileName, JSON.stringify(jsonReturn, null, 4), 'utf8', function(err){
            if(err) console.log('err');
            else console.log('\n\nDone writing json file, located at ' + filePath + fileName + '.\n\nObject keys are : \n' + JSON.stringify(keys, null, 4));
        });
    });
};


var args = process.argv;
if(args.indexOf('-h') != -1){
    printHelp();
} else if(args.indexOf('--help') != -1){
    printHelp();
} else if(args.indexOf('-k') != -1){
    var index = args.indexOf('-k') + 1;
    executeScript(args[index]);
} else if(args.indexOf('--key') != -1){
    var index = args.indexOf('--key') + 1;
    executeScript(args[index]);
} else {
    executeScript();
}