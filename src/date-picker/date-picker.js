/* global angular */
/* global moment */
/* global navigator */
'use strict'; // jshint ignore:line


angular.module('ngMaterial.components.datePicker', ['ngMaterial'])
.controller('mdcDatePickerController', ['$scope','$timeout','$mdDialog','$filter','$document','$locale','date','locale','mdTheme',
    function ($scope, $timeout, $mdDialog, $filter, $document, $locale, date, locale, mdTheme) {
        function checkLocale(locale) {
          if (!locale) {
            return (navigator.language !== null ? navigator.language : navigator.browserLanguage).split('_')[0].split('-')[0] || 'en';
          }
          return locale;
        }
        $scope.myLocale = $locale;

        $scope.model = date;

        $scope.mdTheme = mdTheme ? mdTheme : 'default';

        var activeLocale;

        $scope.activeDate = new Date();
        this.build = function (locale) {
          //activeLocale = locale;

          //moment.locale(activeLocale);

          if (angular.isDefined($scope.model)) {
            $scope.selected = {
              model: $scope.model,//moment($scope.model),
              date: $scope.model
            };

            $scope.activeDate = $scope.model;
          }
          else {
            $scope.selected = {
              model: undefined,
              date: new Date()
            };

            $scope.activeDate = new Date();
          }

          //$scope.moment = moment;

          $scope.days = [];
          //TODO: Use moment locale to set first day of week properly.

          $scope.daysOfWeek = [$scope.myLocale.DATETIME_FORMATS.SHORTDAY[0],
            $scope.myLocale.DATETIME_FORMATS.SHORTDAY[1],
            $scope.myLocale.DATETIME_FORMATS.SHORTDAY[2],
            $scope.myLocale.DATETIME_FORMATS.SHORTDAY[3],
            $scope.myLocale.DATETIME_FORMATS.SHORTDAY[4],
            $scope.myLocale.DATETIME_FORMATS.SHORTDAY[5],
            $scope.myLocale.DATETIME_FORMATS.SHORTDAY[6]];

          $scope.years = [];

          for (var y = $scope.activeDate.getFullYear() - 50; y <= $scope.activeDate.getFullYear() + 50; y++) {
            $scope.years.push(y);
          }

          generateCalendar();
        };
        this.build(checkLocale(locale));

        $scope.previousMonth = function () {
          $scope.activeDate = new Date($scope.activeDate.getTime());
          $scope.activeDate = new Date($scope.activeDate.setMonth($scope.activeDate.getMonth()-1));//$scope.activeDate.subtract(1, 'month');
          generateCalendar();
        };

        $scope.nextMonth = function () {
          $scope.activeDate = new Date($scope.activeDate.getTime());
          $scope.activeDate = new Date($scope.activeDate.setMonth($scope.activeDate.getMonth()+1));//$scope.activeDate.add(1, 'month');
          generateCalendar();
        };

        $scope.select = function (day) {
          $scope.selected = {
            model: day.date,
            date: day.date
          };

          $scope.model = day.date;
          $scope.activeDate = day.date;

          generateCalendar();
        };

        $scope.selectYear = function (year) {
          $scope.yearSelection = false;

          $scope.selected.model = $scope.selected.date.setFullYear(year);// moment($scope.selected.date).year(year).toDate();
          $scope.selected.date =  $scope.selected.date.setFullYear(year);//moment($scope.selected.date).year(year).toDate();
          $scope.model = $scope.model;// moment($scope.selected.date).toDate();
          $scope.activeDate.setFullYear(year);// = $scope.activeDate.add(year - $scope.activeDate.year(), 'year');

          generateCalendar();
        };
        $scope.displayYearSelection = function () {
          var calendarHeight = $document[0].getElementsByClassName('mdc-date-picker__calendar')[0].offsetHeight;
          var yearSelectorElement = $document[0].getElementsByClassName('mdc-date-picker__year-selector')[0];
          yearSelectorElement.style.height = calendarHeight + 'px';

          $scope.yearSelection = true;

          $timeout(function () {
            var activeYearElement = $document[0].getElementsByClassName('mdc-date-picker__year--is-active')[0];
            yearSelectorElement.scrollTop = yearSelectorElement.scrollTop + activeYearElement.offsetTop - yearSelectorElement.offsetHeight / 2 + activeYearElement.offsetHeight / 2;
          });
        };

        function generateCalendar() {
          var days = [],
            //previousDay = new Date($scope.activeDate.getFullYear(), $scope.activeDate.getMonth(), 0),//angular.copy($scope.activeDate).date(0),
            firstDayOfMonth = new Date($scope.activeDate.getFullYear(), $scope.activeDate.getMonth(), 1),//angular.copy($scope.activeDate).date(1),
            lastDayOfMonth =  new Date($scope.activeDate.getFullYear(), $scope.activeDate.getMonth()+1, 0), //angular.copy(firstDayOfMonth).endOf('month'),
            maxDays = lastDayOfMonth.getUTCDate();//angular.copy(lastDayOfMonth).date();

          $scope.emptyFirstDays = [];


              for (var i = firstDayOfMonth.getDay(); i > 0; i--) {
                  $scope.emptyFirstDays.push({});
              }

          var each = firstDayOfMonth;
          var today = new Date();
          today.setHours(0, 0, 0, 0);
          $scope.today = {}; $scope.today.date = today;
          for (var j = 0; j < maxDays; j++) {

            var date = {};
            date.date = each;
            //date = angular.copy(previousDay.add(1, 'days'));

            date.selected = each.getTime() === $scope.selected.date.getTime();//angular.isDefined($scope.selected.model) && date.isSame($scope.selected.date, 'day');
            date.today = each.getTime() === today.getTime();//date.isSame(moment(), 'day');

            days.push(date);
            each = new Date(each);
            each = new Date(each.setDate(each.getDate() + 1));
          }

          $scope.emptyLastDays = [];
          //if(lastDayOfMonth.getDay() < 7 ) {
              for (var k = lastDayOfMonth.getDay()+1; k < 7 ; k++) {
                  $scope.emptyLastDays.push({});
              }
          //}
          $scope.days = days;
        }

        $scope.cancel = function() {
          $mdDialog.hide();
        };

        $scope.closePicker = function () {
          $mdDialog.hide($scope.selected);
        };
    }
])
.controller('mdcDatePickerInputController', function ($scope, $attrs, $timeout, $filter, $mdDialog) {
    if (angular.isDefined($scope.model)) {
      $scope.selected = {
        model: moment($scope.model),
        date: $scope.model
      };
    }
    else {
      $scope.selected = {
        model: undefined,
        date: new Date()
      };
    }
    var dataDateFormat = 'mediumDate';
    if(angular.isDefined($attrs.dataDateFormat))
        dataDateFormat = $attrs.dataDateFormat;

    $scope.openPicker = function (ev) {
      $scope.yearSelection = false;

      $mdDialog.show({
        targetEvent: ev,
        templateUrl: 'date-picker/date-picker-dialog.html',
        controller: 'mdcDatePickerController',
        locals: {date: $scope.selected.date, locale: $attrs.locale, mdTheme: $attrs.dialogMdTheme}
      }).then(function (selected) {
        if (selected) {
          $scope.selected.model = $filter('date')(selected.date, dataDateFormat);
          $scope.selected.date = selected.date;
          $scope.model = selected.model;
        }
      });
    };
  })
.directive('mdcDatePicker', function () {
    return {
      restrict: 'AE',
      controller: 'mdcDatePickerInputController',
      scope: {
        model: '=',
        label: '@'
      },
      templateUrl: 'date-picker/date-picker-input.html'
    };
  });
