# Hickory Dickory Google Doc
You can use this node script to create JSON objects or files from Google spreadsheet docs. To get started, you'll have to have your Google Doc auto publishing CSV documents.


## Within the Google Doc interface
* `File -> Publish to the web...`
* Select "Automatically republish when changes are made"
* `Click` Start Publishing
* `Copy` the link within "Get a link to the published data", it's the "key" when running this script.


## Installation
`npm install hickorydickory`

If you're planning on running this as a command line script, ensure you've added the `-g` flag.


## Using Hickory Dickory within a node app
    var dickory = require('hickorydickory');
    dickory.get({
        'key'       : '0Aqt4TJ6rH8fTdGlNYnd3aU5iWEJ4dzNzell4UEptUGc',
        'index'     : '1'
    }, function(jsonObject){
        console.log(jsonObject);
    });


## Using Hickory Dickory as a command line script
Just run `hickorydickory`. The script will prompt you for configuration options, write the .hickorydickory file to the current directory, and automatically update your .gitignore.

### Configuration Options
The following config options are supported in the .hickorydickory file.

* `key` - The google doc key example - `0Aqt4TJ6rH8fTdDdOSXppMmhLQ20zc1FuRG9yRlNGUUE`
* `index` - The index to set as object keys example - `1`
* `file` - The output file example - `assets/data/datasource.json`
* `exports` - Specify this if you want the final object to be "exported", example - `locations`


## Configuring your Google Doc
Hickorydickory will recognize arrays in your google doc if you surround the cell contents with brackets. Example - `[item1, item2, item3]`