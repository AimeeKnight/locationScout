/* global google:true, places:true */
/* jshint camelcase:false */

(function(){

  'use strict';

  $(document).ready(initialize);

  var map, lat, lng;
  var markers = [];

  var styleArray = [
    {'featureType': 'water',
     'elementType': 'geometry',
     'stylers': [{'hue': '#165c64'}, {'saturation': 34}, {'lightness': -69}, {'visibility': 'on'}]},
    {'featureType': 'landscape',
     'elementType': 'geometry',
     'stylers': [{'hue': '#b7caaa'}, {'saturation': -14}, {'lightness': -18},{'visibility': 'on'}]},
    {'featureType': 'landscape.man_made',
     'elementType': 'all',
     'stylers': [{'hue': '#cbdac1'}, {'saturation': -6}, {'lightness': -9}, {'visibility': 'on'}]},
    {'featureType': 'road',
     'elementType': 'geometry',
     'stylers': [{'hue': '#8d9b83'}, {'saturation': -89}, {'lightness': -12}, {'visibility': 'on'}]},
    {'featureType': 'road.highway',
     'elementType': 'geometry',
     'stylers': [{'hue': '#d4dad0'}, {'saturation': -88}, {'lightness': 54}, {'visibility': 'simplified'}]},
    {'featureType': 'road.arterial',
     'elementType': 'geometry',
     'stylers': [{'hue': '#bdc5b6'}, {'saturation': -89}, {'lightness': -3}, {'visibility': 'simplified'}]},
    {'featureType': 'road.local',
     'elementType': 'geometry',
     'stylers': [{'hue': '#bdc5b6'}, {'saturation': -89}, {'lightness': -26}, {'visibility': 'on'}]},
    {'featureType': 'poi',
     'elementType': 'geometry',
     'stylers': [{'hue': '#c17118'}, {'saturation': 61}, {'lightness': -45}, {'visibility': 'on'}]},
    {'featureType': 'poi.park',
     'elementType': 'all',
     'stylers': [{'hue': '#8ba975'}, {'saturation': -46}, {'lightness': -28}, {'visibility': 'on'}]},
    {'featureType': 'transit',
     'elementType': 'geometry',
     'stylers': [{'hue': '#a43218'}, {'saturation': 74}, {'lightness': -51}, {'visibility': 'simplified'}]},
    {'featureType': 'administrative.province',
     'elementType': 'all',
     'stylers': [{'hue': '#ffffff'}, {'saturation': 0}, {'lightness': 100}, {'visibility': 'simplified'}]},
    {'featureType': 'administrative.neighborhood',
     'elementType': 'all',
     'stylers': [{'hue': '#ffffff'}, {'saturation': 0}, {'lightness': 100}, {'visibility': 'off'}]},
    {'featureType': 'administrative.locality',
     'elementType': 'labels',
     'stylers': [{'hue': '#ffffff'},{'saturation': 0}, {'lightness': 100}, {'visibility': 'off'}]},
    {'featureType': 'administrative.land_parcel',
     'elementType': 'all',
     'stylers': [{'hue': '#ffffff'}, {'saturation': 0}, {'lightness': 100}, {'visibility': 'off'}]},
    {'featureType': 'administrative',
     'elementType': 'all',
     'stylers': [{'hue': '#3a3935'}, {'saturation': 5}, {'lightness': -57}, {'visibility': 'off'}]},
    {'featureType': 'poi.medical',
     'elementType': 'geometry',
     'stylers': [{'hue': '#cba923'}, {'saturation': 50}, {'lightness': -46}, {'visibility': 'on'}]}
  ];

  function initialize(){
    initMap(0, 0, 2);
    for(var i = 0; i < places.length; i++){
      addMarker(places[i]);
    }
    findMyLocation();
    $('#search').click(clickSearch);
    $('#limitButton').click(limitItems);
    $('#prev').click(prevPage);
    $('#next').click(nextPage);
  }

    //--------PAGING--------------//
  function nextPage(){
    var limitVal = $('#limit').val();
    window.location.href = ('/listings/?lat='+lat+'&lng='+lng+'&limit='+limitVal+'&move=next');
  }

  function prevPage(){
    var limitVal = $('#limit').val();
    window.location.href = ('/listings/?lat='+lat+'&lng='+lng+'&limit='+limitVal+'&move=prev');
  }

  function limitItems(){
    var limitVal = $('#limit').val();
    window.location.href = ('/listings/?lat='+lat+'&lng='+lng+'&limit='+limitVal);
  }

  function clickSearch(){
    var limitVal = $('#limit').val();
    window.location.href = ('/listings/?lat='+lat+'&lng='+lng+'&limit='+limitVal);
  }

    //------------GOOGLE--------------//

  function findMyLocation(){
    getLocation();
  }

  function getLocation(){
    var geoOptions = {enableHighAccuracy: true, maximumAge: 1000, timeout: 60000};
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
  }

  function geoSuccess(location) {
    console.log('lat', lat);
    console.log('lng', lng);
    lat = location.coords.latitude;
    lng = location.coords.longitude;
    $('#search').show();
  }

  function geoError() {
    console.log('Sorry, no position available.');
  }

  function initMap(lat, lng, zoom){
    var mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles:styleArray};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function addMarker(location){
    var currentClick;
    var position = new google.maps.LatLng(location.lat, location.lng);
    var marker = new google.maps.Marker({map:map, position:position, title:location.address});
    marker.set('id', location._id);
    markers.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
      if(currentClick === marker){
        window.location.href = '/listings/' + marker.id;
      }
    });
    google.maps.event.addListener(marker, 'click', function() {
      map.setZoom(15);
      map.setCenter(marker.getPosition());
      currentClick = marker;
    });
  }
  google.maps.event.addDomListener(window, 'load', initialize);
})();
