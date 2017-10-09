# NLATool
Natural Language Analysis Tool


## Setup NLATool
Step-by-step instructions:
* `$ npm install -g nodemon`
* `$ npm config set python python2.7`
* `$ npm install`
* `$ npm start`

Hint: To install node-gyp you have to install Python 2.7 (v3.x.x is not supported), and run `npm config set python python2.7` before you run `npm install`.


## Provisional quick start:

1. Navigate to -Your drive-/-Your project location-/NLATool-Projekt
2. Type `npm update` in your terminal to make sure that every package is installed
3. Start the project with the command `npm start`
4. In your browser, navigate to localhost:3000/
5. You may want to refer to a certain route (e.g. localhost:3000/test); you can look up the available routes in the /routes directory in the project
6. Download [CoreNLP](https://stanfordnlp.github.io/CoreNLP/index.html) and navigate to the directory you extracted the files to
7. Start the CoreNLP server with the command `java -mx1g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -port 4000 -timeout 15000`

(Alternatively to steps 6&7 you can use the batch file server_start.bat I've written; you just need to edit in your own directory first)

## MYSQL Server for external access

host: turcan.de
port: 3306
user: nlatool
pw: 1EcH1pHr1VHhdknm
