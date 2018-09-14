'use strict';

/* Controllers */
var pageControllers = angular.module('pageControllers', []);
//TODO

var ToDoCtrl = pageControllers.controller("ToDoCtrl", ['$scope', '$rootScope', '$http', 'ListService', 'DbService', 'DateService',
function($scope, $rootScope, $http, ListService, DbService, DateService) {
	if ($rootScope.todoList == undefined) {
		DbService.getAllTodos($scope, $rootScope);
	}
	if ($rootScope.todoCategoryList == undefined) {
		DbService.getAllTodoCategories($scope, $rootScope);
	}
	if ($rootScope.peopleList == undefined) {
		DbService.getAllPeople($scope, $rootScope);
	}
	if ($rootScope.tobuyList == undefined) {
		DbService.getAllTobuys($scope, $rootScope);
	}
	if ($rootScope.tobuyCategoryList == undefined) {
		DbService.getAllTobuyCategories($scope, $rootScope);
	}
	$rootScope.newTodoCount = ($rootScope.newTodoCount == undefined) ? 1 : $rootScope.newTodoCount;
	$scope.orderProp = 'name';
	$scope.reverse = false;

	$scope.removeToDo = function(id) {
		DbService.deleteTodoRecord(id);
		ListService.delete(id, $scope.todoList);
		var i
		var len = $scope.tobuyList.length;
		for ( i = len - 1; i >= 0; i--) {
			if ($rootScope.tobuyList[i].usedIn == id) {
				$rootScope.tobuyList.splice(i, 1);
			}
		}
	};
	$scope.showDays = function(days) {
		if (days > 0) {
			return true
		} else {
			return false;
		}
	}
	$scope.addToDo = function() {
		$scope.todoList.push({
			name : "New TODO " + $rootScope.newTodoCount,
			status : 'inprogress',
			creationDate : new Date()
		});
		$scope.orderProp = 'creationDate';
		DbService.createTodoRecord("New TODO " + $rootScope.newTodoCount, $scope.todoList);
		$rootScope.newTodoCount++;
	}
	$scope.getTodoCatColor = function(cat) {
		return ListService.getColor(cat, $rootScope.todoCategoryList);
	}
	$scope.getTodoStatus = function(todo) {
		todo.daysToGo = 0;
		if (todo.deadline != "" && todo.deadline != undefined) {
			if (todo.deadline.length < 21 && todo.status != "done") {
				todo.daysToGo = DateService.checkDaysToGo(todo.deadline);
				if (todo.daysToGo < 0) {
					todo.status = "expired";
				}
			}
		}
		return todo.status;
	}
	$scope.setListDirection = function(rev) {
		$scope.reverse = rev;
	}
}])

//TODO DETAILS
var ToDoDetailCtrl = pageControllers.controller("ToDoDetailCtrl", ['$scope', '$rootScope', '$http', '$routeParams', 'ListService', 'DbService', 'FeedbackService', 'FormStateService', '$location',
function($scope, $rootScope, $http, $routeParams, ListService, DbService, FeedbackService, FormStateService, $location) {
	$scope.curIndex = ListService.getIndex($routeParams.param, $rootScope.todoList);
	if ($scope.curIndex != undefined) {
		$scope.curTodo = $rootScope.todoList[$scope.curIndex];
	} else {
		$location.path('/todo');
	}
	if ($scope.curTodo && !$scope.curTodo.deadlineChecked && $scope.curTodo.deadline != "" && $scope.curTodo.daysToGo < 0) {
		alert("This TODO has expired!");
		$scope.curTodo.deadlineChecked = true;
	}
	$scope.todoTab = "general";
	$scope.changeTab = function(param) {
		if (FormStateService.isDirty) {
			FormStateService.saveFunction(FormStateService.objectToSave);
		}
		$scope.todoTab = param;

	}
	$('.nav li a').on('click', function() {
		$(this).parent().parent().find('.active').removeClass('active');
		$(this).parent().addClass('active').css('color', 'yellow');
	});
	$scope.$watch('todoForm.$dirty', function(v) {
		FormStateService.isDirty = v;
		FormStateService.objectToSave = $scope.curTodo;
		FormStateService.saveFunction = $scope.update;
	})
	$scope.update = function(todo) {
		var deadlineValue = $("#deadlineField").val();
		$scope.curTodo.deadline = deadlineValue;
		DbService.updateTodo({
			id : todo.id,
			name : todo.name,
			description : todo.description,
			criterion : todo.criterion,
			creationDate : todo.creationDate,
			deadline : deadlineValue,
			status : todo.status,
			category : todo.category
		}, FeedbackService.giveFeedback);
		$("#todo-feedback").text("saving...");
		FormStateService.isDirty = false;
	}
	//GENERAL
	$scope.minDate = new Date();
	$scope.dateOptions = {
		formatYear : 'yy',
		startingDay : 1
	};
	$scope.openDatePicker = function($event) {

		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};

	//PEOPLE
	if ($scope.curTodo && $scope.curTodo.people == undefined) {
		$scope.curTodo.people = [];
		DbService.getPeopleForTodo($scope.curTodo.id, $rootScope.peopleList, $scope);
	}
	$scope.peopleList = angular.copy($rootScope.peopleList);
	$scope.addToPeople = function() {
		var person = JSON.parse($scope.selectedPerson);
		$scope.curTodo.people.push(person);
		DbService.addPersonToTodo(person.id, $scope.curTodo.id);
		ListService.delete(person.name, $scope.peopleList);
	};
	$scope.removeFromPeople = function(person) {
		DbService.removePersonFromTodo(person.id, $scope.curTodo.id);
		ListService.delete(person.id, $scope.curTodo.people);
		$scope.peopleList.push(person);
	};
	//SHOPPINGLIST

	if ($scope.curTodo && $scope.curTodo.tobuyList == undefined) {
		$scope.curTodo.tobuyList = angular.bind($rootScope.tobuyList);
	}
	$rootScope.newItemCount = ($rootScope.newItemCount == undefined) ? 1 : $rootScope.newItemCount;
	$scope.addToShoppingList = function() {
		$rootScope.tobuyList.push({
			name : "New TOBUY " + $rootScope.newItemCount,
			status : "inprogress",
			usedIn : $scope.curTodo.id,
			creationDate : new Date(),
			price : 0,
			quantity : 1
		});
		DbService.createTobuyRecord("New TOBUY " + $rootScope.newItemCount, $scope.curTodo.id, $rootScope.tobuyList);
		$rootScope.newItemCount++;
	};
	$scope.removeFromShoppingList = function(item) {
		DbService.deleteTobuyRecord(item.id);
		ListService.delete(item.id, $rootScope.tobuyList);

	};
	$scope.getItemCatColor = function(cat) {
		return ListService.getColor(cat, $rootScope.tobuyCategoryList);
	}
	//SUBTASKS
	$rootScope.newSubTaskCount = ($rootScope.newSubTaskCount == undefined) ? 1 : $rootScope.newSubTaskCount;
	if ($scope.curTodo && $scope.curTodo.subTasks == undefined) {
		$scope.curTodo.subTasks = [];
		DbService.getSubTasks($scope.curTodo.id, $scope);
	}
	$scope.addToSubTasks = function() {
		DbService.createSubTaskRecord("New Subtask" + $rootScope.newSubTaskCount, $scope.curTodo.id, $scope.curTodo.subTasks)
		$scope.curTodo.subTasks.push({
			name : "New Subtask" + $rootScope.newSubTaskCount,
			status : "inprogress",
			parentTaskId : $scope.curTodo.id
		});
		$scope.newSubTaskCount++;
	};
	$scope.removeFromSubtasks = function(subTask) {
		DbService.deleteSubTaskRecord(subTask.id)
		ListService.delete(subTask.id, $scope.curTodo.subTasks);
	};
	$scope.editSubTask = function(subTask) {
		$scope.todoTab = "editSubTask";
		$scope.curSubTaskIndex = ListService.getIndex(subTask.id, $scope.curTodo.subTasks);
		$scope.curSubTask = $scope.curTodo.subTasks[$scope.curSubTaskIndex];
	}
	$scope.$watch('subTaskForm.$dirty', function(v) {
		FormStateService.isDirty = v;
		FormStateService.objectToSave = $scope.curSubTask;
		FormStateService.saveFunction = $scope.updateSubTask;
	})

	$scope.updateSubTask = function(subTask) {
		var deadlineValue = $("#subtask-deadlineField").val();
		$scope.curSubTask.deadline = subTask.deadline = deadlineValue;
		DbService.updateSubTask(subTask, FeedbackService.giveFeedback);
	}
	//RELATED
	if ($scope.relatedTodoList == undefined) {
		$rootScope.relatedTodoList = angular.copy($rootScope.todoList);
	}

	if ($scope.curTodo && $scope.curTodo.related == undefined) {
		$scope.curTodo.related = [];
		DbService.getRelatedTodos($scope.curTodo.id, $scope, $rootScope.relatedTodoList);
	}

	$scope.addToRelated = function() {
		var related = JSON.parse($scope.selectedRelated);
		$scope.curTodo.related.push(related);
		ListService.delete(related.id, $rootScope.relatedTodoList);
		DbService.createRelatedTodo($scope.curTodo.id, related.id);
	};
	$scope.removeFromRelated = function(todo) {
		DbService.removeRelatedTodo($scope.curTodo.id, todo.id);
		ListService.delete(todo.id, $scope.curTodo.related);
		$rootScope.relatedTodoList.push(todo);
	};
	$scope.getTodoCatColor = function(cat) {
		return ListService.getColor(cat, $rootScope.todoCategoryList);
	}
}])

var PeopleCtrl = pageControllers.controller("PeopleCtrl", ['$scope', '$rootScope', '$http', 'ListService', 'DbService',
function($scope, $rootScope, $http, ListService, DbService) {
	if ($rootScope.peopleList == undefined) {
		DbService.getAllPeople($scope, $rootScope);
	}
	$rootScope.newPersonCount = ($rootScope.newPersonCount == undefined) ? 1 : $rootScope.newPersonCount;
	$scope.orderProp = 'name';
	$scope.reverse = false;
	$scope.removePerson = function(id) {
		ListService.delete(id, $scope.peopleList);
		DbService.deletePersonRecord(id);
	};
	$scope.addPerson = function() {
		$scope.peopleList.push({
			name : "New Person " + $scope.newPersonCount
		});
		$scope.orderProp = 'creationDate';
		DbService.createPersonRecord("New Person " + $scope.newPersonCount, $scope.peopleList);
		$scope.newPersonCount++;
	}
	$scope.setListDirection = function(rev) {
		$scope.reverse = rev;
	}
}])

var PersonDetailCtrl = pageControllers.controller("PersonDetailCtrl", ['$scope', '$rootScope', '$routeParams', 'ListService', 'DbService', 'FeedbackService', 'FormStateService', '$location',
function($scope, $rootScope, $routeParams, ListService, DbService, FeedbackService, FormStateService, $location) {

	$scope.curIndex = ListService.getIndex($routeParams.param, $rootScope.peopleList);
	if ($scope.curIndex != undefined) {
		$scope.curPerson = $rootScope.peopleList[$scope.curIndex];
	} else {
		$location.path('/people');
	}
	$scope.$watch('personForm.$dirty', function(v) {
		FormStateService.isDirty = v;
		FormStateService.objectToSave = $scope.curPerson;
		FormStateService.saveFunction = $scope.update;
	})

	$scope.update = function(person) {
		DbService.updatePerson({
			id : person.id,
			name : person.name,
			function : person.function,
			phone : person.phone,
			email : person.email
		}, FeedbackService.giveFeedback);
		FormStateService.isDirty = false;
	}
}])

var TodoCategoriesCtrl = pageControllers.controller("TodoCategoriesCtrl", ['$scope', '$rootScope', '$http', 'ListService', 'DbService',
function($scope, $rootScope, $http, ListService, DbService) {
	if ($rootScope.todoCategoryList == undefined) {
		DbService.getAllTodoCategories($scope, $rootScope);
	}
	$scope.todoCategoryList = $rootScope.todoCategoryList;
	$rootScope.newCategoryCount = ($rootScope.newCategoryCount == undefined) ? 1 : $rootScope.newCategoryCount;
	$scope.orderProp = 'name';
	$scope.removeCategory = function(id) {
		ListService.delete(id, $scope.todoCategoryList);
		DbService.deleteTodoCatRecord(id);
	};
	$scope.addCategory = function() {
		$scope.todoCategoryList.push({
			name : "New Category " + $rootScope.newCategoryCount
		});

		DbService.createTodoCatRecord("New Category " + $rootScope.newCategoryCount, $scope.todoCategoryList);
		$rootScope.newCategoryCount++;
	}
}])

var TodoCategoryDetailCtrl = pageControllers.controller("TodoCategoryDetailCtrl", ['$scope', '$rootScope', '$routeParams', 'ListService', 'DbService', 'FeedbackService', 'FormStateService', '$location',
function($scope, $rootScope, $routeParams, ListService, DbService, FeedbackService, FormStateService, $location) {
	$scope.curIndex = ListService.getIndex($routeParams.param, $rootScope.todoCategoryList);
	if ($scope.curIndex != undefined) {
		$scope.curCategory = $rootScope.todoCategoryList[$scope.curIndex];
	} else {
		$location.path('/todo_categories');
	}
	$scope.$watch('tobuyCategoryForm.$dirty', function(v) {
		FormStateService.isDirty = v;
		FormStateService.objectToSave = $scope.curCategory;
		FormStateService.saveFunction = $scope.update;
	})

	$scope.update = function(todoCat) {
		DbService.updateTodoCat({
			id : todoCat.id,
			name : todoCat.name,
			color : todoCat.color
		}, FeedbackService.giveFeedback);
		FormStateService.isDirty = false;
	}
}])

var ToBuyCtrl = pageControllers.controller("ToBuyCtrl", ['$scope', '$rootScope', '$http', 'ListService', 'DbService', 'DateService',
function($scope, $rootScope, $http, ListService, DbService, DateService) {
	if ($rootScope.tobuyList == undefined) {
		DbService.getAllTobuys($scope, $rootScope);
	}
	if ($rootScope.tobuyCategoryList == undefined) {
		DbService.getAllTobuyCategories($scope, $rootScope);
	}
	$scope.newTobuyCount = 1;
	$rootScope.newTobuyCount = ($rootScope.newTobuyCount == undefined) ? 1 : $rootScope.newTobuyCount;
	$scope.orderProp = 'name';
	$scope.reverse = false;
	$scope.removeToBuy = function(id) {
		DbService.deleteTobuyRecord(id);
		ListService.delete(id, $scope.tobuyList);
	};
	$scope.addToBuy = function() {
		$scope.tobuyList.push({
			name : "New TOBUY " + $rootScope.newTobuyCount,
			status : 'inprogress',
			creationDate : new Date(),
			quantity : 1
		});
		DbService.createTobuyRecord("New TOBUY " + $rootScope.newTobuyCount, "", $scope.tobuyList);
		$rootScope.newTobuyCount++;
		$scope.orderProp = 'creationDate';
	}
	$scope.showDays = function(days) {
		if (days > 0) {
			return true
		} else {
			return false;
		}
	}
	$scope.getItemCatColor = function(cat) {
		return ListService.getColor(cat, $rootScope.tobuyCategoryList);
	}
	$scope.getTobuyStatus = function(tobuy) {
		tobuy.daysToGo = 0;
		if (tobuy.deadLine != "" && tobuy.deadLine != undefined) {
			if (tobuy.deadLine.length < 21 && tobuy.status != "done") {
				tobuy.daysToGo = DateService.checkDaysToGo(tobuy.deadLine);
				if (tobuy.daysToGo < 0) {
					tobuy.status = "expired";
				}
			}
		}
		return tobuy.status;
	}
	$scope.setListDirection = function(rev) {
		$scope.reverse = rev;
	}

	$scope.countTotalAmount = function() {
		$scope.totalAmount = 0;
		var buyListLen = $scope.tobuyList.length;

		for (var i = 0; i < buyListLen; i++) {
			var item = $scope.tobuyList[i];
			var totalPerItem = item.price * item.quantity;
			$scope.totalAmount += totalPerItem;
		}
	}
	//$scope.countTotalAmount();
}])

var ToBuyDetailCtrl = pageControllers.controller("ToBuyDetailCtrl", ['$scope', '$rootScope', '$http', '$routeParams', 'ListService', 'DbService', 'FeedbackService', 'FormStateService', '$location',
function($scope, $rootScope, $http, $routeParams, ListService, DbService, FeedbackService, FormStateService, $location) {
	if ($rootScope.todoList == undefined) {
		DbService.getAllTodos($scope, $rootScope);
	}
	$scope.curIndex = ListService.getIndex($routeParams.param, $rootScope.tobuyList);

	if ($scope.curIndex != undefined) {
		$scope.curTobuy = $rootScope.tobuyList[$scope.curIndex];
	} else {
		$location.path('/tobuy');
	}
	if ($scope.curTobuy && !$scope.curTobuy.deadlineChecked && $scope.curTobuy.deadLine != "" && $scope.curTobuy.daysToGo < 0) {
		alert("This TOBUY has expired!");
		$scope.curTobuy.deadlineChecked = true;
	}
	$scope.minDate = new Date();
	$scope.openDatePicker = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};
	$scope.dateOptions = {
		formatYear : 'yy',
		startingDay : 1
	};
	$scope.openDatePicker = function($event) {

		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;
	};
	$scope.$watch('tobuyForm.$dirty', function(v) {
		FormStateService.isDirty = v;
		FormStateService.objectToSave = $scope.curTobuy;
		FormStateService.saveFunction = $scope.update;
	})
	$scope.update = function(tobuy) {
		var deadlineValue = $("#deadlineField").val();
		$scope.curTobuy.deadline = deadlineValue;
		DbService.updateTobuy({
			id : tobuy.id,
			name : tobuy.name,
			price : tobuy.price,
			quantity : tobuy.quantity,
			creationDate : tobuy.creationDate,
			deadline : deadlineValue,
			status : tobuy.status,
			category : tobuy.category,
			supplier : tobuy.supplier,
			usedIn : tobuy.usedIn
		}, FeedbackService.giveFeedback);
		FormStateService.isDirty = false;
	}
	$scope.getName = function(id) {
		return ListService.getPropertyById(id, 'name', $rootScope.todoList);
	}
}])

var TobuyCategoriesCtrl = pageControllers.controller("TobuyCategoriesCtrl", ['$scope', '$rootScope', '$http', 'ListService', 'FeedbackService', 'DbService',
function($scope, $rootScope, $http, ListService, FeedbackService, DbService) {
	if ($rootScope.tobuyCategoryList == undefined) {
		DbService.getAllTobuyCategories($scope, $rootScope);
	}
	$scope.tobuyCategoryList = $rootScope.tobuyCategoryList;
	$scope.newCategoryCount = 1;
	$rootScope.newCategoryCount = ($rootScope.newCategoryCount == undefined) ? 1 : $rootScope.newCategoryCount;
	$scope.orderProp = 'name';
	$scope.removeCategory = function(id) {
		ListService.delete(id, $scope.tobuyCategoryList);
		DbService.deleteTobuyCatRecord(id);
	};
	$scope.addCategory = function() {
		$scope.tobuyCategoryList.push({
			name : "New Category " + $rootScope.newCategoryCount
		});
		$scope.orderProp = 'creationDate';
		DbService.createTobuyCatRecord("New Category " + $rootScope.newCategoryCount, $scope.tobuyCategoryList);
		$rootScope.newCategoryCount++;
	}
}])

var TobuyCategoryDetailCtrl = pageControllers.controller("TobuyCategoryDetailCtrl", ['$scope', '$rootScope', '$routeParams', 'ListService', 'DbService', 'FeedbackService', 'FormStateService', '$location',
function($scope, $rootScope, $routeParams, ListService, DbService, FeedbackService, FormStateService, $location) {
	$scope.curIndex = ListService.getIndex($routeParams.param, $rootScope.tobuyCategoryList);
	if ($scope.curIndex != undefined) {
		$scope.curCategory = $rootScope.tobuyCategoryList[$scope.curIndex];
	} else {
		$location.path('/tobuy_categories');
	}
	$scope.$watch('tobuyCategoryForm.$dirty', function(v) {
		FormStateService.isDirty = v;
		FormStateService.objectToSave = $scope.curCategory;
		FormStateService.saveFunction = $scope.update;
	})

	$scope.update = function(tobuyCat) {
		DbService.updateTobuyCat({
			id : tobuyCat.id,
			name : tobuyCat.name,
			color : tobuyCat.color
		}, FeedbackService.giveFeedback);
	}
}])

