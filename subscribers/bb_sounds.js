const BBMySQLConn = require("../models/mysql_conn.js");

class BBSounds {
	constructor(channel,bbchat, response)
	{
		var me = this;
		this.lastMessage = Date.now();
		this.mysql = new BBMySQLConn("localhost","bbchat","bbchat");
		this.channel = channel;
		this.response = response;
		this.bbchat = bbchat;
		this.pmFunc = function(c,d) { me.processMessage(c,d); };
		this.bbchat.on(this.bbchat.getListenerName(channel), this.pmFunc);
		this.soundMap = {};
		this.mysql.findByString("sounds","channel",this.channel, 
			function(result) {  
				me.loadSounds(result); });
		this.pingTimer = setInterval(function() { me.sendPing() }, 10001);
		
	}

	loadSounds(sndArr)
	{
		if(typeof sndArr == 'object')
		{
			var me = this;
			var index = 0;
			sndArr.forEach( function(s) {
				me.soundMap[s.sound_command+""] = s;
				me.response.write("data: " + JSON.stringify({ action: 'load', sound: s}) + "\n\n");
			});
		}
	}

	sendPing()
	{
		if((Date.now()-this.lastMessage) > 10000)
		{
			this.lastMessage = Date.now();
			this.response.write(":\n\n");
		}
	}

	processMessage(channel, data)
	{
		if(channel == this.channel && data.message.substr(0,4)=="!sfx")
		{
			console.log("Sound request detected for " + this.channel);
			var mSplit = data.message.split(" ");
			if(mSplit.length > 0 && typeof this.soundMap[mSplit[1]] != "undefined")
			{
				console.log("Detected sound as " + this.soundMap[mSplit[1]].sound_title);
				this.response.write("data: " + JSON.stringify({ action: 'play', sound: this.soundMap[mSplit[1]], 
					user: { color: data.tags['color'], name: data.tags['display-name']}}) + "\n\n");
				this.lastMessage = Date.now();
			}
		}
	}


	stop()
	{
		this.clearInterval(this.pingTimer);
		this.bbchat.removeListener(this.bbchat.getListenerName(this.channel), this.pmFunc);
		console.log("Sounds listener removed for " + this.channel);
	}
}	
module.exports = BBSounds;
