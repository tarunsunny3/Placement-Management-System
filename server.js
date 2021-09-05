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
// app.use(helmet());
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
var sendNotification = function(data) {
	var headers = {
	  "Content-Type": "application/json; charset=utf-8",
	  "Authorization": "Basic ZGQyZTc1NmYtMGI4OS00NTVhLWJlYmEtMDQ2Zjc1ODI4OTQx"
	};
	
	var options = {
	  host: "onesignal.com",
	  port: 443,
	  path: "/api/v1/notifications",
	  method: "POST",
	  headers: headers
	};
	
	var https = require('https');
	var req = https.request(options, function(res) {  
	  res.on('data', function(data) {
		console.log("Response:");
		console.log(JSON.parse(data));
	  });
	});
	
	req.on('error', function(e) {
	  console.log("ERROR:");
	  console.log(e);
	});
	
	req.write(JSON.stringify(data));
	req.end();
  };
  
  var message = { 
	app_id: "239fffcd-8ce7-4c36-9b2b-15daa44603e5",
	contents: {"en": "English Message"},
	included_segments: ["Subscribed Users"]
  };
  
//   sendNotificati on(message);


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
