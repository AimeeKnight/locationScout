/* global google:true, places:true */
/* jshint camelcase:false */

(function(){

  'use strict';

  $(document).ready(initialize);

  var map, lat, lng;
  var markers = [];

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
    window.location.href = ('/listings/paging?lat='+lat+'&lng='+lng+'&limit='+limitVal+'&move=next');
  }

  function prevPage(){
    var limitVal = $('#limit').val();
    window.location.href = ('/listings/paging?lat='+lat+'&lng='+lng+'&limit='+limitVal+'&move=prev');
  }

  function limitItems(){
    var limitVal = $('#limit').val();
    window.location.href = ('/listings/paging?lat='+lat+'&lng='+lng+'&limit='+limitVal);
  }

  function clickSearch(){
    var limitVal = $('#limit').val();
    window.location.href = ('/listings/paging?lat='+lat+'&lng='+lng+'&limit='+limitVal);
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
    var mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP};
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

