(function(){angular.module("ngMaterial.components.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("date-picker/date-picker-dialog.html","<md-dialog class=\"mdc-date-picker\" style=\"max-width: 90%; max-height: 90%\">\r\n    <!-- Date picker -->\r\n    <div md-theme=\"{{mdTheme}}\">\r\n      <!-- Current day of week -->\r\n      <md-toolbar class=\"md-hue-2 mdc-date-picker__current-day-of-week\">\r\n        <span>{{ selected.date | date: \'EEEE\' }}</span>\r\n      </md-toolbar>\r\n\r\n      <!-- Current date -->\r\n      <md-toolbar class=\"mdc-date-picker__current-date\">\r\n        <span>{{ selected.date | date : \'MMMM\' }}</span>\r\n        <strong>{{ selected.date | date: \'dd\' }}</strong>\r\n        <a ng-click=\"displayYearSelection()\">{{ selected.date | date: \'yyyy\' }}</a>\r\n      </md-toolbar>\r\n\r\n      <!-- Calendar -->\r\n      <div class=\"mdc-date-picker__calendar\" ng-if=\"!yearSelection\">\r\n        <div class=\"mdc-date-picker__nav\">\r\n          <md-button class=\"md-fab md-primary\" aria-label=\"Previous month\" ng-click=\"previousMonth()\">\r\n            <i class=\"mdi mdi-chevron-left\"></i>\r\n          </md-button>\r\n\r\n          <span>{{ activeDate | date: \'MMMM yyyy\' }}</span>\r\n\r\n          <md-button class=\"md-fab md-primary\" aria-label=\"Next month\" ng-click=\"nextMonth()\">\r\n            <i class=\"mdi mdi-chevron-right\"></i>\r\n          </md-button>\r\n        </div>\r\n\r\n        <div class=\"mdc-date-picker__days-of-week\">\r\n          <span ng-repeat=\"day in daysOfWeek\">{{ day }}</span>\r\n        </div>\r\n\r\n        <div class=\"mdc-date-picker__days\">\r\n                    <span class=\"mdc-date-picker__day mdc-date-picker__day--is-empty\"\r\n                          ng-repeat=\"x in emptyFirstDays\">&nbsp;</span><!--\r\n\r\n                 --><div class=\"mdc-date-picker__day\"\r\n                         ng-class=\"{ \'mdc-date-picker__day--is-selected\': day.selected,\r\n                                     \'mdc-date-picker__day--is-today\': day.today }\"\r\n                         ng-repeat=\"day in days\">\r\n          <a ng-click=\"select(day)\">{{ day.date ? (day.date | date: \'dd\') : \'\' }}</a>\r\n        </div><!--\r\n\r\n                 --><span class=\"mdc-date-picker__day mdc-date-picker__day--is-empty\"\r\n                          ng-repeat=\"x in emptyLastDays\">&nbsp;</span>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Year selection -->\r\n      <div class=\"mdc-date-picker__year-selector\" ng-show=\"yearSelection\">\r\n        <a class=\"mdc-date-picker__year\"\r\n           ng-class=\"{ \'mdc-date-picker__year--is-active\': year == activeDate.format(\'YYYY\') }\"\r\n           ng-repeat=\"year in years\"\r\n           ng-click=\"selectYear(year)\"\r\n           ng-if=\"yearSelection\">\r\n          <span>{{year}}</span>\r\n        </a>\r\n      </div>\r\n\r\n      <!-- Actions -->\r\n      <div class=\"md-actions mdc-date-picker__actions\" layout=\"row\" layout-align=\"end\">\r\n        <md-button class=\"md-primary\" ng-click=\"cancel()\">Cancel</md-button>\r\n        <md-button class=\"md-primary\" ng-click=\"closePicker()\">Ok</md-button>\r\n      </div>\r\n    </div>\r\n</md-dialog>\r\n");
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
          $scope.activeDate = new Date($scope.activeDate.setMonth($scope.activeDate.getMonth()-1));//$scope.activeDate.subtract(1, 'month');
          generateCalendar();
        };

        $scope.nextMonth = function () {
          $scope.activeDate = new Date($scope.activeDate.setMonth($scope.activeDate.getMonth()+1));//$scope.activeDate.add(1, 'month');
          generateCalendar();
        };

        $scope.select = function (day) {
          $scope.selected = {
            model: day.date,
            date: day.date
          };

          $scope.model = day.date;

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
})();
(function(){'use strict';

angular.module('ngMaterial.components', [
  'ngMaterial',
  'ngMaterial.components.templates',
  'ngMaterial.components.datePicker'
]);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi50bXAvdGVtcGxhdGVzL3RlbXBsYXRlcy5qcyIsInNyYy9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci5qcyIsInNyYy9jb21wb25lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFuZ3VsYXItbWF0ZXJpYWwtY29tcG9uZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKFwibmdNYXRlcmlhbC5jb21wb25lbnRzLnRlbXBsYXRlc1wiLCBbXSkucnVuKFtcIiR0ZW1wbGF0ZUNhY2hlXCIsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7JHRlbXBsYXRlQ2FjaGUucHV0KFwiZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXItZGlhbG9nLmh0bWxcIixcIjxtZC1kaWFsb2cgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlclxcXCIgc3R5bGU9XFxcIm1heC13aWR0aDogOTAlOyBtYXgtaGVpZ2h0OiA5MCVcXFwiPlxcclxcbiAgICA8IS0tIERhdGUgcGlja2VyIC0tPlxcclxcbiAgICA8ZGl2IG1kLXRoZW1lPVxcXCJ7e21kVGhlbWV9fVxcXCI+XFxyXFxuICAgICAgPCEtLSBDdXJyZW50IGRheSBvZiB3ZWVrIC0tPlxcclxcbiAgICAgIDxtZC10b29sYmFyIGNsYXNzPVxcXCJtZC1odWUtMiBtZGMtZGF0ZS1waWNrZXJfX2N1cnJlbnQtZGF5LW9mLXdlZWtcXFwiPlxcclxcbiAgICAgICAgPHNwYW4+e3sgc2VsZWN0ZWQuZGF0ZSB8IGRhdGU6IFxcJ0VFRUVcXCcgfX08L3NwYW4+XFxyXFxuICAgICAgPC9tZC10b29sYmFyPlxcclxcblxcclxcbiAgICAgIDwhLS0gQ3VycmVudCBkYXRlIC0tPlxcclxcbiAgICAgIDxtZC10b29sYmFyIGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2N1cnJlbnQtZGF0ZVxcXCI+XFxyXFxuICAgICAgICA8c3Bhbj57eyBzZWxlY3RlZC5kYXRlIHwgZGF0ZSA6IFxcJ01NTU1cXCcgfX08L3NwYW4+XFxyXFxuICAgICAgICA8c3Ryb25nPnt7IHNlbGVjdGVkLmRhdGUgfCBkYXRlOiBcXCdkZFxcJyB9fTwvc3Ryb25nPlxcclxcbiAgICAgICAgPGEgbmctY2xpY2s9XFxcImRpc3BsYXlZZWFyU2VsZWN0aW9uKClcXFwiPnt7IHNlbGVjdGVkLmRhdGUgfCBkYXRlOiBcXCd5eXl5XFwnIH19PC9hPlxcclxcbiAgICAgIDwvbWQtdG9vbGJhcj5cXHJcXG5cXHJcXG4gICAgICA8IS0tIENhbGVuZGFyIC0tPlxcclxcbiAgICAgIDxkaXYgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fY2FsZW5kYXJcXFwiIG5nLWlmPVxcXCIheWVhclNlbGVjdGlvblxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX25hdlxcXCI+XFxyXFxuICAgICAgICAgIDxtZC1idXR0b24gY2xhc3M9XFxcIm1kLWZhYiBtZC1wcmltYXJ5XFxcIiBhcmlhLWxhYmVsPVxcXCJQcmV2aW91cyBtb250aFxcXCIgbmctY2xpY2s9XFxcInByZXZpb3VzTW9udGgoKVxcXCI+XFxyXFxuICAgICAgICAgICAgPGkgY2xhc3M9XFxcIm1kaSBtZGktY2hldnJvbi1sZWZ0XFxcIj48L2k+XFxyXFxuICAgICAgICAgIDwvbWQtYnV0dG9uPlxcclxcblxcclxcbiAgICAgICAgICA8c3Bhbj57eyBhY3RpdmVEYXRlIHwgZGF0ZTogXFwnTU1NTSB5eXl5XFwnIH19PC9zcGFuPlxcclxcblxcclxcbiAgICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1mYWIgbWQtcHJpbWFyeVxcXCIgYXJpYS1sYWJlbD1cXFwiTmV4dCBtb250aFxcXCIgbmctY2xpY2s9XFxcIm5leHRNb250aCgpXFxcIj5cXHJcXG4gICAgICAgICAgICA8aSBjbGFzcz1cXFwibWRpIG1kaS1jaGV2cm9uLXJpZ2h0XFxcIj48L2k+XFxyXFxuICAgICAgICAgIDwvbWQtYnV0dG9uPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2RheXMtb2Ytd2Vla1xcXCI+XFxyXFxuICAgICAgICAgIDxzcGFuIG5nLXJlcGVhdD1cXFwiZGF5IGluIGRheXNPZldlZWtcXFwiPnt7IGRheSB9fTwvc3Bhbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcblxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWRjLWRhdGUtcGlja2VyX19kYXlzXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2RheSBtZGMtZGF0ZS1waWNrZXJfX2RheS0taXMtZW1wdHlcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XFxcInggaW4gZW1wdHlGaXJzdERheXNcXFwiPiZuYnNwOzwvc3Bhbj48IS0tXFxyXFxuXFxyXFxuICAgICAgICAgICAgICAgICAtLT48ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2RheVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xhc3M9XFxcInsgXFwnbWRjLWRhdGUtcGlja2VyX19kYXktLWlzLXNlbGVjdGVkXFwnOiBkYXkuc2VsZWN0ZWQsXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcJ21kYy1kYXRlLXBpY2tlcl9fZGF5LS1pcy10b2RheVxcJzogZGF5LnRvZGF5IH1cXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgIG5nLXJlcGVhdD1cXFwiZGF5IGluIGRheXNcXFwiPlxcclxcbiAgICAgICAgICA8YSBuZy1jbGljaz1cXFwic2VsZWN0KGRheSlcXFwiPnt7IGRheS5kYXRlID8gKGRheS5kYXRlIHwgZGF0ZTogXFwnZGRcXCcpIDogXFwnXFwnIH19PC9hPlxcclxcbiAgICAgICAgPC9kaXY+PCEtLVxcclxcblxcclxcbiAgICAgICAgICAgICAgICAgLS0+PHNwYW4gY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fZGF5IG1kYy1kYXRlLXBpY2tlcl9fZGF5LS1pcy1lbXB0eVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5nLXJlcGVhdD1cXFwieCBpbiBlbXB0eUxhc3REYXlzXFxcIj4mbmJzcDs8L3NwYW4+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICA8IS0tIFllYXIgc2VsZWN0aW9uIC0tPlxcclxcbiAgICAgIDxkaXYgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9feWVhci1zZWxlY3RvclxcXCIgbmctc2hvdz1cXFwieWVhclNlbGVjdGlvblxcXCI+XFxyXFxuICAgICAgICA8YSBjbGFzcz1cXFwibWRjLWRhdGUtcGlja2VyX195ZWFyXFxcIlxcclxcbiAgICAgICAgICAgbmctY2xhc3M9XFxcInsgXFwnbWRjLWRhdGUtcGlja2VyX195ZWFyLS1pcy1hY3RpdmVcXCc6IHllYXIgPT0gYWN0aXZlRGF0ZS5mb3JtYXQoXFwnWVlZWVxcJykgfVxcXCJcXHJcXG4gICAgICAgICAgIG5nLXJlcGVhdD1cXFwieWVhciBpbiB5ZWFyc1xcXCJcXHJcXG4gICAgICAgICAgIG5nLWNsaWNrPVxcXCJzZWxlY3RZZWFyKHllYXIpXFxcIlxcclxcbiAgICAgICAgICAgbmctaWY9XFxcInllYXJTZWxlY3Rpb25cXFwiPlxcclxcbiAgICAgICAgICA8c3Bhbj57e3llYXJ9fTwvc3Bhbj5cXHJcXG4gICAgICAgIDwvYT5cXHJcXG4gICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICA8IS0tIEFjdGlvbnMgLS0+XFxyXFxuICAgICAgPGRpdiBjbGFzcz1cXFwibWQtYWN0aW9ucyBtZGMtZGF0ZS1waWNrZXJfX2FjdGlvbnNcXFwiIGxheW91dD1cXFwicm93XFxcIiBsYXlvdXQtYWxpZ249XFxcImVuZFxcXCI+XFxyXFxuICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1wcmltYXJ5XFxcIiBuZy1jbGljaz1cXFwiY2FuY2VsKClcXFwiPkNhbmNlbDwvbWQtYnV0dG9uPlxcclxcbiAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibWQtcHJpbWFyeVxcXCIgbmctY2xpY2s9XFxcImNsb3NlUGlja2VyKClcXFwiPk9rPC9tZC1idXR0b24+XFxyXFxuICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvbWQtZGlhbG9nPlxcclxcblwiKTtcbiR0ZW1wbGF0ZUNhY2hlLnB1dChcImRhdGUtcGlja2VyL2RhdGUtcGlja2VyLWlucHV0Lmh0bWxcIixcIjxtZC1pbnB1dC1jb250YWluZXIgbmctY2xpY2s9XFxcIm9wZW5QaWNrZXIoJGV2ZW50KVxcXCI+XFxyXFxuICA8bGFiZWw+e3tsYWJlbH19PC9sYWJlbD5cXHJcXG4gIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD1cXFwic2VsZWN0ZWQubW9kZWxcXFwiIG5nLWRpc2FibGVkPVxcXCJ0cnVlXFxcIiBuZy1jbGljaz1cXFwib3BlblBpY2tlcigkZXZlbnQpXFxcIj5cXHJcXG48L21kLWlucHV0LWNvbnRhaW5lcj5cXHJcXG5cIik7fV0pOyIsIi8qIGdsb2JhbCBhbmd1bGFyICovXHJcbi8qIGdsb2JhbCBtb21lbnQgKi9cclxuLyogZ2xvYmFsIG5hdmlnYXRvciAqL1xyXG4ndXNlIHN0cmljdCc7IC8vIGpzaGludCBpZ25vcmU6bGluZVxyXG5cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCduZ01hdGVyaWFsLmNvbXBvbmVudHMuZGF0ZVBpY2tlcicsIFsnbmdNYXRlcmlhbCddKVxyXG4uY29udHJvbGxlcignbWRjRGF0ZVBpY2tlckNvbnRyb2xsZXInLCBbJyRzY29wZScsJyR0aW1lb3V0JywnJG1kRGlhbG9nJywnJGZpbHRlcicsJyRkb2N1bWVudCcsJyRsb2NhbGUnLCdkYXRlJywnbG9jYWxlJywnbWRUaGVtZScsXHJcbiAgICBmdW5jdGlvbiAoJHNjb3BlLCAkdGltZW91dCwgJG1kRGlhbG9nLCAkZmlsdGVyLCAkZG9jdW1lbnQsICRsb2NhbGUsIGRhdGUsIGxvY2FsZSwgbWRUaGVtZSkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTG9jYWxlKGxvY2FsZSkge1xyXG4gICAgICAgICAgaWYgKCFsb2NhbGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChuYXZpZ2F0b3IubGFuZ3VhZ2UgIT09IG51bGwgPyBuYXZpZ2F0b3IubGFuZ3VhZ2UgOiBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlKS5zcGxpdCgnXycpWzBdLnNwbGl0KCctJylbMF0gfHwgJ2VuJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBsb2NhbGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRzY29wZS5teUxvY2FsZSA9ICRsb2NhbGU7XHJcblxyXG4gICAgICAgICRzY29wZS5tb2RlbCA9IGRhdGU7XHJcblxyXG4gICAgICAgICRzY29wZS5tZFRoZW1lID0gbWRUaGVtZSA/IG1kVGhlbWUgOiAnZGVmYXVsdCc7XHJcblxyXG4gICAgICAgIHZhciBhY3RpdmVMb2NhbGU7XHJcblxyXG4gICAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLmJ1aWxkID0gZnVuY3Rpb24gKGxvY2FsZSkge1xyXG4gICAgICAgICAgLy9hY3RpdmVMb2NhbGUgPSBsb2NhbGU7XHJcblxyXG4gICAgICAgICAgLy9tb21lbnQubG9jYWxlKGFjdGl2ZUxvY2FsZSk7XHJcblxyXG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKCRzY29wZS5tb2RlbCkpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkID0ge1xyXG4gICAgICAgICAgICAgIG1vZGVsOiAkc2NvcGUubW9kZWwsLy9tb21lbnQoJHNjb3BlLm1vZGVsKSxcclxuICAgICAgICAgICAgICBkYXRlOiAkc2NvcGUubW9kZWxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gJHNjb3BlLm1vZGVsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZCA9IHtcclxuICAgICAgICAgICAgICBtb2RlbDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKClcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyRzY29wZS5tb21lbnQgPSBtb21lbnQ7XHJcblxyXG4gICAgICAgICAgJHNjb3BlLmRheXMgPSBbXTtcclxuICAgICAgICAgIC8vVE9ETzogVXNlIG1vbWVudCBsb2NhbGUgdG8gc2V0IGZpcnN0IGRheSBvZiB3ZWVrIHByb3Blcmx5LlxyXG5cclxuICAgICAgICAgICRzY29wZS5kYXlzT2ZXZWVrID0gWyRzY29wZS5teUxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLlNIT1JUREFZWzBdLFxyXG4gICAgICAgICAgICAkc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVsxXSxcclxuICAgICAgICAgICAgJHNjb3BlLm15TG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuU0hPUlREQVlbMl0sXHJcbiAgICAgICAgICAgICRzY29wZS5teUxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLlNIT1JUREFZWzNdLFxyXG4gICAgICAgICAgICAkc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVs0XSxcclxuICAgICAgICAgICAgJHNjb3BlLm15TG9jYWxlLkRBVEVUSU1FX0ZPUk1BVFMuU0hPUlREQVlbNV0sXHJcbiAgICAgICAgICAgICRzY29wZS5teUxvY2FsZS5EQVRFVElNRV9GT1JNQVRTLlNIT1JUREFZWzZdXTtcclxuXHJcbiAgICAgICAgICAkc2NvcGUueWVhcnMgPSBbXTtcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciB5ID0gJHNjb3BlLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSAtIDUwOyB5IDw9ICRzY29wZS5hY3RpdmVEYXRlLmdldEZ1bGxZZWFyKCkgKyA1MDsgeSsrKSB7XHJcbiAgICAgICAgICAgICRzY29wZS55ZWFycy5wdXNoKHkpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGdlbmVyYXRlQ2FsZW5kYXIoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuYnVpbGQoY2hlY2tMb2NhbGUobG9jYWxlKSk7XHJcblxyXG4gICAgICAgICRzY29wZS5wcmV2aW91c01vbnRoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJHNjb3BlLmFjdGl2ZURhdGUgPSBuZXcgRGF0ZSgkc2NvcGUuYWN0aXZlRGF0ZS5zZXRNb250aCgkc2NvcGUuYWN0aXZlRGF0ZS5nZXRNb250aCgpLTEpKTsvLyRzY29wZS5hY3RpdmVEYXRlLnN1YnRyYWN0KDEsICdtb250aCcpO1xyXG4gICAgICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5uZXh0TW9udGggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAkc2NvcGUuYWN0aXZlRGF0ZSA9IG5ldyBEYXRlKCRzY29wZS5hY3RpdmVEYXRlLnNldE1vbnRoKCRzY29wZS5hY3RpdmVEYXRlLmdldE1vbnRoKCkrMSkpOy8vJHNjb3BlLmFjdGl2ZURhdGUuYWRkKDEsICdtb250aCcpO1xyXG4gICAgICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5zZWxlY3QgPSBmdW5jdGlvbiAoZGF5KSB7XHJcbiAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XHJcbiAgICAgICAgICAgIG1vZGVsOiBkYXkuZGF0ZSxcclxuICAgICAgICAgICAgZGF0ZTogZGF5LmRhdGVcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgJHNjb3BlLm1vZGVsID0gZGF5LmRhdGU7XHJcblxyXG4gICAgICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5zZWxlY3RZZWFyID0gZnVuY3Rpb24gKHllYXIpIHtcclxuICAgICAgICAgICRzY29wZS55ZWFyU2VsZWN0aW9uID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgJHNjb3BlLnNlbGVjdGVkLm1vZGVsID0gJHNjb3BlLnNlbGVjdGVkLmRhdGUuc2V0RnVsbFllYXIoeWVhcik7Ly8gbW9tZW50KCRzY29wZS5zZWxlY3RlZC5kYXRlKS55ZWFyKHllYXIpLnRvRGF0ZSgpO1xyXG4gICAgICAgICAgJHNjb3BlLnNlbGVjdGVkLmRhdGUgPSAgJHNjb3BlLnNlbGVjdGVkLmRhdGUuc2V0RnVsbFllYXIoeWVhcik7Ly9tb21lbnQoJHNjb3BlLnNlbGVjdGVkLmRhdGUpLnllYXIoeWVhcikudG9EYXRlKCk7XHJcbiAgICAgICAgICAkc2NvcGUubW9kZWwgPSAkc2NvcGUubW9kZWw7Ly8gbW9tZW50KCRzY29wZS5zZWxlY3RlZC5kYXRlKS50b0RhdGUoKTtcclxuICAgICAgICAgICRzY29wZS5hY3RpdmVEYXRlLnNldEZ1bGxZZWFyKHllYXIpOy8vID0gJHNjb3BlLmFjdGl2ZURhdGUuYWRkKHllYXIgLSAkc2NvcGUuYWN0aXZlRGF0ZS55ZWFyKCksICd5ZWFyJyk7XHJcblxyXG4gICAgICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLmRpc3BsYXlZZWFyU2VsZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGNhbGVuZGFySGVpZ2h0ID0gJGRvY3VtZW50WzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21kYy1kYXRlLXBpY2tlcl9fY2FsZW5kYXInKVswXS5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgICB2YXIgeWVhclNlbGVjdG9yRWxlbWVudCA9ICRkb2N1bWVudFswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZGMtZGF0ZS1waWNrZXJfX3llYXItc2VsZWN0b3InKVswXTtcclxuICAgICAgICAgIHllYXJTZWxlY3RvckVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gY2FsZW5kYXJIZWlnaHQgKyAncHgnO1xyXG5cclxuICAgICAgICAgICRzY29wZS55ZWFyU2VsZWN0aW9uID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBhY3RpdmVZZWFyRWxlbWVudCA9ICRkb2N1bWVudFswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZGMtZGF0ZS1waWNrZXJfX3llYXItLWlzLWFjdGl2ZScpWzBdO1xyXG4gICAgICAgICAgICB5ZWFyU2VsZWN0b3JFbGVtZW50LnNjcm9sbFRvcCA9IHllYXJTZWxlY3RvckVsZW1lbnQuc2Nyb2xsVG9wICsgYWN0aXZlWWVhckVsZW1lbnQub2Zmc2V0VG9wIC0geWVhclNlbGVjdG9yRWxlbWVudC5vZmZzZXRIZWlnaHQgLyAyICsgYWN0aXZlWWVhckVsZW1lbnQub2Zmc2V0SGVpZ2h0IC8gMjtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlQ2FsZW5kYXIoKSB7XHJcbiAgICAgICAgICB2YXIgZGF5cyA9IFtdLFxyXG4gICAgICAgICAgICAvL3ByZXZpb3VzRGF5ID0gbmV3IERhdGUoJHNjb3BlLmFjdGl2ZURhdGUuZ2V0RnVsbFllYXIoKSwgJHNjb3BlLmFjdGl2ZURhdGUuZ2V0TW9udGgoKSwgMCksLy9hbmd1bGFyLmNvcHkoJHNjb3BlLmFjdGl2ZURhdGUpLmRhdGUoMCksXHJcbiAgICAgICAgICAgIGZpcnN0RGF5T2ZNb250aCA9IG5ldyBEYXRlKCRzY29wZS5hY3RpdmVEYXRlLmdldEZ1bGxZZWFyKCksICRzY29wZS5hY3RpdmVEYXRlLmdldE1vbnRoKCksIDEpLC8vYW5ndWxhci5jb3B5KCRzY29wZS5hY3RpdmVEYXRlKS5kYXRlKDEpLFxyXG4gICAgICAgICAgICBsYXN0RGF5T2ZNb250aCA9ICBuZXcgRGF0ZSgkc2NvcGUuYWN0aXZlRGF0ZS5nZXRGdWxsWWVhcigpLCAkc2NvcGUuYWN0aXZlRGF0ZS5nZXRNb250aCgpKzEsIDApLCAvL2FuZ3VsYXIuY29weShmaXJzdERheU9mTW9udGgpLmVuZE9mKCdtb250aCcpLFxyXG4gICAgICAgICAgICBtYXhEYXlzID0gbGFzdERheU9mTW9udGguZ2V0VVRDRGF0ZSgpOy8vYW5ndWxhci5jb3B5KGxhc3REYXlPZk1vbnRoKS5kYXRlKCk7XHJcblxyXG4gICAgICAgICAgJHNjb3BlLmVtcHR5Rmlyc3REYXlzID0gW107XHJcblxyXG5cclxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gZmlyc3REYXlPZk1vbnRoLmdldERheSgpOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICAgICRzY29wZS5lbXB0eUZpcnN0RGF5cy5wdXNoKHt9KTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdmFyIGVhY2ggPSBmaXJzdERheU9mTW9udGg7XHJcbiAgICAgICAgICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIHRvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtYXhEYXlzOyBqKyspIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBkYXRlID0ge307XHJcbiAgICAgICAgICAgIGRhdGUuZGF0ZSA9IGVhY2g7XHJcbiAgICAgICAgICAgIC8vZGF0ZSA9IGFuZ3VsYXIuY29weShwcmV2aW91c0RheS5hZGQoMSwgJ2RheXMnKSk7XHJcblxyXG4gICAgICAgICAgICBkYXRlLnNlbGVjdGVkID0gZWFjaC5nZXRUaW1lKCkgPT09ICRzY29wZS5zZWxlY3RlZC5kYXRlLmdldFRpbWUoKTsvL2FuZ3VsYXIuaXNEZWZpbmVkKCRzY29wZS5zZWxlY3RlZC5tb2RlbCkgJiYgZGF0ZS5pc1NhbWUoJHNjb3BlLnNlbGVjdGVkLmRhdGUsICdkYXknKTtcclxuICAgICAgICAgICAgZGF0ZS50b2RheSA9IGVhY2guZ2V0VGltZSgpID09PSB0b2RheS5nZXRUaW1lKCk7Ly9kYXRlLmlzU2FtZShtb21lbnQoKSwgJ2RheScpO1xyXG5cclxuICAgICAgICAgICAgZGF5cy5wdXNoKGRhdGUpO1xyXG4gICAgICAgICAgICBlYWNoID0gbmV3IERhdGUoZWFjaCk7XHJcbiAgICAgICAgICAgIGVhY2ggPSBuZXcgRGF0ZShlYWNoLnNldERhdGUoZWFjaC5nZXREYXRlKCkgKyAxKSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgJHNjb3BlLmVtcHR5TGFzdERheXMgPSBbXTtcclxuICAgICAgICAgIC8vaWYobGFzdERheU9mTW9udGguZ2V0RGF5KCkgPCA3ICkge1xyXG4gICAgICAgICAgICAgIGZvciAodmFyIGsgPSBsYXN0RGF5T2ZNb250aC5nZXREYXkoKSsxOyBrIDwgNyA7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAkc2NvcGUuZW1wdHlMYXN0RGF5cy5wdXNoKHt9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAvL31cclxuICAgICAgICAgICRzY29wZS5kYXlzID0gZGF5cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmNsb3NlUGlja2VyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJG1kRGlhbG9nLmhpZGUoJHNjb3BlLnNlbGVjdGVkKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5dKVxyXG4uY29udHJvbGxlcignbWRjRGF0ZVBpY2tlcklucHV0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRhdHRycywgJHRpbWVvdXQsICRmaWx0ZXIsICRtZERpYWxvZykge1xyXG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKCRzY29wZS5tb2RlbCkpIHtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkID0ge1xyXG4gICAgICAgIG1vZGVsOiBtb21lbnQoJHNjb3BlLm1vZGVsKSxcclxuICAgICAgICBkYXRlOiAkc2NvcGUubW9kZWxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XHJcbiAgICAgICAgbW9kZWw6IHVuZGVmaW5lZCxcclxuICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICB2YXIgZGF0YURhdGVGb3JtYXQgPSAnbWVkaXVtRGF0ZSc7XHJcbiAgICBpZihhbmd1bGFyLmlzRGVmaW5lZCgkYXR0cnMuZGF0YURhdGVGb3JtYXQpKVxyXG4gICAgICAgIGRhdGFEYXRlRm9ybWF0ID0gJGF0dHJzLmRhdGFEYXRlRm9ybWF0O1xyXG5cclxuICAgICRzY29wZS5vcGVuUGlja2VyID0gZnVuY3Rpb24gKGV2KSB7XHJcbiAgICAgICRzY29wZS55ZWFyU2VsZWN0aW9uID0gZmFsc2U7XHJcblxyXG4gICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2LFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXItZGlhbG9nLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdtZGNEYXRlUGlja2VyQ29udHJvbGxlcicsXHJcbiAgICAgICAgbG9jYWxzOiB7ZGF0ZTogJHNjb3BlLnNlbGVjdGVkLmRhdGUsIGxvY2FsZTogJGF0dHJzLmxvY2FsZSwgbWRUaGVtZTogJGF0dHJzLmRpYWxvZ01kVGhlbWV9XHJcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWQubW9kZWwgPSAkZmlsdGVyKCdkYXRlJykoc2VsZWN0ZWQuZGF0ZSwgZGF0YURhdGVGb3JtYXQpO1xyXG4gICAgICAgICAgJHNjb3BlLnNlbGVjdGVkLmRhdGUgPSBzZWxlY3RlZC5kYXRlO1xyXG4gICAgICAgICAgJHNjb3BlLm1vZGVsID0gc2VsZWN0ZWQubW9kZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfSlcclxuLmRpcmVjdGl2ZSgnbWRjRGF0ZVBpY2tlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWN0OiAnQUUnLFxyXG4gICAgICBjb250cm9sbGVyOiAnbWRjRGF0ZVBpY2tlcklucHV0Q29udHJvbGxlcicsXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgbW9kZWw6ICc9JyxcclxuICAgICAgICBsYWJlbDogJ0AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAnZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXItaW5wdXQuaHRtbCdcclxuICAgIH07XHJcbiAgfSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCduZ01hdGVyaWFsLmNvbXBvbmVudHMnLCBbXHJcbiAgJ25nTWF0ZXJpYWwnLFxyXG4gICduZ01hdGVyaWFsLmNvbXBvbmVudHMudGVtcGxhdGVzJyxcclxuICAnbmdNYXRlcmlhbC5jb21wb25lbnRzLmRhdGVQaWNrZXInXHJcbl0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=