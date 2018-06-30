const express = require('express');
const app = express();

let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();

let passport = require('passport');

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
            referral text
        );
    `);
});

// passport.use(new LocalStrategy((username, password, done) => {
//     db.get('SELECT password FROM users WHERE username = ?', username, (err, row) => {
//         if (!row) return done(null, false);
//         db.get('SELECT username, id FROM users WHERE username = ? AND password =? ', username, password, (err, row) => {
//             if (!row) return done(null, false);
//             return done(null, row);
//         })
//     });
// }));

// passport.serializeUser((user, done) => {
//     return done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     db.get('SELECT id, username FROM users WHERE id = ?', id, (err, row) => {
//         if (!row) return done(null, false);
//         return done(null, row);
//     });
// });

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
    INSERT INTO Users(first_name, last_name, email, password, )
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

app.post('/register', (req, res) => {
    data = req.body;
    if (data.password !== data.cpassword) return res.send({ error: "Passwords dont match" });
    delete data.cpassword;
    sql = "INSERT INTO Users(contact_id, first_name, last_name, email, password, referral) VALUES(" + Date.now() + ",'" + Object.values(data).join("', '") + "');";
    //console.log(sql);
    db.exec(sql, err => {
        if (err) return res.send(err);
        res.cookie('userid', data.first_name + data.email);
        return res.redirect('/usertemplate/account.html');
    });
    //res.redirect('/');
});

app.post('/login', (req, res) => {
    data = req.body;
    console.log(data);

    db.get("SELECT first_name, last_name, email, referral, contact_id FROM Users WHERE email = ? AND password = ?", data.email, data.password, (err, row) => {
        console.log("function trigger");
        if (!row) {
            console.log("0 rows found");
            return res.send('Error2');
        }
        console.log(row);
        res.cookie('userdata', row);
        return res.redirect('/usertemplate/dashboard.html');
    });
    //res.send(req.body);

});

app.get('*', (req, res) => {
    res.send('404 Page Not Found.');
});