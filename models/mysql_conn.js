class BBMySQLConn {

	constructor(host,username,password)
	{
		const MySQL = require('mysql');
		this.connected = false;
		this.conn = MySQL.createConnection({
			host: host,
			user: username,
			database: 'bbchat',
			password: password});
		this.conn.connect(function(err) {
			this.connected = true;
			console.log(err);
		});
	}
	query(sql,resultFunc,errorFunc) {
		this.conn.query(sql, function(err,result) {
			if(err && typeof errorFunc != 'undefined') 
				errorFunc(err);
			else 
				resultFunc(result);
		});
	}

	findByString(table,field,value,callback)
	{
		this.conn.query("SELECT * FROM " + this.conn.escapeId(table) + 
			" WHERE " + this.conn.escapeId(field) + " = " + this.conn.escape(value),
			function(err,res,fields)
			{
				if(err) console.log(err);
				else 
				{

					var result=[];
					var row = {};
					callback(JSON.parse(JSON.stringify(res)));
				}
			});
	}

	test()
	{
		this.findByString('sounds','channel','#baudband', function(err,r) {
			if(err) console.log(err);
			else console.log(r);
		});
	}

	
}
module.exports = BBMySQLConn;
