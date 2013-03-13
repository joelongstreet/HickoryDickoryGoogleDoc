var fs          = require('fs');
var csv         = require('csv-string');
var request     = require('request');

var earl        = process.env.GOOGLE_DOC_PATH;
var filePath    = 'output.json';
if(process.env.OUTPUT_PATH) filePath = process.env.OUTPUT_PATH;

var keyIndex    = 1;
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
        else console.log('Done writing file at ' + filePath);
    });
});