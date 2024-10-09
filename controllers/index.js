import { Buffer } from "node:buffer";
import { readdir, writeFile } from "node:fs/promises";
import { unlink } from "node:fs";
import formatDate from "../helpers/helper.formatDate.js";
import path from "node:path";

const __uploadDir = path.resolve('uploads'); // resolve path to uploads folder

// home 
const home = (req, res) => {
    res.render('camera');
};

// get photos 
const getPhotos = async (req, res) => {
    let photos = [];
    try {
        const files = await readdir(__uploadDir, (err) => {
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
};

// delete photos 
const deletePhotos = async (req, res) => {
    const photos = req.body;
    try {
        await photos.forEach(photo => {
            unlink(__uploadDir + '/' + photo, (err) => {
                if (err) throw err;
                console.log(photo + ' deleted.');
            });
        });
        res.status(200).send("Photos deleted.");
    } catch (error) {
        res.status(500).send("Error deleting image, " + error.message);
    }
};

// upload photos
const uploadPhotos = async (req, res) => {
    const { base64 } = req.body;
    const buf = Buffer.from(base64, 'base64');
    try {
        await writeFile(__uploadDir + `/${Date.now()}.jpg`, buf, (err) => {
            if (err) throw err;
        });
        res.status(201).send('File written successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const appController = {
    home,
    getPhotos,
    deletePhotos,
    uploadPhotos
};

export default appController;