const db = require("../models");
const fetch = require("node-fetch");
const fs = require("fs");

let cryptodata = {};

async function fetchCryptodata2() {
  let coingecko = new Promise(function(resolve, reject) {
    return fetch(
      "https://api.coingecko.com/api/v3/coins?order=gecko_desc&per_page=250"
    );
  });

  let coinmarket = new Promise(function(resolve, reject) {
    return fetch("https://api.coinmarketcap.com/v2/ticker/")
      .catch(console.log("todo: get the last cryptodata and send warning"))
      .then(res => res.json())
      .then(res => {
        cryptodata = Object.values(res.data);
        cryptodata.sort((a, b) => a.rank - b.rank);
        let cryptostore = [];
        cryptodata.forEach(val => {
          const price = val.quotes.USD.price;
          const symbol = val.symbol;
          cryptostore.push({ price, symbol });
        });
        cryptostore = { ...cryptostore };
        db.CryptoPrice.create({ currency: cryptostore });
      });
  });
}

async function fetchCryptodata() {
  let urls = [
    "https://api.coinmarketcap.com/v2/ticker/?start=1&limit=100&sort",
    "https://api.coinmarketcap.com/v2/ticker/?start=101&limit=100&sort",
    "https://api.coingecko.com/api/v3/coins?order=gecko_desc&per_page=250&page=1",
    "https://api.coingecko.com/api/v3/coins?order=gecko_desc&per_page=250&page=2"
  ];
  let cryptodataarray = [];

  const grabContent = url =>
    fetch(url)
      .then(res => res.json())
      .then(res => cryptodataarray.push(res))
      .catch(err => console.log(err));

  try {
    await Promise.all(urls.map(grabContent));
  } catch (err) {
    console.log(err);
  }

  try {
    let coingecko = cryptodataarray[2].concat(cryptodataarray[3]);

    coingecko = await Object.values(coingecko);

    let coinmarketcap1 = await Object.values(cryptodataarray[0]);
    let coinmarketcap2 = await Object.values(cryptodataarray[1]);

    coinmarketcap1 = await Object.values(coinmarketcap1[0]);
    coinmarketcap2 = await Object.values(coinmarketcap2[0]);

    let coinmarketcap = coinmarketcap1.concat(coinmarketcap2);

    //needs fixing
    let combinedData = coinmarketcap
      .map(val => {
        let data;
        coingecko.forEach(val2 => {
          if (val2.symbol == val.symbol.toLowerCase()) {
            data = val2;
            delete val2.market_data.high_24h;
            delete val2.market_data.low_24h;
          }
        });
        return {
          ...data,
          coinmarketid: val.id,
          name: val.name,
          rank: val.rank,
          symbol: val.symbol
        };
      })
      .sort((a, b) => a.rank - b.rank)
      .filter(val => val.localization !== undefined);

    cryptodata = combinedData;
    console.log(
      "received Cryptodata from API at: " + new Date().toTimeString()
    );
    fs.writeFile("./prices.json", JSON.stringify(cryptodata, null, 2), err => {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    let data = JSON.parse(fs.readFileSync("./prices.json"));

    cryptodata = data[0].currency;
    console.log(error);
    console.log("Accessing backup Data");
  }
}

function fetchHistoricalData(coin, days = 7) {
  return fetch(
    `https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}/market_chart?vs_currency=usd&days=${days}`
  )
    .then(res => res.json())
    .then(res => {
      let historicalPrices = Object.values(res.prices);
      let x = res.prices.map(val => {
        let data = {
          x: val[0],
          y: val[1]
        };

        return data;
      });
      return x;
    });
}

exports.getHistoricalData = async function(req, res, next) {
  try {
    console.log(req.params.coin);

    let data = await fetchHistoricalData(req.params.coin, req.params.days);
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
};

exports.ApiFetchInterval = fetchCryptodata();
setInterval(() => {
  fetchCryptodata();
}, 300000);

exports.getCryptoPrices = async function(req, res, next) {
  try {
    return res.status(200).json(cryptodata);
  } catch (err) {
    return next(err);
  }
};
