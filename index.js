var fs          = require('fs');
var csv         = require('csv-string');
var request     = require('request');

if(process.env.GDOC_KEY == undefined){
    console.log('Please specify a google doc path, see the readme for directions.');
    process.exit()
}

var earl        = 'https://docs.google.com/spreadsheet/pub?key=' + process.env.GDOC_KEY + '&output=csv';
var fileName    = 'data.json';
var filePath    = process.cwd() + '/';
var keyIndex    = 0;

if(process.env.FILE_NAME)   fileName = process.env.FILE_NAME;
if(process.env.FILE_PATH)   filePath = process.env.FILE_PATH;
if(process.env.START_INDEX) keyIndex = process.env.START_INDEX;

var jsonReturn  = []
var keys        = [];

request(earl, function(err, response, body){
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