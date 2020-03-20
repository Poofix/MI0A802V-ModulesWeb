const fs = require('fs');

if (process.argv[2]) {
    fs.readFile('./data.csv', 'utf-8', (err, data) =>{
        if(err){
            console.error(err);
            return;
        }
        console.log(data);
    })
} else {
    console.error("Veuillez précisez le nom du fichier à lire");
}