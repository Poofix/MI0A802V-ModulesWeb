# Prise en main du framework express

### Code source :
#### script.js
```javascript
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

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
    var id = null;
    if(req.params && req.params.id) {
        id = req.params.id;
    }

    if(id == null){
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400;
        res.end();
    } else {
        fs.readFile('cities.json', 'utf-8', (err, data) => {
            if(err){
                console.error(err);
                res.setHeader('Content-Type', 'text/html');
                res.statusCode = 404;
                res.end();
            } else {
                if(req.body.name !== undefined && req.body.name !== null){
                    var newContent = JSON.parse(data);
                    newContent.cities.forEach(element => {
                        if(element.id === id){
                            element.name = req.body.name;
                        }
                    });
                    console.log(newContent);
                    fs.writeFile('cities.json', JSON.stringify(newContent), (err) => {
                        if(err){
                            console.error(err);
                        } else {
                            renderArgs.fileContent = JSON.parse(data).cities;
                            res.setHeader('Content-type', 'text/html');
                            res.statusCode = 200;
                            res.render('template', renderArgs);
                        }
                    })
                }
            }
        });
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

// Erreur générique 500 à ajouter?
```

### Résultat : 

#### GET
* Avec : `GET 127.0.0.1:8080/cities`
    * ![tp2_0.png](../../ressources/tp2_0.png)

### POST 
* Avec : `POST 127.0.0.1:8080/city`
    * ![tp2_1.png](../../ressources/tp2_1.png)
    * ![tp2_11.png](../../ressources/tp2_11.png)

### PUT
* Avec : `PUT 127.0.0.1:8080/city`
    * ![tp2_2.png](../../ressources/tp2_2.png)
    * ![tp2_20.png](../../ressources/tp2_20.png)

### DELETE
* Avec : `PUT 127.0.0.1:8080/city`
    * ![tp2_3.png](../../ressources/tp2_3.png)
    * ![tp2_30.png](../../ressources/tp2_30.png)
