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
        callback();
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
     var fileData=""
     fs = require('fs')
     fs.readFile('./public/DynamoDump.js', 'utf8', function (err,data) {
       if (err) {
         return console.log(err);
       }
       
  startBatchWrite(data);
});
};
var startBatchWrite=function(fileData){
var params = {
  RequestItems: {
    items: [{
      PutRequest: {
        Item: {
          name: {
            S: 'abc',
          }
        }
      }
    }, {
      PutRequest: {
        Item: {
          name: {
            S: 'def',
          }
        }
      }
    }, {
      PutRequest: {
        Item: {
          name: {
            S: 'Apple iPad mini 16GB'
          },
          description: {
            S: 'The new Apple iPad mini                             16GB with Wi-Fi gives you all the features of an iPad but in a slightly smaller form. With a 7.9-inch LED-backlit display and an A5 chip, the iPad mini 16GB delivers a beautiful screen with a fast and fluid performance. Featuring a 5MP iSight camera with 1080p HD video recording and FaceTime, you can snap pictures, take video and talk to loved ones on a platform that fits in the palm of your hand. The Apple iPad mini 16GB with Wi-Fi has ultrafast wireless that gives you access to high-speed cellular data networks around the world. With up to 10 hours of battery life, the iPad mini 16GB gives you the freedom to work anywhere, anytime. The grey or white Apple iPad mini even offers you all the amazing apps (over 275,000 apps on the App Store) that are made for iPad. So its an iPad in every way and shape, in a slightly smaller form.</br>Apple iPad mini 16GB with Wi-Fi (Space Grey or White):<ul><li>The Apple iPad mini with WiFi has a 7.9-inch LED-backlit display</li><li> A5 chip</li><li> 5MP iSight camera with 1080p HD video recording</li><li> FaceTime camera</li><li> The Apple iPad mini with WiFi features up to 10 hours of battery life *</li><li> Built-in Wi-Fi (802.11a/b/g/n)</li><li> Over 275,000 apps on the App Store **</li><li> The Apple iPad 16GB (Space Gray or White) runs on iOS 6 and iCloud</li><li> Cellular data service on Wi-Fi + Cellular models (sold separately)</li><li> Available in black & slate or white & silver</li><li> </ul>* Battery life varies by use and configuration. See www.apple.com/batteries for more information.</br>** App count refers to the total number of apps worldwide.'
          },
          description: {
            S: '279.00'
          },
          quantity: {
            N: '10'
          }
        }
      }
    }, {
      PutRequest: {
        Item: {
          name: {
            S: 'SCEPTRE X405BV-FHDR 40" LED Class 1080P HDTV with ultra slim metal brush bezel, 60Hz'
          },
          description: {
            S: 'View crisp, crystal-clear, sharp images thatll enrich your entertainment experience with the SCEPTRE X405BV-FHDR 40" LED Class 1080P HDTV with ultra slim metal brush bezel, 60Hz.</br>Note: You must have a source of HD programming in order to take full advantage of the SCEPTRE X405BV-FHDR 40" LED Class 1080P HDTV with ultra slim metal brush bezel, 60Hz. Contact your local cable or satellite TV provider for details on how to upgrade.</br>SCEPTRE X405BV-FHDR 40" LED Class 1080P HDTV with ultra slim metal brush bezel, 60Hz:<ul><li>40 inch TV LED panel</li><li> With a 1920 x 1080 Full HD resolution</li><li> True 16:9 aspect ratio</li><li> View your movies as the director intended</li><li> Wide 176-degree vertical and 176-degree horizontal angles</li><li> See a clear picture from anywhere in the room</li><li> Built-in digital tuner</li><li> Watch digital broadcasts, including HDTV programs where available</li><li> Three HDMI inputs</li><li> Enjoy a superior HD experience with HDMI, the one cable audio/video solution</li><li> 40" screen measured diagonally from corner to corner</li><li> Wall mountable</li><li> VESA standard 400mm x 200mm</li></ul>'
          },
          description: {
            S: '259.00'
          },
          quantity: {
            N: '10'
          }
        }
      }
    }, {
      PutRequest: {
        Item: {
          name: {
            S: 'VIZIO D320-B1 32" Class 720p 60Hz Full-Array LED HDTV'
          },
          description: {
            S: 'Introducing the all-new 2014 D- Series 32" (31.50" diag.) Full-Array LED TV with an ultra-narrow frame, and vibrant LED-lit picture. Full-Array LED delivers brilliant picture quality as it distributes LEDs behind the entire screen for superior light uniformity. Enjoy high definition TV in crisp, clear 720p HD resolution. With a near borderless design, a thinner side profile and space-saving, slimmer base, the new D-Series 32" Full-Array LED TV is a perfect upgrade to any room. VIZIO D-Series: Picture-Perfect Brilliance. </br>Note: You must have a source of HD programming in order to take full advantage of the VIZIO 32" LED HDTV. Contact your local cable or satellite TV provider for details on how to upgrade.</br>VIZIO D320-B1 32" 720p 60Hz Class LED HDTV:<ul><li>32" LED panel</li><li> With a 1366 x 768 resolution</li><li> True 16:9 aspect ratio</li><li> View your movies as the director intended</li><li> Wide 178-degree vertical and 178-degree horizontal angles</li><li> See a clear picture from anywhere in the room</li><li> Built-in digital tuner</li><li> Watch digital broadcasts, including HDTV programs where available</li><li> HDMI Inputs: 2</li><li> Enjoy a superior HD experience with HDMI, the one cable audio/video solution</li><li> 31.5" screen measured diagonally from corner to corner</li><li> Wall mountable</li><li> VESA standard 100mm x 100mm</li></ul>'
          },
          description: {
            S: '218.00'
          },
          quantity: {
            N: '10'
          }
        }
      }
    }, {
      PutRequest: {
        Item: {
          name: {
            S: 'Craig CVD512A DVD Player'
          },
          description: {
            S: 'The Craig CVD512A DVD Player with Remote is a convenient way to watch your favorite movies at home. The audio and video output jacks allow you to easily connect it to your television. It has component and progressive video output jacks and progressive scan capabilities. The Craig DVD player supports multiple languages and AC operation. It is DVD, JPEG and CD player compatible.</br>Craig CVD512A DVD Player:<ul><li>DVD/JPEG/CD-R/CD-RwithCD player compatible</li><li> Progressive scan</li><li> Audio/Video output jacks</li><li> Component/Progressive video output jacks</li><li> Craig portable DVD player supports different languages</li><li> AC operation</li></ul>'
          },
          description: {
            S: '22.68'
          },
          quantity: {
            N: '10'
          }
        }
      }
    }, {
      PutRequest: {
        Item: {
          name: {
            S: 'Straight Talk Apple iPhone 5S 4G LTE 16GB Prepaid Smartphone'
          },
          description: {
            S: 'The highly advanced Straight Talk iPhone 5S 4G LTE 16GB Prepaid Smartphone features the A7 chip with 64-bit architecture, the Touch ID fingerprint sensor, a new 8-megapixel iSight camera, a new FaceTime HD camera, ultrafast LTE wireless,1 iOS 7, and iCloud. Yet its as thin and light as ever</br>Straight Talk Apple iPhone 5S 4G LTE 16GB Prepaid Smartphone:<ul><li>4-inch (diagonal) Multi-Touch Retina display</li><li> Resolution: 1136-by-640-pixel resolution at 326 ppi</li><li> Straight Talk iPhone 5S 4G LTE 16GB Prepaid Smartphone Storage: 16GB, 32GB or 64GB</li><li> Chip: A7 with 64-bit architecture and M7 coprocessor</li><li> Wireless data: 802.11a/b/g/n Wi-Fi (802.11n 2.4GHz and 5GHz), Bluetooth 4.0 wireless technology</li><li> GPS: Assisted GPS and GLONASS</li><li> Camera: 8-megapixel iSight camera for photos and 1080p HD video recording, FaceTime HD camera for video calls</li><li> Straight Talk 4G Phone Battery: Built-in rechargeable lithium-ion batter</li><li> Talk time: Up to 10 hours on 3G</li><li> Straight Talk Smartphone Standby time: Up to 250 hours</li><li> Internet use: Up to 8 hours on 3G, up to 10 hours on LTE, up to 10 hours on Wi-Fi</li><li> Video playback: Up to 10 hours</li><li> Audio playback: Up to 40 hours</li><li> Straight Talk 4G Phone Dimensions: 123.8 mm by 58.6 mm by 7.6 mm</li><li> Weight: 112</li><li> In the Straight Talk Smartphone box: iPhone 5s, Apple EarPods with Remote and Mic, Lightning to USB Cable, USB Power Adapter, Documentation</li><li> Input and output: Lightning connector, 3.5-mm stereo headphone mini-jack, built-in speaker, built-in microphone, SIM card tray</li><li> System requirements: Apple ID (required for some features) Internet access Syncing with iTunes on a Mac or PC requires: Mac: OS X v10.6.8 or later PC: Windows 7; Windows Vista; or Windows XP Home or Professional with Service Pack 3 or later iTunes 11.1 or later (free download from www.itunes.com/download).</li><li> For a complete set of Straight Talk iPhone 5S 4G LTE 16GB Prepaid Smartphone Technical Specifications, go to http://www.apple.com/iphone-5c/specs/</li></ul>'
          },
          description: {
            S: '549.00'
          },
          quantity: {
            N: '10'
          }
        }
      }
    }],
  },
  ReturnConsumedCapacity: 'INDEXES | TOTAL | NONE',
  ReturnItemCollectionMetrics: 'SIZE | NONE'
};
console.log(params);
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
    });
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

                res.send(resp);

                if (resp.ConsumedCapacity) {

                    res.send('Scan consumed: ', resp.ConsumedCapacity);
                }
            }
        });
    })
