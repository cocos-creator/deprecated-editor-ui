// init express
var express = require('express');
var app = express();

// create an error with .status. we
// can then use the property in our
// custom error handler (Connect repects this prop as well)
function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
}

// routes
app.get('/', function(req, res){
    res.sendfile('test/index.html');
});
app.get('/dock', function(req, res){
    res.sendfile('test/dock.html');
});
app.get('/debug-focus', function(req, res){
    res.sendfile('test/debug-focus.html');
});

// serves all the static files
app.get(/^(.+)$/, function(req, res){ 
    // console.log('static file request : ' + req.params);
    res.sendfile( __dirname + req.params[0]); 
});

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next){
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.send(err.status || 500, { error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
    res.send(404, { error: "404 Error." });
});

// start the server
var server = app.listen(8082, function() {
    console.log('Listening on port %d', server.address().port);
});
