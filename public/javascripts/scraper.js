var request = require('request'),
    scraperjs = require('scraperjs');
    cheerio = require('cheerio');
    urls = [];

request('http://games.espn.go.com/ffl/standings?leagueId=558279&seasonId=2015', function(err, res, body) {
  if(!err && res.statusCode == 200) {
    var  $ = cheerio.load(body);
    $('.tableBody').each(function(){
      console.log(this);
      var url = this
      urls.push(url);
    });

    // console.log(urls);
  }
});