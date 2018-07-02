const express = require('express');
const app = express();

let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();

let bcrypt = require('bcrypt-nodejs');

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
app.use('/login.html', express.static('login.html'));
app.use('/register.html', express.static('register.html'));
app.use('/reset.html', express.static('reset.html'));

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
            email varchar(100) NOT NULL,    
            password text NOT NULL,
            referral text,
            address_line_1 text,
            address_line_2 text,
            city text,
            pincode text
        );
    `);
});

app.listen(process.env.PORT || 3000, () => {
    console.log('listening on : ' + (process.env.PORT || 3000));
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/usertemplate/logout.html', (req, res) => {
    res.cookie('first_name', '', 0);
    res.cookie('last_name', '', 0);
    res.cookie('email', '', 0);
    res.cookie('referral', '', 0);
    res.cookie('contact_id', '', 0);
    res.cookie('hash', '', 0);
    res.redirect('/');
});

app.post('/account', (req, res) => {
    console.log(req.body);
    console.log(req.cookies);

    // db.get("SELECT address_line_1, address_line_2, pincode, city FROM Users WHERE email = ? AND password = ?", data.email, bcrypt.hashSync(data.password), (err, row) => {
    //     //console.log("function trigger");
    //     if (!row) {
    //         console.log("0 rows found");
    //         return res.send('Error, No such user exists');
    //     }
    // });
    data = req.body;

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

app.post('/register', (req, res) => {
    data = req.body;
    if (data.password !== data.cpassword) return res.send({ error: "Passwords dont match" });
    delete data.cpassword;
    data.password = bcrypt.hashSync(data.password);
    sql = "INSERT INTO Users(contact_id, first_name, last_name, email, password, referral) VALUES(" + Date.now() + ",'" + Object.values(data).join("', '") + "');";
    //console.log(sql);
    db.exec(sql, err => {
        if (err) return res.send(err);
        return res.redirect('/usertemplate/account.html');
    });
    //res.redirect('/');
});

app.post('/login', (req, res) => {
    data = req.body;
    //console.log("Logged in", data);
    db.get("SELECT first_name, last_name, email, password, referral, contact_id, address_line_1, address_line_2, city, pincode FROM Users WHERE email = ?", data.email, (err, row) => {
        //console.log("function trigger");
        if (!row) {
            console.log("0 rows found");
            return res.send('Error, No such user exists');
        }
        //console.log(row);
        if (!bcrypt.compareSync(data.password, row.password)) return res.send("Err  or, Incorrect password.");
        e = { expires: new Date(Date.now() + 1000 * 60 * 24) };
        console.log('Logged in', row);

        res = setCookies(res, row, e);
        return res.redirect('/usertemplate/dashboard.html');
    });
    //res.send(req.body);

});

function setCookies(res, row, expiry = 0) {
    for (let key in row)
        if (row[key]) res.cookie(key, row[key], expiry);
        else res.cookie(key, "", expiry);
    return res;
}

app.get('*', (req, res) => {
    res.send('404 Page Not Found.');
});