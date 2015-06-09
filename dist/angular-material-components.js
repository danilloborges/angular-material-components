(function(){angular.module("ngMaterial.components.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("date-picker/date-picker-dialog.html","<md-dialog class=\"mdc-date-picker\" style=\"max-width: 90%; max-height: 90%\">\r\n    <!-- Date picker -->\r\n    <div md-theme=\"{{mdTheme}}\">\r\n      <!-- Current day of week -->\r\n      <md-toolbar hide-sm class=\"md-hue-2 mdc-date-picker__current-day-of-week\">\r\n        <span>{{ selected.date | date: \'EEEE\' }}</span>\r\n      </md-toolbar>\r\n\r\n      <!-- Current date -->\r\n      <md-toolbar hide-sm class=\"mdc-date-picker__current-date\">\r\n        <span>{{ selected.date | date : \'MMMM\' }}</span>\r\n        <strong>{{ selected.date | date: \'dd\' }}</strong>\r\n        <a ng-click=\"displayYearSelection()\">{{ selected.date | date: \'yyyy\' }}</a>\r\n      </md-toolbar>\r\n      <md-toolbar hide show-sm class=\"mdc-date-picker__current-date\">\r\n            <strong>{{ selected.date | date: \'dd\' }}</strong>\r\n            <a ng-click=\"displayYearSelection()\">{{ selected.date | date: \'MMMM yyyy\' }}</a>\r\n      </md-toolbar>\r\n\r\n      <!-- Calendar -->\r\n      <div class=\"mdc-date-picker__calendar\" ng-if=\"!yearSelection\">\r\n        <div class=\"mdc-date-picker__nav\">\r\n          <md-button class=\"md-fab md-primary\" aria-label=\"Previous month\" ng-click=\"previousMonth()\">\r\n            <i class=\"mdi mdi-chevron-left\"></i>\r\n          </md-button>\r\n\r\n          <span>{{ activeDate | date: \'MMMM yyyy\' }}</span>\r\n\r\n          <md-button class=\"md-fab md-primary\" aria-label=\"Next month\" ng-click=\"nextMonth()\">\r\n            <i class=\"mdi mdi-chevron-right\"></i>\r\n          </md-button>\r\n        </div>\r\n\r\n        <div class=\"mdc-date-picker__days-of-week\">\r\n          <span ng-repeat=\"day in daysOfWeek\">{{ day }}</span>\r\n        </div>\r\n\r\n        <div class=\"mdc-date-picker__days\">\r\n                    <span class=\"mdc-date-picker__day mdc-date-picker__day--is-empty\"\r\n                          ng-repeat=\"x in emptyFirstDays\">&nbsp;</span><!--\r\n\r\n                 --><div class=\"mdc-date-picker__day\"\r\n                         ng-class=\"{ \'mdc-date-picker__day--is-selected\': day.selected,\r\n                                     \'mdc-date-picker__day--is-today\': day.today }\"\r\n                         ng-repeat=\"day in days\">\r\n                      <a ng-click=\"select(day)\">{{ day.date ? (day.date | date: \'dd\') : \'\' }}</a>\r\n                    </div><!--\r\n\r\n                 --><span class=\"mdc-date-picker__day mdc-date-picker__day--is-empty\"\r\n                          ng-repeat=\"x in emptyLastDays\">&nbsp;</span>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Year selection -->\r\n      <div class=\"mdc-date-picker__year-selector\" ng-show=\"yearSelection\">\r\n        <a class=\"mdc-date-picker__year\"\r\n           ng-class=\"{ \'mdc-date-picker__year--is-active\': year == (activeDate | date:\'yyyy\') }\"\r\n           ng-repeat=\"year in years\"\r\n           ng-click=\"selectYear(year)\"\r\n           ng-if=\"yearSelection\">\r\n          <span>{{year}}</span>\r\n        </a>\r\n      </div>\r\n\r\n      <!-- Actions -->\r\n      <div class=\"md-actions mdc-date-picker__actions\" layout=\"row\" layout-align=\"end end\">\r\n        <md-button class=\"md-primary\" ng-click=\"select(today)\">Hoje</md-button>\r\n        <md-button class=\"md-primary\" ng-click=\"cancel()\">Cancelar</md-button>\r\n        <md-button class=\"md-primary\" ng-click=\"closePicker()\">Ok</md-button>\r\n      </div>\r\n    </div>\r\n</md-dialog>\r\n");
$templateCache.put("date-picker/date-picker-input.html","<md-input-container ng-click=\"openPicker($event)\">\r\n  <label>{{label}}</label>\r\n  <input type=\"text\" ng-model=\"selected.model\" ng-disabled=\"true\" ng-click=\"openPicker($event)\">\r\n</md-input-container>\r\n");}]);})();
(function(){/* global angular */
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
        model: $scope.model,
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
        templateUrl: function (elem, attr) {
            return attr.mdTemplate ? attr.mdTemplate : 'date-picker/date-picker-input.html';
        }
    }
  });
})();
(function(){'use strict';

angular.module('ngMaterial.components', [
  'ngMaterial',
  'ngMaterial.components.templates',
  'ngMaterial.components.datePicker'
]);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi50bXAvdGVtcGxhdGVzL3RlbXBsYXRlcy5qcyIsInNyYy9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci5qcyIsInNyYy9jb21wb25lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFuZ3VsYXItbWF0ZXJpYWwtY29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKFwibmdNYXRlcmlhbC5jb21wb25lbnRzLnRlbXBsYXRlc1wiLCBbXSkucnVuKFtcIiR0ZW1wbGF0ZUNhY2hlXCIsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7JHRlbXBsYXRlQ2FjaGUucHV0KFwiZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXItZGlhbG9nLmh0bWxcIixcIjxtZC1kaWFsb2cgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlclxcXCIgc3R5bGU9XFxcIm1heC13aWR0aDogOTAlOyBtYXgtaGVpZ2h0OiA5MCVcXFwiPlxcclxcbiAgICA8IS0tIERhdGUgcGlja2VyIC0tPlxcclxcbiAgICA8ZGl2IG1kLXRoZW1lPVxcXCJ7e21kVGhlbWV9fVxcXCI+XFxyXFxuICAgICAgPCEtLSBDdXJyZW50IGRheSBvZiB3ZWVrIC0tPlxcclxcbiAgICAgIDxtZC10b29sYmFyIGhpZGUtc20gY2xhc3M9XFxcIm1kLWh1ZS0yIG1kYy1kYXRlLXBpY2tlcl9fY3VycmVudC1kYXktb2Ytd2Vla1xcXCI+XFxyXFxuICAgICAgICA8c3Bhbj57eyBzZWxlY3RlZC5kYXRlIHwgZGF0ZTogXFwnRUVFRVxcJyB9fTwvc3Bhbj5cXHJcXG4gICAgICA8L21kLXRvb2xiYXI+XFxyXFxuXFxyXFxuICAgICAgPCEtLSBDdXJyZW50IGRhdGUgLS0+XFxyXFxuICAgICAgPG1kLXRvb2xiYXIgaGlkZS1zbSBjbGFzcz1cXFwibWRjLWRhdGUtcGlja2VyX19jdXJyZW50LWRhdGVcXFwiPlxcclxcbiAgICAgICAgPHNwYW4+e3sgc2VsZWN0ZWQuZGF0ZSB8IGRhdGUgOiBcXCdNTU1NXFwnIH19PC9zcGFuPlxcclxcbiAgICAgICAgPHN0cm9uZz57eyBzZWxlY3RlZC5kYXRlIHwgZGF0ZTogXFwnZGRcXCcgfX08L3N0cm9uZz5cXHJcXG4gICAgICAgIDxhIG5nLWNsaWNrPVxcXCJkaXNwbGF5WWVhclNlbGVjdGlvbigpXFxcIj57eyBzZWxlY3RlZC5kYXRlIHwgZGF0ZTogXFwneXl5eVxcJyB9fTwvYT5cXHJcXG4gICAgICA8L21kLXRvb2xiYXI+XFxyXFxuICAgICAgPG1kLXRvb2xiYXIgaGlkZSBzaG93LXNtIGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2N1cnJlbnQtZGF0ZVxcXCI+XFxyXFxuICAgICAgICAgICAgPHN0cm9uZz57eyBzZWxlY3RlZC5kYXRlIHwgZGF0ZTogXFwnZGRcXCcgfX08L3N0cm9uZz5cXHJcXG4gICAgICAgICAgICA8YSBuZy1jbGljaz1cXFwiZGlzcGxheVllYXJTZWxlY3Rpb24oKVxcXCI+e3sgc2VsZWN0ZWQuZGF0ZSB8IGRhdGU6IFxcJ01NTU0geXl5eVxcJyB9fTwvYT5cXHJcXG4gICAgICA8L21kLXRvb2xiYXI+XFxyXFxuXFxyXFxuICAgICAgPCEtLSBDYWxlbmRhciAtLT5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2NhbGVuZGFyXFxcIiBuZy1pZj1cXFwiIXllYXJTZWxlY3Rpb25cXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWRjLWRhdGUtcGlja2VyX19uYXZcXFwiPlxcclxcbiAgICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1mYWIgbWQtcHJpbWFyeVxcXCIgYXJpYS1sYWJlbD1cXFwiUHJldmlvdXMgbW9udGhcXFwiIG5nLWNsaWNrPVxcXCJwcmV2aW91c01vbnRoKClcXFwiPlxcclxcbiAgICAgICAgICAgIDxpIGNsYXNzPVxcXCJtZGkgbWRpLWNoZXZyb24tbGVmdFxcXCI+PC9pPlxcclxcbiAgICAgICAgICA8L21kLWJ1dHRvbj5cXHJcXG5cXHJcXG4gICAgICAgICAgPHNwYW4+e3sgYWN0aXZlRGF0ZSB8IGRhdGU6IFxcJ01NTU0geXl5eVxcJyB9fTwvc3Bhbj5cXHJcXG5cXHJcXG4gICAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibWQtZmFiIG1kLXByaW1hcnlcXFwiIGFyaWEtbGFiZWw9XFxcIk5leHQgbW9udGhcXFwiIG5nLWNsaWNrPVxcXCJuZXh0TW9udGgoKVxcXCI+XFxyXFxuICAgICAgICAgICAgPGkgY2xhc3M9XFxcIm1kaSBtZGktY2hldnJvbi1yaWdodFxcXCI+PC9pPlxcclxcbiAgICAgICAgICA8L21kLWJ1dHRvbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWRjLWRhdGUtcGlja2VyX19kYXlzLW9mLXdlZWtcXFwiPlxcclxcbiAgICAgICAgICA8c3BhbiBuZy1yZXBlYXQ9XFxcImRheSBpbiBkYXlzT2ZXZWVrXFxcIj57eyBkYXkgfX08L3NwYW4+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fZGF5c1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwibWRjLWRhdGUtcGlja2VyX19kYXkgbWRjLWRhdGUtcGlja2VyX19kYXktLWlzLWVtcHR5XFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmctcmVwZWF0PVxcXCJ4IGluIGVtcHR5Rmlyc3REYXlzXFxcIj4mbmJzcDs8L3NwYW4+PCEtLVxcclxcblxcclxcbiAgICAgICAgICAgICAgICAgLS0+PGRpdiBjbGFzcz1cXFwibWRjLWRhdGUtcGlja2VyX19kYXlcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsYXNzPVxcXCJ7IFxcJ21kYy1kYXRlLXBpY2tlcl9fZGF5LS1pcy1zZWxlY3RlZFxcJzogZGF5LnNlbGVjdGVkLFxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXCdtZGMtZGF0ZS1waWNrZXJfX2RheS0taXMtdG9kYXlcXCc6IGRheS50b2RheSB9XFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XFxcImRheSBpbiBkYXlzXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgPGEgbmctY2xpY2s9XFxcInNlbGVjdChkYXkpXFxcIj57eyBkYXkuZGF0ZSA/IChkYXkuZGF0ZSB8IGRhdGU6IFxcJ2RkXFwnKSA6IFxcJ1xcJyB9fTwvYT5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PjwhLS1cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgIC0tPjxzcGFuIGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2RheSBtZGMtZGF0ZS1waWNrZXJfX2RheS0taXMtZW1wdHlcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XFxcInggaW4gZW1wdHlMYXN0RGF5c1xcXCI+Jm5ic3A7PC9zcGFuPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgPCEtLSBZZWFyIHNlbGVjdGlvbiAtLT5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX3llYXItc2VsZWN0b3JcXFwiIG5nLXNob3c9XFxcInllYXJTZWxlY3Rpb25cXFwiPlxcclxcbiAgICAgICAgPGEgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9feWVhclxcXCJcXHJcXG4gICAgICAgICAgIG5nLWNsYXNzPVxcXCJ7IFxcJ21kYy1kYXRlLXBpY2tlcl9feWVhci0taXMtYWN0aXZlXFwnOiB5ZWFyID09IChhY3RpdmVEYXRlIHwgZGF0ZTpcXCd5eXl5XFwnKSB9XFxcIlxcclxcbiAgICAgICAgICAgbmctcmVwZWF0PVxcXCJ5ZWFyIGluIHllYXJzXFxcIlxcclxcbiAgICAgICAgICAgbmctY2xpY2s9XFxcInNlbGVjdFllYXIoeWVhcilcXFwiXFxyXFxuICAgICAgICAgICBuZy1pZj1cXFwieWVhclNlbGVjdGlvblxcXCI+XFxyXFxuICAgICAgICAgIDxzcGFuPnt7eWVhcn19PC9zcGFuPlxcclxcbiAgICAgICAgPC9hPlxcclxcbiAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgIDwhLS0gQWN0aW9ucyAtLT5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJtZC1hY3Rpb25zIG1kYy1kYXRlLXBpY2tlcl9fYWN0aW9uc1xcXCIgbGF5b3V0PVxcXCJyb3dcXFwiIGxheW91dC1hbGlnbj1cXFwiZW5kIGVuZFxcXCI+XFxyXFxuICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5XFxcIiBuZy1jbGljaz1cXFwic2VsZWN0KHRvZGF5KVxcXCI+SG9qZTwvbWQtYnV0dG9uPlxcclxcbiAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibWQtcHJpbWFyeVxcXCIgbmctY2xpY2s9XFxcImNhbmNlbCgpXFxcIj5DYW5jZWxhcjwvbWQtYnV0dG9uPlxcclxcbiAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibWQtcHJpbWFyeVxcXCIgbmctY2xpY2s9XFxcImNsb3NlUGlja2VyKClcXFwiPk9rPC9tZC1idXR0b24+XFxyXFxuICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvbWQtZGlhbG9nPlxcclxcblwiKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dChcImRhdGUtcGlja2VyL2RhdGUtcGlja2VyLWlucHV0Lmh0bWxcIixcIjxtZC1pbnB1dC1jb250YWluZXIgbmctY2xpY2s9XFxcIm9wZW5QaWNrZXIoJGV2ZW50KVxcXCI+XFxyXFxuICA8bGFiZWw+e3tsYWJlbH19PC9sYWJlbD5cXHJcXG4gIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD1cXFwic2VsZWN0ZWQubW9kZWxcXFwiIG5nLWRpc2FibGVkPVxcXCJ0cnVlXFxcIiBuZy1jbGljaz1cXFwib3BlblBpY2tlcigkZXZlbnQpXFxcIj5cXHJcXG48L21kLWlucHV0LWNvbnRhaW5lcj5cXHJcXG5cIik7fV0pOyIsIi8qIGdsb2JhbCBhbmd1bGFyICovXHJcbi8qIGdsb2JhbCBtb21lbnQgKi9cclxuLyogZ2xvYmFsIG5hdmlnYXRvciAqL1xyXG4ndXNlIHN0cmljdCc7IC8vIGpzaGludCBpZ25vcmU6bGluZVxyXG5cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCduZ01hdGVyaWFsLmNvbXBvbmVudHMuZGF0ZVBpY2tlcicsIFsnbmdNYXRlcmlhbCddKVxyXG4uY29udHJvbGxlcignbWRjRGF0ZVBpY2tlckNvbnRyb2xsZXInLCBbJyRzY29wZScsJyR0aW1lb3V0JywnJG1kRGlhbG9nJywnJGZpbHRlcicsJyRkb2N1bWVudCcsJyRsb2NhbGUnLCdkYXRlJywnbG9jYWxlJywnbWRUaGVtZScsXHJcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCAkdGltZW91dCwgJG1kRGlhbG9nLCAkZmlsdGVyLCAkZG9jdW1lbnQsICRsb2NhbGUsIGRhdGUsIGxvY2FsZSwgbWRUaGVtZSkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTG9jYWxlKGxvY2FsZSkge1xyXG4gICAgICAgICAgaWYgKCFsb2NhbGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChuYXZpZ2F0b3IubGFuZ3VhZ2UgIT09IG51bGwgPyBuYXZpZ2F0b3IubGFuZ3VhZ2UgOiBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlKS5zcGxpdCgnXycpWzBdLnNwbGl0KCctJylbMF0gfHwgJ2VuJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBsb2NhbGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRzY29wZS5teUxvY2FsZSA9ICRsb2NhbGU7XHJcblxyXG4gICAgICAgICRzY29wZS5tb2RlbCA9IGRhdGU7XHJcblxyXG4gICAgICAgICRzY29wZS5tZFRoZW1lID0gbWRUaGVtZSA/IG1kVGhlbWUgOiAnZGVmYXVsdCc7XHJcblxyXG4gICAgICAgIHZhciBhY3RpdmVMb2NhbGU7XHJcblxyXG4gICAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLmJ1aWxkID0gZnVuY3Rpb24gKGxvY2FsZSkge1xyXG4gICAgICAgICAgLy9hY3RpdmVMb2NhbGUgPSBsb2NhbGU7XHJcblxyXG4gICAgICAgICAgLy9tb21lbnQubG9jYWxlKGFjdGl2ZUxvY2FsZSk7XHJcblxyXG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKCRzY29wZS5tb2RlbCkpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkID0ge1xyXG4gICAgICAgICAgICAgIG1vZGVsOiAkc2NvcGUubW9kZWwsLy9tb21lbnQoJHNjb3BlLm1vZGVsKSxcclxuICAgICAgICAgICAgICBkYXRlOiAkc2NvcGUubW9kZWxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gJHNjb3BlLm1vZGVsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZCA9IHtcclxuICAgICAgICAgICAgICBtb2RlbDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyRzY29wZS5tb21lbnQgPSBtb21lbnQ7XHJcblxyXG4gICAgICAgICAgJHNjb3BlLmRheXMgPSBbXTtcclxuICAgICAgICAgIC8vVE9ETzogVXNlIG1vbWVudCBsb2NhbGUgdG8gc2V0IGZpcnN0IGRheSBvZiB3ZWVrIHByb3Blcmx5LlxyXG5cclxuICAgICAgICAgICRzY29wZS5kYXlzT2ZXZWVrID0gWyRzY29wZS5teUxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLlNIT1JUREFZWzBdLFxyXG4gICAgICAgICAgICAkc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVsxXSxcclxuICAgICAgICAgICAgJHNjb3BlLm15TG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuU0hPUlREQVlbMl0sXHJcbiAgICAgICAgICAgICRzY29wZS5teUxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLlNIT1JUREFZWzNdLFxyXG4gICAgICAgICAgICAkc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVs0XSxcclxuICAgICAgICAgICAgJHNjb3BlLm15TG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuU0hPUlREQVlbNV0sXHJcbiAgICAgICAgICAgICRzY29wZS5teUxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLlNIT1JUREFZWzZdXTtcclxuXHJcbiAgICAgICAgICAkc2NvcGUueWVhcnMgPSBbXTtcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciB5ID0gJHNjb3BlLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSAtIDUwOyB5IDw9ICRzY29wZS5hY3RpdmVEYXRlLmdldEZ1bGxZZWFyKCkgKyA1MDsgeSsrKSB7XHJcbiAgICAgICAgICAgICRzY29wZS55ZWFycy5wdXNoKHkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGdlbmVyYXRlQ2FsZW5kYXIoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuYnVpbGQoY2hlY2tMb2NhbGUobG9jYWxlKSk7XHJcblxyXG4gICAgICAgICRzY29wZS5wcmV2aW91c01vbnRoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJHNjb3BlLmFjdGl2ZURhdGUgPSBuZXcgRGF0ZSgkc2NvcGUuYWN0aXZlRGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgJHNjb3BlLmFjdGl2ZURhdGUgPSBuZXcgRGF0ZSgkc2NvcGUuYWN0aXZlRGF0ZS5zZXRNb250aCgkc2NvcGUuYWN0aXZlRGF0ZS5nZXRNb250aCgpLTEpKTsvLyRzY29wZS5hY3RpdmVEYXRlLnN1YnRyYWN0KDEsICdtb250aCcpO1xyXG4gICAgICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5uZXh0TW9udGggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkc2NvcGUuYWN0aXZlRGF0ZSA9IG5ldyBEYXRlKCRzY29wZS5hY3RpdmVEYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgICAkc2NvcGUuYWN0aXZlRGF0ZSA9IG5ldyBEYXRlKCRzY29wZS5hY3RpdmVEYXRlLnNldE1vbnRoKCRzY29wZS5hY3RpdmVEYXRlLmdldE1vbnRoKCkrMSkpOy8vJHNjb3BlLmFjdGl2ZURhdGUuYWRkKDEsICdtb250aCcpO1xyXG4gICAgICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5zZWxlY3QgPSBmdW5jdGlvbiAoZGF5KSB7XHJcbiAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XHJcbiAgICAgICAgICAgIG1vZGVsOiBkYXkuZGF0ZSxcclxuICAgICAgICAgICAgZGF0ZTogZGF5LmRhdGVcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgJHNjb3BlLm1vZGVsID0gZGF5LmRhdGU7XHJcbiAgICAgICAgICAkc2NvcGUuYWN0aXZlRGF0ZSA9IGRheS5kYXRlO1xyXG5cclxuICAgICAgICAgIGdlbmVyYXRlQ2FsZW5kYXIoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuc2VsZWN0WWVhciA9IGZ1bmN0aW9uICh5ZWFyKSB7XHJcbiAgICAgICAgICAkc2NvcGUueWVhclNlbGVjdGlvbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICRzY29wZS5zZWxlY3RlZC5tb2RlbCA9ICRzY29wZS5zZWxlY3RlZC5kYXRlLnNldEZ1bGxZZWFyKHllYXIpOy8vIG1vbWVudCgkc2NvcGUuc2VsZWN0ZWQuZGF0ZSkueWVhcih5ZWFyKS50b0RhdGUoKTtcclxuICAgICAgICAgICRzY29wZS5zZWxlY3RlZC5kYXRlID0gICRzY29wZS5zZWxlY3RlZC5kYXRlLnNldEZ1bGxZZWFyKHllYXIpOy8vbW9tZW50KCRzY29wZS5zZWxlY3RlZC5kYXRlKS55ZWFyKHllYXIpLnRvRGF0ZSgpO1xyXG4gICAgICAgICAgJHNjb3BlLm1vZGVsID0gJHNjb3BlLm1vZGVsOy8vIG1vbWVudCgkc2NvcGUuc2VsZWN0ZWQuZGF0ZSkudG9EYXRlKCk7XHJcbiAgICAgICAgICAkc2NvcGUuYWN0aXZlRGF0ZS5zZXRGdWxsWWVhcih5ZWFyKTsvLyA9ICRzY29wZS5hY3RpdmVEYXRlLmFkZCh5ZWFyIC0gJHNjb3BlLmFjdGl2ZURhdGUueWVhcigpLCAneWVhcicpO1xyXG5cclxuICAgICAgICAgIGdlbmVyYXRlQ2FsZW5kYXIoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS5kaXNwbGF5WWVhclNlbGVjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBjYWxlbmRhckhlaWdodCA9ICRkb2N1bWVudFswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZGMtZGF0ZS1waWNrZXJfX2NhbGVuZGFyJylbMF0ub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgICAgdmFyIHllYXJTZWxlY3RvckVsZW1lbnQgPSAkZG9jdW1lbnRbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWRjLWRhdGUtcGlja2VyX195ZWFyLXNlbGVjdG9yJylbMF07XHJcbiAgICAgICAgICB5ZWFyU2VsZWN0b3JFbGVtZW50LnN0eWxlLmhlaWdodCA9IGNhbGVuZGFySGVpZ2h0ICsgJ3B4JztcclxuXHJcbiAgICAgICAgICAkc2NvcGUueWVhclNlbGVjdGlvbiA9IHRydWU7XHJcblxyXG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgYWN0aXZlWWVhckVsZW1lbnQgPSAkZG9jdW1lbnRbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWRjLWRhdGUtcGlja2VyX195ZWFyLS1pcy1hY3RpdmUnKVswXTtcclxuICAgICAgICAgICAgeWVhclNlbGVjdG9yRWxlbWVudC5zY3JvbGxUb3AgPSB5ZWFyU2VsZWN0b3JFbGVtZW50LnNjcm9sbFRvcCArIGFjdGl2ZVllYXJFbGVtZW50Lm9mZnNldFRvcCAtIHllYXJTZWxlY3RvckVsZW1lbnQub2Zmc2V0SGVpZ2h0IC8gMiArIGFjdGl2ZVllYXJFbGVtZW50Lm9mZnNldEhlaWdodCAvIDI7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZUNhbGVuZGFyKCkge1xyXG4gICAgICAgICAgdmFyIGRheXMgPSBbXSxcclxuICAgICAgICAgICAgLy9wcmV2aW91c0RheSA9IG5ldyBEYXRlKCRzY29wZS5hY3RpdmVEYXRlLmdldEZ1bGxZZWFyKCksICRzY29wZS5hY3RpdmVEYXRlLmdldE1vbnRoKCksIDApLC8vYW5ndWxhci5jb3B5KCRzY29wZS5hY3RpdmVEYXRlKS5kYXRlKDApLFxyXG4gICAgICAgICAgICBmaXJzdERheU9mTW9udGggPSBuZXcgRGF0ZSgkc2NvcGUuYWN0aXZlRGF0ZS5nZXRGdWxsWWVhcigpLCAkc2NvcGUuYWN0aXZlRGF0ZS5nZXRNb250aCgpLCAxKSwvL2FuZ3VsYXIuY29weSgkc2NvcGUuYWN0aXZlRGF0ZSkuZGF0ZSgxKSxcclxuICAgICAgICAgICAgbGFzdERheU9mTW9udGggPSAgbmV3IERhdGUoJHNjb3BlLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSwgJHNjb3BlLmFjdGl2ZURhdGUuZ2V0TW9udGgoKSsxLCAwKSwgLy9hbmd1bGFyLmNvcHkoZmlyc3REYXlPZk1vbnRoKS5lbmRPZignbW9udGgnKSxcclxuICAgICAgICAgICAgbWF4RGF5cyA9IGxhc3REYXlPZk1vbnRoLmdldFVUQ0RhdGUoKTsvL2FuZ3VsYXIuY29weShsYXN0RGF5T2ZNb250aCkuZGF0ZSgpO1xyXG5cclxuICAgICAgICAgICRzY29wZS5lbXB0eUZpcnN0RGF5cyA9IFtdO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IGZpcnN0RGF5T2ZNb250aC5nZXREYXkoKTsgaSA+IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgICAkc2NvcGUuZW1wdHlGaXJzdERheXMucHVzaCh7fSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHZhciBlYWNoID0gZmlyc3REYXlPZk1vbnRoO1xyXG4gICAgICAgICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgIHRvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgICAgJHNjb3BlLnRvZGF5ID0ge307ICRzY29wZS50b2RheS5kYXRlID0gdG9kYXk7XHJcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG1heERheXM7IGorKykge1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGUgPSB7fTtcclxuICAgICAgICAgICAgZGF0ZS5kYXRlID0gZWFjaDtcclxuICAgICAgICAgICAgLy9kYXRlID0gYW5ndWxhci5jb3B5KHByZXZpb3VzRGF5LmFkZCgxLCAnZGF5cycpKTtcclxuXHJcbiAgICAgICAgICAgIGRhdGUuc2VsZWN0ZWQgPSBlYWNoLmdldFRpbWUoKSA9PT0gJHNjb3BlLnNlbGVjdGVkLmRhdGUuZ2V0VGltZSgpOy8vYW5ndWxhci5pc0RlZmluZWQoJHNjb3BlLnNlbGVjdGVkLm1vZGVsKSAmJiBkYXRlLmlzU2FtZSgkc2NvcGUuc2VsZWN0ZWQuZGF0ZSwgJ2RheScpO1xyXG4gICAgICAgICAgICBkYXRlLnRvZGF5ID0gZWFjaC5nZXRUaW1lKCkgPT09IHRvZGF5LmdldFRpbWUoKTsvL2RhdGUuaXNTYW1lKG1vbWVudCgpLCAnZGF5Jyk7XHJcblxyXG4gICAgICAgICAgICBkYXlzLnB1c2goZGF0ZSk7XHJcbiAgICAgICAgICAgIGVhY2ggPSBuZXcgRGF0ZShlYWNoKTtcclxuICAgICAgICAgICAgZWFjaCA9IG5ldyBEYXRlKGVhY2guc2V0RGF0ZShlYWNoLmdldERhdGUoKSArIDEpKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkc2NvcGUuZW1wdHlMYXN0RGF5cyA9IFtdO1xyXG4gICAgICAgICAgLy9pZihsYXN0RGF5T2ZNb250aC5nZXREYXkoKSA8IDcgKSB7XHJcbiAgICAgICAgICAgICAgZm9yICh2YXIgayA9IGxhc3REYXlPZk1vbnRoLmdldERheSgpKzE7IGsgPCA3IDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICRzY29wZS5lbXB0eUxhc3REYXlzLnB1c2goe30pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgJHNjb3BlLmRheXMgPSBkYXlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuY2xvc2VQaWNrZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkbWREaWFsb2cuaGlkZSgkc2NvcGUuc2VsZWN0ZWQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbl0pXHJcbi5jb250cm9sbGVyKCdtZGNEYXRlUGlja2VySW5wdXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGF0dHJzLCAkdGltZW91dCwgJGZpbHRlciwgJG1kRGlhbG9nKSB7XHJcbiAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoJHNjb3BlLm1vZGVsKSkge1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XHJcbiAgICAgICAgbW9kZWw6ICRzY29wZS5tb2RlbCxcclxuICAgICAgICBkYXRlOiAkc2NvcGUubW9kZWxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XHJcbiAgICAgICAgbW9kZWw6IHVuZGVmaW5lZCxcclxuICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICB2YXIgZGF0YURhdGVGb3JtYXQgPSAnbWVkaXVtRGF0ZSc7XHJcbiAgICBpZihhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuZGF0YURhdGVGb3JtYXQpKVxyXG4gICAgICAgIGRhdGFEYXRlRm9ybWF0ID0gJGF0dHJzLmRhdGFEYXRlRm9ybWF0O1xyXG5cclxuICAgICRzY29wZS5vcGVuUGlja2VyID0gZnVuY3Rpb24gKGV2KSB7XHJcbiAgICAgICRzY29wZS55ZWFyU2VsZWN0aW9uID0gZmFsc2U7XHJcblxyXG4gICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2LFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXItZGlhbG9nLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdtZGNEYXRlUGlja2VyQ29udHJvbGxlcicsXHJcbiAgICAgICAgbG9jYWxzOiB7ZGF0ZTogJHNjb3BlLnNlbGVjdGVkLmRhdGUsIGxvY2FsZTogJGF0dHJzLmxvY2FsZSwgbWRUaGVtZTogJGF0dHJzLmRpYWxvZ01kVGhlbWV9XHJcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWQubW9kZWwgPSAkZmlsdGVyKCdkYXRlJykoc2VsZWN0ZWQuZGF0ZSwgZGF0YURhdGVGb3JtYXQpO1xyXG4gICAgICAgICAgJHNjb3BlLnNlbGVjdGVkLmRhdGUgPSBzZWxlY3RlZC5kYXRlO1xyXG4gICAgICAgICAgJHNjb3BlLm1vZGVsID0gc2VsZWN0ZWQubW9kZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfSlcclxuLmRpcmVjdGl2ZSgnbWRjRGF0ZVBpY2tlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdBRScsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ21kY0RhdGVQaWNrZXJJbnB1dENvbnRyb2xsZXInLFxyXG4gICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgIG1vZGVsOiAnPScsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnQCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbiAoZWxlbSwgYXR0cikge1xyXG4gICAgICAgICAgICByZXR1cm4gYXR0ci5tZFRlbXBsYXRlID8gYXR0ci5tZFRlbXBsYXRlIDogJ2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLWlucHV0Lmh0bWwnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ25nTWF0ZXJpYWwuY29tcG9uZW50cycsIFtcclxuICAnbmdNYXRlcmlhbCcsXHJcbiAgJ25nTWF0ZXJpYWwuY29tcG9uZW50cy50ZW1wbGF0ZXMnLFxyXG4gICduZ01hdGVyaWFsLmNvbXBvbmVudHMuZGF0ZVBpY2tlcidcclxuXSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==