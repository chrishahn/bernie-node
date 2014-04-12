var mongo           = require('mongodb'),
    express         = require('express'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    monk            = require('monk'),
    db              = monk('localhost:27017/berniemills'),
    app             = new express(),
    coll            = db.get('bernies'),
    inc             = require('./include.js');

app.use(bodyParser());
app.use(methodOverride());
 
// ## CORS middleware
//
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);

function validateBernie (json) {
    
    if (typeof json.bernietext == 'undefined' || json.bernietext == '') {
        return false;
    }

    if (typeof json.realtext == 'undefined' || json.realtext == '') {
        return false;
    }

    if (typeof json.description == 'undefined' || json.description == '') {
        return false;
    }

    return true;
    
}

function validateApiKey (key) {
    return key == inc.apiKey;
}

// POST create new bernie mills
app.post('/', function (req, res) {

    if (!validateBernie(req.body)) {
        res.statusCode = 400;
        return res.send('Error 400: Malformed Bernie Data');
    }

    coll.insert(req.body, function (err, doc) {

        if (err) {
            res.statusCode = 500;
            return res.send('Error 500: An Error Occurred. Please Try Again Later.');
        }

        res.statusCode = 201;
        res.json({_id: doc._id});
        
    });
});

// UPDATE a single bernie mills resource
app.put('/:id', function (req, res) {

    // grab the authorization header out of the request
    var reqKey = req.headers['x-api-key'];

    if (typeof reqKey == 'undefined' || !validateApiKey(reqKey)) {
        res.statusCode = 403;
        return res.send("Error 403: Missing Or Invalid Authentication.");
    }

    if (!validateBernie(req.body)) {
        res.statusCode = 400;
        return res.send('Error 400: Malformed Bernie Mills Data');
    }

    // delete the mongo db record
    coll.update({_id: req.params.id}, req.body);

    res.statusCode = 204;
    res.send();

});

// RETRIEVE individual bernie mills resource by id
app.get('/:id', function (req, res) {

    coll.find({_id: req.params.id}, function (e, docs) {

        if (e) {
            res.statusCode = 500;
            return res.send('Error 500: An Error Occurred. Please Try Again Later.');
        }

        if (docs.length == 0) {
            res.statusCode = 404;
            return res.send('Error 404: No Record For ID ' + req.params.id);
        }

        res.statusCode = 200;
        res.json(docs.pop());
    });

});

// DELETE individual bernie mills resource by id
app.delete('/:id', function (req, res) {

    // grab the authorization header out of the request
    var reqKey = req.headers['x-api-key'];

    if (typeof reqKey == 'undefined' || !validateApiKey(reqKey)) {
        res.statusCode = 403;
        return res.send("Error 403: Missing Or Invalid Authentication.");
    }

    // delete the mongo db record
    coll.remove({_id: req.params.id});

    res.statusCode = 204;
    res.send();

});

// RETRIEVE list of all bernie mills
app.get('/', function (req, res) {

    coll.find({}, function (e, docs) {

        if (e) {
            res.statusCode = 500;
            return res.send('Error 500: An Error Occurred. Please Try Again Later.');
        }

        res.statusCode = 200;
        res.json(docs);

    });
});

app.listen(inc.listenPort);
console.log("Listening on port " + inc.listenPort + "...");
