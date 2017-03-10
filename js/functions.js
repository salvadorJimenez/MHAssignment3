var locations={
		"locationsColima":[{
			"ltd":19.24331,
			"lng":-103.72802,
			"name":"Historical Center",
			"description": "In the Historical Center of Colima Capital we can see, among many others, the Government Palace, the portals, the Cathedral, the Theater Hidalgo, the Municipal Presidency, Hotel Ceballos, the kiosk , The Liberty Garden, the Portal of Medellin, etc."
		},
		{
			"ltd":19.24331,
			"lng":-103.72802,
			"name":"Volcano of Colima",
			"description": "Yeah we have a Volcano"
		},
		{
			"ltd":19.24331,
			"lng":-103.72802,
			"name":"Comala",
			"description": "A magic town of Colima"
		},
		{
			"ltd":19.24331,
			"lng":-103.72802,
			"name":"Magical Zone",
			"description": "Where's everithing can happen"
		},
		{
			"ltd":19.24331,
			"lng":-103.72802,
			"name":"Jardín de la Villa",
			"description": "You have to go there for some popsicles"
		},
		{
			"ltd":19.24331,
			"lng":-103.72802,
			"name":"La Campana",
			"description": "Arqueoligical zone"
		}]
	};
var defaultCoordsColima={lat:19.363624,lng:-103.686562
};

function error(error){
	console.log(error);
	$("#status").html("<p>Error: "+error+"</p>");
}

function showMap(position){
	var location;
	if(!position)
		location=defaultCoordsColima;
	else{
		var latitude=position.coords.latitude;
		var longitude=position.coords.longitude;
		location= {lat:latitude,lng:longitude};
	}

	map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 13,
    	center: location
    });
}

$(document).ready(function(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showMap,error);
	}
	else{
		showMap(false);
	}
});