const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
var querystring = require('querystring');
var url  = require('url');

const port = 8080;
const uuidv4 = require('uuid/v4');

var fs = require('fs');

var renderArgs = {
    titre: '',
    fileContent: []
};

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.listen(port, () => console.log(`App listening on port ${port}.`));

app.get('/', (req, res) => {
    renderArgs.titre = "Index"
    res.render('index', renderArgs);
});

app.get('/cities', (req, res, next) => {
    fs.readFile('cities.json', 'utf-8',  (err, data) => {
        if (err){
            console.error(err);
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 200;
            res.end();
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 200;
            renderArgs.titre = "Contenu du JSON";
            renderArgs.fileContent = JSON.parse(data).cities;
            console.log(renderArgs.fileContent);
            res.render('template', renderArgs);
        }
    });
});

app.post('/city', bodyParser.json(), (req, res, next) => {
    fs.readFile('cities.json', 'utf-8',  (err, data) => {
        if (err){
            console.error(err);
            if(req.body.name !== undefined || req.body.name !== null){
                var content = {
                    "id": uuidv4(),
                    "name": req.body.name
                }
                fs.appendFile('cities.json', JSON.stringify(content), function (err) {
                    if (err)  {console.log(err) };
                });
            }
            res.setHeader('Content-Type','text/html');
            res.statusCode = 404;
            res.end();
        } else {
            if(req.body.name !== undefined || req.body.name !== null){
                var content = {
                    "id": uuidv4(),
                    "name": req.body.name
                }
                var newContent = JSON.parse(data);
                newContent.cities.push(content);

                fs.writeFile('cities.json', JSON.stringify(newContent), function (err) {
                    if (err) {console.log(err) }
                    else { 
                        renderArgs.fileContent = JSON.parse(data).cities;
                        res.setHeader('Content-Type', 'text/html');
                        res.statusCode = 200;
                        res.render('template', renderArgs);
                    };
                });
            }
        }
    });
});

app.put('/city/:id', (req, res, next) => {
    //var idToDelete = req.params.id ? req.params.id : null;

    if (params["id"]) {

    } else {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400;
        res.end();
    }
});

app.delete('/city/:id', (req, res, next) => {
    var idToDelete = req.params.id ? req.params.id : null;

    if (idToDelete) {
        fs.readFile('cities.json', 'utf-8',  (err, data) => {
            if (err){
                console.error(err);
                res.setHeader('Content-Type','text/html');
                res.statusCode = 404;
                res.end();
            } else {
                if(req.body.name !== undefined || req.body.name !== null){
                    var newContent = JSON.parse(data);
                    let index = 0;
                    newContent.cities.forEach(city => {
                        if(city.id == idToDelete) {
                            index = newContent.cities.indexOf(city)
                        }
                    });
                    if (index != -1){
                        newContent.cities.splice(index, 1);
                    }
    
                    fs.writeFile('cities.json', JSON.stringify(newContent), function (err) {
                        if (err) {console.log(err) }
                        else { 
                            renderArgs.fileContent = JSON.parse(data).cities;
                            res.setHeader('Content-Type', 'text/html');
                            res.statusCode = 200;
                            res.render('template', renderArgs);
                        };
                    });
                }
            }
        });
    } else {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400;
        res.end();
    }
});

// Erreur générique 500 à jouter