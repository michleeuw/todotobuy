'use strict';

/* App Module */

var planningApp = angular.module("planningApp", ['ngRoute', 'pageControllers', 'ui.bootstrap', 'colorpicker.module']);

//myApp.value('globalTodoList', { value: '' };

planningApp.config(['$routeProvider',
function($routeProvider) {
	$routeProvider.when('/todo', {
		templateUrl : 'parts/todo.html',
		controller : 'ToDoCtrl'
	}).when('/todos/:param', {
		templateUrl : 'parts/todo-details.html',
		controller : 'ToDoDetailCtrl'
	}).when('/people', {
		templateUrl : 'parts/people.html',
		controller : 'PeopleCtrl'
	}).when('/person/:param', {
		templateUrl : 'parts/person-details.html',
		controller : 'PersonDetailCtrl'
	}).when('/todo_categories', {
		templateUrl : 'parts/todo-categories.html',
		controller : 'TodoCategoriesCtrl'
	}).when('/todo-category/:param', {
		templateUrl : 'parts/todo-category-detail.html',
		controller : 'TodoCategoryDetailCtrl'
	}).when('/tobuy', {
		templateUrl : 'parts/tobuy.html',
		controller : 'ToBuyCtrl'
	}).when('/tobuys/:param', {
		templateUrl : 'parts/tobuy-details.html',
		controller : 'ToBuyDetailCtrl'
	}).when('/tobuy_categories', {
		templateUrl : 'parts/tobuy-categories.html',
		controller : 'TobuyCategoriesCtrl'
	}).when('/tobuy-category/:param', {
		templateUrl : 'parts/tobuy-category-detail.html',
		controller : 'TobuyCategoryDetailCtrl'
	}).otherwise({
		redirectTo : '/todo'
	});
}]);

planningApp.run(['$rootScope', '$location', 'FormStateService',function($rootScope, $location, FormStateService) {
	$rootScope.$on("$locationChangeStart", function(event, next, current) {
		if (FormStateService.isDirty) {			
			 FormStateService.saveFunction(FormStateService.objectToSave);		
		}
	});
}]);