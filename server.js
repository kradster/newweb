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

app.listen(process.env.PORT || 3000, () => {
    console.log('listening on : ' + (process.env.PORT || 3000));
});

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.post('/account', (req, res) => {
    console.log(req.body);
    data = req.body;
    res.send(data);
});

app.post('/changepwd', (req, res) => {
    console.log(req.body);
    data = req.body;
    res.send(data);
});

app.get('*', (req, res) => {
    res.send('404 Page Not Found.');
});