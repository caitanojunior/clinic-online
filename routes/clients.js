var express = require('express');
var router = express.Router();

/* GET clients listing. */
router.get('/clientlist', function(req, res) {
    var db = req.db;
    var collection = db.get('clientlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to addclient.
 */
router.post('/addclient', function(req, res) {
    var db = req.db;
    var collection = db.get('clientlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

module.exports = router;
