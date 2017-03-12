//JSON FOR TESTS//
var locations={"locationsColima":[{
		"lat":19.24331,
		"lng":-103.72802,
		"name":"Historical Center",
		"description": "In the Historical Center of Colima Capital we can see, among many others, the Government Palace, the portals, the Cathedral, the Theater Hidalgo, the Municipal Presidency, Hotel Ceballos, the kiosk , The Liberty Garden, the Portal of Medellin, etc."
	},
	{
		"lat":19.51267,
		"lng":-103.61734,
		"name":"Volcano of Colima",
		"description": "Yeah we have a Volcano"
	},
	{
		"lat":19.32306,
		"lng":-103.75845,
		"name":"Comala",
		"description": "A magic town of Colima"
	},
	{
		"lat":19.36172,
		"lng":-103.72387,
		"name":"Magical Zone",
		"description": "Where's everithing can happen"
	},
	{
		"lat":19.26561,
		"lng":-103.73598,
		"name":"Jardín de la Villa",
		"description": "You have to go there for some popsicles"
	},
	{
		"lat":19.26782,
		"lng":-103.72565,
		"name":"La Campana",
		"description": "Arqueoligical zone"
	}]
};
//////////////////////END OF JSON FOR TESTS/////////

//Show an error if geolocation doesn't work//
function error(error){
	console.log(error);
	$("#status").html("<p>Error: "+error+"</p>");
}

//Display the map and the markers//
function showMap(position){
	var location;
	var latitude=position.coords.latitude;
	var longitude=position.coords.longitude;
	location= {lat:latitude,lng:longitude};

	///Display the map
	var map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 10,
    	center: location
    });

	//Addlistener to know when the user make click on the map
    map.addListener('click', function(e) {
        placeMarkerAndPanTo(e.latLng, map);
    });

	//Iterare the object and display the markers//
	for (var key in locations.locationsColima) {
		if (locations.locationsColima.hasOwnProperty(key)) {
		    var name=locations.locationsColima[key].name;
		    var description=locations.locationsColima[key].description;
		    var lati=locations.locationsColima[key].lat;
		    var long=locations.locationsColima[key].lng;

		    var contentString="<h4> "+name+" <h4><p>"+description+"</p>";

		    //create a marker on the map
		    var marker= new google.maps.Marker({
		    	position:{lat:lati,lng:long},
		    	map:map,
		    	title:name
		    });

		    attachDescription(marker,contentString);
		    setAnimation(marker);
		}
	}
}

//Display a mark into the map when you make click in some place of the map
function placeMarkerAndPanTo(latLng, map){
	var marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
    map.panTo(latLng);
}

//add a description to the marker
function attachDescription(marker,contentString){
	var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

	marker.addListener('click', function() {
        infowindow.open(marker.get('map'), marker);
    });
}

//Set a animation to the marker
function setAnimation(marker){
	marker.addListener("click",function(){
		if(marker.getAnimation() !== null)
			marker.setAnimation(null);
		else
			marker.setAnimation(google.maps.Animation.BOUNCE);	
	});
}

$(document).ready(function(){
	//Check if your browser has support to geolocation
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showMap,error);
	}
	else{
		$("#status").html("<p>Geolocation is not supported by your browser</p>");
	}
});

//FIREBASE FUNCTIONS
$('#btSend').on('click', function (e) {

     var data = {
     	description : "New Item",
     	lat: 19.2432,
     	lng: -103.7281,
     	mediaURL: "",
     	name: "New Item from JS"
     }
     console.log(data);
     database = firebase.database();
     var ref = database.ref('locations');
     ref.push(data);
});

$('#btGet').on('click', function (e) {
     database = firebase.database();

     var ref = database.ref('locations');
     ref.on('value', gotData, errorData);
});

//If we got the data correctly
function gotData(data){
	console.log(data.val());
}
//If something went wrong with the data
function errorData(error){
	console.log('Error');
	console.log(error);
}