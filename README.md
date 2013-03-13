# Hickory Dickory Google Doc

You can use this little node script to automatically create json files from google spreadsheet docs. To get started, you'll have to have your google doc auto publishing csv documents.

## Within the google doc interface

* `File -> Publish to the web...`
* Select "Automatically republish when changes are made"
* `Click` Start Publishing
* `Copy` the link within "Get a link to the published data", it's your GDOC_PATH


## Using the script

This script takes three arguments:
1. `OUTPUT_PATH` (optional) - path to where your json file will be written. If nothing is specified, the script will publish a file called output.json to the HickoryDickoryGoogleDoc directory.
2. `GDOC_PATH` (required) - the public path to your google doc spreadsheet. To obtain this, see directions above.
3. `START_INDEX` (optional) - What row should the script consider to be the object keys. By default, this is 0.

Sample Command:

`START_INDEX=1 OUTPUT_PATH='hi.json' GDOC_PATH='https://docs.google.com/spreadsheet/pub?key=0Aqt4TJ6rH8fTdDdOSXppMmhLQ20zc1FuRG9yRlNGUUE&output=csv' node index.js`