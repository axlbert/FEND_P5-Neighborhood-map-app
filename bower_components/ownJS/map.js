$(document).ready(function () {
   ko.applyBindings(new ViewModel);
});

 var iniLocations = [
  {
      clickCount : 0,
      name: "Kitty",
      imgSrc: "img/catpick.jpg",
      imgAttribution: "0",
      namelist : ["snoopy","poopy", "whoopy"]
    }, {
      clickCount : 0,
      name: "Patty",
      imgSrc: "img/catpick2.jpg",
      imgAttribution: "0",
      namelist : ["woopy","goopy", "sloopy"]
    }, {
      clickCount : 0,
      name: "Polly",
      imgSrc: "img/catpick3.jpg",
      imgAttribution: "0",
      namelist : ["pappy","poopy", "whoopy"]
    }, {
      clickCount : 0,
      name: "Molly",
      imgSrc: "img/catpick4.jpg",
      imgAttribution: "0",
      namelist : ["pappy", "whoopy"]
    }, {
      clickCount : 0,
      name: "Mappy",
      imgSrc: "img/catpick5.jpg",
      imgAttribution: "0",
      namelist : ["frappy"]
  }];



var Loc = function(data) {
  this.clickCount = ko.observable(data.clickCount);
  this.name = ko.observable(data.name);
  this.imgSrc = ko.observable(data.imgSrc);
  this.imgAttribution = ko.observable(data.imgAttribution);
  this.namelist = ko.observableArray(data.namelist);

};


var ViewModel = function() {
    var self = this;
    self.myMap = ko.observable({
        lat: ko.observable(50),
        lng: ko.observable(5)});

    this.locationList = ko.observableArray([]);  // storing the cats, but before

    iniLocations.forEach(function(locItem){  //create a "new Cat" out of each item
      self.locationList.push( new Loc(locItem) );
    });

    this.currentLoc = ko.observable(this.locationList()[0] );

    this.setLoc = function(clickedLoc) { //setcat has been paired with each text item in the list
      self.currentLoc(clickedLoc);  //we dont click on the name, we actually click on the object
  };
};


ko.bindingHandlers.map = {

    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var mapObj = ko.utils.unwrapObservable(valueAccessor());
        var latLng = new google.maps.LatLng(
            ko.utils.unwrapObservable(mapObj.lat),
            ko.utils.unwrapObservable(mapObj.lng));
        var mapOptions = { center: latLng,
                          zoom: 5,
                          mapTypeId: google.maps.MapTypeId.ROADMAP};

        mapObj.googleMap = new google.maps.Map(element, mapOptions);
    }
};
