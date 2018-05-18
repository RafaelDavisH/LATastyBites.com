// Global variable
var map;


var ViewModel = function() {
  var self = this;

  // Passing current place as a parameter
  self.places = ko.observableArray(favPlaces);

  this.searchInput = ko.observable("");

  // Google map initialize
  this.markers = [];

  this.initMap = function() {
    // Constructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat:34.0411747, lng:-118.23804319999999},
      zoom: 12,
      styles: styles,
      mapTypeControl: false
    });

    // Replace the default marker with a png marker.
    var defaultIcon = 'img/blue-marker.png';

    // Replace with a png marker as "highlighted location" for when the user
    // mouseover the marker.
    var highlightedIcon = 'img/green-marker.png';

    var largeInfowindow = new google.maps.InfoWindow({});

    // Create an array of makers on initialize.
    for (var i = 0;i < favPlaces.length; i++) {
      // Get the position from the location array
      this.lat = favPlaces[i].location.lat;
      this.lng = favPlaces[i].location.lng;
      this.title = favPlaces[i].title;
      this.imgSrc = favPlaces[i].imgSrc;
      // Create a marker per location, and put into markers array.
      this.marker = new google.maps.Marker({
        map: map,
        position: {lat: this.lat, lng: this.lng},
        lat: this.lat,
        lng: this.lng,
        title: this.title,
        imgSrc: this.imgSrc,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i
      });
      this.markers.push(this.marker);

      // Event listeners = mouseover and mouseout
      // to change the colors back and forth of markers.
      this.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
          this.setAnimation(null);
        }).bind(this), 700);
      });
      this.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });

      // Create an onClick event to open the large infowindow and bounce the marker.
      this.marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
          this.setAnimation(null);
        }).bind(this), 1400);
      });

      //Mouseover: highlightes the listed place and marker.
      self.logMouseOver = function() {
        var place = document.getElementsByClassName('place');
        this.setIcon(highlightedIcon);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
          this.setAnimation(null);
        }).bind(this), 700);
      }

      self.selectedPlace = function() {
        populateInfoWindow(this, largeInfowindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
          this.setAnimation(null);
        }).bind(this), 1400);
      }

      self.offMouseOver = function(){
        place = document.getElementsByClassName('place');
        this.setIcon(defaultIcon);
      }

    }
    showPlaces();
  };
  this.initMap();


  // This function takes in a COLOR, and then creates a new markers
  // icon of that color.
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' +
      markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(25, 44),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(25, 44));
    return markerImage;
  }

  // This function will loop through the markers array and display them all.
  function showPlaces() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each makers and display the marker.
    for (var i = 0;i < self.markers.length; i++) {
      self.markers[i].setMap(map);
      bounds.extend(self.markers[i].position);
    }
    map.fitBounds(bounds);
  }

  // Input filter to display live only the place listed and marker that its
  // searched.
  this.favPlacesFilter = ko.computed(function() {
    var list = [];
    for (var i = 0; i < self.markers.length; i++) {
      var markerPlace = self.markers[i];
      if (markerPlace.title.toLowerCase().includes(this.searchInput()
            .toLowerCase())) {
        list.push(markerPlace);
        self.markers[i].setVisible(true);
      } else {
        self.markers[i].setVisible(false);
      }
    }
    return list;
  }, this);


  // Markers InfoWindow Content
  function populateInfoWindow(marker, infowindow) {

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {

        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;

        // foursquare API client
        foursquare_client_id = "4HQ3Q5SF4YWOP4WB5RJF4DDLFBOJXMGZPIFRLZQTYGPEL4YJ"
        foursquare_client_secret = "0W3BR531UNN3A5U4GO4IEAY1BO2TXUS1MX3N3KTMPIRKH5XY"


        // Foursquare API url
        var fqUrl = 'https://api.foursquare.com/v2/venues/search?client_id='+ foursquare_client_id +'&client_secret=' + foursquare_client_secret + '&v=20180512&ll=' + marker.lat + ',' + marker.lng + '&query=' + marker.title;

        // Foursquare API - Pull the needed info from reponse
        $.getJSON(fqUrl).done(function(marker) {
          var response = marker.response.venues[0];
          self.street = response.location.formattedAddress[0];
          self.cityZip = response.location.formattedAddress[1]
          self.category = response.categories[0].shortName;
          self.venueId = response.id;

          self.fqHtmlContent =
            '<i class="fas fa-utensils fa-2x"></i><p class="place-category">' + self.category + '</p>' +
            '<i class="fas fa-location-arrow fa-2x"></i><p class="place-info">' + self.street + " " + self.cityZip +
            '</p><a class="img-link" href="#">' +
            '<i class="fas fa-2x fa-images" ' +
            'data-toggle="modal" data-target="#images"></i></a>' +
            '<p class="pgImg">Pictures</p>';

          infowindow.setContent(self.setWindowContent + self.fqHtmlContent);


          // Request for images for the selected Place using venue id.
          var imgUrl = 'https://api.foursquare.com/v2/venues/' + self.venueId + '/photos?client_id=' + foursquare_client_id + '&client_secret=' + foursquare_client_secret + '&v=20180514';


          $.getJSON(imgUrl, function(result) {
            var imgSrc = [];
            var imgResult = result.response.photos.count;
            if (imgResult == 0){
              document.getElementById('carousel').innerHTML =
              '<div class="carousel-item active">' +
              '<img class="d-block w-100" src="'+ self.marker.imgSrc +'"'+ 'alt="First slide">' + '</div>';
            } else {
              for (var i = 0;i < 10; i++){
                var preSu = result.response.photos.items;

                document.getElementById('carousel').innerHTML =
                '<div class="carousel-item active" >' +
                '<img class="d-block w-100" src="'+
                preSu[i].prefix + "300x300" + preSu[i].suffix +'"'+
                'alt="First slide">' + '</div>' +
                '<div class="carousel-item">' +
                '<img class="d-block w-100" src="'+
                preSu[i + 1].prefix + "300x300" + preSu[i + 1].suffix +'"'+
                'alt="Second slide">' + '</div>' +
                '<div class="carousel-item">' +
                '<img class="d-block w-100" src="'+
                preSu[i + 2].prefix + "300x300" + preSu[i + 2].suffix +'"'+
                'alt="Third slide">' + '</div>' +
                '<div class="carousel-item">' +
                '<img class="d-block w-100" src="'+
                preSu[i + 3].prefix + "300x300" + preSu[i + 3].suffix +'"'+
                'alt="Fourth slide">' + '</div>' +
                '<div class="carousel-item">' +
                '<img class="d-block w-100" src="'+
                preSu[i + 4].prefix + "300x300" + preSu[i + 4].suffix +'"'+
                'alt="Fifth slide">' + '</div>' +
                '<div class="carousel-item">' +
                '<img class="d-block w-100" src="'+
                preSu[i + 5].prefix + "300x300" + preSu[i + 5].suffix +'"'+
                'alt="Sixth slide">' + '</div>' +
                '<div class="carousel-item">' +
                '<img class="d-block w-100" src="'+
                preSu[i + 6].prefix + "300x300" + preSu[i + 6].suffix +'"'+
                'alt="Seventh slide">' + '</div>' +
                '<div class="carousel-item">' +
                '<img class="d-block w-100" src="'+
                preSu[i + 7].prefix + "300x300" + preSu[i + 7].suffix +'"'+
                'alt="Eighth slide">' + '</div>' +
                '<div class="carousel-item">' +
                '<img class="d-block w-100" src="'+
                preSu[i + 8].prefix + "300x300" + preSu[i + 8].suffix +'"'+
                'alt="Nineth slide">' + '</div>' +
                '<div class="carousel-item">' +
                '<img class="d-block w-100" src="'+
                preSu[i + 9].prefix + "300x300" + preSu[i + 9].suffix +'"'+
                'alt="Tenth slide">' + '</div>';
              }

            }
          });

        }).fail(function() {
            alert("Please reload the page, there seems to be a problem when loading the content.");
        });

        // set the content to display in the infowindow
        self.setWindowContent =
          '<div class="place-info-box"><p class="marker-title">' + marker.title + '</p>';

        infowindow.open(map, marker);

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
    }
  };

}

// Google Error function
googleErrorHandler = function googleError() {
  alert('There seeem to be a issue with Google Map loading. Sorry for the inconvenience.');
};

// function for sidenav open and close animation with screen matching
var screen = window.matchMedia("(max-width: 500px)");
function openNav() {
  if (screen.matches ) {
    document.getElementById('favPlaces').style.width = "100%";
  } else {
    document.getElementById('favPlaces').style.width = "350px";
  }
}

function closeNav() {
  document.getElementById('favPlaces').style.width = "0";
}

// Run app
function runApp() {
  ko.applyBindings(new ViewModel());
}
