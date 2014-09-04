// init express
var express = require('express');
var app = express();
var cwd = process.cwd();
var port = 8082;

process.on('uncaughtException', function(err) {
    switch (err.code) {
    case 'EADDRINUSE':
        console.error( 'Error: The listening port ' + port + ' is in used' );
        break;

    default:
        console.error(err);
        break;
    }
});

// create an error with .status.
function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
}

// routes
app.get('/', function(req, res){
    res.sendFile( cwd + '/test/index.html' );
});
app.get('/dock', function(req, res){
    res.sendFile( cwd + '/test/dock.html');
});
app.get('/debug-focus', function(req, res){
    res.sendFile( cwd + '/test/debug-focus.html');
});

// serves all the static files
app.get(/^(.+)$/, function(req, res){ 
    // console.log('static file request : ' + req.params);
    res.sendFile( cwd + req.params[0]); 
});

app.use(function(err, req, res, next){
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.status(err.status || 500).send({ error: err.message });
});

app.use(function(req, res){
    res.status(404).send({ error: "404 Error." });
});

// start the server
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
