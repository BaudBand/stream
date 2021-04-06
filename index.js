var http = require('http');
//const EventEmitter = require('events');
const QueryString = require('query-string');
const BBTwitchChat = require('./publishers/bb_twitch_chat.js');
const BBChatProcess = require('./subscribers/bb_chat_process.js');
const BBMySQLConn = require('./models/mysql_conn.js');
var publisherChat = new BBTwitchChat();
publisherChat.on("connected", function(to,eData) { console.log("Connected to " + to); publisherChat.joinChannel("#baudband"); });
publisherChat.on("joined", function(eTarget, eData) {
	console.log("Joined channel " + eTarget);
});
publisherChat.on("message", function(channel, data) { console.log(channel + " - " + data.message); });
mysqlDB = new BBMySQLConn('localhost','bbchat','bbchat');
mysqlDB.test();
const BBSounds = require('./subscribers/bb_sounds.js');

http.createServer( function(req,res) {
		const qParsedQuery = QueryString.parseUrl(req.url);
		var splitUrl = qParsedQuery.url.split("/");
		console.log(splitUrl);
		if(typeof splitUrl[1] != "undefined" && splitUrl[1] == "sounds")
		{
			res.writeHead(200, {'Content-Type': 'text/event-stream', 'Cache-Control' : 'no-cache'});
			var subscriberChat = new BBSounds("#baudband",publisherChat, res); 
			req.on('close', function() {
				subscriberChat.stop();
				subscriberChat = null;
				res.end();
			});
		}
		else if(typeof splitUrl[1] != "undefined" && splitUrl[1] == "chat")
		{
			res.writeHead(200, {'Content-Type': 'text/event-stream', 'Cache-Control' : 'no-cache'});
			var subscriberChat = new BBChatProcess("#baudband",publisherChat, res); 
			req.on('close', function() {
				subscriberChat.stop();
				subscriberChat = null;
				res.end();
			});
		}
		
		

	



}).listen(3000, 'localhost');

