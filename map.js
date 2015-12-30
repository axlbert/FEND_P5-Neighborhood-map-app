/** database storing locations and some details */
var iniLocations = [{
  clickCount: 0,
  name: "Fortress",
  descr: "awesome view included",
  coords: {
    lat: 50.364409,
    lng: 7.614130
  }
}, {
  clickCount: 0,
  name: "Genussges.",
  descr: "awesome food",
  coords: {
    lat: 50.363104,
    lng: 7.604488
  }
}, {
  clickCount: 0,
  name: "Landmark",
  descr: "awesome view",
  coords: {
    lat: 50.364555,
    lng: 7.606087
  }
}, {
  clickCount: 0,
  name: "Zenit Bar",
  descr: "awesome drinks",
  coords: {
    lat: 50.359347,
    lng: 7.600011
  }
}, {
  clickCount: 0,
  name: "Parking",
  descr: "decent",
  coords: {
    lat: 50.357221,
    lng: 7.600222
  }
}, {
  clickCount: 0,
  name: "Absintheria",
  descr: "terrific bar",
  coords: {
    lat: 50.362228,
    lng: 7.595217
  }
}, {
  clickCount: 0,
  name: "Palace",
  descr: "not too bad",
  coords: {
    lat: 50.355660,
    lng: 7.601884
  }
}, {
  clickCount: 0,
  name: "Cable car",
  descr: "across the river",
  coords: {
    lat: 50.361831,
    lng: 7.604852
  }
}, {
  clickCount: 0,
  name: "Gecko Bar",
  descr: "drinks in a cellar",
  coords: {
    lat: 50.362012,
    lng: 7.595963
  }
}];



/**ViewModel aka Octopus*/

var ViewModel = function() {
  /**launching the google map*/
  var self = this;
  self.map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 50.3590365,
      lng: 7.6010197
    },
    scrollwheel: false,
    zoom: 15
  });

  /** create an array for all markers that will be observed for changes*/
  self.markerArray = ko.observableArray();

  /** constructor function for the markers, did not work outside the ViewModel though*/
  self.constructMarkers = function(itemNo) {
    /** confusing self and this here have been a fantastic error source*/
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(itemNo.coords.lat, itemNo.coords.lng),
      map: self.map,
      title: itemNo.descr
    });
    this.marker.addListener('click', function() {
      self.infowindow.open(self.map, self.marker);
    });
    self.infowindow = new google.maps.InfoWindow({
      content: self.buildBox(itemNo)
    });
  };

  /** some cheap textbox*/
  self.buildBox = function(itemNo) {
    var contentStr = itemNo.descr;
    return contentStr;
  };

  /**building an array of markers to be observed*/
  iniLocations.forEach(function(itemNo) {
    self.markerArray.push(new self.constructMarkers(itemNo));
  });


  /**should be used to push the current search result in and then render the menu from it*/
  /** problem is to not have it empty at first */
  self.filterList = ko.observableArray([]);

  /** populating a copy of the locationlist with the dataset for better filtering*/
  self.buildFilterList = function(val) {
    iniLocations.forEach(function(val) {
      self.filterList.push(val);
    });
  };

  /** triggering the above mentioned*/
  self.buildFilterList();

  /** stores the users input*/
  self.input = ko.observable('');

  /** hiding all markers*/
  self.hideMarkers = function() {
    var len = iniLocations.length;
    for (var i = 0; i < len; i++) {
      self.markerArray()[i].marker.setVisible(false);
    }
  };

  /** showing individual markers and adding a bounce when selected on the list*/
  self.showMarkers = function(val) {
    self.markerArray()[val].marker.setVisible(true);
    self.markerArray()[val].marker.setAnimation(google.maps.Animation.BOUNCE);
  };

  /** showing all markers and killing animations*/
  self.showAllMarkers = function() {
    var len = iniLocations.length;
    for (var i = 0; i < len; i++) {
      self.markerArray()[i].marker.setVisible(true);
      self.markerArray()[i].marker.setAnimation(false);
    }
  };

  /** result of this should populate the filterList, according to search input*/
  self.filterFunc = function() {
    self.filterList.removeAll();
    self.hideMarkers();

    var filterInput = self.input().toLowerCase();
    if (filterInput.length > 1) {
      //console.log("filter function is hit");
      iniLocations.forEach(function(val) {
        //self.markerArray.push(new self.constructMarkers(val));
        if (val.name.toLowerCase().indexOf(filterInput) >= 0) {

          self.showMarkers(iniLocations.indexOf(val));
          //console.log("if clause of filter function is hit");
          self.filterList.push(val);
        }
      });
    } else {
      this.buildFilterList();
      self.showAllMarkers();
    }

  };

  /** linked with the click function in html to only show the selected marker*/
  self.showPos = function(val) {
    self.hideMarkers();
    self.showMarkers(iniLocations.indexOf(val));
  };
};



/**knockout.js go-live*/
ko.applyBindings(new ViewModel());

/** only used for trouble shooting*/
//var foo = ViewModel.markerArray;