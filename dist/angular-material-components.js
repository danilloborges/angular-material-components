(function(){angular.module("ngMaterial.components.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("date-picker/date-picker-dialog.html","<md-dialog class=\"mdc-date-picker\" style=\"max-width: 90%; max-height: 90%\">\r\n    <!-- Date picker -->\r\n    <div md-theme=\"{{mdTheme}}\">\r\n      <!-- Current day of week -->\r\n      <md-toolbar hide-sm class=\"md-hue-2 mdc-date-picker__current-day-of-week\">\r\n        <span>{{ selected.date | date: \'EEEE\' }}</span>\r\n      </md-toolbar>\r\n\r\n      <!-- Current date -->\r\n      <md-toolbar hide-sm class=\"mdc-date-picker__current-date\">\r\n        <span>{{ selected.date | date : \'MMMM\' }}</span>\r\n        <strong>{{ selected.date | date: \'dd\' }}</strong>\r\n        <a ng-click=\"displayYearSelection()\">{{ selected.date | date: \'yyyy\' }}</a>\r\n      </md-toolbar>\r\n      <md-toolbar hide show-sm class=\"mdc-date-picker__current-date\">\r\n            <strong>{{ selected.date | date: \'dd\' }}</strong>\r\n            <a ng-click=\"displayYearSelection()\">{{ selected.date | date: \'MMMM yyyy\' }}</a>\r\n      </md-toolbar>\r\n\r\n      <!-- Calendar -->\r\n      <div class=\"mdc-date-picker__calendar\" ng-if=\"!yearSelection\">\r\n        <div class=\"mdc-date-picker__nav\">\r\n          <md-button class=\"md-fab md-primary\" aria-label=\"Previous month\" ng-click=\"previousMonth()\">\r\n            <i class=\"mdi mdi-chevron-left\"></i>\r\n          </md-button>\r\n\r\n          <span>{{ activeDate | date: \'MMMM yyyy\' }}</span>\r\n\r\n          <md-button class=\"md-fab md-primary\" aria-label=\"Next month\" ng-click=\"nextMonth()\">\r\n            <i class=\"mdi mdi-chevron-right\"></i>\r\n          </md-button>\r\n        </div>\r\n\r\n        <div class=\"mdc-date-picker__days-of-week\">\r\n          <span ng-repeat=\"day in daysOfWeek\">{{ day }}</span>\r\n        </div>\r\n\r\n        <div class=\"mdc-date-picker__days\">\r\n                    <span class=\"mdc-date-picker__day mdc-date-picker__day--is-empty\"\r\n                          ng-repeat=\"x in emptyFirstDays\">&nbsp;</span><!--\r\n\r\n                 --><div class=\"mdc-date-picker__day\"\r\n                         ng-class=\"{ \'mdc-date-picker__day--is-selected\': day.selected,\r\n                                     \'mdc-date-picker__day--is-today\': day.today }\"\r\n                         ng-repeat=\"day in days\">\r\n          <a ng-click=\"select(day)\">{{ day.date ? (day.date | date: \'dd\') : \'\' }}</a>\r\n        </div><!--\r\n\r\n                 --><span class=\"mdc-date-picker__day mdc-date-picker__day--is-empty\"\r\n                          ng-repeat=\"x in emptyLastDays\">&nbsp;</span>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Year selection -->\r\n      <div class=\"mdc-date-picker__year-selector\" ng-show=\"yearSelection\">\r\n        <a class=\"mdc-date-picker__year\"\r\n           ng-class=\"{ \'mdc-date-picker__year--is-active\': year == (activeDate | date:\'yyyy\') }\"\r\n           ng-repeat=\"year in years\"\r\n           ng-click=\"selectYear(year)\"\r\n           ng-if=\"yearSelection\">\r\n          <span>{{year}}</span>\r\n        </a>\r\n      </div>\r\n\r\n      <!-- Actions -->\r\n      <div class=\"md-actions mdc-date-picker__actions\" layout=\"row\" layout-align=\"end end\">\r\n        <md-button class=\"md-primary\" ng-click=\"select(today)\">Hoje</md-button>\r\n        <md-button class=\"md-primary\" ng-click=\"cancel()\">Cancelar</md-button>\r\n        <md-button class=\"md-primary\" ng-click=\"closePicker()\">Ok</md-button>\r\n      </div>\r\n    </div>\r\n</md-dialog>\r\n");
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
      templateUrl: 'date-picker/date-picker-input.html'
    };
  });
})();
(function(){'use strict';

angular.module('ngMaterial.components', [
  'ngMaterial',
  'ngMaterial.components.templates',
  'ngMaterial.components.datePicker'
]);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi50bXAvdGVtcGxhdGVzL3RlbXBsYXRlcy5qcyIsInNyYy9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci5qcyIsInNyYy9jb21wb25lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYW5ndWxhci1tYXRlcmlhbC1jb21wb25lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoXCJuZ01hdGVyaWFsLmNvbXBvbmVudHMudGVtcGxhdGVzXCIsIFtdKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHskdGVtcGxhdGVDYWNoZS5wdXQoXCJkYXRlLXBpY2tlci9kYXRlLXBpY2tlci1kaWFsb2cuaHRtbFwiLFwiPG1kLWRpYWxvZyBjbGFzcz1cXFwibWRjLWRhdGUtcGlja2VyXFxcIiBzdHlsZT1cXFwibWF4LXdpZHRoOiA5MCU7IG1heC1oZWlnaHQ6IDkwJVxcXCI+XFxyXFxuICAgIDwhLS0gRGF0ZSBwaWNrZXIgLS0+XFxyXFxuICAgIDxkaXYgbWQtdGhlbWU9XFxcInt7bWRUaGVtZX19XFxcIj5cXHJcXG4gICAgICA8IS0tIEN1cnJlbnQgZGF5IG9mIHdlZWsgLS0+XFxyXFxuICAgICAgPG1kLXRvb2xiYXIgaGlkZS1zbSBjbGFzcz1cXFwibWQtaHVlLTIgbWRjLWRhdGUtcGlja2VyX19jdXJyZW50LWRheS1vZi13ZWVrXFxcIj5cXHJcXG4gICAgICAgIDxzcGFuPnt7IHNlbGVjdGVkLmRhdGUgfCBkYXRlOiBcXCdFRUVFXFwnIH19PC9zcGFuPlxcclxcbiAgICAgIDwvbWQtdG9vbGJhcj5cXHJcXG5cXHJcXG4gICAgICA8IS0tIEN1cnJlbnQgZGF0ZSAtLT5cXHJcXG4gICAgICA8bWQtdG9vbGJhciBoaWRlLXNtIGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2N1cnJlbnQtZGF0ZVxcXCI+XFxyXFxuICAgICAgICA8c3Bhbj57eyBzZWxlY3RlZC5kYXRlIHwgZGF0ZSA6IFxcJ01NTU1cXCcgfX08L3NwYW4+XFxyXFxuICAgICAgICA8c3Ryb25nPnt7IHNlbGVjdGVkLmRhdGUgfCBkYXRlOiBcXCdkZFxcJyB9fTwvc3Ryb25nPlxcclxcbiAgICAgICAgPGEgbmctY2xpY2s9XFxcImRpc3BsYXlZZWFyU2VsZWN0aW9uKClcXFwiPnt7IHNlbGVjdGVkLmRhdGUgfCBkYXRlOiBcXCd5eXl5XFwnIH19PC9hPlxcclxcbiAgICAgIDwvbWQtdG9vbGJhcj5cXHJcXG4gICAgICA8bWQtdG9vbGJhciBoaWRlIHNob3ctc20gY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fY3VycmVudC1kYXRlXFxcIj5cXHJcXG4gICAgICAgICAgICA8c3Ryb25nPnt7IHNlbGVjdGVkLmRhdGUgfCBkYXRlOiBcXCdkZFxcJyB9fTwvc3Ryb25nPlxcclxcbiAgICAgICAgICAgIDxhIG5nLWNsaWNrPVxcXCJkaXNwbGF5WWVhclNlbGVjdGlvbigpXFxcIj57eyBzZWxlY3RlZC5kYXRlIHwgZGF0ZTogXFwnTU1NTSB5eXl5XFwnIH19PC9hPlxcclxcbiAgICAgIDwvbWQtdG9vbGJhcj5cXHJcXG5cXHJcXG4gICAgICA8IS0tIENhbGVuZGFyIC0tPlxcclxcbiAgICAgIDxkaXYgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fY2FsZW5kYXJcXFwiIG5nLWlmPVxcXCIheWVhclNlbGVjdGlvblxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX25hdlxcXCI+XFxyXFxuICAgICAgICAgIDxtZC1idXR0b24gY2xhc3M9XFxcIm1kLWZhYiBtZC1wcmltYXJ5XFxcIiBhcmlhLWxhYmVsPVxcXCJQcmV2aW91cyBtb250aFxcXCIgbmctY2xpY2s9XFxcInByZXZpb3VzTW9udGgoKVxcXCI+XFxyXFxuICAgICAgICAgICAgPGkgY2xhc3M9XFxcIm1kaSBtZGktY2hldnJvbi1sZWZ0XFxcIj48L2k+XFxyXFxuICAgICAgICAgIDwvbWQtYnV0dG9uPlxcclxcblxcclxcbiAgICAgICAgICA8c3Bhbj57eyBhY3RpdmVEYXRlIHwgZGF0ZTogXFwnTU1NTSB5eXl5XFwnIH19PC9zcGFuPlxcclxcblxcclxcbiAgICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1mYWIgbWQtcHJpbWFyeVxcXCIgYXJpYS1sYWJlbD1cXFwiTmV4dCBtb250aFxcXCIgbmctY2xpY2s9XFxcIm5leHRNb250aCgpXFxcIj5cXHJcXG4gICAgICAgICAgICA8aSBjbGFzcz1cXFwibWRpIG1kaS1jaGV2cm9uLXJpZ2h0XFxcIj48L2k+XFxyXFxuICAgICAgICAgIDwvbWQtYnV0dG9uPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2RheXMtb2Ytd2Vla1xcXCI+XFxyXFxuICAgICAgICAgIDxzcGFuIG5nLXJlcGVhdD1cXFwiZGF5IGluIGRheXNPZldlZWtcXFwiPnt7IGRheSB9fTwvc3Bhbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWRjLWRhdGUtcGlja2VyX19kYXlzXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2RheSBtZGMtZGF0ZS1waWNrZXJfX2RheS0taXMtZW1wdHlcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XFxcInggaW4gZW1wdHlGaXJzdERheXNcXFwiPiZuYnNwOzwvc3Bhbj48IS0tXFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgICAtLT48ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2RheVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xhc3M9XFxcInsgXFwnbWRjLWRhdGUtcGlja2VyX19kYXktLWlzLXNlbGVjdGVkXFwnOiBkYXkuc2VsZWN0ZWQsXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcJ21kYy1kYXRlLXBpY2tlcl9fZGF5LS1pcy10b2RheVxcJzogZGF5LnRvZGF5IH1cXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgIG5nLXJlcGVhdD1cXFwiZGF5IGluIGRheXNcXFwiPlxcclxcbiAgICAgICAgICA8YSBuZy1jbGljaz1cXFwic2VsZWN0KGRheSlcXFwiPnt7IGRheS5kYXRlID8gKGRheS5kYXRlIHwgZGF0ZTogXFwnZGRcXCcpIDogXFwnXFwnIH19PC9hPlxcclxcbiAgICAgICAgPC9kaXY+PCEtLVxcclxcblxcclxcbiAgICAgICAgICAgICAgICAgLS0+PHNwYW4gY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fZGF5IG1kYy1kYXRlLXBpY2tlcl9fZGF5LS1pcy1lbXB0eVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5nLXJlcGVhdD1cXFwieCBpbiBlbXB0eUxhc3REYXlzXFxcIj4mbmJzcDs8L3NwYW4+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICA8IS0tIFllYXIgc2VsZWN0aW9uIC0tPlxcclxcbiAgICAgIDxkaXYgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9feWVhci1zZWxlY3RvclxcXCIgbmctc2hvdz1cXFwieWVhclNlbGVjdGlvblxcXCI+XFxyXFxuICAgICAgICA8YSBjbGFzcz1cXFwibWRjLWRhdGUtcGlja2VyX195ZWFyXFxcIlxcclxcbiAgICAgICAgICAgbmctY2xhc3M9XFxcInsgXFwnbWRjLWRhdGUtcGlja2VyX195ZWFyLS1pcy1hY3RpdmVcXCc6IHllYXIgPT0gKGFjdGl2ZURhdGUgfCBkYXRlOlxcJ3l5eXlcXCcpIH1cXFwiXFxyXFxuICAgICAgICAgICBuZy1yZXBlYXQ9XFxcInllYXIgaW4geWVhcnNcXFwiXFxyXFxuICAgICAgICAgICBuZy1jbGljaz1cXFwic2VsZWN0WWVhcih5ZWFyKVxcXCJcXHJcXG4gICAgICAgICAgIG5nLWlmPVxcXCJ5ZWFyU2VsZWN0aW9uXFxcIj5cXHJcXG4gICAgICAgICAgPHNwYW4+e3t5ZWFyfX08L3NwYW4+XFxyXFxuICAgICAgICA8L2E+XFxyXFxuICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgPCEtLSBBY3Rpb25zIC0tPlxcclxcbiAgICAgIDxkaXYgY2xhc3M9XFxcIm1kLWFjdGlvbnMgbWRjLWRhdGUtcGlja2VyX19hY3Rpb25zXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJlbmQgZW5kXFxcIj5cXHJcXG4gICAgICAgIDxtZC1idXR0b24gY2xhc3M9XFxcIm1kLXByaW1hcnlcXFwiIG5nLWNsaWNrPVxcXCJzZWxlY3QodG9kYXkpXFxcIj5Ib2plPC9tZC1idXR0b24+XFxyXFxuICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5XFxcIiBuZy1jbGljaz1cXFwiY2FuY2VsKClcXFwiPkNhbmNlbGFyPC9tZC1idXR0b24+XFxyXFxuICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5XFxcIiBuZy1jbGljaz1cXFwiY2xvc2VQaWNrZXIoKVxcXCI+T2s8L21kLWJ1dHRvbj5cXHJcXG4gICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9tZC1kaWFsb2c+XFxyXFxuXCIpO1xuJHRlbXBsYXRlQ2FjaGUucHV0KFwiZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXItaW5wdXQuaHRtbFwiLFwiPG1kLWlucHV0LWNvbnRhaW5lciBuZy1jbGljaz1cXFwib3BlblBpY2tlcigkZXZlbnQpXFxcIj5cXHJcXG4gIDxsYWJlbD57e2xhYmVsfX08L2xhYmVsPlxcclxcbiAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPVxcXCJzZWxlY3RlZC5tb2RlbFxcXCIgbmctZGlzYWJsZWQ9XFxcInRydWVcXFwiIG5nLWNsaWNrPVxcXCJvcGVuUGlja2VyKCRldmVudClcXFwiPlxcclxcbjwvbWQtaW5wdXQtY29udGFpbmVyPlxcclxcblwiKTt9XSk7IiwiLyogZ2xvYmFsIGFuZ3VsYXIgKi9cclxuLyogZ2xvYmFsIG1vbWVudCAqL1xyXG4vKiBnbG9iYWwgbmF2aWdhdG9yICovXHJcbid1c2Ugc3RyaWN0JzsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcblxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ25nTWF0ZXJpYWwuY29tcG9uZW50cy5kYXRlUGlja2VyJywgWyduZ01hdGVyaWFsJ10pXHJcbi5jb250cm9sbGVyKCdtZGNEYXRlUGlja2VyQ29udHJvbGxlcicsIFsnJHNjb3BlJywnJHRpbWVvdXQnLCckbWREaWFsb2cnLCckZmlsdGVyJywnJGRvY3VtZW50JywnJGxvY2FsZScsJ2RhdGUnLCdsb2NhbGUnLCdtZFRoZW1lJyxcclxuICAgIGZ1bmN0aW9uICgkc2NvcGUsICR0aW1lb3V0LCAkbWREaWFsb2csICRmaWx0ZXIsICRkb2N1bWVudCwgJGxvY2FsZSwgZGF0ZSwgbG9jYWxlLCBtZFRoZW1lKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tMb2NhbGUobG9jYWxlKSB7XHJcbiAgICAgICAgICBpZiAoIWxvY2FsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKG5hdmlnYXRvci5sYW5ndWFnZSAhPT0gbnVsbCA/IG5hdmlnYXRvci5sYW5ndWFnZSA6IG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2UpLnNwbGl0KCdfJylbMF0uc3BsaXQoJy0nKVswXSB8fCAnZW4nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGxvY2FsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHNjb3BlLm15TG9jYWxlID0gJGxvY2FsZTtcclxuXHJcbiAgICAgICAgJHNjb3BlLm1vZGVsID0gZGF0ZTtcclxuXHJcbiAgICAgICAgJHNjb3BlLm1kVGhlbWUgPSBtZFRoZW1lID8gbWRUaGVtZSA6ICdkZWZhdWx0JztcclxuXHJcbiAgICAgICAgdmFyIGFjdGl2ZUxvY2FsZTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmFjdGl2ZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuYnVpbGQgPSBmdW5jdGlvbiAobG9jYWxlKSB7XHJcbiAgICAgICAgICAvL2FjdGl2ZUxvY2FsZSA9IGxvY2FsZTtcclxuXHJcbiAgICAgICAgICAvL21vbWVudC5sb2NhbGUoYWN0aXZlTG9jYWxlKTtcclxuXHJcbiAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoJHNjb3BlLm1vZGVsKSkge1xyXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XHJcbiAgICAgICAgICAgICAgbW9kZWw6ICRzY29wZS5tb2RlbCwvL21vbWVudCgkc2NvcGUubW9kZWwpLFxyXG4gICAgICAgICAgICAgIGRhdGU6ICRzY29wZS5tb2RlbFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFjdGl2ZURhdGUgPSAkc2NvcGUubW9kZWw7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkID0ge1xyXG4gICAgICAgICAgICAgIG1vZGVsOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFjdGl2ZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vJHNjb3BlLm1vbWVudCA9IG1vbWVudDtcclxuXHJcbiAgICAgICAgICAkc2NvcGUuZGF5cyA9IFtdO1xyXG4gICAgICAgICAgLy9UT0RPOiBVc2UgbW9tZW50IGxvY2FsZSB0byBzZXQgZmlyc3QgZGF5IG9mIHdlZWsgcHJvcGVybHkuXHJcblxyXG4gICAgICAgICAgJHNjb3BlLmRheXNPZldlZWsgPSBbJHNjb3BlLm15TG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuU0hPUlREQVlbMF0sXHJcbiAgICAgICAgICAgICRzY29wZS5teUxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLlNIT1JUREFZWzFdLFxyXG4gICAgICAgICAgICAkc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVsyXSxcclxuICAgICAgICAgICAgJHNjb3BlLm15TG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuU0hPUlREQVlbM10sXHJcbiAgICAgICAgICAgICRzY29wZS5teUxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLlNIT1JUREFZWzRdLFxyXG4gICAgICAgICAgICAkc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVs1XSxcclxuICAgICAgICAgICAgJHNjb3BlLm15TG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuU0hPUlREQVlbNl1dO1xyXG5cclxuICAgICAgICAgICRzY29wZS55ZWFycyA9IFtdO1xyXG5cclxuICAgICAgICAgIGZvciAodmFyIHkgPSAkc2NvcGUuYWN0aXZlRGF0ZS5nZXRGdWxsWWVhcigpIC0gNTA7IHkgPD0gJHNjb3BlLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSArIDUwOyB5KyspIHtcclxuICAgICAgICAgICAgJHNjb3BlLnllYXJzLnB1c2goeSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5idWlsZChjaGVja0xvY2FsZShsb2NhbGUpKTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnByZXZpb3VzTW9udGggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkc2NvcGUuYWN0aXZlRGF0ZSA9IG5ldyBEYXRlKCRzY29wZS5hY3RpdmVEYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgICAkc2NvcGUuYWN0aXZlRGF0ZSA9IG5ldyBEYXRlKCRzY29wZS5hY3RpdmVEYXRlLnNldE1vbnRoKCRzY29wZS5hY3RpdmVEYXRlLmdldE1vbnRoKCktMSkpOy8vJHNjb3BlLmFjdGl2ZURhdGUuc3VidHJhY3QoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICBnZW5lcmF0ZUNhbGVuZGFyKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLm5leHRNb250aCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gbmV3IERhdGUoJHNjb3BlLmFjdGl2ZURhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gbmV3IERhdGUoJHNjb3BlLmFjdGl2ZURhdGUuc2V0TW9udGgoJHNjb3BlLmFjdGl2ZURhdGUuZ2V0TW9udGgoKSsxKSk7Ly8kc2NvcGUuYWN0aXZlRGF0ZS5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgICAgICBnZW5lcmF0ZUNhbGVuZGFyKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uIChkYXkpIHtcclxuICAgICAgICAgICRzY29wZS5zZWxlY3RlZCA9IHtcclxuICAgICAgICAgICAgbW9kZWw6IGRheS5kYXRlLFxyXG4gICAgICAgICAgICBkYXRlOiBkYXkuZGF0ZVxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAkc2NvcGUubW9kZWwgPSBkYXkuZGF0ZTtcclxuICAgICAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gZGF5LmRhdGU7XHJcblxyXG4gICAgICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5zZWxlY3RZZWFyID0gZnVuY3Rpb24gKHllYXIpIHtcclxuICAgICAgICAgICRzY29wZS55ZWFyU2VsZWN0aW9uID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgJHNjb3BlLnNlbGVjdGVkLm1vZGVsID0gJHNjb3BlLnNlbGVjdGVkLmRhdGUuc2V0RnVsbFllYXIoeWVhcik7Ly8gbW9tZW50KCRzY29wZS5zZWxlY3RlZC5kYXRlKS55ZWFyKHllYXIpLnRvRGF0ZSgpO1xyXG4gICAgICAgICAgJHNjb3BlLnNlbGVjdGVkLmRhdGUgPSAgJHNjb3BlLnNlbGVjdGVkLmRhdGUuc2V0RnVsbFllYXIoeWVhcik7Ly9tb21lbnQoJHNjb3BlLnNlbGVjdGVkLmRhdGUpLnllYXIoeWVhcikudG9EYXRlKCk7XHJcbiAgICAgICAgICAkc2NvcGUubW9kZWwgPSAkc2NvcGUubW9kZWw7Ly8gbW9tZW50KCRzY29wZS5zZWxlY3RlZC5kYXRlKS50b0RhdGUoKTtcclxuICAgICAgICAgICRzY29wZS5hY3RpdmVEYXRlLnNldEZ1bGxZZWFyKHllYXIpOy8vID0gJHNjb3BlLmFjdGl2ZURhdGUuYWRkKHllYXIgLSAkc2NvcGUuYWN0aXZlRGF0ZS55ZWFyKCksICd5ZWFyJyk7XHJcblxyXG4gICAgICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLmRpc3BsYXlZZWFyU2VsZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGNhbGVuZGFySGVpZ2h0ID0gJGRvY3VtZW50WzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21kYy1kYXRlLXBpY2tlcl9fY2FsZW5kYXInKVswXS5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgICB2YXIgeWVhclNlbGVjdG9yRWxlbWVudCA9ICRkb2N1bWVudFswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZGMtZGF0ZS1waWNrZXJfX3llYXItc2VsZWN0b3InKVswXTtcclxuICAgICAgICAgIHllYXJTZWxlY3RvckVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gY2FsZW5kYXJIZWlnaHQgKyAncHgnO1xyXG5cclxuICAgICAgICAgICRzY29wZS55ZWFyU2VsZWN0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBhY3RpdmVZZWFyRWxlbWVudCA9ICRkb2N1bWVudFswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZGMtZGF0ZS1waWNrZXJfX3llYXItLWlzLWFjdGl2ZScpWzBdO1xyXG4gICAgICAgICAgICB5ZWFyU2VsZWN0b3JFbGVtZW50LnNjcm9sbFRvcCA9IHllYXJTZWxlY3RvckVsZW1lbnQuc2Nyb2xsVG9wICsgYWN0aXZlWWVhckVsZW1lbnQub2Zmc2V0VG9wIC0geWVhclNlbGVjdG9yRWxlbWVudC5vZmZzZXRIZWlnaHQgLyAyICsgYWN0aXZlWWVhckVsZW1lbnQub2Zmc2V0SGVpZ2h0IC8gMjtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlQ2FsZW5kYXIoKSB7XHJcbiAgICAgICAgICB2YXIgZGF5cyA9IFtdLFxyXG4gICAgICAgICAgICAvL3ByZXZpb3VzRGF5ID0gbmV3IERhdGUoJHNjb3BlLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSwgJHNjb3BlLmFjdGl2ZURhdGUuZ2V0TW9udGgoKSwgMCksLy9hbmd1bGFyLmNvcHkoJHNjb3BlLmFjdGl2ZURhdGUpLmRhdGUoMCksXHJcbiAgICAgICAgICAgIGZpcnN0RGF5T2ZNb250aCA9IG5ldyBEYXRlKCRzY29wZS5hY3RpdmVEYXRlLmdldEZ1bGxZZWFyKCksICRzY29wZS5hY3RpdmVEYXRlLmdldE1vbnRoKCksIDEpLC8vYW5ndWxhci5jb3B5KCRzY29wZS5hY3RpdmVEYXRlKS5kYXRlKDEpLFxyXG4gICAgICAgICAgICBsYXN0RGF5T2ZNb250aCA9ICBuZXcgRGF0ZSgkc2NvcGUuYWN0aXZlRGF0ZS5nZXRGdWxsWWVhcigpLCAkc2NvcGUuYWN0aXZlRGF0ZS5nZXRNb250aCgpKzEsIDApLCAvL2FuZ3VsYXIuY29weShmaXJzdERheU9mTW9udGgpLmVuZE9mKCdtb250aCcpLFxyXG4gICAgICAgICAgICBtYXhEYXlzID0gbGFzdERheU9mTW9udGguZ2V0VVRDRGF0ZSgpOy8vYW5ndWxhci5jb3B5KGxhc3REYXlPZk1vbnRoKS5kYXRlKCk7XHJcblxyXG4gICAgICAgICAgJHNjb3BlLmVtcHR5Rmlyc3REYXlzID0gW107XHJcblxyXG5cclxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gZmlyc3REYXlPZk1vbnRoLmdldERheSgpOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICAgICRzY29wZS5lbXB0eUZpcnN0RGF5cy5wdXNoKHt9KTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdmFyIGVhY2ggPSBmaXJzdERheU9mTW9udGg7XHJcbiAgICAgICAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgdG9kYXkuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgICAkc2NvcGUudG9kYXkgPSB7fTsgJHNjb3BlLnRvZGF5LmRhdGUgPSB0b2RheTtcclxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbWF4RGF5czsgaisrKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGF0ZSA9IHt9O1xyXG4gICAgICAgICAgICBkYXRlLmRhdGUgPSBlYWNoO1xyXG4gICAgICAgICAgICAvL2RhdGUgPSBhbmd1bGFyLmNvcHkocHJldmlvdXNEYXkuYWRkKDEsICdkYXlzJykpO1xyXG5cclxuICAgICAgICAgICAgZGF0ZS5zZWxlY3RlZCA9IGVhY2guZ2V0VGltZSgpID09PSAkc2NvcGUuc2VsZWN0ZWQuZGF0ZS5nZXRUaW1lKCk7Ly9hbmd1bGFyLmlzRGVmaW5lZCgkc2NvcGUuc2VsZWN0ZWQubW9kZWwpICYmIGRhdGUuaXNTYW1lKCRzY29wZS5zZWxlY3RlZC5kYXRlLCAnZGF5Jyk7XHJcbiAgICAgICAgICAgIGRhdGUudG9kYXkgPSBlYWNoLmdldFRpbWUoKSA9PT0gdG9kYXkuZ2V0VGltZSgpOy8vZGF0ZS5pc1NhbWUobW9tZW50KCksICdkYXknKTtcclxuXHJcbiAgICAgICAgICAgIGRheXMucHVzaChkYXRlKTtcclxuICAgICAgICAgICAgZWFjaCA9IG5ldyBEYXRlKGVhY2gpO1xyXG4gICAgICAgICAgICBlYWNoID0gbmV3IERhdGUoZWFjaC5zZXREYXRlKGVhY2guZ2V0RGF0ZSgpICsgMSkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICRzY29wZS5lbXB0eUxhc3REYXlzID0gW107XHJcbiAgICAgICAgICAvL2lmKGxhc3REYXlPZk1vbnRoLmdldERheSgpIDwgNyApIHtcclxuICAgICAgICAgICAgICBmb3IgKHZhciBrID0gbGFzdERheU9mTW9udGguZ2V0RGF5KCkrMTsgayA8IDcgOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgJHNjb3BlLmVtcHR5TGFzdERheXMucHVzaCh7fSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgLy99XHJcbiAgICAgICAgICAkc2NvcGUuZGF5cyA9IGRheXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5jbG9zZVBpY2tlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICRtZERpYWxvZy5oaWRlKCRzY29wZS5zZWxlY3RlZCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXSlcclxuLmNvbnRyb2xsZXIoJ21kY0RhdGVQaWNrZXJJbnB1dENvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkYXR0cnMsICR0aW1lb3V0LCAkZmlsdGVyLCAkbWREaWFsb2cpIHtcclxuICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCgkc2NvcGUubW9kZWwpKSB7XHJcbiAgICAgICRzY29wZS5zZWxlY3RlZCA9IHtcclxuICAgICAgICBtb2RlbDogJHNjb3BlLm1vZGVsLFxyXG4gICAgICAgIGRhdGU6ICRzY29wZS5tb2RlbFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICRzY29wZS5zZWxlY3RlZCA9IHtcclxuICAgICAgICBtb2RlbDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKClcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIHZhciBkYXRhRGF0ZUZvcm1hdCA9ICdtZWRpdW1EYXRlJztcclxuICAgIGlmKGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5kYXRhRGF0ZUZvcm1hdCkpXHJcbiAgICAgICAgZGF0YURhdGVGb3JtYXQgPSAkYXR0cnMuZGF0YURhdGVGb3JtYXQ7XHJcblxyXG4gICAgJHNjb3BlLm9wZW5QaWNrZXIgPSBmdW5jdGlvbiAoZXYpIHtcclxuICAgICAgJHNjb3BlLnllYXJTZWxlY3Rpb24gPSBmYWxzZTtcclxuXHJcbiAgICAgICRtZERpYWxvZy5zaG93KHtcclxuICAgICAgICB0YXJnZXRFdmVudDogZXYsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdkYXRlLXBpY2tlci9kYXRlLXBpY2tlci1kaWFsb2cuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogJ21kY0RhdGVQaWNrZXJDb250cm9sbGVyJyxcclxuICAgICAgICBsb2NhbHM6IHtkYXRlOiAkc2NvcGUuc2VsZWN0ZWQuZGF0ZSwgbG9jYWxlOiAkYXR0cnMubG9jYWxlLCBtZFRoZW1lOiAkYXR0cnMuZGlhbG9nTWRUaGVtZX1cclxuICAgICAgfSkudGhlbihmdW5jdGlvbiAoc2VsZWN0ZWQpIHtcclxuICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICRzY29wZS5zZWxlY3RlZC5tb2RlbCA9ICRmaWx0ZXIoJ2RhdGUnKShzZWxlY3RlZC5kYXRlLCBkYXRhRGF0ZUZvcm1hdCk7XHJcbiAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWQuZGF0ZSA9IHNlbGVjdGVkLmRhdGU7XHJcbiAgICAgICAgICAkc2NvcGUubW9kZWwgPSBzZWxlY3RlZC5tb2RlbDtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9KVxyXG4uZGlyZWN0aXZlKCdtZGNEYXRlUGlja2VyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVzdHJpY3Q6ICdBRScsXHJcbiAgICAgIGNvbnRyb2xsZXI6ICdtZGNEYXRlUGlja2VySW5wdXRDb250cm9sbGVyJyxcclxuICAgICAgc2NvcGU6IHtcclxuICAgICAgICBtb2RlbDogJz0nLFxyXG4gICAgICAgIGxhYmVsOiAnQCdcclxuICAgICAgfSxcclxuICAgICAgdGVtcGxhdGVVcmw6ICdkYXRlLXBpY2tlci9kYXRlLXBpY2tlci1pbnB1dC5odG1sJ1xyXG4gICAgfTtcclxuICB9KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ25nTWF0ZXJpYWwuY29tcG9uZW50cycsIFtcclxuICAnbmdNYXRlcmlhbCcsXHJcbiAgJ25nTWF0ZXJpYWwuY29tcG9uZW50cy50ZW1wbGF0ZXMnLFxyXG4gICduZ01hdGVyaWFsLmNvbXBvbmVudHMuZGF0ZVBpY2tlcidcclxuXSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==