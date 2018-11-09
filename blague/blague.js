var Promise = require('q').Promise;

require('colors');


exports.action = function(data, callback){
	
	info("Blague du jour from:", data.client.yellow);
  
	var url = 'http://www.blague.info/blagues-du-jour/blagues.php';
	http_request(url)
	.then(body => scraper(body))
	.then(function(blague) { 
		Avatar.speak(blague, data.client, function(){ 
			Avatar.Speech.end(data.client);
	   });
	})
	.catch(function(err) {
		Avatar.speak(err, data.client, function(){ 
			Avatar.Speech.end(data.client);
	   });
	});
	
	callback();
}



function scraper(body) {
	
	return new Promise(function (resolve, reject) {
		  
		var $ = require('cheerio').load(body, { xmlMode: true, ignoreWhitespace: false, lowerCaseTags: false });
		var blague = $('body').text() ;
		if (!blague) {
			return reject('Désolé je n\'ai pas trouvé de blague');
		}
		blague = blague.substr(23).replace(/"/g,'').replace(/-/g,'');
		
		resolve (blague);
	});
	
}



function http_request (url) {
	
	return new Promise(function (resolve, reject) {
		
		var request = require('request');
		request({ 'uri' : url }, function (err, response, body) {
		
			if (err || response.statusCode != 200) {
			  return reject ('Désolé je n\'ai pas trouvé de blague');
			}

			resolve(body);
		});
		
	});
	
}