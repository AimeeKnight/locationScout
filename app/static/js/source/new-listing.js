/* global google:true */
/* jshint camelcase:false */

(function(){

  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $('#create').click(clickCreate);
  }

  function clickCreate(e){
    var address = $('input[name="address"]').val();

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address:address}, function(results, status){
      var name = results[0].formatted_address;
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();

      $('input[name="address"]').val(name);
      $('input[name="lat"]').val(lat);
      $('input[name="lng"]').val(lng);

      $('form').submit();
    });

    e.preventDefault();
  }

})();

