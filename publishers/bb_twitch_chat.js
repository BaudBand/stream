const EventEmitter = require('events');
class BBTwitchChat extends EventEmitter {
	constructor()
	{
		super();
		const tmi = require("tmi.js");
		var me = this;
		this.channels = [];
		this.client = new tmi.client({
			connection: { reconnect: true },
			options: { debug: false }
		});
		this.client.on('connected', function(addr,port) {
			me.emit("connected", addr+":"+port, { address: addr, port: port });
		});
		this.client.connect();
		this.client.on('message', function(channel,tags,message,self) {
			me.processMessage(channel,tags,message);
		});
	}

	joinChannel(channel)
	{
		if(this.channels.indexOf(channel) < 0)
		{
			console.log("Trying to join " + channel);
			this.channels.push(channel);
			this.client.join(channel);
			this.emit("joined", channel, {});
		}
		else
		{
			console.log("Could not join " + channel);
		}
		console.log(this.channels);

	}

	getListenerName(channel)
	{
		return "message_" + channel.replace(/^#/,'');
	}

	processMessage(channel,tags,message)
	{
		if(this.channels.indexOf(channel) >= 0)
		{
			this.emit(this.getListenerName(channel),channel, { tags: tags, message: message, channel: channel });
		}
	}


}

module.exports = BBTwitchChat;
