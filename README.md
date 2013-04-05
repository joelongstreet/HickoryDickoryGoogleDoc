# Hickory Dickory Google Doc
You can use this little node script to automatically create json files from google spreadsheet docs. To get started, you'll have to have your google doc auto publishing csv documents.


## Within the google doc interface
* `File -> Publish to the web...`
* Select "Automatically republish when changes are made"
* `Click` Start Publishing
* `Copy` the link within "Get a link to the published data", it's your GDOC_KEY


## Installation
`npm install hickorydickory`


## Using the script
Just run `hickorydickory`. The script will prompt you for configuration options and then write the .hickorydickory file to the current directory.


## Configuring your Google Doc
Hickorydickory will recognize arrays in your google doc if you surround the cell contents with brackets. Example - `[thing1, thing2, thing3]`

## Configuration Options
The following config options are supported in the .hickorydickory file.

* `key` - The google doc key example - `0Aqt4TJ6rH8fTdDdOSXppMmhLQ20zc1FuRG9yRlNGUUE`
* `index` - The index to set as object keys example - `1`
* `file` - The output file example - `assets/data/datasource.json`
* `exports` - Specify this if you want the final object to be "exported", example - `locations`