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

/**creating the initial list of names for the filter, not completetly necessary will be refactored and removed later*/
/** new copy function declared in the ViewModel, should be deleted*/
var filterNames = function() {
  var NameList = [];
  var len = iniLocations.length;
  for (var i = 0; i < len; i++) {
    NameList.push(iniLocations[i].name);
  }
  return NameList;
};
/** same as above*/
var nameList = filterNames();



/**supposed to empty the sidebar with the names as the function is hit and then repopulate it with items that match the keyboard input supplied by query.*/
var Constructor = function(data){
  this.name = ko.observable(data.name);

  //self.searchList = ko.observableArray('');
  //self.searchList = nameList.slice(0);

};


var ViewModel = function() {
  /**launching the google map*/
  initMap();
  var self = this;

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
  self.filterList = ko.observableArray();

  /** populating a copy  of the locationlist with the dataset for better filtering*/
  iniLocations.forEach(function(val){
    self.filterList.push(val);
  });


  /** stores the users input*/
  self.input = ko.observable('');

  /** result of this should populate the filterList, according to search input*/
  self.filterFunc = function(){
    var filterInput = self.input();
    self.filterList.removeAll();
    console.log("filter function is hit");
    if (self.locList.name.toLowerCase().indexOf(filterInput)>= 0) {
      console.log("if clause of filter function is hit");
      self.filterList.push(self.locList);
    }
  };

    //if (this.input.length > 0) {
     // self.searchList = []; eventually reuse for filterList ?
     //console.log("if statement has been triggered");
    /** for comparing against possible entries, */
    //var len = nameList.length;
   // for (var i = 0; i < len; i++) {
    //  if (nameList[i].toLowerCase().indexOf(this.input.toLowerCase()) >= 0) {
      //  this.filterList.push(nameList[i].name);
        //console.log("step 2 is working");
     // }
   // }}

 // }, self);

//};

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