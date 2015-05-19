/**
 * Widget Directive
 */

angular
    .module('myApp')
    .directive('agileboard', agileboard);

function agileboard() {
    var directive = {
        scope: {
            component: '='
        },
        transclude: true,
        templateUrl: '/partials/agileboard/agileboard',
        restrict: 'EA',
        controller: function($scope, JIRA, config, $interval, $filter) {
          $scope.config = config;
          $scope.loading = true;

          $scope.dropTarget = null;

          $scope.sortableOptions = {
            placeholder: "jira",
            connectWith: ".jira-container",
            tolerance: 'pointer',
            items: 'li',
            revert: 50,
            stop: function(e, ui) {
              var column = $scope.dropTarget.column;
              var item = ui.item.sortable.moved;
              var fromIndex = ui.item.sortable.index;
              var toIndex = ui.item.sortable.dropindex;
              if(item) {
                console.log("Moved " + item.key + " to " + column.name + "(Transition: " + column.defaultTransition + ")");
                if(column.defaultTransition) {
                  JIRA.transition.save({ key: item.key, transitionId: column.defaultTransition }, {});
                } else {
                  console.log('No default transition for ' + column.name);
                }
              }
            }
          };

          function runAndSchedule(task) {
            task();
            var retrieverInterval = $interval(task, config.updateTimeInMins * 60 * 1000);

            $scope.$on('$destroy', function() {
              // Make sure that the interval is destroyed too
              if (angular.isDefined(retrieverInterval)) {
                $interval.cancel(retrieverInterval);
                retrieverInterval = undefined;
              }
            });
          };

          function getJiras(component) {
            console.log("Refreshing Agile board: " + component);

            JIRA.currentSprint(component).get(function(jiras) {

              $scope.jiras = {};
              _.each(config.agileColumns, function(column) {
                var columnJiras = $filter('statusIn')(jiras.issues, column.statuses);
                columnJiras = $filter('orderBy')(columnJiras, 'fields.updated', true);
                columnJiras.column = column;
                $scope.jiras[column.name] = columnJiras;

               $scope.$watchCollection('jiras["' + column.name + '"]', function() {
                 $scope.dropTarget = $scope.jiras[column.name];
               });
              });

              $scope.loading = false;
            });
          }

          runAndSchedule(function () {
            getJiras($scope.component);
          });
        }
    };

    return directive;
};