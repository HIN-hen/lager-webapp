import express from "express";
import { readdir, writeFile } from "node:fs/promises";
import { unlink } from "node:fs";
import formatDate from "./helpers/helper.formatDate.js";

const __dirname = import.meta.dirname;

//- create app instance, port
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public")); // static folder for js, css files ...
app.use(express.static(__dirname + "/uploads")); // static folder for uploaded files ...

app.use(express.json({ limit: "50mb" }));

//- pug template engine
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// home route
app.get("/", (req, res) => {
    res.render('camera');
});

// get photos api route
app.get("/photos", async (req, res) => {
    let photos = [];
    try {
        const files = await readdir(__dirname + "/uploads", (err) => {
            if (err) throw err;
        });
        files.reverse(); // newest files on top
        files.forEach(el => photos.push(
            { name: formatDate(el), image: el }
        ));
        res.status(200).render('photos', { photos: photos });
    } catch (error) {
        res.status(204).render('No file found, ' + error.message);
    }
});
// delete photos api route
app.delete('/photos', async (req, res) => {
    const photos = req.body;
    try {
        await photos.forEach(photo => {
            unlink(__dirname + '/uploads/' + photo, (err) => {
                if (err) throw err;
                console.log(photo + ' deleted.');
            });
        });
        res.status(200).send("Photos deleted.");
    } catch (error) {
        res.status(500).send("Error deleting image, " + error.message);
    }
})
// post upload api route
app.post('/upload', async (req, res) => {
    const { base64 } = req.body;
    const buff = Buffer.from(base64, 'base64');
    try {
        await writeFile(__dirname + `/uploads/${Date.now()}.jpg`, buff, (err) => {
            if (err) throw err;
        });
        res.status(201).send('File written successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port} -> http://localhost:${port}`)
});