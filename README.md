# Neighborhood Map
>Single-page application featuring a map with my favorite food spots in Los Angeles, CA. Using google API to load markers with latitude and longitude, animated with BOUNCE and DROP for better user experience. Markers display basic information of each spot using Google's infowindow functionality and populated with data from the locations.js file and Foursquare API.

*This single-page application is ready to be use out-of-the-box. If you wish to use it all it needs to be modified is the `locations.js` file where name, location (latitude and longitude), and a fallback image for each of the locations is needed.*

#### Clone-it -> Modify-it -> Publish-it

---
### Google API Implementation
Using `initMap` to load the map providing latitude, longitude, zoom, and custom styles for the map.

Other features from google API used are:

- InfoWindow
- MarkerImage

##### Animation for Markers

- BOUNCE
- DROP

### Knockoutjs Implementation
Using Knockoutjs to load an array of locations to the DOM in a list as computed observables using `foreach` control flow. Computed observables make it easy to provide filter option using an input field to filter both the list view and the map markers updating in real time. Also, click and event bindings were used for the list view.

Features used:
- Observables
- Computed Observables
- foreach
- click and event binding

---
### Bootstrap Implementation
Bootstrap is responsible for the modal pop window and the carousel used to display pictures from Foursquare API for each location. The amount of pictures for each location was set to 10.

---
### The basic information for each location is:

- Spot's Name (local:locations.js)
- Pictures (Foursquare API)
- Type of Food (Foursquare API)
- Physical Address (Foursquare API)
- Icons (Fontawesome)

---
### Fontawesome
Icons used:

- `fa-utensils` representing food category.
- `fa-location` representing address.
- `fa-images` respresenting pictures.

---
### ICONFINDER
Two markers were used from [Iconfinder](https://www.iconfinder.com/search/?q=marker); one as the default and the other as a highlight.

---
### Documents
> DIRECTORIES

**`js` directory.**

1. `locations.js`

  - This file stores each locations latitude, longitude, name, and a fall back image.

- `styles.js`

  - This file stores an array of styles for the Google Map that could be found in [here](https://developers.google.com/maps/documentation/javascript/styling).

- `app.js`

  - This is the main app file where the google map is initialize inside a ViewModel function. Simple Javascript functions implemented outside the ViewModel to make the app mobile responsive and to open/close the sidenav. A final function runs the app `runApp` which is trigger by the google script callback at the bottom of the `index.hmtl`.

- `lib` directory
  - Inside this directory lives knockout-3.4.2.js file.

**`css` directory.**
- `master.css`
  - CSS grid Implementation
  - Basic styling for InfoWindow, fonts and sidenav.
  - One media screen breakpoin.

**`img` directory.**
- Markers png icons (default and highlight) and fallback pictures for each of the locations.

**Main HMTL file.**
- `index.html`
   - Using CSS grid the one page is divided into 3 sections. The top section is for the menu icon which extends horizontally across the top of the page. The center section is for the Google Map and hidden to the left is the `sidenav`, which is displayed when the menu icon is triggered expanding to  full screen for mobile with a screen width of 500px or less and a width of 350px for screens above 500px width.
