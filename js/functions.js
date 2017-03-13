//JSON FOR TESTS//
var locations={};
//////////////////////END OF JSON FOR TESTS/////////


var defaultCoordsColima={lat:19.363624,lng:-103.686562};

var userLocation;
var currentLocation;
var lastLocation;
var totalLocationsByPinsDistance = 0;
var totalDefaultLocationsDistance = 0;
var counterLocations = 1;

//Show an error if geolocation doesn't work//
function error(error){
	$("#status").html("<p>Error: "+error+"</p>");
}

//Display the map and the markers//
function showMap(data){
	///Display the map
	map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 11,
    	center: defaultCoordsColima
    });

    $aMarkers=[];
    $contentString=[];
	//Iterare the object and display the markers//
	for (var key in data) {
		    var name=data[key].name;
		    var description=data[key].description;
		    var lati=data[key].lat;
		    var long=data[key].lng;

		    var contentString="<h4> "+name+"</h4><p>"+description+"</p>";
		    $contentString.push(contentString);

		    //create a marker on the map
		    var marker= new google.maps.Marker({
		    	position:{lat:lati,lng:long},
		    	map:map,
		    	title:name
		    });

		    $aMarkers.push(marker);

		    attachDescription(marker,contentString);
		    setAnimation(marker);
		}
}
var newLocations=[];
var locationSelected=[];

//Display a mark into the map when you make click in some place of the map
function placeMarkerAndPanTo(latLng){
	var marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
    map.panTo(latLng);
    google.maps.event.clearListeners(map,'click');
    $("#newLocation").hide();
    $("#pingDescription").show();
    $aMarkers.push(marker);
    $latLng=latLng;
}

function pingMapListener(){
	map.addListener('click', function(e) {
	    placeMarkerAndPanTo(e.latLng);
	});
}


//add a description to the marker
function attachDescription(marker,contentString){
	marker.addListener('click', function() {
        $("#description").html(contentString);
    });
}

//Set a animation to the marker
function setAnimation(marker){
	marker.addListener("click",function(){
		if(marker.getAnimation() != null)
			marker.setAnimation(null);
		else{
			marker.setAnimation(google.maps.Animation.BOUNCE);
			for(var a=0;a<$aMarkers.length;a++){
				if(marker!==$aMarkers[a])
					$aMarkers[a].setAnimation(null);
			}
		}
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
	$("#distanceTwoPoints").html("<p>The distance between last 2 locations is " + computeDistance(lastLocation,currentLocation) + " km</p>");
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


function setNewListener(marker){
	marker.addListener("click",function(){
		if(marker.getAnimation()==null){
			marker.setAnimation(google.maps.Animation.BOUNCE);
			locationSelected.push(marker);
		}
		else{
			marker.setAnimation(null);

			for(var key in locationSelected){
				if(locationSelected[key]==marker){
					console.log(locationSelected[key]);
					locationSelected.splice(key,1);					
				}
			}
		}
	});
}

$(document).ready(function(){
	database = firebase.database();
    var ref = database.ref('locations');
    ref.on('value', gotData, errorData);

	$("#pingLocation").on("click",function(){
		$("#pingLocation").hide();
		pingMapListener();
	});

	$("#saveLocation").on("click",function(){
    	var name=$("#name").val();
    	var description=$("#text").val();
		newLocations.push({"latitude":$latLng.lat(),"longitude":$latLng.lng(),"name":name,"description":description,"mediaURL":""});
		var last=($aMarkers.length)-1;
		var contentString="<h4> "+name+"</h4><p>"+description+"</p>";
		attachDescription($aMarkers[last],contentString);
		setAnimation($aMarkers[last]);
		$("#pingDescription").hide();
		$("#pingLocation").show();
	});

	$("#getDistanceLocations").on("click",function(){
		$("#getDistanceLocations").hide();
		$("#backStandard").show();

		locationSelected=[];
		for(var key in $aMarkers){
			$aMarkers[key].setAnimation(null);
			google.maps.event.clearListeners($aMarkers[key], 'click');
			setNewListener($aMarkers[key]);
		}
	});

	$("#backStandard").on("click",function(){
		for(var key in $aMarkers){
			google.maps.event.clearListeners($aMarkers[key], 'click');
			$aMarkers[key].setAnimation(null);
			setAnimation($aMarkers[key]);
			attachDescription($aMarkers[key],$contentString[key]);
			$("#getDistanceLocations").show();
			$("#backStandard").hide();
		}
	});
});

//FIREBASE FUNCTIONS
$('#btSend').on('click', function (e) {

	for(var key in newLocations){
		if(newLocations.hasOwnProperty(key)){
			var data={
				description : newLocations[key].description,
				lat: newLocations[key].latitude, 
				lng: newLocations[key].longitude,
				mediaURL: newLocations[key].mediaURL,
				name: newLocations[key].name
			};
    		database = firebase.database();
    		var ref = database.ref('locations');
    		ref.push(data);
		}
	}
});

//If we got the data correctly
function gotData(data){
	showMap(data.val());
}
//If something went wrong with the data
function errorData(error){
	console.log('Error');
	console.log(error);
}