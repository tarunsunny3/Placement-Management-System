if(process.env.NODE_ENV !== "production"){
require('dotenv').config({path:'./config/config.env'});
}
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const routes= require('./routes/routes.js');
const jobRoutes = require('./routes/jobRoutes.js');
const cookieParser = require('cookie-parser');
const app = express();
const cors= require('cors');
const fs = require('fs');
const connection= require('./db/connection');
const helmet = require("helmet");
const compression = require("compression");
//Connect to Database
connection();
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({
	extended: true
}));
app.use(cors({credentials: true, origin: true, "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",}));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(bodyParser.json({ extended: true, limit: "50mb" }));
if(!fs.existsSync('./reports')){
	fs.mkdir("./reports",  (err) => {
		if (err) {
			console.error(err);
		}
		console.log('Directory created successfully!');
	});
}

//Serve  static files
if(process.env.NODE_ENV == 'production'){
	app.use(express.static(path.resolve(__dirname, 'frontend', 'build')));
	app.use('/api', routes);
	app.use('/job', jobRoutes);
	app.get('/', (req, res)=>{
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
	});
	app.get('/*', (req, res)=>{
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
	});
};

app.get('/', (req, res)=>{
	res.send("Server up and running");
})

app.use('/api', routes);
app.use('/job', jobRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log("Server started on port", PORT);
});
