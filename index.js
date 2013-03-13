var fs          = require('fs');
var csv         = require('csv-string');
var request     = require('request');

var earl        = '';
var file        = 'locations.csv';
var keyIndex    = 1;

var jsonReturn  = []
var keys        = [];

fs.readFile(file, 'utf-8', function(err, data){
    var rows = csv.parse(data);
    for(var i=0; i<rows.length; i++){

        var obj = {}
        for(var j=0; j<rows[i].length; j++){
            if(i == keyIndex) keys.push(rows[i][j]);
            else obj[keys[j]] = rows[i][j];
        }

        if(i > keyIndex) jsonReturn.push(obj);
    }

    console.log(jsonReturn);
});