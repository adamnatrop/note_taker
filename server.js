// Dependencies
const fs = require('fs');
const nanoid = require('nanoid');
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
// package to create UID
let id = nanoid.nanoid();
console.log(id);

let notesData = [];
// Read saved database json file
fs.readFile('db/db.json','utf8', (err, data) => {
    err ? console.error(err) : console.log('Success Read File') 
    notesData = JSON.parse(data)
   });
// write database file    
function writeNotesToFile(data){
    fs.writeFile('db/db.json', data, (err) =>
    err ? console.log(err) : console.log('Success writeFile'))
};

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// used this to send back an html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))  
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

// get database 
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'db/db.json'))     
})
// apply UID and add new note to database
app.post('/api/notes', (req, res) => {
    req.body.id = nanoid.nanoid();
    notesData.push(req.body)
    res.json(req.body)
    writeNotesToFile(JSON.stringify(notesData))  
})
// delete function to remove note
app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id)
    notesData = notesData.filter( note => note.id != req.params.id)
    console.log(notesData)
    writeNotesToFile(JSON.stringify(notesData))
    res.sendFile(path.join(__dirname, 'db/db.json'))  
})
// Listener
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));