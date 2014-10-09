//configs

var offer = 'Put your offer ID here';
var offerprice = 500;


// init submodules
var syscoin = require('syscoin');
var https = require('https');
var http = require('http');

// init client handler

var sysclient = new syscoin.Client({
  host: 'localhost',
  port: 8368,
  user: 'username',
  pass: 'password',
  timeout: 180000
});

// Get SYS Prices

var pricesyscryptsy = 0;
var pricesysbittrex = 0;

var pricebtcbtce = 0;
var pricebtcbitstamp = 0;

var rawbittrex = 'NIL';
var rawcryptsy = 'NIL';
var rawbtce = 'NIL';
var rawbitstamp = 'NIL';

var biturl='https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS';
var cryptsyurl='http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=278';
var btceurl = 'https://btc-e.com/api/3/ticker/btc_usd';
var bitstampurl = 'https://www.bitstamp.net/api/ticker/';

//////////// Define API options /////////////////////
var optionsgeta = {
    host : 'bittrex.com', // here only the domain name
    // (no http/https !)
    port : 443,
    path : '/api/v1.1/public/getticker?market=BTC-SYS', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

var optionsgetb = {
    host : 'pubapi.cryptsy.com', // here only the domain name
    // (no http/https !)
    port : 80,
    path : '/api.php?method=singlemarketdata&marketid=278', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

var optionsgetc = {
    host : 'btc-e.com', // here only the domain name
    // (no http/https !)
    port : 443,
    path : '/api/3/ticker/btc_usd', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

var optionsgetd = {
    host : 'www.bitstamp.net', // here only the domain name
    // (no http/https !)
    port : 443,
    path : '/api/ticker/', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

// do the GET request
var reqGet = https.request(optionsgeta, function(res) {
    console.log("statusCode: ", res.statusCode);

    res.on('data', function(d) {
        rawbittrex = d;
        var reqGet = http.request(optionsgetb, function(res) {
            console.log("statusCode: ", res.statusCode);

            res.on('data', function(d) {
              rawcryptsy = d;
              var reqGet = https.request(optionsgetc, function(res) {
                console.log("statusCode: ", res.statusCode);

                res.on('data', function(d) {
                  rawbtce = d;
                  var reqGet = https.request(optionsgetd, function(res) {
                    console.log("statusCode: ", res.statusCode);

                    res.on('data', function(d) {
                      rawbitstamp = d;
                      console.log('raw of stamp: ', rawbitstamp);
                      // Calc the averages and final price

                      var sysprice = (pricesysbittrex + pricesyscryptsy) / 2;
                      var btcprice = (pricebtcbtce + pricebtcbitstamp) / 2;

                      var price = offerprice / btcprice / sysprice;
                      console.log('Bittrex Price: ', pricesysbittrex);
                      console.log('Bitstamp Price: ', pricebtcbitstamp);
                      console.log('Final price in SYS: ', price); // debug print for development

                      // update the offer

                      sysclient.offerUpdate(offer, 0, price, offer.desc, function(err, response, resHandler){
                        if (err) return console.log(err);
                          console.log('Update successful');
                      });
                    });
                  });
                });
              });
            });
        });
    });
});

console.log('This is bittrex result: ', rawbittrex)
//////////// End of Bittrex call ////////////////////
