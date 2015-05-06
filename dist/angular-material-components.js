(function(){angular.module("ngMaterial.components.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("date-picker/date-picker-dialog.html","<md-dialog class=\"mdc-date-picker\" style=\"max-width: 90%; max-height: 90%\">\r\n    <!-- Date picker -->\r\n    <div md-theme=\"{{mdTheme}}\">\r\n      <!-- Current day of week -->\r\n      <md-toolbar class=\"md-hue-2 mdc-date-picker__current-day-of-week\">\r\n        <span>{{ selected.date | date: \'EEEE\' }}</span>\r\n      </md-toolbar>\r\n\r\n      <!-- Current date -->\r\n      <md-toolbar class=\"mdc-date-picker__current-date\">\r\n        <span>{{ selected.date | date : \'MMMM\' }}</span>\r\n        <strong>{{ selected.date | date: \'dd\' }}</strong>\r\n        <a ng-click=\"displayYearSelection()\">{{ selected.date | date: \'yyyy\' }}</a>\r\n      </md-toolbar>\r\n\r\n      <!-- Calendar -->\r\n      <div class=\"mdc-date-picker__calendar\" ng-if=\"!yearSelection\">\r\n        <div class=\"mdc-date-picker__nav\">\r\n          <md-button class=\"md-fab md-primary\" aria-label=\"Previous month\" ng-click=\"previousMonth()\">\r\n            <i class=\"mdi mdi-chevron-left\"></i>\r\n          </md-button>\r\n\r\n          <span>{{ activeDate.format(\'MMMM YYYY\') }}</span>\r\n\r\n          <md-button class=\"md-fab md-primary\" arial-label=\"Next month\" ng-click=\"nextMonth()\">\r\n            <i class=\"mdi mdi-chevron-right\"></i>\r\n          </md-button>\r\n        </div>\r\n\r\n        <div class=\"mdc-date-picker__days-of-week\">\r\n          <span ng-repeat=\"day in daysOfWeek\">{{ day }}</span>\r\n        </div>\r\n\r\n        <div class=\"mdc-date-picker__days\">\r\n                    <span class=\"mdc-date-picker__day mdc-date-picker__day--is-empty\"\r\n                          ng-repeat=\"x in emptyFirstDays\">&nbsp;</span><!--\r\n\r\n                 --><div class=\"mdc-date-picker__day\"\r\n                         ng-class=\"{ \'mdc-date-picker__day--is-selected\': day.selected,\r\n                                     \'mdc-date-picker__day--is-today\': day.today }\"\r\n                         ng-repeat=\"day in days\">\r\n          <a ng-click=\"select(day)\">{{ day ? day.format(\'D\') : \'\' }}</a>\r\n        </div><!--\r\n\r\n                 --><span class=\"mdc-date-picker__day mdc-date-picker__day--is-empty\"\r\n                          ng-repeat=\"x in emptyLastDays\">&nbsp;</span>\r\n        </div>\r\n      </div>\r\n\r\n      <!-- Year selection -->\r\n      <div class=\"mdc-date-picker__year-selector\" ng-show=\"yearSelection\">\r\n        <a class=\"mdc-date-picker__year\"\r\n           ng-class=\"{ \'mdc-date-picker__year--is-active\': year == activeDate.format(\'YYYY\') }\"\r\n           ng-repeat=\"year in years\"\r\n           ng-click=\"selectYear(year)\"\r\n           ng-if=\"yearSelection\">\r\n          <span>{{year}}</span>\r\n        </a>\r\n      </div>\r\n\r\n      <!-- Actions -->\r\n      <div class=\"md-actions mdc-date-picker__actions\" layout=\"row\" layout-align=\"end\">\r\n        <md-button class=\"md-primary\" ng-click=\"cancel()\">Cancel</md-button>\r\n        <md-button class=\"md-primary\" ng-click=\"closePicker()\">Ok</md-button>\r\n      </div>\r\n    </div>\r\n</md-dialog>\r\n");
$templateCache.put("date-picker/date-picker-input.html","<md-input-container ng-click=\"openPicker($event)\">\r\n  <label>{{label}}</label>\r\n  <input type=\"text\" ng-model=\"selected.model\" ng-disabled=\"true\" ng-click=\"openPicker($event)\">\r\n</md-input-container>\r\n");}]);})();
(function(){/* global angular */
/* global moment */
/* global navigator */
'use strict'; // jshint ignore:line


angular.module('ngMaterial.components.datePicker', ['ngMaterial'])
.controller('mdcDatePickerController', ['$scope','$timeout','$mdDialog','$filter','$document','$locale','date','locale','mdTheme', function ($scope, $timeout, $mdDialog, $filter, $document, $locale, date, locale, mdTheme) {
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

    this.build = function (locale) {
      activeLocale = locale;

      moment.locale(activeLocale);

      if (angular.isDefined($scope.model)) {
        $scope.selected = {
          model: moment($scope.model),
          date: $scope.model
        };

        $scope.activeDate = moment($scope.model);
      }
      else {
        $scope.selected = {
          model: undefined,
          date: new Date()
        };

        $scope.activeDate = moment();
      }

      $scope.moment = moment;

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

      for (var y = moment().year() - 100; y <= moment().year() + 100; y++) {
        $scope.years.push(y);
      }

      generateCalendar();
    };
    this.build(checkLocale(locale));

    $scope.previousMonth = function () {
      $scope.activeDate = $scope.activeDate.subtract(1, 'month');
      generateCalendar();
    };

    $scope.nextMonth = function () {
      $scope.activeDate = $scope.activeDate.add(1, 'month');
      generateCalendar();
    };

    $scope.select = function (day) {
      $scope.selected = {
        model: day.toDate(),
        date: day.toDate()
      };

      $scope.model = day.toDate();

      generateCalendar();
    };

    $scope.selectYear = function (year) {
      $scope.yearSelection = false;

      $scope.selected.model = moment($scope.selected.date).year(year).toDate();
      $scope.selected.date = moment($scope.selected.date).year(year).toDate();
      $scope.model = moment($scope.selected.date).toDate();
      $scope.activeDate = $scope.activeDate.add(year - $scope.activeDate.year(), 'year');

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
        previousDay = angular.copy($scope.activeDate).date(0),
        firstDayOfMonth = angular.copy($scope.activeDate).date(1),
        lastDayOfMonth = angular.copy(firstDayOfMonth).endOf('month'),
        maxDays = angular.copy(lastDayOfMonth).date();

      $scope.emptyFirstDays = [];

      for (var i =  firstDayOfMonth.day(); i > 0; i--) {
        $scope.emptyFirstDays.push({});
      }

      for (var j = 0; j < maxDays; j++) {
        var date = angular.copy(previousDay.add(1, 'days'));

        date.selected = angular.isDefined($scope.selected.model) && date.isSame($scope.selected.date, 'day');
        date.today = date.isSame(moment(), 'day');

        days.push(date);
      }

      $scope.emptyLastDays = [];

      for (var k = 7 - (lastDayOfMonth.day() === 0 ? 7 : lastDayOfMonth.day()); k > 0; k--) {
        $scope.emptyLastDays.push({});
      }

      $scope.days = days;
    }

    $scope.cancel = function() {
      $mdDialog.hide();
    };

    $scope.closePicker = function () {
      $mdDialog.hide($scope.selected);
    };
  }])
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
    if(angular.isDefined($attrs.dataDateFormat)) dataDateFormat = $attrs.dataDateFormat;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi50bXAvdGVtcGxhdGVzL3RlbXBsYXRlcy5qcyIsInNyYy9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci5qcyIsInNyYy9jb21wb25lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbmd1bGFyLW1hdGVyaWFsLWNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZShcIm5nTWF0ZXJpYWwuY29tcG9uZW50cy50ZW1wbGF0ZXNcIiwgW10pLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkgeyR0ZW1wbGF0ZUNhY2hlLnB1dChcImRhdGUtcGlja2VyL2RhdGUtcGlja2VyLWRpYWxvZy5odG1sXCIsXCI8bWQtZGlhbG9nIGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJcXFwiIHN0eWxlPVxcXCJtYXgtd2lkdGg6IDkwJTsgbWF4LWhlaWdodDogOTAlXFxcIj5cXHJcXG4gICAgPCEtLSBEYXRlIHBpY2tlciAtLT5cXHJcXG4gICAgPGRpdiBtZC10aGVtZT1cXFwie3ttZFRoZW1lfX1cXFwiPlxcclxcbiAgICAgIDwhLS0gQ3VycmVudCBkYXkgb2Ygd2VlayAtLT5cXHJcXG4gICAgICA8bWQtdG9vbGJhciBjbGFzcz1cXFwibWQtaHVlLTIgbWRjLWRhdGUtcGlja2VyX19jdXJyZW50LWRheS1vZi13ZWVrXFxcIj5cXHJcXG4gICAgICAgIDxzcGFuPnt7IHNlbGVjdGVkLmRhdGUgfCBkYXRlOiBcXCdFRUVFXFwnIH19PC9zcGFuPlxcclxcbiAgICAgIDwvbWQtdG9vbGJhcj5cXHJcXG5cXHJcXG4gICAgICA8IS0tIEN1cnJlbnQgZGF0ZSAtLT5cXHJcXG4gICAgICA8bWQtdG9vbGJhciBjbGFzcz1cXFwibWRjLWRhdGUtcGlja2VyX19jdXJyZW50LWRhdGVcXFwiPlxcclxcbiAgICAgICAgPHNwYW4+e3sgc2VsZWN0ZWQuZGF0ZSB8IGRhdGUgOiBcXCdNTU1NXFwnIH19PC9zcGFuPlxcclxcbiAgICAgICAgPHN0cm9uZz57eyBzZWxlY3RlZC5kYXRlIHwgZGF0ZTogXFwnZGRcXCcgfX08L3N0cm9uZz5cXHJcXG4gICAgICAgIDxhIG5nLWNsaWNrPVxcXCJkaXNwbGF5WWVhclNlbGVjdGlvbigpXFxcIj57eyBzZWxlY3RlZC5kYXRlIHwgZGF0ZTogXFwneXl5eVxcJyB9fTwvYT5cXHJcXG4gICAgICA8L21kLXRvb2xiYXI+XFxyXFxuXFxyXFxuICAgICAgPCEtLSBDYWxlbmRhciAtLT5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2NhbGVuZGFyXFxcIiBuZy1pZj1cXFwiIXllYXJTZWxlY3Rpb25cXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibWRjLWRhdGUtcGlja2VyX19uYXZcXFwiPlxcclxcbiAgICAgICAgICA8bWQtYnV0dG9uIGNsYXNzPVxcXCJtZC1mYWIgbWQtcHJpbWFyeVxcXCIgYXJpYS1sYWJlbD1cXFwiUHJldmlvdXMgbW9udGhcXFwiIG5nLWNsaWNrPVxcXCJwcmV2aW91c01vbnRoKClcXFwiPlxcclxcbiAgICAgICAgICAgIDxpIGNsYXNzPVxcXCJtZGkgbWRpLWNoZXZyb24tbGVmdFxcXCI+PC9pPlxcclxcbiAgICAgICAgICA8L21kLWJ1dHRvbj5cXHJcXG5cXHJcXG4gICAgICAgICAgPHNwYW4+e3sgYWN0aXZlRGF0ZS5mb3JtYXQoXFwnTU1NTSBZWVlZXFwnKSB9fTwvc3Bhbj5cXHJcXG5cXHJcXG4gICAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibWQtZmFiIG1kLXByaW1hcnlcXFwiIGFyaWFsLWxhYmVsPVxcXCJOZXh0IG1vbnRoXFxcIiBuZy1jbGljaz1cXFwibmV4dE1vbnRoKClcXFwiPlxcclxcbiAgICAgICAgICAgIDxpIGNsYXNzPVxcXCJtZGkgbWRpLWNoZXZyb24tcmlnaHRcXFwiPjwvaT5cXHJcXG4gICAgICAgICAgPC9tZC1idXR0b24+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fZGF5cy1vZi13ZWVrXFxcIj5cXHJcXG4gICAgICAgICAgPHNwYW4gbmctcmVwZWF0PVxcXCJkYXkgaW4gZGF5c09mV2Vla1xcXCI+e3sgZGF5IH19PC9zcGFuPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2RheXNcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fZGF5IG1kYy1kYXRlLXBpY2tlcl9fZGF5LS1pcy1lbXB0eVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5nLXJlcGVhdD1cXFwieCBpbiBlbXB0eUZpcnN0RGF5c1xcXCI+Jm5ic3A7PC9zcGFuPjwhLS1cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgIC0tPjxkaXYgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fZGF5XFxcIlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICBuZy1jbGFzcz1cXFwieyBcXCdtZGMtZGF0ZS1waWNrZXJfX2RheS0taXMtc2VsZWN0ZWRcXCc6IGRheS5zZWxlY3RlZCxcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFwnbWRjLWRhdGUtcGlja2VyX19kYXktLWlzLXRvZGF5XFwnOiBkYXkudG9kYXkgfVxcXCJcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgbmctcmVwZWF0PVxcXCJkYXkgaW4gZGF5c1xcXCI+XFxyXFxuICAgICAgICAgIDxhIG5nLWNsaWNrPVxcXCJzZWxlY3QoZGF5KVxcXCI+e3sgZGF5ID8gZGF5LmZvcm1hdChcXCdEXFwnKSA6IFxcJ1xcJyB9fTwvYT5cXHJcXG4gICAgICAgIDwvZGl2PjwhLS1cXHJcXG5cXHJcXG4gICAgICAgICAgICAgICAgIC0tPjxzcGFuIGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2RheSBtZGMtZGF0ZS1waWNrZXJfX2RheS0taXMtZW1wdHlcXFwiXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XFxcInggaW4gZW1wdHlMYXN0RGF5c1xcXCI+Jm5ic3A7PC9zcGFuPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgPCEtLSBZZWFyIHNlbGVjdGlvbiAtLT5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX3llYXItc2VsZWN0b3JcXFwiIG5nLXNob3c9XFxcInllYXJTZWxlY3Rpb25cXFwiPlxcclxcbiAgICAgICAgPGEgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9feWVhclxcXCJcXHJcXG4gICAgICAgICAgIG5nLWNsYXNzPVxcXCJ7IFxcJ21kYy1kYXRlLXBpY2tlcl9feWVhci0taXMtYWN0aXZlXFwnOiB5ZWFyID09IGFjdGl2ZURhdGUuZm9ybWF0KFxcJ1lZWVlcXCcpIH1cXFwiXFxyXFxuICAgICAgICAgICBuZy1yZXBlYXQ9XFxcInllYXIgaW4geWVhcnNcXFwiXFxyXFxuICAgICAgICAgICBuZy1jbGljaz1cXFwic2VsZWN0WWVhcih5ZWFyKVxcXCJcXHJcXG4gICAgICAgICAgIG5nLWlmPVxcXCJ5ZWFyU2VsZWN0aW9uXFxcIj5cXHJcXG4gICAgICAgICAgPHNwYW4+e3t5ZWFyfX08L3NwYW4+XFxyXFxuICAgICAgICA8L2E+XFxyXFxuICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgPCEtLSBBY3Rpb25zIC0tPlxcclxcbiAgICAgIDxkaXYgY2xhc3M9XFxcIm1kLWFjdGlvbnMgbWRjLWRhdGUtcGlja2VyX19hY3Rpb25zXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJlbmRcXFwiPlxcclxcbiAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibWQtcHJpbWFyeVxcXCIgbmctY2xpY2s9XFxcImNhbmNlbCgpXFxcIj5DYW5jZWw8L21kLWJ1dHRvbj5cXHJcXG4gICAgICAgIDxtZC1idXR0b24gY2xhc3M9XFxcIm1kLXByaW1hcnlcXFwiIG5nLWNsaWNrPVxcXCJjbG9zZVBpY2tlcigpXFxcIj5PazwvbWQtYnV0dG9uPlxcclxcbiAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L21kLWRpYWxvZz5cXHJcXG5cIik7XG4kdGVtcGxhdGVDYWNoZS5wdXQoXCJkYXRlLXBpY2tlci9kYXRlLXBpY2tlci1pbnB1dC5odG1sXCIsXCI8bWQtaW5wdXQtY29udGFpbmVyIG5nLWNsaWNrPVxcXCJvcGVuUGlja2VyKCRldmVudClcXFwiPlxcclxcbiAgPGxhYmVsPnt7bGFiZWx9fTwvbGFiZWw+XFxyXFxuICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9XFxcInNlbGVjdGVkLm1vZGVsXFxcIiBuZy1kaXNhYmxlZD1cXFwidHJ1ZVxcXCIgbmctY2xpY2s9XFxcIm9wZW5QaWNrZXIoJGV2ZW50KVxcXCI+XFxyXFxuPC9tZC1pbnB1dC1jb250YWluZXI+XFxyXFxuXCIpO31dKTsiLCIvKiBnbG9iYWwgYW5ndWxhciAqL1xyXG4vKiBnbG9iYWwgbW9tZW50ICovXHJcbi8qIGdsb2JhbCBuYXZpZ2F0b3IgKi9cclxuJ3VzZSBzdHJpY3QnOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcclxuXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnbmdNYXRlcmlhbC5jb21wb25lbnRzLmRhdGVQaWNrZXInLCBbJ25nTWF0ZXJpYWwnXSlcclxuLmNvbnRyb2xsZXIoJ21kY0RhdGVQaWNrZXJDb250cm9sbGVyJywgWyckc2NvcGUnLCckdGltZW91dCcsJyRtZERpYWxvZycsJyRmaWx0ZXInLCckZG9jdW1lbnQnLCckbG9jYWxlJywnZGF0ZScsJ2xvY2FsZScsJ21kVGhlbWUnLCBmdW5jdGlvbiAoJHNjb3BlLCAkdGltZW91dCwgJG1kRGlhbG9nLCAkZmlsdGVyLCAkZG9jdW1lbnQsICRsb2NhbGUsIGRhdGUsIGxvY2FsZSwgbWRUaGVtZSkge1xyXG4gICAgZnVuY3Rpb24gY2hlY2tMb2NhbGUobG9jYWxlKSB7XHJcbiAgICAgIGlmICghbG9jYWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIChuYXZpZ2F0b3IubGFuZ3VhZ2UgIT09IG51bGwgPyBuYXZpZ2F0b3IubGFuZ3VhZ2UgOiBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlKS5zcGxpdCgnXycpWzBdLnNwbGl0KCctJylbMF0gfHwgJ2VuJztcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbG9jYWxlO1xyXG4gICAgfVxyXG4gICAgJHNjb3BlLm15TG9jYWxlID0gJGxvY2FsZTtcclxuXHJcbiAgICAkc2NvcGUubW9kZWwgPSBkYXRlO1xyXG5cclxuICAgICRzY29wZS5tZFRoZW1lID0gbWRUaGVtZSA/IG1kVGhlbWUgOiAnZGVmYXVsdCc7XHJcblxyXG4gICAgdmFyIGFjdGl2ZUxvY2FsZTtcclxuXHJcbiAgICB0aGlzLmJ1aWxkID0gZnVuY3Rpb24gKGxvY2FsZSkge1xyXG4gICAgICBhY3RpdmVMb2NhbGUgPSBsb2NhbGU7XHJcblxyXG4gICAgICBtb21lbnQubG9jYWxlKGFjdGl2ZUxvY2FsZSk7XHJcblxyXG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoJHNjb3BlLm1vZGVsKSkge1xyXG4gICAgICAgICRzY29wZS5zZWxlY3RlZCA9IHtcclxuICAgICAgICAgIG1vZGVsOiBtb21lbnQoJHNjb3BlLm1vZGVsKSxcclxuICAgICAgICAgIGRhdGU6ICRzY29wZS5tb2RlbFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gbW9tZW50KCRzY29wZS5tb2RlbCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkID0ge1xyXG4gICAgICAgICAgbW9kZWw6IHVuZGVmaW5lZCxcclxuICAgICAgICAgIGRhdGU6IG5ldyBEYXRlKClcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuYWN0aXZlRGF0ZSA9IG1vbWVudCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUubW9tZW50ID0gbW9tZW50O1xyXG5cclxuICAgICAgJHNjb3BlLmRheXMgPSBbXTtcclxuICAgICAgLy9UT0RPOiBVc2UgbW9tZW50IGxvY2FsZSB0byBzZXQgZmlyc3QgZGF5IG9mIHdlZWsgcHJvcGVybHkuXHJcblxyXG4gICAgICAkc2NvcGUuZGF5c09mV2VlayA9IFskc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVswXSxcclxuICAgICAgICAkc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVsxXSxcclxuICAgICAgICAkc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVsyXSxcclxuICAgICAgICAkc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVszXSxcclxuICAgICAgICAkc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVs0XSxcclxuICAgICAgICAkc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVs1XSxcclxuICAgICAgICAkc2NvcGUubXlMb2NhbGUuREFURVRJTUVfRk9STUFUUy5TSE9SVERBWVs2XV07XHJcblxyXG4gICAgICAkc2NvcGUueWVhcnMgPSBbXTtcclxuXHJcbiAgICAgIGZvciAodmFyIHkgPSBtb21lbnQoKS55ZWFyKCkgLSAxMDA7IHkgPD0gbW9tZW50KCkueWVhcigpICsgMTAwOyB5KyspIHtcclxuICAgICAgICAkc2NvcGUueWVhcnMucHVzaCh5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xyXG4gICAgfTtcclxuICAgIHRoaXMuYnVpbGQoY2hlY2tMb2NhbGUobG9jYWxlKSk7XHJcblxyXG4gICAgJHNjb3BlLnByZXZpb3VzTW9udGggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gJHNjb3BlLmFjdGl2ZURhdGUuc3VidHJhY3QoMSwgJ21vbnRoJyk7XHJcbiAgICAgIGdlbmVyYXRlQ2FsZW5kYXIoKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLm5leHRNb250aCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJHNjb3BlLmFjdGl2ZURhdGUgPSAkc2NvcGUuYWN0aXZlRGF0ZS5hZGQoMSwgJ21vbnRoJyk7XHJcbiAgICAgIGdlbmVyYXRlQ2FsZW5kYXIoKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uIChkYXkpIHtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkID0ge1xyXG4gICAgICAgIG1vZGVsOiBkYXkudG9EYXRlKCksXHJcbiAgICAgICAgZGF0ZTogZGF5LnRvRGF0ZSgpXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUubW9kZWwgPSBkYXkudG9EYXRlKCk7XHJcblxyXG4gICAgICBnZW5lcmF0ZUNhbGVuZGFyKCk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zZWxlY3RZZWFyID0gZnVuY3Rpb24gKHllYXIpIHtcclxuICAgICAgJHNjb3BlLnllYXJTZWxlY3Rpb24gPSBmYWxzZTtcclxuXHJcbiAgICAgICRzY29wZS5zZWxlY3RlZC5tb2RlbCA9IG1vbWVudCgkc2NvcGUuc2VsZWN0ZWQuZGF0ZSkueWVhcih5ZWFyKS50b0RhdGUoKTtcclxuICAgICAgJHNjb3BlLnNlbGVjdGVkLmRhdGUgPSBtb21lbnQoJHNjb3BlLnNlbGVjdGVkLmRhdGUpLnllYXIoeWVhcikudG9EYXRlKCk7XHJcbiAgICAgICRzY29wZS5tb2RlbCA9IG1vbWVudCgkc2NvcGUuc2VsZWN0ZWQuZGF0ZSkudG9EYXRlKCk7XHJcbiAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gJHNjb3BlLmFjdGl2ZURhdGUuYWRkKHllYXIgLSAkc2NvcGUuYWN0aXZlRGF0ZS55ZWFyKCksICd5ZWFyJyk7XHJcblxyXG4gICAgICBnZW5lcmF0ZUNhbGVuZGFyKCk7XHJcbiAgICB9O1xyXG4gICAgJHNjb3BlLmRpc3BsYXlZZWFyU2VsZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgY2FsZW5kYXJIZWlnaHQgPSAkZG9jdW1lbnRbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWRjLWRhdGUtcGlja2VyX19jYWxlbmRhcicpWzBdLm9mZnNldEhlaWdodDtcclxuICAgICAgdmFyIHllYXJTZWxlY3RvckVsZW1lbnQgPSAkZG9jdW1lbnRbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWRjLWRhdGUtcGlja2VyX195ZWFyLXNlbGVjdG9yJylbMF07XHJcbiAgICAgIHllYXJTZWxlY3RvckVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gY2FsZW5kYXJIZWlnaHQgKyAncHgnO1xyXG5cclxuICAgICAgJHNjb3BlLnllYXJTZWxlY3Rpb24gPSB0cnVlO1xyXG5cclxuICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhY3RpdmVZZWFyRWxlbWVudCA9ICRkb2N1bWVudFswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZGMtZGF0ZS1waWNrZXJfX3llYXItLWlzLWFjdGl2ZScpWzBdO1xyXG4gICAgICAgIHllYXJTZWxlY3RvckVsZW1lbnQuc2Nyb2xsVG9wID0geWVhclNlbGVjdG9yRWxlbWVudC5zY3JvbGxUb3AgKyBhY3RpdmVZZWFyRWxlbWVudC5vZmZzZXRUb3AgLSB5ZWFyU2VsZWN0b3JFbGVtZW50Lm9mZnNldEhlaWdodCAvIDIgKyBhY3RpdmVZZWFyRWxlbWVudC5vZmZzZXRIZWlnaHQgLyAyO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVDYWxlbmRhcigpIHtcclxuICAgICAgdmFyIGRheXMgPSBbXSxcclxuICAgICAgICBwcmV2aW91c0RheSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuYWN0aXZlRGF0ZSkuZGF0ZSgwKSxcclxuICAgICAgICBmaXJzdERheU9mTW9udGggPSBhbmd1bGFyLmNvcHkoJHNjb3BlLmFjdGl2ZURhdGUpLmRhdGUoMSksXHJcbiAgICAgICAgbGFzdERheU9mTW9udGggPSBhbmd1bGFyLmNvcHkoZmlyc3REYXlPZk1vbnRoKS5lbmRPZignbW9udGgnKSxcclxuICAgICAgICBtYXhEYXlzID0gYW5ndWxhci5jb3B5KGxhc3REYXlPZk1vbnRoKS5kYXRlKCk7XHJcblxyXG4gICAgICAkc2NvcGUuZW1wdHlGaXJzdERheXMgPSBbXTtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAgZmlyc3REYXlPZk1vbnRoLmRheSgpOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgJHNjb3BlLmVtcHR5Rmlyc3REYXlzLnB1c2goe30pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG1heERheXM7IGorKykge1xyXG4gICAgICAgIHZhciBkYXRlID0gYW5ndWxhci5jb3B5KHByZXZpb3VzRGF5LmFkZCgxLCAnZGF5cycpKTtcclxuXHJcbiAgICAgICAgZGF0ZS5zZWxlY3RlZCA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRzY29wZS5zZWxlY3RlZC5tb2RlbCkgJiYgZGF0ZS5pc1NhbWUoJHNjb3BlLnNlbGVjdGVkLmRhdGUsICdkYXknKTtcclxuICAgICAgICBkYXRlLnRvZGF5ID0gZGF0ZS5pc1NhbWUobW9tZW50KCksICdkYXknKTtcclxuXHJcbiAgICAgICAgZGF5cy5wdXNoKGRhdGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUuZW1wdHlMYXN0RGF5cyA9IFtdO1xyXG5cclxuICAgICAgZm9yICh2YXIgayA9IDcgLSAobGFzdERheU9mTW9udGguZGF5KCkgPT09IDAgPyA3IDogbGFzdERheU9mTW9udGguZGF5KCkpOyBrID4gMDsgay0tKSB7XHJcbiAgICAgICAgJHNjb3BlLmVtcHR5TGFzdERheXMucHVzaCh7fSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5kYXlzID0gZGF5cztcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jbG9zZVBpY2tlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgJG1kRGlhbG9nLmhpZGUoJHNjb3BlLnNlbGVjdGVkKTtcclxuICAgIH07XHJcbiAgfV0pXHJcbi5jb250cm9sbGVyKCdtZGNEYXRlUGlja2VySW5wdXRDb250cm9sbGVyJywgZnVuY3Rpb24gKCRzY29wZSwgJGF0dHJzLCAkdGltZW91dCwgJGZpbHRlciwgJG1kRGlhbG9nKSB7XHJcbiAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoJHNjb3BlLm1vZGVsKSkge1xyXG4gICAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XHJcbiAgICAgICAgbW9kZWw6IG1vbWVudCgkc2NvcGUubW9kZWwpLFxyXG4gICAgICAgIGRhdGU6ICRzY29wZS5tb2RlbFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICRzY29wZS5zZWxlY3RlZCA9IHtcclxuICAgICAgICBtb2RlbDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKClcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIHZhciBkYXRhRGF0ZUZvcm1hdCA9ICdtZWRpdW1EYXRlJztcclxuICAgIGlmKGFuZ3VsYXIuaXNEZWZpbmVkKCRhdHRycy5kYXRhRGF0ZUZvcm1hdCkpIGRhdGFEYXRlRm9ybWF0ID0gJGF0dHJzLmRhdGFEYXRlRm9ybWF0O1xyXG5cclxuICAgICRzY29wZS5vcGVuUGlja2VyID0gZnVuY3Rpb24gKGV2KSB7XHJcbiAgICAgICRzY29wZS55ZWFyU2VsZWN0aW9uID0gZmFsc2U7XHJcblxyXG4gICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2LFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXItZGlhbG9nLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6ICdtZGNEYXRlUGlja2VyQ29udHJvbGxlcicsXHJcbiAgICAgICAgbG9jYWxzOiB7ZGF0ZTogJHNjb3BlLnNlbGVjdGVkLmRhdGUsIGxvY2FsZTogJGF0dHJzLmxvY2FsZSwgbWRUaGVtZTogJGF0dHJzLmRpYWxvZ01kVGhlbWV9XHJcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWQubW9kZWwgPSAkZmlsdGVyKCdkYXRlJykoc2VsZWN0ZWQuZGF0ZSwgZGF0YURhdGVGb3JtYXQpO1xyXG4gICAgICAgICAgJHNjb3BlLnNlbGVjdGVkLmRhdGUgPSBzZWxlY3RlZC5kYXRlO1xyXG4gICAgICAgICAgJHNjb3BlLm1vZGVsID0gc2VsZWN0ZWQubW9kZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgfSlcclxuLmRpcmVjdGl2ZSgnbWRjRGF0ZVBpY2tlcicsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3RyaWN0OiAnQUUnLFxyXG4gICAgICBjb250cm9sbGVyOiAnbWRjRGF0ZVBpY2tlcklucHV0Q29udHJvbGxlcicsXHJcbiAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgbW9kZWw6ICc9JyxcclxuICAgICAgICBsYWJlbDogJ0AnXHJcbiAgICAgIH0sXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAnZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXItaW5wdXQuaHRtbCdcclxuICAgIH07XHJcbiAgfSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCduZ01hdGVyaWFsLmNvbXBvbmVudHMnLCBbXHJcbiAgJ25nTWF0ZXJpYWwnLFxyXG4gICduZ01hdGVyaWFsLmNvbXBvbmVudHMudGVtcGxhdGVzJyxcclxuICAnbmdNYXRlcmlhbC5jb21wb25lbnRzLmRhdGVQaWNrZXInXHJcbl0pO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=