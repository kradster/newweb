const express = require('express');
const app = express();

let bodyParser = require('body-parser');

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

app.get('*', (req, res) => {
    res.send('404 Page Not Found.');
});