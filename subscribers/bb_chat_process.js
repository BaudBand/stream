class BBChatProcess {
	constructor(channel,bbchat, response)
	{
		var me = this;
		this.lastMessage = Date.now();
		this.channel = channel;
		this.response = response;
		this.bbchat = bbchat;
		this.pmFunc = function(c,d) { me.processMessage(c,d); };
		this.bbchat.on(this.bbchat.getListenerName(channel), this.pmFunc);
		setInterval(function() { me.sendPing() }, 10001);
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
		if(channel == this.channel)
		{
			if(data.message.substr(0,1)=="!") return; // command not message
			if(data.tags['message-type'] == "chat")
			{
				var message = '<span class="chat-message"><span class="chat-user" style="color:'+data.tags['color']+';">'
					+data.tags['display-name']+'</span>&nbsp;'
					+data.message+'</span><br />';
			}
			else if(data.tags['message-type'] == "action")
			{
				var message = '<span class="chat-action" style="color:'+data.tags['color']+'" ><span class="chat-user">'
					+data.tags['display-name']+'</span>&nbsp;'
					+data.message+'</span><br />';

			}
			else
			{
				console.log(data.tags['message-type']);
				return;
			}
			this.response.write("data: " +message+ "\n\n");
			this.lastMessage = Date.now();
		}
	}


	stop()
	{
		this.bbchat.removeListener(this.bbchat.getListenerName(this.channel), this.pmFunc);
		console.log("Listener to channel removed for " + this.channel);
	}
}	
module.exports = BBChatProcess;
