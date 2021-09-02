var express = require('express');
var router = express.Router();

const sensors = require('./sensors')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/sensors', sensors)

module.exports = router;
