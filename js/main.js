// Global variables
var map;


var ViewModel = function() {
  var self = this;

  // Passing current places location as a parameter
  self.places = ko.observableArray(favPlaces);

};

ko.applyBindings(new ViewModel());







var markers = [];
function initMap() {

  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:34.0411747, lng:-118.23804319999999},
    zoom: 15,
    styles: styles,
    mapTypeControl: false
  });

  // Style the default marker
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  // Create an array of markers on initialize
  for ( var i = 0; i < favPlaces.length; i++) {
    // Get the position from the location array
    var position = favPlaces[i].location;
    var title = favPlaces[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);

    //Event listeners - mouseover and mouseout
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }
  showPlaces();
}


function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

function showPlaces() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker.
  for ( var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}
