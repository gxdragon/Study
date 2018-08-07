/**
 * 
 */

const express = require('express');
const app = express();
const router = require('./router/index')(app);

app.set('views', __dirname + '/views');			//view file setting

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/public', express.static('public'));	//use static folder

const server = app.listen(8000, function(){
	console.log("Express server started");
});
