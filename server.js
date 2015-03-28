var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var human = require('./models/human').human();
var kiss  = require('./models/kiss').kiss();
var virus = require('./models/virus').virus();
var hvIndex = require('./models/human-virus-index.js').humanVirusIndex();
var async  = require('async');
require('./lib/array-helper').help();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.contentType('application/json');
  next();
});

var port = process.env.PORT || 4508;


// TODO Maybe, create some kind of controllers
var router = express.Router();
var renderError = function (err) {
  return {
    status: 500,
    message: err
  }
}
router.get('/', function(req, res) {
  res.json({
    message: 'VIRUS! Virus Everywhere!',
    apiVersion: '0.0.1',
    apiDocs: 'TODO'
  });
});

router.post('/device/reg', function (req, res) {
  console.log('Trying to register new user: ' + req.query.id);
  console.log(req.body);
  human.create(req.query, function (result, err) {
    if(err) {
      res.write(JSON.stringify(renderError(err)));
    } else {
      res.write(JSON.stringify({
        status: 200,
        res: true
      }))
    }
    res.end()
  });
});

router.get('/device', function (req, res) {
  console.log('Trying to get a user: ' + req.query.id);
  human.get(req.query.id, function (result, err) {
    if(err) {
      res.write(JSON.stringify(renderError(err)));
    } else {
      res.write(JSON.stringify({
        status: 200,
        res: result
      }))
    }
    res.end()
  });
});

router.post('/kiss', function (req, res) {
  kiss.create(req.query, function (result, err) {
    if(err) {
      res.write(JSON.stringify(renderError(err)));
    } else {
      res.write(JSON.stringify({
        status: 200,
        res: true
      }))
    }
    res.end()
  });
});

router.post('/virus/new', function (req, res) {
  virus.create(req.query, function (result, err) {
    if(err) {
      res.write(JSON.stringify(renderError(err)));
    } else {
      res.write(JSON.stringify({
        status: 200,
        res: true
      }));
    }
    res.end();
  })
});

router.get('/markers/all', function (req, res) {

});

router.post('/virus/sick', function (req, res) {
  hvIndex.create(req.query, function (result, err) {
    if(err) {
      res.write(JSON.stringify(renderError(err)));
      res.end();
      return;
    }
    human.isSick(req.query.deviceId, function (result, err) {
      if(err) {
        res.write(JSON.stringify(renderError(err)));
      } else {
        res.write(JSON.stringify({
          status: 200,
          res: true
        }));
      }
    res.end();
    });
  });
});

app.use('/api', router);

app.listen(port);

console.log('You can "Kill all Humas!" on port: ' + port);
