
var mymap = L.map('mapid').setView([50.79834, -3.821375], 8);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: '[MAXBOX ACCESS TOKEN GOES HERE]'
}).addTo(mymap);


var new_polyline = [];
// var popup = L.popup();
var polyline;


function process_output(){

	var output = JSON.stringify(new_polyline);

	$("#coordinates").html( output );

	if (new_polyline.length > 2){
		$(".button-finish").addClass( "active" );
	} else {
		$(".button-finish").removeClass( "active" );
	}

}

var circleMarker = "";

function spot(location){

	if (circleMarker != ""){
		mymap.removeLayer(circleMarker);
	}

	circleMarker = L.circle(location, {
		color: '#d9534f',
		fillColor: '#f03',
		fillOpacity: 0.5,
		radius: 0,
		weight: 5
	}).addTo(mymap);

}

function onMapClick(e) {

	spot(e.latlng)

	$("#spot_coordinates").html(e.latlng.toString());

	new_polyline.push(e.latlng);
	process_output();
	polyline = L.polyline(new_polyline, {color: '#d9534f'}).addTo(mymap);


	if (new_polyline.length == 0){
		$(".control-panel").removeClass("active");
	} else {
		$(".control-panel").addClass("active");
	}

}

mymap.on('click', onMapClick);



function clearMap() {
	$("#coordinates").removeClass("active");
	// mymap.removeLayer(popup)
	for(i in mymap._layers) {
		if(mymap._layers[i]._path != undefined) {
			try {
				mymap.removeLayer(mymap._layers[i]);
			}
			catch(e) {
				console.log("problem with " + e + mymap._layers[i]);
			}
		}
	}
}


function reset(){
	new_polyline = [];
	clearMap();
	// console.log ("Reset");
	$(".button-finish").removeClass( "active" );
	$(".control-panel").removeClass("active");
	$("#spot_coordinates").html( "Please click on the map to begin" );
}

$(".button-reset").click(function(){
	reset();
});


function undo() {
	clearMap();
	new_polyline.splice(-1,1);
	polyline = L.polyline(new_polyline, {color: '#d9534f'}).addTo(mymap);

	var spot_location = new_polyline[new_polyline.length - 1];

	if (new_polyline.length == 0){
		reset();
	} else {
		$("#spot_coordinates").html(spot_location.toString());
		spot(spot_location);
	}
}

$(".button-undo").click(function(){
	undo();
	// console.log ("Undo");
});





function finish() {
	var end_point = new_polyline[0];
	new_polyline.push(end_point);
	clearMap();
	var polygon = L.polygon(new_polyline).addTo(mymap);
	process_output();
	// alert(new_polyline);

	$("#coordinates").addClass("active");
}

$(".button-finish").click(function(){
	finish();
	// console.log ("Finish");
});





$( document ).ready(function() {

	$(function(){
		$('.draggable').draggable({ scroll: true, cursor: "move"});
	});


});