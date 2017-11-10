# NLATool
Natural Language Analysis Tool


## Setup NLATool
Step-by-step instructions:
* `$ npm install -g nodemon`
* `$ npm install -g --production windows-build-tools`
* `$ npm install -g node-gyp`
* `$ npm config set python python2.7`
* `$ npm install`
* `$ npm start`

Hint: To install node-gyp you have to install Python 2.7 (v3.x.x is not supported), and run `npm config set python python2.7` before you run `npm install`.


## Quick start:

1. Navigate to -Your drive-/-Your project location-/NLATool-Projekt
2. Type `npm update` in your terminal to make sure that every package is installed
3. Start the project with the command `npm start`
4. After the server is running; in your browser, navigate to localhost:3000/
5. You may want to refer to a certain route (e.g. localhost:3000/test); you can look up the available routes in the /routes directory in the project
6. If any of the CoreNLP or database connection fail, try restarting your query or secondly the whole express project


## MYSQL Server for external access

host: turcan.de
port: 3306
user: nlatool
pw: 1EcH1pHr1VHhdknm
