var defaultCoordsColima={lat:19.363624,lng:-103.686562};

var userLocation;
var currentLocation;
var lastLocation;
var totalLocationsByPinsDistance = 0;
var totalDefaultLocationsDistance = 0;
var counterLocations = 1;

var newLocations=[];
var locationSelected=[];
//Show an error if geolocation doesn't work//
function error(error){
	$("#status").html("<p>Error: "+error+"</p>");
}

var currentLocation;
var storedLocations;
var lastLocation;
var totalLocationsByPinsDistance = 0;
var totalDefaultLocationsDistance;
var counterLocations = 0;

//Display the map and the markers//
function showMap(data){
	///Display the map
	map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 11,
    	center: defaultCoordsColima
    });


	currentLocation = defaultCoordsColima;
    $aMarkers=[];
    $contentString=[];
	//Iterare the object and display the markers//
	for (var key in data) {
		    var name=data[key].name;
		    var description=data[key].description;
		    var lati=data[key].lat;
		    var long=data[key].lng;
		    var media=data[key].mediaURL;

		   	var contentString="<h4> "+name+"</h4><video width='320' height='240' autoplay><source src='"+media+"' type='video/mp4'>Your browser does not support the video tag.</video> <p>"+description+"</p>";
		    $contentString.push(contentString);
		    //create a marker on the map
		    var marker = new google.maps.Marker({
		    	position:{lat:lati,lng:long},
		    	map:map,
		    	title:name
		    });

		    $aMarkers.push(marker);
		    attachDescription(marker,contentString);
		    setAnimation(marker);
		}
}

//Display a mark into the map when you make click in some place of the map
function placeMarkerAndPanTo(latLng){
	 $marker = new google.maps.Marker({
        position: latLng,
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        map: map
    });
    map.panTo(latLng);
    google.maps.event.clearListeners(map,'click');
    $("#newLocation").hide();
    var selectedLocation = "<h4>Selected <br>lat:"+latLng.lat() +", long:" +latLng.lng()+"</h4>";
    $("#description").html(selectedLocation);
    $("#pingDescription").show();
    $aMarkers.push($marker);
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
	var locationsMeasuredString = "Your distance (Your location = " + defaultCoordsColima.lat + "," + defaultCoordsColima.lng + ") from: <br>";
	var newLocation;
	for(var key in storedLocations){
		newLocation = {lat:storedLocations[key].lat,lng:storedLocations[key].lng};
		locationsMeasuredString +=  "-" + storedLocations[key].name + " is " + 
		computeDistance(defaultCoordsColima,newLocation) + " km.<br>";
	}
	$("#distances").html("<p>" + locationsMeasuredString + "</p>");
}

function showDefaultLocationsDistance() {
	lastLocation = currentLocation;
	totalDefaultLocationsDistance = 0;
	for(var key in storedLocations){
		currentLocation = {lat:storedLocations[key].lat, lng:storedLocations[key].lng};
		totalDefaultLocationsDistance += computeDistance(lastLocation,currentLocation);
		lastLocation = currentLocation;
	}
	$("#distances").html("<p>The distance between default locations is " + totalDefaultLocationsDistance + " km");
}

function showTotalSelectedDistance(){

	var distance = 0;
	counterLocations = 0;
	lastLocation = locationSelected[0];
	for(var key in locationSelected){
		currentLocation = locationSelected[key];
		distance += computeDistance(lastLocation,currentLocation);
		lastLocation = currentLocation;
		counterLocations++;
		console.log(distance);
	}
	
	$("#distances").html("<p>The distance between your " + counterLocations + " locations is " + distance + " km</p>");
}

function showDistancesFrom(startCoords,destCoords){
	for(var key in $polylines){
		$polylines[key].setMap(null);
	}

	$polylines=[];
	$("#distanceLocations ul li").remove();
	var arrDistances=[];
	var names=[];
	for(var key in destCoords){
		if(startCoords!==destCoords[key]){
			arrDistances[key]=computeDistance(startCoords,destCoords[key]);
			names[key]=destCoords[key].name;
			setPolyline([{lat: startCoords.lat,lng:startCoords.lng},{lat:destCoords[key].lat,lng:destCoords[key].lng}]);
		}
	}
	var li="";
	var arrPolygons=[];
	for(var key in arrDistances){
		li+="<li>The distance between "+startCoords.name+" and "+names[key]+" is : "+arrDistances[key]+"km</li>";
	}

	$("#distanceLocations ul").append(li);
}

$polylines=[];
function setPolyline(coords){
	var line = new google.maps.Polyline({
	    path: coords,
	    geodesic: true,
	    strokeColor: '#FF0000',
	    strokeOpacity: 1.0,
	    strokeWeight: 2
	});

	line.setMap(map);
	$polylines.push(line);
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

$markersSelected=[];
function setNewListener(marker){
	marker.addListener("click",function(){
		var long;
		if(marker.getAnimation()==null){
			marker.setAnimation(google.maps.Animation.BOUNCE);
			var latMarker = marker.getPosition().lat();
			var lngMarker = marker.getPosition().lng();
			locationSelected.push({lat:latMarker,lng:lngMarker, name: (marker.getTitle())});
			$markersSelected.push(marker);
			long=locationSelected.length;
			if(long>1){
				$("#alertDistance").hide();
				$("#controlsDistance").show();
			}else{
				$("#alertDistance").show();
				$("#controlsDistance").hide();
			}
		}
		else{
			marker.setAnimation(null);

			for(var key in $markersSelected){
				if($markersSelected[key]==marker){
					$markersSelected.splice(key,1);
					locationSelected.splice(key,1);
					long=locationSelected.length;
					if(long>1){
						$("#alertDistance").hide();
						$("#controlsDistance").show();
					}else{
						$("#alertDistance").show();
						$("#controlsDistance").hide();
					}			
				}
			}
		}
	});
}

$(document).ready(function(){
	database = firebase.database();
    var ref = database.ref('locations');
    ref.on('value', gotData, errorData);
    $("#backStandard").hide();

	$("#pingLocation").on("click",function(){
		$("#pingLocation").hide();
		$("#description").html("<h4>Click on Map to Create new Ping</h4>");
		$("#getDistanceLocations").hide();
		pingMapListener();
	});

	$("#saveLocation").on("click",function(){
    	var name=$("#name").val();
    	var description=$("#text").val();
    	var media=$("#mediaSelector").val();
		newLocations.push({"latitude":$latLng.lat(),"longitude":$latLng.lng(),"name":name,"description":description,"mediaURL":media});
		$("#btSend").click();
		/*var last=($aMarkers.length)-1;
		var contentString="<h4> "+name+"</h4><video width='320' height='240' autoplay><source src='"+media+"' type='video/mp4'>Your browser does not support the video tag.</video> <p>"+description+"</p>";
		$contentString.push(contentString);
		attachDescription($aMarkers[last],contentString);
		setAnimation($aMarkers[last]);
		$("#pingDescription").hide();
		$("#pingLocation").show();
		$("#getDistanceLocations").show();*/
	});

	$("#getDistanceLocations").on("click",function(){
		$("#pingLocation").hide();
		$("#getDistanceLocations").hide();
		$("#saveLocation").hide();
		$("#backStandard").show();
		$("#viewGetDistance").show();
		for(var key in $aMarkers){
			$aMarkers[key].setAnimation(null);
			google.maps.event.clearListeners($aMarkers[key], 'click');
			setNewListener($aMarkers[key]);
		}
	});

	$myLocation=null;
	$("#myLocation").on("click", function(){
		if(navigator.geolocation)
			navigator.geolocation.getCurrentPosition(function(position){
				var latitude=position.coords.latitude;
				var longitude=position.coords.longitude;
				var startCoords={lat:latitude,lng:longitude,name:"My Location"};
				if($myLocation===null){
					$myLocation = new google.maps.Marker({
	        			position: {lat: latitude,lng: longitude},
	        			icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
	        			title:"My Location",
	        			map: map
	    			});
				}
				else
					$myLocation.setMap(map);

				showDistancesFrom(startCoords,locationSelected);
			}, error);	
		$("#appendSelect").hide();
	});

	$("#location").on("click", function(){
		$("#distanceLocations ul li").remove();
		$("#appendSelect select option").remove();
		var optionsSelect="<option value='null'>Select One</option>";
		for(var key in locationSelected){
			optionsSelect+="<option value="+key+">"+locationSelected[key].name+"</option>";
		}
		$("#appendSelect select").append(optionsSelect);
		$("#appendSelect").show();
	});

	$("#all").on("click", function(){
		showDefaultLocationsDistance();
		$("#appendSelect").hide();
	});

	$("#appendSelect select").on("change",function(){
		var valueOption=$("#appendSelect select").val();
		var startCoords;
		if(valueOption!='null'){
			for(var key in locationSelected){
				if (valueOption==key){
					startCoords=locationSelected[key];
				}
			}
			showDistancesFrom(startCoords,locationSelected);
		}
	});

	$("#backStandard").on("click",function(){
		locationSelected=[];
		for(var key in $polylines){
			$polylines[key].setMap(null);
		}

		$polylines=[];
		if($myLocation!=null){
			$myLocation.setMap(null);
		}
		$("#distanceLocations ul li").remove();
		for(var key in $aMarkers){
			google.maps.event.clearListeners($aMarkers[key], 'click');
			$aMarkers[key].setAnimation(null);
			setAnimation($aMarkers[key]);
			attachDescription($aMarkers[key],$contentString[key]);
			$("#getDistanceLocations").show();
			$("#saveLocation").show();
			$("#backStandard").hide();
			$("#controlsDistance").hide();
			$("#viewGetDistance").hide();
			$("#pingLocation").show();
			$("#appendSelect").hide();
		}
	});

	$("#btCancel").on("click",function(){
		$("#pingLocation").show();
		$("#getDistanceLocations").show();
		$("#description").html("<h4>Select a Pin to View More Info</h4>");
		$("#pingDescription").hide();
		$aMarkers.pop();
		$marker.setMap(null);
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
    		location.reload();
		}
	}
});

//If we got the data correctly
function gotData(data){
	storedLocations = data.val();
	showMap(data.val());
}
//If something went wrong with the data
function errorData(error){
	console.log('Error');
	console.log(error);
}