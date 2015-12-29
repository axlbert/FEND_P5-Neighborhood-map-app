/** legacy database to be modified, for now just includes some coords and names as titles for reuse*/

var iniLocations = [{
  clickCount: 0,
  name: "Fortress",
  descr: "awesome view included",
  coords: {
    lat: 50.364409,
    lng: 7.614130
  },
  namelist: ["snoopy", "poopy", "whoopy"]
}, {
  clickCount: 0,
  name: "Genussges.",
  descr: "awesome food",
  coords: {
    lat: 50.363104,
    lng: 7.604488
  },
  namelist: ["woopy", "goopy", "sloopy"]
}, {
  clickCount: 0,
  name: "Landmark",
  descr: "awesome view",
  coords: {
    lat: 50.364555,
    lng: 7.606087
  },
  namelist: ["pappy", "poopy", "whoopy"]
}, {
  clickCount: 0,
  name: "Zenit Bar",
  descr: "awesome drinks",
  coords: {
    lat: 50.359347,
    lng: 7.600011
  },
  namelist: ["pappy", "whoopy"]
}, {
  clickCount: 0,
  name: "Parking",
  descr: "decent",
  coords: {
    lat: 50.357221,
    lng: 7.600222
  },
  namelist: ["pappy", "whoopy"]
},{
  clickCount: 0,
  name: "Absintheria",
  descr: "terrific bar",
  coords: {
    lat: 50.362228,
    lng: 7.595217
  },
  namelist: ["pappy", "whoopy"]
},{
  clickCount: 0,
  name: "Palace",
  descr: "not too bad",
  coords: {
    lat: 50.355660,
    lng:  7.601884
  },
  namelist: ["pappy", "whoopy"]
},{
  clickCount: 0,
  name: "Cable car",
  descr: "across the river",
  coords: {
    lat: 50.361831,
    lng:  7.604852
  },
  namelist: ["pappy", "whoopy"]
},{
  clickCount: 0,
  name: "Gecko Bar",
  descr: "drinks in a cellar",
  coords: {
    lat: 50.362012,
    lng: 7.595963
  },
  namelist: ["frappy"]
}];



/**supposed to empty the sidebar with the names as the function is hit and then repopulate it with items that match the keyboard input supplied by query.*/
var Constructor = function(data){
  this.name = ko.observable(data.name);
  this.coords = ko.observable(data.coords);

  //self.searchList = ko.observableArray('');
  //self.searchList = nameList.slice(0);
};


var ViewModel = function() {
  /**launching the google map*/
    var self = this;
    self.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:  50.3590365,lng: 7.6010197},
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
    })
};


 iniLocations.forEach(function(itemNo){
 self.markerArray.push(new self.constructMarkers(itemNo))
});

/**throws all newly created markes into the markerArray for further modification */
 //  self.buildMarkerArray = function(val) {
 // iniLocations.forEach(function(val){
 // self.markerArray.push(new self.constructMarkers(val));
 // });
 // };


  /**"smart" version of iniLocations where each array item has been "constructed" with observable features*/
  /** should not be manipulated for the search function, is just ready to display things*/
  /** should also not be used to display the ever changing filtermenu-list*/
  self.locList = ko.observableArray([]);

  /** smartifying all the array items and pushing them into the observable array above*/
  /** should not be manipulated for the search function either*/
  /** should also not be used to display the ever changing filtermenu-list*/
  iniLocations.forEach(function(locItem){
    self.locList.push(new Constructor(locItem));
  });

/** currently selected array, should be all locations by default*/
/** this should receive a different scope when search is hit*/
/**only contains one item right now*/
/** not suitable for use of menufilter-list, only containts one item and thus one name*/
  self.currentSearch = ko.observable(this.locList()[0]);

 /** Keep this for later when selecting an item from the list, BUT additional search function is needed */
  self.setLoc = function(filtLoc){
    self.currentSearch(filtLoc);
  };

  /**should be used to push the current search result in and then render the menu from it*/
  /** problem is to not have it empty at first */
  self.filterList = ko.observableArray([]);

  /** populating a copy of the locationlist with the dataset for better filtering*/
 self.buildFilterList = function(val) {
  iniLocations.forEach(function(val){
    self.filterList.push(val);
  });
 };

  self.buildFilterList();
//  self.buildMarkerArray();
  // self.markerArray.removeAll()

  /** stores the users input*/
  self.input = ko.observable('');

  self.hideMarkers = function(){
    var len = iniLocations.length;
    for (var i=0;i < len; i++) {
    self.markerArray()[i].marker.setVisible(false);
  }
};

  self.showMarkers = function(val){
    self.markerArray()[val].marker.setVisible(true);
  }

self.showAllMarkers = function(){
    var len = iniLocations.length;
    for (var i=0;i < len; i++) {
    self.markerArray()[i].marker.setVisible(true);
  }
};

  /** result of this should populate the filterList, according to search input*/
  self.filterFunc = function(){
    self.filterList.removeAll();
    self.hideMarkers();

    var filterInput = self.input().toLowerCase();
    if (filterInput.length > 1) {
          //console.log("filter function is hit");
    iniLocations.forEach(function(val){
      //self.markerArray.push(new self.constructMarkers(val));
    if (val.name.toLowerCase().indexOf(filterInput)>= 0) {

      self.showMarkers(iniLocations.indexOf(val));
      //console.log("if clause of filter function is hit");
      self.filterList.push(val);
            }})
     } else { this.buildFilterList();
              self.showAllMarkers(); };

   };

   self.showPos = function(val){
      self.hideMarkers();
      self.showMarkers(iniLocations.indexOf(val));
   };
};



/**knockout.js go-live*/
ko.applyBindings(new ViewModel());

var foo = ViewModel.markerArray;