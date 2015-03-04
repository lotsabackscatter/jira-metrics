'use strict';

// Declare app level module which depends on filters, and services

var angularModules = angular.module('myApp', [
  'ui.bootstrap',
  'ui.router',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'ngResource',
  'ngCookies',
  'nvd3',
  'RDash',
  'ngSanitize',
]);

var jiraHostName = 'https://resourceful.atlassian.net';
var confluenceHostName = 'https://resourceful.atlassian.net';
var mercurialHostName = 'https://resourceful.atlassian.net';

angularModules.value('config', {
	projects: ["'Resource'"],
  jiraHostName: jiraHostName,
  confluenceHostName: confluenceHostName,
  mercurialHostName: mercurialHostName,
  issueTypes: ['Bug', '"New Feature"', 'Improvement', 'Technical', 'Task'],
  completionTypes: ['Fixed', 'Completed']
});

angularModules.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
});