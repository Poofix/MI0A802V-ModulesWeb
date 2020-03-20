# Lire dans un fichier

### Code source :
#### script.js
```javascript
var fs = require('fs');

if (process.argv[2]) {
    fs.readFile(process.argv[2], 'utf-8', (err, data) =>{
        if(err){
            console.error(err);
            return;
        }
        console.log(data);
    })
} else {
    console.error("Veuillez précisez le nom du fichier à lire");
}
```

#### data.csv
```csv
User1;toulouse;
User2;toulouse;
```

### Run time :
```
node script.js
```