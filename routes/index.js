import express from 'express';
import appController from '../controllers/index.js';

const appRoutes = express.Router();

appRoutes.get("/", appController.home); // home (start) routes
appRoutes.get("/photos", appController.getPhotos); // get all photos route
appRoutes.delete("/api/photos/delete", appController.deletePhotos); // api to delete photos
appRoutes.post("/api/photos/upload", appController.uploadPhotos); // api to upload photos

export default appRoutes;