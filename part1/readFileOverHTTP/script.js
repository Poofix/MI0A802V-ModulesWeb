const fs = require('fs');
const http = require('http');
var url  = require('url');
var querystring = require('querystring');
const pug = require('pug');

var redData = [];

const port = 8080;

const compiledFunction = pug.compileFile('template.pug');

const server = http.createServer((req, res) =>{
    var params = querystring.parse(url.parse(req.url).query); // Extraire les arguments dans la requête
    //req.url.split('=',2)[1]

    if (params["file"]) {
        fs.readFile("./"+params["file"], 'utf-8', (err, data) =>{
            if(err){
                console.error(err);
                return;
            }
            redData = [];
            data.split('\n').forEach(element =>{ 
                redData.push(element.split(';',2))
            });
        });
    }

    const generatedTemplate = compiledFunction({ 
        redFile: redData 
    });
    console.log(redData);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(generatedTemplate);
});

server.listen(port, ()=>{
    console.log(`Le serveur écoute sur le port ${port}`);
});