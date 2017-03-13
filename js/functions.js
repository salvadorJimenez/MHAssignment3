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

var userLocation;
var currentLocation;
var lastLocation;
var totalLocationsByPinsDistance = 0;
var totalDefaultLocationsDistance = 0;
var counterLocations = 1;

//Display the map and the markers//
function showMap(position){
	var location;
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	location = {lat:latitude,lng:longitude};
	currentLocation = location;
	userLocation = location;

	///Display the map
	var map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 15,
    	center: location
    });

	//Addlistener to know when the user make click on the map
    map.addListener('click', function(e) {
        placeMarkerAndPanTo(e.latLng, map);
        lastLocation = currentLocation;
        currentLocation = {lat:e.latLng.lat(), lng:e.latLng.lng()};
        showTotalSelectedDistance(currentLocation);  
        showLastTwoLocationsDistance(currentLocation);  
    });

    var currentLocationMarker = new google.maps.Marker({
    	position:{lat:latitude, lng:longitude},
    	map:map,
    	title:"You"
    });
    setAnimation(currentLocationMarker);
    var locationStart;
	var locationDest;
	var latDest;
	var lngDest;
	var locationsCounter = 0;
	//Iterare the object and display the markers//
	for (var key in locations.locationsColima) {
		if (locations.locationsColima.hasOwnProperty(key)) {
		    var name = locations.locationsColima[key].name;
		    var description = locations.locationsColima[key].description;
		    var lati = locations.locationsColima[key].lat;
		    var long = locations.locationsColima[key].lng;

		    var contentString="<h4> "+name+" <h4><p>"+description+"</p>";

		    //create a marker on the map
		    var marker = new google.maps.Marker({
		    	position:{lat:lati,lng:long},
		    	map:map,
		    	title:name
		    });
		    
		    if (locations.locationsColima[locationsCounter+1] != null) {
		    	lngDest = locations.locationsColima[locationsCounter+1].lng;
		    	latDest = locations.locationsColima[locationsCounter+1].lat;
		    	locationStart = {lat:lati, lng:long};
		    	locationDest = {lat:latDest, lng:lngDest};
		    	locationsCounter++;
		    	totalDefaultLocationsDistance += computeDistance(locationStart,locationDest);
		    }
		    attachDescription(marker,contentString);
		    setAnimation(marker);
		}
	}

	showDefaultLocationsDistance();
	showTwoPointsDefaultDistance();
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

function showTwoPointsDefaultDistance() {
	var locationsMeasuredString = "Your distance to: <br>";
	var newLocation;
	for(var key in locations.locationsColima){
		newLocation = {lat:locations.locationsColima[key].lat,lng:locations.locationsColima[key].lng};
		locationsMeasuredString +=  locations.locationsColima[key].name + " is " + 
		computeDistance(currentLocation,newLocation) + " km.<br>";
	}

	$("#defaultTwoPointsDistance").html("<p>" + locationsMeasuredString + "</p>");
}

function showDefaultLocationsDistance() {
	$("#defaultLocationsDistance").html("<p>The distance between default locations is " + totalDefaultLocationsDistance + " km");
}

function showLastTwoLocationsDistance(currentLocation){
	$("#distanceTwoPoints").html("<p>The distance between last 2 locations is " + computeDistance(lastLocation,currentLocation) + " km</p>")
}

function showTotalSelectedDistance(currentLocation){
	var distance = computeDistance(lastLocation,currentLocation) + totalLocationsByPinsDistance;
	totalLocationsByPinsDistance = distance;
	counterLocations++;
	$("#distancePinsDiv").html("<p>The distance between your " + counterLocations + " locations is " + distance + " km</p>");
}

function computeDistance(startCoords, destCoords) {
    var startLatRads = degreesToRadians(startCoords.lat);
    var startLongRads = degreesToRadians(startCoords.lng);
    var destLatRads = degreesToRadians(destCoords.lat);
    var destLongRads = degreesToRadians(destCoords.lng);
    var Radius = 6371; // radius of the Earth in km
    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
    Math.cos(startLatRads) * Math.cos(destLatRads) *
    Math.cos(startLongRads - destLongRads)) * Radius;
    return distance;
}

function degreesToRadians(degrees) {
    var radians = (degrees * Math.PI)/180;
    return radians;
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