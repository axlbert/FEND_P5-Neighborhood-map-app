/** legacy database to be modified, for now just includes some coords and names as titles for reuse*/

var iniLocations = [{
  clickCount: 0,
  name: "Best Restaurant",
  imgSrc: "img/catpick.jpg",
  coords: {
    lat: -20.100,
    lng: 131.044
  },
  namelist: ["snoopy", "poopy", "whoopy"]
}, {
  clickCount: 0,
  name: "Best Pub",
  imgSrc: "img/catpick2.jpg",
  coords: {
    lat: 5.210,
    lng: 131.044
  },
  namelist: ["woopy", "goopy", "sloopy"]
}, {
  clickCount: 0,
  name: "Landmark",
  imgSrc: "img/catpick3.jpg",
  coords: {
    lat: -17.164,
    lng: 101.044
  },
  namelist: ["pappy", "poopy", "whoopy"]
}, {
  clickCount: 0,
  name: "Viewpoint",
  imgSrc: "img/catpick4.jpg",
  coords: {
    lat: -8.640,
    lng: 131.044
  },
  namelist: ["pappy", "whoopy"]
}, {
  clickCount: 0,
  name: "Furniture Store",
  imgSrc: "img/catpick5.jpg",
  coords: {
    lat: 12.930,
    lng: 131.044
  },
  namelist: ["frappy"]
}];

/**creating the initial list of names to be displayed in the sidebar*/
var filterNames = function() {
  var NameList = [];
  var len = iniLocations.length;
  for (var i = 0; i < len; i++) {
    NameList.push(iniLocations[i].name);
  }
  return NameList;
};

var nameList = filterNames();


var ViewModel = function() {
  initMap();
  var self = this;
  /**duplicating the list of names to use one for rebuilding as we use the search function and one as a full cross-reference*/
  self.searchList = ko.observableArray('');
  self.searchList = nameList.slice(0);
  self.query = ko.observable('');


/**supposed to empty the sidebar with the names as the function is hit and then repopulate it with items that match the keyboard input supplied by query.*/
/**Uncaught TypeError: query.toLowerCase is not a function*/
  self.filterSearch = ko.computed(function(value) {
    if (self.query().length > 0) {
     self.searchList = [];
     console.log("if statement has been triggered");
    var len = nameList.length;
    for (var i = 0; i < len; i++) {
      if (nameList[i].toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
        self.searchList.push(nameList[i].name);
        console.log("step 2 is working");
      }
    }}

  }, self);


/**launching the google map*/

};




var initMap = function() {
  var myLat2 = {
    lat: -23.363,
    lng: 130.044
  };

  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLat2,
    scrollwheel: false,
    zoom: 4
  });

  initMarkers(map);
};


/** building an initial array of markers from the model on the top*/
var initMarkers = function(map) {
  for (var i = 0; i < iniLocations.length; i++) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(iniLocations[i].coords.lat, iniLocations[i].coords.lng),
      map: map,
      title: "test"
    });
  }
};

/**knockout.js go-live*/
ko.applyBindings(new ViewModel());