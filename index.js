var fs          = require('fs');
var csv         = require('csv-string');
var request     = require('request');

if(process.env.GDOC_PATH == undefined){
    console.log('Please specify a google doc path, see the readme for directions.');
    process.exit()
}

var earl        = process.env.GDOC_PATH;
var filePath    = 'output.json';
var keyIndex    = 0;
if(process.env.OUTPUT_PATH) filePath = process.env.OUTPUT_PATH;
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

    fs.writeFile(filePath, JSON.stringify(jsonReturn, null, 4), 'utf8', function(err){
        if(err) console.log('err');
        else console.log('\n\nDone writing json file, located at ' + filePath + '.\n\nObject keys are : \n' + JSON.stringify(keys, null, 4));
    });
});