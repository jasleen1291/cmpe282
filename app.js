var http = require('http');
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var mysql = require('mysql');
require('./app/routes')(app); // configure our routes
var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: "myKey",
    secretAccessKey: "secretKey",
    region: "us-east-1"
});


dyn = new AWS.DynamoDB({
    endpoint: new AWS.Endpoint('http://localhost:8000')
});
var vogels = require('vogels');
vogels.dynamoDriver(dyn);
//Checking to see if tables exist
dyn.listTables(function(err, data) {
    console.log('listTables', err, data);
    calls(err, data);
}, calls);
/**ALL MY MODELS**/
var catalog = vogels.define('catalog', function(schema) {
    schema.String('name', {
        hashKey: true
    });
    schema.String('description');
});
var Items = vogels.define('item', function(schema) {
    schema.String('name', {
        hashKey: true
    });
    schema.String('catalog');
    schema.String('description');
    schema.Number('quantity');
    schema.String('cost');
});
var cart = vogels.define('cart', function(schema) {
    schema.Number('id', {
        hashKey: true
    });
    schema.String('items');

})

function calls(err, data) {
    if (err) {
        console.log("err");
    } else if (data.TableNames.length > 0) {
    	startBatchWrite();
    //	callback();
    } else {
        var call = vogels.createTables({
            'catalog': {
                readCapacity: 1,
                writeCapacity: 1
            },
            'item': {
                readCapacity: 1,
                writeCapacity: 1
            },
            'cart': {
                readCapacity: 1,
                writeCapacity: 1
            }
        }, function(err) {
            if (err) {
                console.log('Error creating tables', err);
            } else {
                console.log('table are now created and active');
                callback();
            }
        }, callback);

    }

};
//Defining my routes 
app.post("/signup", function(req, res) {
    var items = []
    var item = JSON.stringify(items);
    var acc = new cart({
        id: req.body.id,
        items: item
    });
    acc.save(function(err) {
        console.log('created account in DynamoDB');
        if (err) {
            res.send(err);
        } else {
            res.send({
                message: "Success"
            });
        }
    });
});
//All My cart operations
var router = express.Router();
router.route('/cart/:cart_id')
    .get(function(req, res) {
        cart.get(req.params.cart_id, function(err, acc) {
            if (err) {
                res.send(400, 'User cart not found');
            } else {
                var item = JSON.parse(acc.attrs.items);
                var batchGet = [];
                for (i in item) {
                    batchGet.push(item[i].item);
                }
                console.log(batchGet);
                Items.getItems(['Apple iPhone 6 Plus 128gb Gold - Unlocked'], function(err, accounts) {
                    if (err)
                        res.send(err);
                    else res.send({
                        cart: acc,
                        items: accounts
                    }); // prints loaded 3 accounts
                });

            }
        })
    })
    .put(function(req, res) {
        if (req.body.opt === "add") {
            cart.get(req.params.cart_id, function(err, acc) {
                    if (err) {
                        res.send(400, 'User cart not found');
                    } else {

                        var items = JSON.parse(acc.attrs.items);
                        var item = req.body.item;
                        var quantity = req.body.quantity;
                        items.push({
                            item: item,
                            quantity: quantity
                        });
                        jsonStr = JSON.stringify(items);
                        cart.update({
                            id: req.params.cart_id,
                            items: jsonStr
                        }, function(err, post) {
                            if (err)
                                res.send(err);
                            else
                                res.send(post);
                        });
                    }
                }

            );
        } else if (req.body.opt === "clear") {
            cart.get(req.params.cart_id, function(err, acc) {
                    if (err) {
                        res.send(400, 'User cart not found');
                    } else {

                        var items = []
                        var item = JSON.stringify(items);
                        cart.update({
                            id: req.params.cart_id,
                            items: item
                        }, function(err, post) {
                            if (err)
                                res.send(err);
                            else
                                res.send(post);
                        });
                    }
                }

            );
        } else if (req.body.opt === "chngeQuantity") {
            cart.get(req.params.cart_id, function(err, acc) {
                    if (err) {
                        res.send(400, 'User cart not found');
                    } else {

                        var items = JSON.parse(acc.attrs.items);
                        var item = req.body.item;
                        var quantity = req.body.quantity;
                        var oldItem = false;
                        for (var i in items) {
                            console.log(i);
                            if (items[i].item === item) {
                                items[i].quantity = quantity;
                                oldItem = true;
                                break;
                            }
                        }
                        if (oldItem) {
                            jsonStr = JSON.stringify(items);
                            cart.update({
                                id: req.params.cart_id,
                                items: jsonStr
                            }, function(err, post) {
                                if (err)
                                    res.send(err);
                                else
                                    res.send(post);
                            });
                        } else {
                            res.send(400, 'Item not found');
                        }


                    }
                }

            );
        } else if (req.body.opt === "del") {
            cart.get(req.params.cart_id, function(err, acc) {
                    if (err) {
                        res.send(400, 'User cart not found');
                    } else {

                        var items = JSON.parse(acc.attrs.items);
                        var item = req.body.item;
                        var oldItem = false;
                        for (var i in items) {
                            console.log(i);
                            if (items[i].item === item) {
                                items.splice(i, 1);
                                oldItem = true;
                                break;
                            }
                        }
                        if (oldItem) {
                            jsonStr = JSON.stringify(items);
                            cart.update({
                                id: req.params.cart_id,
                                items: jsonStr
                            }, function(err, post) {
                                if (err)
                                    res.send(err);
                                else
                                    res.send(post);
                            });
                        } else {
                            res.send(400, 'Item not found');
                        }
                    }
                }

            );
        } else {
            res.send(400, 'Invalid operations');
        }
    });




var callback = function() {
var param=require("./public/DynamoDump");

var newParams={
RequestItems:param.RequestItems
,
  ReturnConsumedCapacity: 'INDEXES | TOTAL | NONE',
  ReturnItemCollectionMetrics: 'SIZE | NONE'
};

dyn.batchWriteItem(newParams, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
        startBatchWrite();
    });    
       
  

};
var startBatchWrite=function(){


    app.use(express.static(__dirname + '/public'));
    app.use('/user', router);
    app.use('/admin', router2);
    app.set('port', process.env.PORT || 3000);
    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
    exports = module.exports = app;
};

router.route('/catalog')
    .get(function(req, res) {
        catalog
            .scan()
            .limit(20)
            .loadAll()
            .exec(function(err, resp) {
                if (err) {
                    res.send('Error running scan', err);
                } else {

                    res.send(resp);

                    if (resp.ConsumedCapacity) {

                        res.send('Scan consumed: ', resp.ConsumedCapacity);
                    }
                }
            });

    });

var router2 = express.Router();
router2.route('/catalog')
    .post(function(req, res) {

        var acc = new catalog({
            name: req.body.name,
            description: req.body.description
        });
        acc.save(function(err) {
            console.log('created account in DynamoDB');
            if (err) {
                res.send(err);
            } else {
                res.send({
                    message: "Success"
                });
            }
        });
    });
router2.route('/item')
    .post(function(req, res) {
        var item = new Items({
            name: req.body.name,
            description: req.body.description,
            catalog: req.body.catalog,
            quantity: req.body.quantity,
            cost: req.body.cost
        });
        console.log(item);
        item.save(
            function(err, item) {
                console.log('created account in DynamoDB');
                if (err) {
                    res.send(err);
                } else {
                    res.send({
                        message: "Success",
                        item: item
                    });
                }
            }
        );
    })
     .delete(function(req, res) {
        Items.destroy(req.body.name, function(err) {
            if (err)
                res.send(err);
            else {
                res.json({
                    message: "Success"
                });
            }
        });
    })
router.route('/item')
    .get(function(req, res) {
        Items
            .scan()
            .limit(20)
            .loadAll()
            .exec(function(err, resp) {
                if (err) {
                    res.send('Error running scan', err);
                } else {

                    res.send(resp);

                    if (resp.ConsumedCapacity) {

                        res.send('Scan consumed: ', resp.ConsumedCapacity);
                    }
                }
            });
    });
router.route('/:catalog')
    .get(function(req, res) {
        Items

            .scan()
            .where('catalog').eq(req.params.catalog)
            .returnConsumedCapacity()

        .exec(function(err, resp) {
            if (err) {
                res.send('Error running scan', err);
            } else {

                res.send(resp.Items);

                if (resp.ConsumedCapacity) {

                    res.send('Scan consumed: ', resp.ConsumedCapacity);
                }
            }
        });
    });
router.route('/items/all')
.get(function(req, res) {
    Items

        .scan()
        
        .returnConsumedCapacity()

    .exec(function(err, resp) {
        if (err) {
            res.send('Error running scan', err);
        } else {

            res.send(resp.Items);

            if (resp.ConsumedCapacity) {

                res.send('Scan consumed: ', resp.ConsumedCapacity);
            }
        }
    });
})

