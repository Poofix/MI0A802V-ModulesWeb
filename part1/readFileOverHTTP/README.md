# Lire dans un fichier avec HTTP

### Code source :
#### script.js
```javascript
const fs = require('fs');
const http = require('http');
var url  = require('url');
var querystring = require('querystring');
const pug = require('pug');

var redData = [];

const port = 8080;

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

            const compiledFunction = pug.compileFile('template.pug');
            const generatedTemplate = compiledFunction({ 
                redFile: redData 
            });

            //console.log(redData);
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(generatedTemplate);
        }); 
    } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end("<a href=\"?file=data.csv\">test ici</a>");
    }
});

server.listen(port, ()=>{
    console.log(`Le serveur écoute sur le port ${port}`);
});
```

#### data.csv
```csv
User1;toulouse;
User2;toulouse;
```

### Run time :
```
$ node script.js
$ firefox 127.0.0.1:8080
```
