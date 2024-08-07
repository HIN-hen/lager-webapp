const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const app = express();
const port = process.env.PORT || 3000;

//- use body parser for json requests
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

//- pug template engine (https://nodejsera.com/library/pug/)
const pug = require('pug');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//- set static upload directory for entering from outside in view mode
const directory = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(directory));

//- Home
app.get('/', (req, res) => {
    res.render('index');
});

//- Get all uploaded files from folder
app.get('/photos', async (req, res) => {
    try {
        const data = await fs.readdir(__dirname + `/uploads/`);
        res.render('photos', { photos: data, amount: data.length });
    } catch (err) {
        console.log(err.message);
        res.status(404).send("No Files available.");
    }
});

//- api for writing files to upload folder
app.post('/upload', async (req, res) => {
    const { base64 } = req.body;
    const buff = Buffer.from(base64, 'base64');
    // YYYY-MM-DD_HH:MM.jpg
    // writing file to folder
    try {
        await fs.writeFile(__dirname + `/uploads/${Date.now()}.png`, buff);
        res.status(201).send('File written successfully.');
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});