# Hickory Dickory Google Doc

You can use this little node script to automatically create json files from google spreadsheet docs. To get started, you'll have to have your google doc auto publishing csv documents.

## Within the google doc interface

* `File -> Publish to the web...`
* Select "Automatically republish when changes are made"
* `Click` Start Publishing
* `Copy` the link within "Get a link to the published data", it's your GDOC_KEY


## Using the script

This script takes four arguments:
* `GDOC_KEY` (required) - the public key to your google doc spreadsheet. To obtain this, see directions above.
* `FILE_PATH` (optional) - path to where your json file will be written. If nothing is specified, the script will publish to the current directory.
* `FILE_NAME` (optional) - the name of the file, by default this is data.json.
* `START_INDEX` (optional) - What row should the script consider to be the object keys. By default, this is 0.

Sample Command:

`START_INDEX=1 FILE_NAME=goodmorning.json GDOC_KEY=0Aqt4TJ6rH8fTdDdOSXppMmhLQ20zc1FuRG9yRlNGUUE node index.js`

or add something like this as an alias to your bash profile:

`alias getGoogle='START_INDEX=1 GDOC_KEY=0Aqt4TJ6rH8fTdDdOSXppMmhLQ20zc1FuRG9yRlNGUUE node ~/Sites/HikcoryDickoryGoogleDoc index.js'`\