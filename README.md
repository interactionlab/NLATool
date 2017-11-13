# NLATool
Natural Language Analysis Tool
A web application that uses Stanford Corenlp to analyse Texts for you and
gives you a nice view on the text. It also should help you looking up words
with a quick research functionality.

## Setup NLATool
Step-by-step instructions:
* `$ npm install -g nodemon`
* `$ npm install -g node-gyp`
* `$ npm config set python python2.7`
* `$ npm install`
* `$ npm start`

Linux:
Hint: To install node-gyp you have to install Python 2.7 (v3.x.x is not supported), and run `npm config set python python2.7` before you run `npm install`.

Windows:
To install node-gyp you need to run this:
npm install -g --production windows-build-tools`

## Quick start:

1. Navigate to -Your drive-/-Your project location-/NLATool-Projekt
2. Type `npm update` in your terminal to make sure that every package is installed
3. Start the project with the command `npm start`
4. After the server is running; in your browser, navigate to localhost:3000/
5. You may want to refer to a certain route (e.g. localhost:3000/test); you can look up the available routes in the /routes directory in the project
6. If any of the CoreNLP or database connection fail, try restarting your query or secondly the whole express project

## Database:

This app will only run if there is a database connected to it.
If you want to use your own DB you need to go to {PROJEKT_PATH}/modules/confic.json
-> database.connections and add a new connection with host, port, username & password

## Corenlp Server:

This app will need a corenlp server to work. It already uses an external server but
if you want to set up your own you to go the {PROJEKT_PATH}/modules/config.json
->corenlp.connections and add a connection with a host aka url.