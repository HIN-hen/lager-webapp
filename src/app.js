import express from "express";
import appRoutes from "./routes/index.js";
 
const __dirname = import.meta.dirname;

//- create app instance, port
const app = express();
//const port = process.env.PORT || 3000;

const isProduction = process.env.NODE_ENV === 'production';

//app.use(express.static(__dirname + "/public")); // static folder for js, css files ...
//app.use(express.static(__dirname + "/uploads")); // static folder for uploaded files ...
//app.use(express.static(__dirname + "/modules")); // application modules folder ...

// Serve static files from "public" folder
app.use(express.static('public'));
// Serve photos from "uploads" folder
app.use(express.static('uploads'));

app.use(express.json({ limit: "50mb" }));

app.use(appRoutes);

//- pug template engine
app.set("view engine", "pug");
app.set("views", __dirname + '/views');
/*
app.listen(port, () => {
    console.log(`App listening on port ${port} -> http://localhost:${port}`);
});
*/

// Export the app for Vite
export const viteNodeApp = app;

// Only start server if not using Vite's dev mode
if (isProduction) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  }
