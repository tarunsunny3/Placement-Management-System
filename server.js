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

const connection= require('./db/connection');
//Connect to Database
connection();

app.use(express.urlencoded({
	extended: true
}))

app.use('/api', routes);
app.use('/job', jobRoutes);
//Serve  static files
if(process.env.NODE_ENV == 'production'){
	app.use(express.static(path.resolve(__dirname, 'frontend', 'build')));
	app.get('*', (req, res)=>{
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
	})
}
app.use(cors({credentials: true, origin: ['https://uoh-plms.netlify.app', 'http://localhost:3000'], "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",}));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }))
app.use(bodyParser.json({ extended: true, limit: "50mb" }));
app.get('/', (req, res)=>{
	res.send("Server up and running");
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log("Server started on port", PORT);
});
