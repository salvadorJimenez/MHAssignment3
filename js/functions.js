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


var defaultCoordsColima={lat:19.363624,lng:-103.686562};

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
	//Iterare the object and display the markers//
	for (var key in data) {
		    var name=data[key].name;
		    var description=data[key].description;
		    var lati=data[key].lat;
		    var long=data[key].lng;

		    var contentString="<h4> "+name+"</h4><p>"+description+"</p>";

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