function Foursquare()
{
	if(!window.plugins){
        window.plugins = {};
    }
    
	if(window.plugins.childBrowser == null){
		try{
			ChildBrowser.install();
		}catch(err){}
	}
}

Foursquare.install = function()
{
	if(!window.plugins){
		window.plugins = {};	
	}
	window.plugins.foursquare = new Foursquare();
	return window.plugins.foursquare;
}

Foursquare.prototype.connect = function(client_id, redirect_uri, display)
{
	if( window.plugins.childBrowser == null ) return;

	this.client_id = client_id;
	this.redirect_uri = redirect_uri;
	
	var oauth_url = "https://foursquare.com/oauth2/authenticate?";
		oauth_url += "client_id=" + client_id;
		oauth_url += "&response_type=token";
		oauth_url += "&locate=es";
		oauth_url += "&display=" + ( display ? display : "touch" );
		oauth_url += "&redirect_uri=" + encodeURIComponent(redirect_uri);

	window.plugins.childBrowser.showWebPage(oauth_url, {showLocationBar:false});

	var self = this;
	window.plugins.childBrowser.onLocationChange = function(loc){self.onLocationChange(loc);};
}

Foursquare.prototype.onLocationChange = function(newLoc)
{
	if(newLoc.indexOf(this.redirect_uri) == 0)
	{
		var key = 'access_token=';
		var index = newLoc.indexOf(key);
		if( index > -1 ){
			this.accessToken = newLoc.substr(index + key.length).split('&')[0];
			// TODO: Implement expires
		}else{
			// TODO: Implement error
			alert('ERROR: No token :(');
		}
		
		window.plugins.childBrowser.close();
		if( this.onConnect != undefined ){
			this.onConnect();
		}
	}
}
Foursquare.prototype.api = function(type, params){
	var now = new Date();
	var currentDate = [
		now.getFullYear(), 
		('0'+now.getMonth()).substr(-2), 
		('0'+now.getDate()).substr(-2)
	].join('');


	var api_url = 'https://api.foursquare.com/v2/'+ type +'?';
		api_url += 'oauth_token=' + window.plugins.foursquare.accessToken;
		api_url += '&v=' + currentDate;

	if(params != undefined){
		for(key in params){
			api_url += '&' + key + '=' + params[key];
		}
	}

	return api_url;
	
}
