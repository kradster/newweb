const express = require('express');
const app = express();

let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();

//for parsing application/xwww
app.use(bodyParser.urlencoded({ extended: true }));
//for parsing application/json
app.use(bodyParser.json());
//for parsing multipart/form-data
app.use(upload.array());

//serve all static folders
app.use(express.static('css'));
app.use(express.static('img'));
app.use(express.static('myfont'));
app.use('/usertemplate', express.static('usertemplate'));

//Connecting to local database
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('database.db', err => {
    if (err) return console.error(err.message);
    console.log('Connected to database.db SQLite3 Local Database');
    db.exec(`
        CREATE TABLE IF NOT EXISTS Users ( 
        contact_id integer PRIMARY KEY,
        first_name text NOT NULL,    
        last_name text NOT NULL,    
        address_line_1 text NOT NULL,
        address_line_2 text NOT NULL,
        city text NOT NULL,
        pincode text NOT NULL,
        email text NOT NULL   
        );
    `);
});

app.listen(process.env.PORT || 3000, () => {
    console.log('listening on : ' + (process.env.PORT || 3000));
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.post('/account', (req, res) => {
    console.log(req.body);
    data = req.body;
    db.exec(`
    INSERT INTO Users(first_name, last_name, address_line_1, address_line_2, city, pincode, email)
    VALUES(` + Object.values(data).join(",") + `);
    `);
    res.send(data);
});

app.post('/changepwd', (req, res) => {
    console.log(req.body);
    data = req.body;
    res.send(data);
});

app.post('/updatekyc', (req, res) => {
    console.log(req.body);
    data = req.body;
    res.send(data);
});


app.get('*', (req, res) => {
    res.send('404 Page Not Found.');
});