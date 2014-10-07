//configs

var offer = 'Put your offer ID here';
var offerprice = 500;


// init submodules
var syscoin = require('syscoin');

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

var biturl='https://bittrex.com/api/v1.1/public/getticker?market=BTC-SYS';
var cryptsyurl='http://pubapi.cryptsy.com/api.php?method=singlemarketdata&marketid=278';

var bittrexapi = function(biturl, $http) {
      return $http({
        method: 'GET',
        url: biturl
      });
      pricesysbittrex = result.Last;
    };

bittrexapi = new bittrexapi(biturl);
console.log('BittrexAPI result: ', bittrexapi);
bittrexapi.then();

var cryptsyapi = function(biturl) {
      return $http({
        method: 'GET',
        url: cryptsyurl
      });
      pricesyscryptsy = result.market.SYS.last;
    };

//var pricesysbittrex = bittrexapi.result.Last;

// Get BTC prices

var pricebtcbtce = 0;
var pricebtcbitstamp = 0;

var btceurl = 'https://btc-e.com/api/3/ticker/btc_usd';
var bitstampurl = 'https://www.bitstamp.net/api/ticker/';

var btceapi = function(biturl) {
      return $http({
        method: 'JSONP',
        url: btceurl
      });
      pricebtcbtce = result.btc_usd.last;
    };

var bitstampapi = function(biturl) {
      return $http({
        method: 'JSONP',
        url: bitstampurl
      });
      pricebtcbitstamp = result.last;
    };
    

//var pricebtcbtce = btceapi.btc_usd.last;
//var pricebtcbitstamp = bitstampapi.last;   
    
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
