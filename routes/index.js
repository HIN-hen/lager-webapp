import express from 'express';
import appController from '../controllers/index.js';

const appRoutes = express.Router();

appRoutes.get("/", appController.home);
appRoutes.get("/photos", appController.getPhotos);
appRoutes.delete("/api/photos/delete", appController.deletePhotos);
appRoutes.post("/api/photos/upload", appController.uploadPhotos);

export default appRoutes;