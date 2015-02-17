(function(){angular.module("ngMaterial.components.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("date-picker/date-picker-dialog.html","<md-dialog class=\"mdc-date-picker\">\n    <!-- Date picker -->\n    <div md-theme=\"{{mdTheme}}\">\n      <!-- Current day of week -->\n      <md-toolbar class=\"md-hue-2 mdc-date-picker__current-day-of-week\">\n        <span>{{ moment(selected.date).format(\'dddd\') }}</span>\n      </md-toolbar>\n\n      <!-- Current date -->\n      <md-toolbar class=\"mdc-date-picker__current-date\">\n        <span>{{ moment(selected.date).format(\'MMM\') }}</span>\n        <strong>{{ moment(selected.date).format(\'DD\') }}</strong>\n        <a ng-click=\"displayYearSelection()\">{{ moment(selected.date).format(\'YYYY\') }}</a>\n      </md-toolbar>\n\n      <!-- Calendar -->\n      <div class=\"mdc-date-picker__calendar\" ng-if=\"!yearSelection\">\n        <div class=\"mdc-date-picker__nav\">\n          <md-button class=\"md-fab md-primary\" ng-click=\"previousMonth()\">\n            <i class=\"mdi mdi-chevron-left\"></i>\n          </md-button>\n\n          <span>{{ activeDate.format(\'MMMM YYYY\') }}</span>\n\n          <md-button class=\"md-fab md-primary\" ng-click=\"nextMonth()\">\n            <i class=\"mdi mdi-chevron-right\"></i>\n          </md-button>\n        </div>\n\n        <div class=\"mdc-date-picker__days-of-week\">\n          <span ng-repeat=\"day in daysOfWeek\">{{ day }}</span>\n        </div>\n\n        <div class=\"mdc-date-picker__days\">\n                    <span class=\"mdc-date-picker__day mdc-date-picker__day--is-empty\"\n                          ng-repeat=\"x in emptyFirstDays\">&nbsp;</span><!--\n\n                 --><div class=\"mdc-date-picker__day\"\n                         ng-class=\"{ \'mdc-date-picker__day--is-selected\': day.selected,\n                                     \'mdc-date-picker__day--is-today\': day.today }\"\n                         ng-repeat=\"day in days\">\n          <a ng-click=\"select(day)\">{{ day ? day.format(\'D\') : \'\' }}</a>\n        </div><!--\n\n                 --><span class=\"mdc-date-picker__day mdc-date-picker__day--is-empty\"\n                          ng-repeat=\"x in emptyLastDays\">&nbsp;</span>\n        </div>\n      </div>\n\n      <!-- Year selection -->\n      <div class=\"mdc-date-picker__year-selector\" ng-show=\"yearSelection\">\n        <a class=\"mdc-date-picker__year\"\n           ng-class=\"{ \'mdc-date-picker__year--is-active\': year == activeDate.format(\'YYYY\') }\"\n           ng-repeat=\"year in years\"\n           ng-click=\"selectYear(year)\"\n           ng-if=\"yearSelection\">\n          <span>{{year}}</span>\n        </a>\n      </div>\n\n      <!-- Actions -->\n      <div class=\"md-actions mdc-date-picker__actions\" layout=\"row\" layout-align=\"end\">\n        <md-button class=\"md-primary\" ng-click=\"cancel()\">Cancel</md-button>\n        <md-button class=\"md-primary\" ng-click=\"closePicker()\">Ok</md-button>\n      </div>\n    </div>\n</md-dialog>\n");
$templateCache.put("date-picker/date-picker-input.html","<md-input-container ng-click=\"openPicker($event)\">\n  <label>{{label}}</label>\n  <input type=\"text\" ng-model=\"selected.model\" ng-disabled=\"true\" ng-click=\"openPicker($event)\">\n</md-input-container>\n");}]);})();
(function(){/* global angular */
/* global moment */
/* global navigator */
'use strict'; // jshint ignore:line


angular.module('ngMaterial.components.datePicker', ['ngMaterial'])
.controller('mdcDatePickerController', function ($scope, $timeout, $mdDialog, $document, model, locale, mdTheme) {
    function checkLocale(locale) {
      if (!locale) {
        return (navigator.language !== null ? navigator.language : navigator.browserLanguage).split('_')[0].split('-')[0] || 'en';
      }
      return locale;
    }

    $scope.model = model;
    $scope.mdTheme = mdTheme ? mdTheme : 'default';

    var activeLocale;

    this.build = function (locale) {
      activeLocale = locale;

      moment.locale(activeLocale);

      if (angular.isDefined($scope.model)) {
        $scope.selected = {
          model: moment($scope.model).format('LL'),
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
      $scope.daysOfWeek = [moment.weekdaysMin(1), moment.weekdaysMin(2), moment.weekdaysMin(3), moment.weekdaysMin(4), moment.weekdaysMin(5), moment.weekdaysMin(6), moment.weekdaysMin(0)];

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
        model: day.format('LL'),
        date: day.toDate()
      };

      $scope.model = day.toDate();

      generateCalendar();
    };

    $scope.selectYear = function (year) {
      $scope.yearSelection = false;

      $scope.selected.model = moment($scope.selected.date).year(year).format('LL');
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

      for (var i = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1; i > 0; i--) {
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
  })
.controller('mdcDatePickerInputController', function ($scope, $attrs, $timeout, $mdDialog) {
    if (angular.isDefined($scope.model)) {
      $scope.selected = {
        model: moment($scope.model).format('LL'),
        date: $scope.model
      };
    }
    else {
      $scope.selected = {
        model: undefined,
        date: new Date()
      };
    }

    $scope.openPicker = function (ev) {
      $scope.yearSelection = false;

      $mdDialog.show({
        targetEvent: ev,
        templateUrl: 'date-picker/date-picker-dialog.html',
        controller: 'mdcDatePickerController',
        locals: {model: $scope.model, locale: $attrs.locale, mdTheme: $attrs.dialogMdTheme}
      }).then(function (selected) {
        if (selected) {
          $scope.selected = selected;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi50bXAvdGVtcGxhdGVzL3RlbXBsYXRlcy5qcyIsInNyYy9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci5qcyIsInNyYy9jb21wb25lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhbmd1bGFyLW1hdGVyaWFsLWNvbXBvbmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZShcIm5nTWF0ZXJpYWwuY29tcG9uZW50cy50ZW1wbGF0ZXNcIiwgW10pLnJ1bihbXCIkdGVtcGxhdGVDYWNoZVwiLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkgeyR0ZW1wbGF0ZUNhY2hlLnB1dChcImRhdGUtcGlja2VyL2RhdGUtcGlja2VyLWRpYWxvZy5odG1sXCIsXCI8bWQtZGlhbG9nIGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJcXFwiPlxcbiAgICA8IS0tIERhdGUgcGlja2VyIC0tPlxcbiAgICA8ZGl2IG1kLXRoZW1lPVxcXCJ7e21kVGhlbWV9fVxcXCI+XFxuICAgICAgPCEtLSBDdXJyZW50IGRheSBvZiB3ZWVrIC0tPlxcbiAgICAgIDxtZC10b29sYmFyIGNsYXNzPVxcXCJtZC1odWUtMiBtZGMtZGF0ZS1waWNrZXJfX2N1cnJlbnQtZGF5LW9mLXdlZWtcXFwiPlxcbiAgICAgICAgPHNwYW4+e3sgbW9tZW50KHNlbGVjdGVkLmRhdGUpLmZvcm1hdChcXCdkZGRkXFwnKSB9fTwvc3Bhbj5cXG4gICAgICA8L21kLXRvb2xiYXI+XFxuXFxuICAgICAgPCEtLSBDdXJyZW50IGRhdGUgLS0+XFxuICAgICAgPG1kLXRvb2xiYXIgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fY3VycmVudC1kYXRlXFxcIj5cXG4gICAgICAgIDxzcGFuPnt7IG1vbWVudChzZWxlY3RlZC5kYXRlKS5mb3JtYXQoXFwnTU1NXFwnKSB9fTwvc3Bhbj5cXG4gICAgICAgIDxzdHJvbmc+e3sgbW9tZW50KHNlbGVjdGVkLmRhdGUpLmZvcm1hdChcXCdERFxcJykgfX08L3N0cm9uZz5cXG4gICAgICAgIDxhIG5nLWNsaWNrPVxcXCJkaXNwbGF5WWVhclNlbGVjdGlvbigpXFxcIj57eyBtb21lbnQoc2VsZWN0ZWQuZGF0ZSkuZm9ybWF0KFxcJ1lZWVlcXCcpIH19PC9hPlxcbiAgICAgIDwvbWQtdG9vbGJhcj5cXG5cXG4gICAgICA8IS0tIENhbGVuZGFyIC0tPlxcbiAgICAgIDxkaXYgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fY2FsZW5kYXJcXFwiIG5nLWlmPVxcXCIheWVhclNlbGVjdGlvblxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX25hdlxcXCI+XFxuICAgICAgICAgIDxtZC1idXR0b24gY2xhc3M9XFxcIm1kLWZhYiBtZC1wcmltYXJ5XFxcIiBuZy1jbGljaz1cXFwicHJldmlvdXNNb250aCgpXFxcIj5cXG4gICAgICAgICAgICA8aSBjbGFzcz1cXFwibWRpIG1kaS1jaGV2cm9uLWxlZnRcXFwiPjwvaT5cXG4gICAgICAgICAgPC9tZC1idXR0b24+XFxuXFxuICAgICAgICAgIDxzcGFuPnt7IGFjdGl2ZURhdGUuZm9ybWF0KFxcJ01NTU0gWVlZWVxcJykgfX08L3NwYW4+XFxuXFxuICAgICAgICAgIDxtZC1idXR0b24gY2xhc3M9XFxcIm1kLWZhYiBtZC1wcmltYXJ5XFxcIiBuZy1jbGljaz1cXFwibmV4dE1vbnRoKClcXFwiPlxcbiAgICAgICAgICAgIDxpIGNsYXNzPVxcXCJtZGkgbWRpLWNoZXZyb24tcmlnaHRcXFwiPjwvaT5cXG4gICAgICAgICAgPC9tZC1idXR0b24+XFxuICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fZGF5cy1vZi13ZWVrXFxcIj5cXG4gICAgICAgICAgPHNwYW4gbmctcmVwZWF0PVxcXCJkYXkgaW4gZGF5c09mV2Vla1xcXCI+e3sgZGF5IH19PC9zcGFuPlxcbiAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2RheXNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fZGF5IG1kYy1kYXRlLXBpY2tlcl9fZGF5LS1pcy1lbXB0eVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5nLXJlcGVhdD1cXFwieCBpbiBlbXB0eUZpcnN0RGF5c1xcXCI+Jm5ic3A7PC9zcGFuPjwhLS1cXG5cXG4gICAgICAgICAgICAgICAgIC0tPjxkaXYgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9fZGF5XFxcIlxcbiAgICAgICAgICAgICAgICAgICAgICAgICBuZy1jbGFzcz1cXFwieyBcXCdtZGMtZGF0ZS1waWNrZXJfX2RheS0taXMtc2VsZWN0ZWRcXCc6IGRheS5zZWxlY3RlZCxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFwnbWRjLWRhdGUtcGlja2VyX19kYXktLWlzLXRvZGF5XFwnOiBkYXkudG9kYXkgfVxcXCJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgbmctcmVwZWF0PVxcXCJkYXkgaW4gZGF5c1xcXCI+XFxuICAgICAgICAgIDxhIG5nLWNsaWNrPVxcXCJzZWxlY3QoZGF5KVxcXCI+e3sgZGF5ID8gZGF5LmZvcm1hdChcXCdEXFwnKSA6IFxcJ1xcJyB9fTwvYT5cXG4gICAgICAgIDwvZGl2PjwhLS1cXG5cXG4gICAgICAgICAgICAgICAgIC0tPjxzcGFuIGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX2RheSBtZGMtZGF0ZS1waWNrZXJfX2RheS0taXMtZW1wdHlcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XFxcInggaW4gZW1wdHlMYXN0RGF5c1xcXCI+Jm5ic3A7PC9zcGFuPlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgPC9kaXY+XFxuXFxuICAgICAgPCEtLSBZZWFyIHNlbGVjdGlvbiAtLT5cXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJtZGMtZGF0ZS1waWNrZXJfX3llYXItc2VsZWN0b3JcXFwiIG5nLXNob3c9XFxcInllYXJTZWxlY3Rpb25cXFwiPlxcbiAgICAgICAgPGEgY2xhc3M9XFxcIm1kYy1kYXRlLXBpY2tlcl9feWVhclxcXCJcXG4gICAgICAgICAgIG5nLWNsYXNzPVxcXCJ7IFxcJ21kYy1kYXRlLXBpY2tlcl9feWVhci0taXMtYWN0aXZlXFwnOiB5ZWFyID09IGFjdGl2ZURhdGUuZm9ybWF0KFxcJ1lZWVlcXCcpIH1cXFwiXFxuICAgICAgICAgICBuZy1yZXBlYXQ9XFxcInllYXIgaW4geWVhcnNcXFwiXFxuICAgICAgICAgICBuZy1jbGljaz1cXFwic2VsZWN0WWVhcih5ZWFyKVxcXCJcXG4gICAgICAgICAgIG5nLWlmPVxcXCJ5ZWFyU2VsZWN0aW9uXFxcIj5cXG4gICAgICAgICAgPHNwYW4+e3t5ZWFyfX08L3NwYW4+XFxuICAgICAgICA8L2E+XFxuICAgICAgPC9kaXY+XFxuXFxuICAgICAgPCEtLSBBY3Rpb25zIC0tPlxcbiAgICAgIDxkaXYgY2xhc3M9XFxcIm1kLWFjdGlvbnMgbWRjLWRhdGUtcGlja2VyX19hY3Rpb25zXFxcIiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJlbmRcXFwiPlxcbiAgICAgICAgPG1kLWJ1dHRvbiBjbGFzcz1cXFwibWQtcHJpbWFyeVxcXCIgbmctY2xpY2s9XFxcImNhbmNlbCgpXFxcIj5DYW5jZWw8L21kLWJ1dHRvbj5cXG4gICAgICAgIDxtZC1idXR0b24gY2xhc3M9XFxcIm1kLXByaW1hcnlcXFwiIG5nLWNsaWNrPVxcXCJjbG9zZVBpY2tlcigpXFxcIj5PazwvbWQtYnV0dG9uPlxcbiAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L21kLWRpYWxvZz5cXG5cIik7XG4kdGVtcGxhdGVDYWNoZS5wdXQoXCJkYXRlLXBpY2tlci9kYXRlLXBpY2tlci1pbnB1dC5odG1sXCIsXCI8bWQtaW5wdXQtY29udGFpbmVyIG5nLWNsaWNrPVxcXCJvcGVuUGlja2VyKCRldmVudClcXFwiPlxcbiAgPGxhYmVsPnt7bGFiZWx9fTwvbGFiZWw+XFxuICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9XFxcInNlbGVjdGVkLm1vZGVsXFxcIiBuZy1kaXNhYmxlZD1cXFwidHJ1ZVxcXCIgbmctY2xpY2s9XFxcIm9wZW5QaWNrZXIoJGV2ZW50KVxcXCI+XFxuPC9tZC1pbnB1dC1jb250YWluZXI+XFxuXCIpO31dKTsiLCIvKiBnbG9iYWwgYW5ndWxhciAqL1xuLyogZ2xvYmFsIG1vbWVudCAqL1xuLyogZ2xvYmFsIG5hdmlnYXRvciAqL1xuJ3VzZSBzdHJpY3QnOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuXG5hbmd1bGFyLm1vZHVsZSgnbmdNYXRlcmlhbC5jb21wb25lbnRzLmRhdGVQaWNrZXInLCBbJ25nTWF0ZXJpYWwnXSlcbi5jb250cm9sbGVyKCdtZGNEYXRlUGlja2VyQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICR0aW1lb3V0LCAkbWREaWFsb2csICRkb2N1bWVudCwgbW9kZWwsIGxvY2FsZSwgbWRUaGVtZSkge1xuICAgIGZ1bmN0aW9uIGNoZWNrTG9jYWxlKGxvY2FsZSkge1xuICAgICAgaWYgKCFsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIChuYXZpZ2F0b3IubGFuZ3VhZ2UgIT09IG51bGwgPyBuYXZpZ2F0b3IubGFuZ3VhZ2UgOiBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlKS5zcGxpdCgnXycpWzBdLnNwbGl0KCctJylbMF0gfHwgJ2VuJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgfVxuXG4gICAgJHNjb3BlLm1vZGVsID0gbW9kZWw7XG4gICAgJHNjb3BlLm1kVGhlbWUgPSBtZFRoZW1lID8gbWRUaGVtZSA6ICdkZWZhdWx0JztcblxuICAgIHZhciBhY3RpdmVMb2NhbGU7XG5cbiAgICB0aGlzLmJ1aWxkID0gZnVuY3Rpb24gKGxvY2FsZSkge1xuICAgICAgYWN0aXZlTG9jYWxlID0gbG9jYWxlO1xuXG4gICAgICBtb21lbnQubG9jYWxlKGFjdGl2ZUxvY2FsZSk7XG5cbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCgkc2NvcGUubW9kZWwpKSB7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZCA9IHtcbiAgICAgICAgICBtb2RlbDogbW9tZW50KCRzY29wZS5tb2RlbCkuZm9ybWF0KCdMTCcpLFxuICAgICAgICAgIGRhdGU6ICRzY29wZS5tb2RlbFxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gbW9tZW50KCRzY29wZS5tb2RlbCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkID0ge1xuICAgICAgICAgIG1vZGVsOiB1bmRlZmluZWQsXG4gICAgICAgICAgZGF0ZTogbmV3IERhdGUoKVxuICAgICAgICB9O1xuXG4gICAgICAgICRzY29wZS5hY3RpdmVEYXRlID0gbW9tZW50KCk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5tb21lbnQgPSBtb21lbnQ7XG5cbiAgICAgICRzY29wZS5kYXlzID0gW107XG4gICAgICAvL1RPRE86IFVzZSBtb21lbnQgbG9jYWxlIHRvIHNldCBmaXJzdCBkYXkgb2Ygd2VlayBwcm9wZXJseS5cbiAgICAgICRzY29wZS5kYXlzT2ZXZWVrID0gW21vbWVudC53ZWVrZGF5c01pbigxKSwgbW9tZW50LndlZWtkYXlzTWluKDIpLCBtb21lbnQud2Vla2RheXNNaW4oMyksIG1vbWVudC53ZWVrZGF5c01pbig0KSwgbW9tZW50LndlZWtkYXlzTWluKDUpLCBtb21lbnQud2Vla2RheXNNaW4oNiksIG1vbWVudC53ZWVrZGF5c01pbigwKV07XG5cbiAgICAgICRzY29wZS55ZWFycyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciB5ID0gbW9tZW50KCkueWVhcigpIC0gMTAwOyB5IDw9IG1vbWVudCgpLnllYXIoKSArIDEwMDsgeSsrKSB7XG4gICAgICAgICRzY29wZS55ZWFycy5wdXNoKHkpO1xuICAgICAgfVxuXG4gICAgICBnZW5lcmF0ZUNhbGVuZGFyKCk7XG4gICAgfTtcbiAgICB0aGlzLmJ1aWxkKGNoZWNrTG9jYWxlKGxvY2FsZSkpO1xuXG4gICAgJHNjb3BlLnByZXZpb3VzTW9udGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUuYWN0aXZlRGF0ZSA9ICRzY29wZS5hY3RpdmVEYXRlLnN1YnRyYWN0KDEsICdtb250aCcpO1xuICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xuICAgIH07XG5cbiAgICAkc2NvcGUubmV4dE1vbnRoID0gZnVuY3Rpb24gKCkge1xuICAgICAgJHNjb3BlLmFjdGl2ZURhdGUgPSAkc2NvcGUuYWN0aXZlRGF0ZS5hZGQoMSwgJ21vbnRoJyk7XG4gICAgICBnZW5lcmF0ZUNhbGVuZGFyKCk7XG4gICAgfTtcblxuICAgICRzY29wZS5zZWxlY3QgPSBmdW5jdGlvbiAoZGF5KSB7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XG4gICAgICAgIG1vZGVsOiBkYXkuZm9ybWF0KCdMTCcpLFxuICAgICAgICBkYXRlOiBkYXkudG9EYXRlKClcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5tb2RlbCA9IGRheS50b0RhdGUoKTtcblxuICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2VsZWN0WWVhciA9IGZ1bmN0aW9uICh5ZWFyKSB7XG4gICAgICAkc2NvcGUueWVhclNlbGVjdGlvbiA9IGZhbHNlO1xuXG4gICAgICAkc2NvcGUuc2VsZWN0ZWQubW9kZWwgPSBtb21lbnQoJHNjb3BlLnNlbGVjdGVkLmRhdGUpLnllYXIoeWVhcikuZm9ybWF0KCdMTCcpO1xuICAgICAgJHNjb3BlLnNlbGVjdGVkLmRhdGUgPSBtb21lbnQoJHNjb3BlLnNlbGVjdGVkLmRhdGUpLnllYXIoeWVhcikudG9EYXRlKCk7XG4gICAgICAkc2NvcGUubW9kZWwgPSBtb21lbnQoJHNjb3BlLnNlbGVjdGVkLmRhdGUpLnRvRGF0ZSgpO1xuICAgICAgJHNjb3BlLmFjdGl2ZURhdGUgPSAkc2NvcGUuYWN0aXZlRGF0ZS5hZGQoeWVhciAtICRzY29wZS5hY3RpdmVEYXRlLnllYXIoKSwgJ3llYXInKTtcblxuICAgICAgZ2VuZXJhdGVDYWxlbmRhcigpO1xuICAgIH07XG4gICAgJHNjb3BlLmRpc3BsYXlZZWFyU2VsZWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNhbGVuZGFySGVpZ2h0ID0gJGRvY3VtZW50WzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21kYy1kYXRlLXBpY2tlcl9fY2FsZW5kYXInKVswXS5vZmZzZXRIZWlnaHQ7XG4gICAgICB2YXIgeWVhclNlbGVjdG9yRWxlbWVudCA9ICRkb2N1bWVudFswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZGMtZGF0ZS1waWNrZXJfX3llYXItc2VsZWN0b3InKVswXTtcbiAgICAgIHllYXJTZWxlY3RvckVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gY2FsZW5kYXJIZWlnaHQgKyAncHgnO1xuXG4gICAgICAkc2NvcGUueWVhclNlbGVjdGlvbiA9IHRydWU7XG5cbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFjdGl2ZVllYXJFbGVtZW50ID0gJGRvY3VtZW50WzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21kYy1kYXRlLXBpY2tlcl9feWVhci0taXMtYWN0aXZlJylbMF07XG4gICAgICAgIHllYXJTZWxlY3RvckVsZW1lbnQuc2Nyb2xsVG9wID0geWVhclNlbGVjdG9yRWxlbWVudC5zY3JvbGxUb3AgKyBhY3RpdmVZZWFyRWxlbWVudC5vZmZzZXRUb3AgLSB5ZWFyU2VsZWN0b3JFbGVtZW50Lm9mZnNldEhlaWdodCAvIDIgKyBhY3RpdmVZZWFyRWxlbWVudC5vZmZzZXRIZWlnaHQgLyAyO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlQ2FsZW5kYXIoKSB7XG4gICAgICB2YXIgZGF5cyA9IFtdLFxuICAgICAgICBwcmV2aW91c0RheSA9IGFuZ3VsYXIuY29weSgkc2NvcGUuYWN0aXZlRGF0ZSkuZGF0ZSgwKSxcbiAgICAgICAgZmlyc3REYXlPZk1vbnRoID0gYW5ndWxhci5jb3B5KCRzY29wZS5hY3RpdmVEYXRlKS5kYXRlKDEpLFxuICAgICAgICBsYXN0RGF5T2ZNb250aCA9IGFuZ3VsYXIuY29weShmaXJzdERheU9mTW9udGgpLmVuZE9mKCdtb250aCcpLFxuICAgICAgICBtYXhEYXlzID0gYW5ndWxhci5jb3B5KGxhc3REYXlPZk1vbnRoKS5kYXRlKCk7XG5cbiAgICAgICRzY29wZS5lbXB0eUZpcnN0RGF5cyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gZmlyc3REYXlPZk1vbnRoLmRheSgpID09PSAwID8gNiA6IGZpcnN0RGF5T2ZNb250aC5kYXkoKSAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgJHNjb3BlLmVtcHR5Rmlyc3REYXlzLnB1c2goe30pO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG1heERheXM7IGorKykge1xuICAgICAgICB2YXIgZGF0ZSA9IGFuZ3VsYXIuY29weShwcmV2aW91c0RheS5hZGQoMSwgJ2RheXMnKSk7XG5cbiAgICAgICAgZGF0ZS5zZWxlY3RlZCA9IGFuZ3VsYXIuaXNEZWZpbmVkKCRzY29wZS5zZWxlY3RlZC5tb2RlbCkgJiYgZGF0ZS5pc1NhbWUoJHNjb3BlLnNlbGVjdGVkLmRhdGUsICdkYXknKTtcbiAgICAgICAgZGF0ZS50b2RheSA9IGRhdGUuaXNTYW1lKG1vbWVudCgpLCAnZGF5Jyk7XG5cbiAgICAgICAgZGF5cy5wdXNoKGRhdGUpO1xuICAgICAgfVxuXG4gICAgICAkc2NvcGUuZW1wdHlMYXN0RGF5cyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBrID0gNyAtIChsYXN0RGF5T2ZNb250aC5kYXkoKSA9PT0gMCA/IDcgOiBsYXN0RGF5T2ZNb250aC5kYXkoKSk7IGsgPiAwOyBrLS0pIHtcbiAgICAgICAgJHNjb3BlLmVtcHR5TGFzdERheXMucHVzaCh7fSk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS5kYXlzID0gZGF5cztcbiAgICB9XG5cbiAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbWREaWFsb2cuaGlkZSgpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2xvc2VQaWNrZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkbWREaWFsb2cuaGlkZSgkc2NvcGUuc2VsZWN0ZWQpO1xuICAgIH07XG4gIH0pXG4uY29udHJvbGxlcignbWRjRGF0ZVBpY2tlcklucHV0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRhdHRycywgJHRpbWVvdXQsICRtZERpYWxvZykge1xuICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCgkc2NvcGUubW9kZWwpKSB7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XG4gICAgICAgIG1vZGVsOiBtb21lbnQoJHNjb3BlLm1vZGVsKS5mb3JtYXQoJ0xMJyksXG4gICAgICAgIGRhdGU6ICRzY29wZS5tb2RlbFxuICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XG4gICAgICAgIG1vZGVsOiB1bmRlZmluZWQsXG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKClcbiAgICAgIH07XG4gICAgfVxuXG4gICAgJHNjb3BlLm9wZW5QaWNrZXIgPSBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICRzY29wZS55ZWFyU2VsZWN0aW9uID0gZmFsc2U7XG5cbiAgICAgICRtZERpYWxvZy5zaG93KHtcbiAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLWRpYWxvZy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ21kY0RhdGVQaWNrZXJDb250cm9sbGVyJyxcbiAgICAgICAgbG9jYWxzOiB7bW9kZWw6ICRzY29wZS5tb2RlbCwgbG9jYWxlOiAkYXR0cnMubG9jYWxlLCBtZFRoZW1lOiAkYXR0cnMuZGlhbG9nTWRUaGVtZX1cbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHNlbGVjdGVkKSB7XG4gICAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICAgICRzY29wZS5zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgICAgICAgICRzY29wZS5tb2RlbCA9IHNlbGVjdGVkLm1vZGVsO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9KVxuLmRpcmVjdGl2ZSgnbWRjRGF0ZVBpY2tlcicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBRScsXG4gICAgICBjb250cm9sbGVyOiAnbWRjRGF0ZVBpY2tlcklucHV0Q29udHJvbGxlcicsXG4gICAgICBzY29wZToge1xuICAgICAgICBtb2RlbDogJz0nLFxuICAgICAgICBsYWJlbDogJ0AnXG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVVcmw6ICdkYXRlLXBpY2tlci9kYXRlLXBpY2tlci1pbnB1dC5odG1sJ1xuICAgIH07XG4gIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnbmdNYXRlcmlhbC5jb21wb25lbnRzJywgW1xuICAnbmdNYXRlcmlhbCcsXG4gICduZ01hdGVyaWFsLmNvbXBvbmVudHMudGVtcGxhdGVzJyxcbiAgJ25nTWF0ZXJpYWwuY29tcG9uZW50cy5kYXRlUGlja2VyJ1xuXSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=