/* 
Todo: 
https://www.digitalocean.com/community/tutorials/workflow-nodemon
https://docs.docker.com/language/nodejs/containerize/
*/
const route = require('./route');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// router conn
//app.use("/", route);

// use of public folder -> upload
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(`${__dirname}/upload`));

// use of handlebars
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set(express.static(__dirname + "/views"));

app.get("/", function (req, res) {
  res.render('home');
});

// Start the server and listen to the port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
