const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const port = 8080;
const uuidv4 = require('uuid/v4');

var fs = require('fs');

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

function syncLocal(){
    
}

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

    if(req.body.name !== undefined && req.body.name !== null){
        const addCity = new City({name: req.body.name});
        addCity.save((err) => {
            if(err){
                console.log(err);
            } else {
                City.find((err, city) => {
                    if(err){
                        console.log(err);
                    } else {
                        try {
                            renderArgs.bddContent = JSON.parse(JSON.stringify(cities));
                        } catch (error) {
                            console.error("Impossible de lire la base de donnée");
                        }
                        res.render('template', renderArgs);
                    }
                });
            }
        });
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