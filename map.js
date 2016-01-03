/** global variables*/
var infowindow;
var map;


/** database storing locations and some details */
var iniLocations = [{
  clickCount: 0,
  name: "Ehrenbreitstein",
  descr: "a great view",
  coords: {
    lat: 50.364409,
    lng: 7.614130
  }
}, {
  clickCount: 0,
  name: "Palace Square",
  descr: "an awesome green",
  coords: {
    lat: 50.355523,
    lng: 7.602743
  }
}, {
  clickCount: 0,
  name: "Deutsches-Eck",
  descr: "two rivers at once",
  coords: {
    lat: 50.364555,
    lng: 7.606087
  }
}, {
  clickCount: 0,
  name: "Schängelbrunnen",
  descr: "a Fountain!",
  coords: {
    lat: 50.360200,
    lng: 7.598058
  }
}, {
  clickCount: 0,
  name: "Train_Station",
  descr: "trains",
  coords: {
    lat: 50.358886,
    lng: 7.590677
  }
}, {
  clickCount: 0,
  name: "Liebfrauenkirche",
  descr: "a nice building",
  coords: {
    lat: 50.360793,
    lng: 7.595737
  }
}, {
  clickCount: 0,
  name: "Electoral-Palace",
  descr: "neat architecture",
  coords: {
    lat: 50.355461,
    lng: 7.603140
  }
}, {
  clickCount: 0,
  name: "Church",
  descr: "an old building",
  coords: {
    lat: 50.362062,
    lng: 7.603766
  }
}, {
  clickCount: 0,
  name: "Kapuzinerplatz",
  descr: "an old square",
  coords: {
    lat: 50.358631,
    lng: 7.610564
  }
}];

/**apparently this and a callback in the google url is enough to make google maps get called asynchronously */
function init() {
/**knockout.js go-live*/
  ko.applyBindings(new ViewModel());
};

/**ViewModel aka Octopus*/

var ViewModel = function() {
  /**launching the google map*/
  var self = this;
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 50.3590365,
      lng: 7.6010197
    },
    scrollwheel: false,
    zoom: 15
  });

  /** create an array for all markers that will be observed for changes*/
  self.markerArray = ko.observableArray();

  /** necessary since always the last item in the list was pooulating all windows */
  self.infoWindowArray = ko.observableArray();
  /** constructor function for the markers*/
  self.constructMarkers = function(itemNo) {
    /** confusing self and this here have been a fantastic error source*/
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(itemNo.coords.lat, itemNo.coords.lng),
      map: map,
      animation: null,
      title: itemNo.descr
    });
    /** making the markers clickable*/
    this.marker.addListener('click', function() {
      //console.log("works");
      /**closing all old infowindows*/
      self.closeAllWindows();
      //** calling the info window*/
      self.closeAllWindows();
      self.infoWindowArray()[iniLocations.indexOf(itemNo)].infowindow.open(map, this.marker);
      //** starting the marker bounce */
      self.markerArray()[iniLocations.indexOf(itemNo)].marker.setAnimation(google.maps.Animation.BOUNCE);
      //** calling the bouncing off after 2,85 seconds (last animation cycle is roughly finished then) */
      setTimeout(function() {
        self.markerArray()[iniLocations.indexOf(itemNo)].marker.setAnimation(false);
      }, 2850);
    });
  };

/**this function iterates through all infowindows in order to close them */
  self.closeAllWindows = function() {
    var len = iniLocations.length;
    for (var i = 0; i < len; i++) {
      self.infoWindowArray()[i].infowindow.close();
    }
  };

  /**for storing the api-retrieved wikipedia articles */
  self.ArticleArray = ko.observableArray();

  /** building array of infowindows, works nicely: vm.infoWindowArray()[0].infowindow.content*/
  self.constructInfoWindow = function(itemNo) {
      this.infowindow = new google.maps.InfoWindow({
      content: self.buildBox(itemNo),
      position: itemNo.coords,
      //** this is supposed to move the infobox just on top of the marker ###but it doesnt### */
      pixelOffset: (0,0)
    });
  };

  /** creating a textbox with the links requested from the wiki api*/
  self.buildBox = function(itemNo) {
    self.wikiArticles(itemNo);
    var samplepic = ('<img class="streetpic" src="http://maps.googleapis.com/maps/api/streetview?size=240x120&location=' + itemNo.coords.lat + ',' + itemNo.coords.lng + '"">');
    var contentStr = '<h3 class="headline3">Discover ' + itemNo.descr + '</h3><br>' + '<p>Read more:<a href="' + self.ArticleArray()[iniLocations.indexOf(itemNo)] + '">Wikipedia</a><br>' + samplepic;
    return contentStr;
    //console.log(contentStr);
  };


/**wikipedia api request */
  self.wikiArticles = function(itemNo) {
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + itemNo.name + '&format=json&callback=wikiCallback';
    //console.log(wikiUrl);
    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      jsonp: "callback",
      success: function(response) {
        var articleList = response[1];
        /**limiting returned articles to 1 for now */
        for (var i = 0; i < 1; i++) {
          articleStr = articleList[i];
          var url = 'http://en.wikipedia.org/wiki/' + articleStr;
          /** further usage of the url string in the observablearray*/
          self.ArticleArray.push(url);
          return url;
        }
      }
    });
  };


  /**building an array of markers to be observed*/
  iniLocations.forEach(function(itemNo) {
    self.markerArray.push(new self.constructMarkers(itemNo));
    self.infoWindowArray.push(new self.constructInfoWindow(itemNo));
  });


  // self.addmarkerListeners();
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



/** only used for trouble shooting*/
//var foo = ViewModel.markerArray;
//var vm = ko.dataFor(document.body);
//vm.infoWindowArray()[0].infowindow.content