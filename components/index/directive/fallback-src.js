angular
    .module('myApp')
    .directive('fallbackSrc', fallbackSrc);

function fallbackSrc() {
    return {
    link: function (scope, element, attrs) {
      element.bind('error', function() {
        angular.element(this).attr("src", attrs.fallbackSrc);
      });
    }
   }
};