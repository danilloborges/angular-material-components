'use strict';

angular.module('demoApp', ['ngMaterial','ngMaterial.components'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('datePickerTheme').primaryPalette('teal');
})
.controller('datePickerCtrl', function() {

  });
