//configs

var offer = 'Put your offer ID here';
var offerprice = 500; // Price per piece of you offer; Currency: USD
var maxdiffperc = 1; // maximum tolerated price diff without performing offer update; in percent

// init submodules
var syscoin = require('syscoin');
var https = require('https');
var http = require('http');

// init client handler

var sysclient = new syscoin.Client({
  host: 'localhost',
  port: 1111,
  user: 'user',
  pass: 'pass',
  timeout: 180000
});

var offerdata = '';

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
////////// End of API options ///////////

///////// API requests & Calcs //////////

sysclient.offerInfo(offer, function(err, response, resHandler){
  if (err) return console.log(err);
  console.log('OfferInfo successful');
  offerdata = response;
  
  var reqGet = https.request(optionsgeta, function(res) {
    var responseString = '';
    res.on('data', function(data) {
      responseString += data;
    });
    res.on('end', function() {
        rawbittrex = JSON.parse(responseString);
        var reqGet = http.request(optionsgetb, function(res) {
          var responseString = '';
          res.on('data', function(data) {
            responseString += data;
          });
          res.on('end', function() {
              rawcryptsy = JSON.parse(responseString);
              var reqGet = https.request(optionsgetc, function(res) {
                var responseString = '';
                res.on('data', function(data) {
                  responseString += data;
                });
                res.on('end', function() {
                  rawbtce = JSON.parse(responseString);
                  var reqGet = https.request(optionsgetd, function(res) {
                    var responseString = '';
                    res.on('data', function(data) {
                      responseString += data;
                    });
                      res.on('end', function() {
                      rawbitstamp = JSON.parse(responseString);
                      
                      pricesysbittrex = rawbittrex["result"]["Last"];
                      pricesyscryptsy = rawcryptsy["return"]["markets"]["SYS"]["lasttradeprice"];
                      pricebtcbtce = rawbtce["btc_usd"]["last"];
                      pricebtcbitstamp = rawbitstamp["last"];
                      
                      console.log('bittrex price result: ', pricesysbittrex)
                      console.log('cryptsy price result: ', pricesyscryptsy);
                      console.log('btce price result: ', pricebtcbtce);
                      console.log('bitstamp price result: ', pricebtcbitstamp);
                      
                      var sysprice = ((parseFloat(pricesysbittrex) + parseFloat(pricesyscryptsy)) / 2);
                      var btcprice = ((parseFloat(pricebtcbtce) + parseFloat(pricebtcbitstamp)) / 2);
                      console.log('final avg. sys price: ', sysprice);
                      console.log('final avg. btc price: ', btcprice);

                      var price = (offerprice / btcprice / sysprice);
                      price = price.toFixed(7);
                      console.log('Final price in SYS: ', price); // debug print for development

			var upper = (price*(1+(parseFloat(maxdiffperc)/100)));
			var lower = (price*(1-(parseFloat(maxdiffperc)/100)));
			upper = upper.toFixed(7);
			lower = lower.toFixed(7);
			console.log('upper, then lower, then offer.price: ', upper, ' ', lower, ' ', offer.price);
                        console.log('this is the offer: ', offerdata);
			// update the offer
                      if((parseFloat(offerdata.price) >= upper) || parseFloat(offerdata.price) <= lower) {
                        console.log('IF clause matched!');
			sysclient.offerUpdate(offerdata.id, offerdata.category, offerdata.title, '0', price, offerdata.description, function(err, response, resHandler){
                          if (err) return console.log(err);
                            console.log('Offer update successful');
                        });
                      };
                    });
                  });
                  reqGet.end();
                  reqGet.on('error', function(e) {
                    console.error(e);
                  });
                });
              });
              reqGet.end();
              reqGet.on('error', function(e) {
                console.error(e);
              });
            });
        });
        reqGet.end();
        reqGet.on('error', function(e) {
          console.error(e);
        });
    });
  });
  reqGet.end();
  reqGet.on('error', function(e) {
    console.error(e);
  });
});
