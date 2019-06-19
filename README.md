# NLATool - Natural Language Analysis Tool
A web application that uses Stanford Corenlp to analyse Texts for you and gives you a nice view on the text. It also should help you looking up words with a quick research functionality.

## Quick start:

### Setup NLATool
Step-by-step instructions:
* `$ npm install`
* `$ npm install -g nodemon`
* `$ npm start`

Tested on Ubuntu Server 18

### Run NLATool

1. Navigate to {PROJEKT_PATH} (-Your drive-/-Your project location-/NLATool-Projekt)
2. Type `npm update` in your terminal to make sure that every package is installed
3. Start the project with the command `npm start`
4. After the server is running; in your browser, navigate to localhost:3000/
5. You may want to refer to a certain route (e.g. localhost:3000/test); you can look up the available routes in the /routes directory in the project
6. If any of the CoreNLP or database connection fail, try restarting your query or secondly the whole express project

### Database

This app will only run if there is a database connected to it.
If you want to use your own DB you need to go to {PROJEKT_PATH}/modules/confic.json
-> database.connections and add a new connection with host, port, username & password

### Setup/Connect CoreNLP Server:

This app requires a corenlp server to work. To to connect to your own server add the details here: {PROJEKT_PATH}/modules/config.json
->corenlp.connections. To setup your own server follow the server setup instructions: https://stanfordnlp.github.io/CoreNLP/corenlp-server.html


## How to cite this work
This repository contains the tool for the COLING '18 paper on "NLATool: An Application for Enhanced Deep Text Understanding".

### Abstract
Today, we see an ever growing number of tools supporting text annotation. Each of these tools is optimized for specific use-cases such as named entity recognition. However, we see large growing knowledge bases such as Wikipedia or the Google Knowledge Graph. In this paper, we introduce NLATool, a web application developed using a human-centered design process. The application combines supporting text annotation and enriching the text with additional information from a number of sources directly within the application. The tool assists users to efficiently recognize named entities, annotate text, and automatically provide users additional information while solving deep text understanding tasks.

This work can be cited as follows:
<pre>
@inproceedings{Gartner:2018:NLA,
title = {NLATool: An Application for Enhanced Deep Text Understanding},
author = {Gärtner, Markus and Mayer, Sven and Schwind, Valentin and Hämmerle, Eric and Turcan, Emine and Rheinwald, Florin and Murawski, Gustav and Lischke, Lars and Kuhn, Jonas},
year = {2018},
date = {2018-08-20},
booktitle = {Proceedings of the 27th International Conference on Computational Linguistics: System Demonstrations},
pages = {4},
series = {COLING'18}
}
</pre>
