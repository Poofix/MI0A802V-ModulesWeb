const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const port = 8080;

var renderArgs = {
    titre: '',
    bddContent: []
};

const db = mongoose.connection;

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.listen(port, () => console.log(`App listening on port ${port}.`));

mongoose.connect("mongodb://localhost/TP_Web", { useNewUrlParser: true });
const citySchema = new mongoose.Schema({
    name: String
});

const City = mongoose.model("cities", citySchema);
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(){
    //
})

app.get('/', (req, res) => {
    renderArgs.titre = "Index"
    res.render('index', renderArgs);
});

app.get('/cities', (req, res) => {
    City.find((err, cities) => {
        if(err) {
            console.error(err);
        } else {
            renderArgs.bddContent = JSON.parse(JSON.stringify(cities));
            res.render('template', renderArgs);
        }
    });
});

app.post('/city', bodyParser.json(), (req, res) => {
    console.log(req.body.name);
    if(req.body.name !== undefined && req.body.name !== null){
        City.findOne({name:req.body.name}, (err, city) => {
            if(err) {
                return console.error(err);
            }
            if(city == null){
                const addCity = new City({name: req.body.name});
                addCity.save((err) =>{
                    if(err){
                        return console.error(err);
                    }
                    City.find((err, cities) => {
                        if(err) {
                            console.error(err);
                        } else {
                            renderArgs.bddContent = JSON.parse(JSON.stringify(cities));
                            res.render('template', renderArgs); // Un formulaire ACTION pointe sur cette page
                        }
                    });
                });
            }
        })
    } else { res.render('template', renderArgs); }
});

app.put('/city/:id', (req,res) => {
    var id = null;
    if(req.params && req.params.id){
        id = req.params.id;
    }
    if(id == null){
        console.log("ID not found");
        res.setHeader('Content-type', 'text/html');
        res.statusCode = 400;
        res.end(); 
    } else {
        if(req.body.name != undefined && req.body.name != null) {
            City.findOneAndUpdate({_id: id}, req.body, (err) => {
                if(err){
                   return console.error(err); 
                }
                City.find((err, cities) => {
                    if(err) {
                        console.error(err);
                    } else {
                        renderArgs.bddContent = JSON.parse(JSON.stringify(cities));
                        res.render('template', renderArgs);
                    }
                });
            });
        }
    }
});

app.delete('/city/:id', (req,res) => {
    var id = null;
    if(req.params && req.params.id){
        id = req.params.id;
    } 
    if(id == null){
        console.log("ID not found");
        res.setHeader('Content-type', 'text/html');
        res.statusCode = 400;
        res.end(); 
    } else {
        City.deleteOne({_id:id}, (err) => {
            if(err){
                return console.error(err);
            }
            City.find((err, cities) => {
                if(err) {
                    console.error(err);
                } else {
                    renderArgs.bddContent = JSON.parse(JSON.stringify(cities));
                    res.render('template', renderArgs);
                }
            });
        });
    }
});