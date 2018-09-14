'use strict';

angular.module('todoAnimations', ['ngAnimate']);
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
'use strict';

angular.module('colorpicker.module', [])
  .factory('helper', function () {
    return {
      closest: function (elem, selector) {
        var matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
        while (elem) {
          if (matchesSelector.bind(elem)(selector)) {
            return elem;
          } else {
            elem = elem.parentNode;
          }
        }
        return false;
      },
      getOffset: function (elem) {
        var
          x = 0,
          y = 0;
        while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
          x += elem.offsetLeft;
          y += elem.offsetTop;
          elem = elem.offsetParent;
        }
        return {
          top: y,
          left: x
        };
      },
      extend: function () {
        for (var i = 1; i < arguments.length; i++) {
          for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
              arguments[0][key] = arguments[i][key];
            }
          }
        }
        return arguments[0];
      },
      // a set of RE's that can match strings and generate color tuples. https://github.com/jquery/jquery-color/
      stringParsers: [
        {
          re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
          parse: function (execResult) {
            return [
              execResult[1],
              execResult[2],
              execResult[3],
              execResult[4]
            ];
          }
        },
        {
          re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
          parse: function (execResult) {
            return [
              2.55 * execResult[1],
              2.55 * execResult[2],
              2.55 * execResult[3],
              execResult[4]
            ];
          }
        },
        {
          re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
          parse: function (execResult) {
            return [
              parseInt(execResult[1], 16),
              parseInt(execResult[2], 16),
              parseInt(execResult[3], 16)
            ];
          }
        },
        {
          re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
          parse: function (execResult) {
            return [
              parseInt(execResult[1] + execResult[1], 16),
              parseInt(execResult[2] + execResult[2], 16),
              parseInt(execResult[3] + execResult[3], 16)
            ];
          }
        }
      ]
    }
  })
  .factory('Color', ['helper', function (helper) {
    return {
      value: {
        h: 1,
        s: 1,
        b: 1,
        a: 1
      },
      // translate a format from Color object to a string
      'rgb': function () {
        var rgb = this.toRGB();
        return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
      },
      'rgba': function () {
        var rgb = this.toRGB();
        return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
      },
      'hex': function () {
        return  this.toHex();
      },

      // HSBtoRGB from RaphaelJS
      RGBtoHSB: function (r, g, b, a) {
        r /= 255;
        g /= 255;
        b /= 255;

        var H, S, V, C;
        V = Math.max(r, g, b);
        C = V - Math.min(r, g, b);
        H = (C === 0 ? null :
          V == r ? (g - b) / C :
            V == g ? (b - r) / C + 2 :
              (r - g) / C + 4
          );
        H = ((H + 360) % 6) * 60 / 360;
        S = C === 0 ? 0 : C / V;
        return {h: H || 1, s: S, b: V, a: a || 1};
      },

      HueToRGB: function (p, q, h) {
        if (h < 0)
          h += 1;
        else if (h > 1)
          h -= 1;

        if ((h * 6) < 1)
          return p + (q - p) * h * 6;
        else if ((h * 2) < 1)
          return q;
        else if ((h * 3) < 2)
          return p + (q - p) * ((2 / 3) - h) * 6;
        else
          return p;
      },

      //parse a string to HSB
      setColor: function (val) {
        val = val.toLowerCase();
        for (var key in helper.stringParsers) {
          var parser = helper.stringParsers[key];
          var match = parser.re.exec(val),
            values = match && parser.parse(match),
            space = parser.space || 'rgba';
          if (values) {
            this.value = this.RGBtoHSB.apply(null, values);
            return false;
          }
        }
      },

      setHue: function (h) {
        this.value.h = 1 - h;
      },

      setSaturation: function (s) {
        this.value.s = s;
      },

      setLightness: function (b) {
        this.value.b = 1 - b;
      },

      setAlpha: function (a) {
        this.value.a = parseInt((1 - a) * 100, 10) / 100;
      },

      // HSBtoRGB from RaphaelJS
      // https://github.com/DmitryBaranovskiy/raphael/
      toRGB: function (h, s, b, a) {
        if (!h) {
          h = this.value.h;
          s = this.value.s;
          b = this.value.b;
        }
        h *= 360;
        var R, G, B, X, C;
        h = (h % 360) / 60;
        C = b * s;
        X = C * (1 - Math.abs(h % 2 - 1));
        R = G = B = b - C;

        h = ~~h;
        R += [C, X, 0, 0, X, C][h];
        G += [X, C, C, X, 0, 0][h];
        B += [0, 0, X, C, C, X][h];
        return {
          r: Math.round(R * 255),
          g: Math.round(G * 255),
          b: Math.round(B * 255),
          a: a || this.value.a
        };
      },

      toHex: function (h, s, b, a) {
        var rgb = this.toRGB(h, s, b, a);
        return '#' + ((1 << 24) | (parseInt(rgb.r) << 16) | (parseInt(rgb.g) << 8) | parseInt(rgb.b)).toString(16).substr(1);
      }
    }
  }])
  .directive('colorpicker', ['$document', '$compile', 'Color', 'helper', function ($document, $compile, Color, helper) {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function ($scope, elem, attrs, ngModel) {

        var
          template = '<div class="colorpicker dropdown-menu">' +
            '<div class="colorpicker-saturation"><i><b></b></i></div>' +
            '<div class="colorpicker-hue"><i></i></div>' +
            '<div class="colorpicker-alpha"><i></i></div>' +
            '<div class="colorpicker-color"><div></div></div>' +
            '<button class="close close-colorpicker">&times;</button>' +
            '</div>',
          colorpickerTemplate = angular.element(template),
          pickerColor = Color,
          pickerColorPreview,
          pickerColorAlpha,
          pickerColorBase,
          pickerColorPointers,
          pointer = null,
          slider = null;

        var thisFormat = attrs.colorpicker ? attrs.colorpicker : 'hex';
        var position = attrs.colorpickerPosition ? attrs.colorpickerPosition : 'bottom';


        $compile(colorpickerTemplate)($scope);

        pickerColorAlpha = {
          enabled: thisFormat === 'rgba',
          css: null
        };

        if (pickerColorAlpha.enabled === true) {
          colorpickerTemplate.addClass('alpha');
          pickerColorAlpha.css = colorpickerTemplate.find('div')[2].style;
        }

        colorpickerTemplate.addClass('colorpicker-position-' + position);

        angular.element(document.body).append(colorpickerTemplate);

        if(ngModel) {
          ngModel.$render = function () {
            elem.val(ngModel.$viewValue);
          };
          $scope.$watch(attrs.ngModel, function() {
            update();
          });
        }

        elem.bind('$destroy', function() {
          colorpickerTemplate.remove();
        });

        pickerColorBase = colorpickerTemplate.find('div')[0].style;
        pickerColorPreview = colorpickerTemplate.find('div')[4].style;
        pickerColorPointers = colorpickerTemplate.find('i');

        var previewColor = function () {
          try {
            pickerColorPreview.backgroundColor = pickerColor[thisFormat]();
          } catch (e) {
            pickerColorPreview.backgroundColor = pickerColor.toHex();
          }
          pickerColorBase.backgroundColor = pickerColor.toHex(pickerColor.value.h, 1, 1, 1);
          if (pickerColorAlpha.enabled === true) {
            pickerColorAlpha.css.backgroundColor = pickerColor.toHex();
          }
        };

        var slidersUpdate = function (event) {
          event.stopPropagation();
          event.preventDefault();

          var zone = helper.closest(event.target, 'div');

          if (zone.className === 'colorpicker-saturation') {
            slider = helper.extend({}, {
              maxLeft: 100,
              maxTop: 100,
              callLeft: 'setSaturation',
              callTop: 'setLightness'
            });
          }
          else if (zone.className === 'colorpicker-hue') {
            slider = helper.extend({}, {
              maxLeft: 0,
              maxTop: 100,
              callLeft: false,
              callTop: 'setHue'
            });
          }
          else if (zone.className === 'colorpicker-alpha') {
            slider = helper.extend({}, {
              maxLeft: 0,
              maxTop: 100,
              callLeft: false,
              callTop: 'setAlpha'
            });
          } else {
            slider = null;
            return false;
          }
          slider.knob = zone.children[0].style;
          slider.left = event.pageX - helper.getOffset(zone).left;
          slider.top = event.pageY - helper.getOffset(zone).top;
          pointer = {
            left: event.pageX,
            top: event.pageY
          };
        };

        var mousemove = function (event) {
          if (!slider) {
            return;
          }
          var left = Math.max(
            0,
            Math.min(
              slider.maxLeft,
              slider.left + ((event.pageX || pointer.left) - pointer.left)
            )
          );

          var top = Math.max(
            0,
            Math.min(
              slider.maxTop,
              slider.top + ((event.pageY || pointer.top) - pointer.top)
            )
          );

          slider.knob.left = left + 'px';
          slider.knob.top = top + 'px';
          if (slider.callLeft) {
            pickerColor[slider.callLeft].call(pickerColor, left / 100);
          }
          if (slider.callTop) {
            pickerColor[slider.callTop].call(pickerColor, top / 100);
          }
          previewColor();
          var newColor = pickerColor[thisFormat]();
          elem.val(newColor);
          if(ngModel) {
            $scope.$apply(ngModel.$setViewValue(newColor));
          }
          return false;
        };

        var mouseup = function () {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        };

        var update = function () {
          pickerColor.setColor(elem.val());
          pickerColorPointers.eq(0).css({
            left: pickerColor.value.s * 100 + 'px',
            top: 100 - pickerColor.value.b * 100 + 'px'
          });
          pickerColorPointers.eq(1).css('top', 100 * (1 - pickerColor.value.h) + 'px');
          pickerColorPointers.eq(2).css('top', 100 * (1 - pickerColor.value.a) + 'px');
          previewColor();
        };

        var getColorpickerTemplatePosition = function() {
          var
            positionValue,
            positionOffset = helper.getOffset(elem[0]);

          if (position === 'top') {
            positionValue =  {
              'top': positionOffset.top - 146,
              'left': positionOffset.left
            }
          } else if (position === 'right') {
            positionValue = {
              'top': positionOffset.top,
              'left': positionOffset.left + 141
            }
          } else if (position === 'bottom') {
            positionValue = {
              'top': positionOffset.top + elem[0].offsetHeight,
              'left': positionOffset.left
            }
          } else if (position === 'left') {
            positionValue = {
              'top': positionOffset.top,
              'left': positionOffset.left - 131
            }
          }
          return {
            'top': positionValue.top + 'px',
            'left': positionValue.left + 'px'
          };
        };

        elem.bind('click', function () {
          update();
          colorpickerTemplate
            .addClass('colorpicker-visible')
            .css(getColorpickerTemplatePosition());
        });

        colorpickerTemplate.bind('mousedown', function (event) {
          event.stopPropagation();
          event.preventDefault();
        });

        colorpickerTemplate.find('div').bind('click', function (event) {
          slidersUpdate(event);
          mousemove(event);
        });

        colorpickerTemplate.find('div').bind('mousedown', function (event) {
          slidersUpdate(event);
          $document.bind('mousemove', mousemove);
          $document.bind('mouseup', mouseup);
        });

        var hideColorpickerTemplate = function() {
          if (colorpickerTemplate.hasClass('colorpicker-visible')) {
            colorpickerTemplate.removeClass('colorpicker-visible');
          }
        };

        colorpickerTemplate.find('button').bind('click', function () {
          hideColorpickerTemplate();
        });

        $document.bind('mousedown', function () {
          hideColorpickerTemplate();
        });
      }
    };
  }]);
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


'use strict';

planningApp.service('DateService', function () {
   
   this.checkDaysToGo = function(deadline) {
          var year = deadline.substring(0,4);
          var month = deadline.substring(5,7);
          var day = deadline.substring(8,10);
         //alert("year: " + year + ", month: " + month + ", day: " + day);
          var date        = new Date(year, month-1, day);
          var currentDate = new Date();
          var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
          return Math.round((date.getTime() - currentDate.getTime())/(oneDay));
    }
});
'use strict';

var DbService = planningApp.service('DbService', ['$http', 'ListService', '$rootScope', function ($http, ListService, $rootScope) {
        //TODO
     this.getAllTodos = function (sc, rsc) {
         $http.post('http://www.leeuwdesign.nl/todo/backend/todo.php',{'action':'getAll'}).success(function(data) {
            if(data == "0 results"){
                sc.todoList = rsc.todoList = [];
            }else{
                sc.todoList = rsc.todoList = data; 
            }
        });
    }
    this.createTodoRecord = function (name, list) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/todo.php',{'action':'createRecord', 'name':name, 'status':'inprogress', 'creationDate':new Date()}).success(function(data) {
            //data returns the id of the new record
            ListService.setId(name, data, list);                      
        });
    }
    this.deleteTodoRecord = function (id) {
       $http.post('http://www.leeuwdesign.nl/todo/backend/todo.php',{'action':'deleteRecord', 'id':id}).success(function(data) {
                           
        });
    }
    this.updateTodo = function (todo, callBack) {
         $http.post('http://www.leeuwdesign.nl/todo/backend/todo.php',{'action':'update', 'id':todo.id, 'name':todo.name, 'description':todo.description, 'criterion':todo.criterion,'deadline':todo.deadline, 'creationDate':todo.creationDate, 'status': todo.status, 'category':todo.category}).success(function(data) {
              callBack("Your todo is saved.");          
         });
    }
    //SUBTASKS
    this.getSubTasks = function (id,sc) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/subtasks.php',{'action':'getAll', 'id':id}).success(function(data) {
            if(data == "0 results"){
                sc.curTodo.subTasks = [];
            }else{
                sc.curTodo.subTasks = data; 
            }
        });
    }
    this.createSubTaskRecord = function (name, parentTaskId, list) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/subtasks.php',{'action':'createRecord', 'name':name, 'status':'inprogress', 'parentTaskId':parentTaskId}).success(function(data) {
            //data returns the id of the new record
            ListService.setId(name, data, list);                      
        });
    }
    this.deleteSubTaskRecord = function (id) {
       $http.post('http://www.leeuwdesign.nl/todo/backend/subtasks.php',{'action':'deleteRecord', 'id':id}).success(function(data) {
                           
        });
    }
    this.updateSubTask = function (subTask, callBack) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/subtasks.php',{'action':'update', 'id':subTask.id, 'name':subTask.name, 'description':subTask.description, 'criterion':subTask.criterion,'deadline':subTask.deadline, 'status': subTask.status}).success(function(data) {
            callBack("Your subtask is saved.");          
         });
    }
    //RELATED TODOS
    this.createRelatedTodo = function (id1, id2) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/related_todos.php',{'action':'createRecord', 'todo1_id':id1, 'todo2_id':id2}).success(function(data) {
                               
        });
    }
     this.getRelatedTodos = function (id, sc, peopleList) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/related_todos.php',{'action':'getAll', 'id':id}).success(function(data) {
            if(data != "0 results"){
                 var relatedTodos = data;
                 var i;
                 for (i in relatedTodos) {
                    var j;
                    for (j in peopleList) {
                      if((relatedTodos[i].todo2_id == peopleList[j].id && peopleList[j].id != id) || (relatedTodos[i].todo1_id == peopleList[j].id && peopleList[j].id != id)) {
                            sc.curTodo.related.push(peopleList[j]);
                            ListService.delete(peopleList[j].id, $rootScope.relatedTodoList);
                        }

                    }
                }          
            }       
        });
    }
     this.removeRelatedTodo = function (id1, id2) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/related_todos.php',{'action':'deleteRecord', 'todo1_id':id1, 'todo2_id':id2}).success(function(data) {
                              
        });
    }
    //TODO CATEGORIES
    this.getAllTodoCategories = function (sc, rsc) {
         $http.post('http://www.leeuwdesign.nl/todo/backend/todocat.php',{'action':'getAll'}).success(function(data) {
            if(data == "0 results"){
                sc.todoCategoryList = rsc.todoCategoryList = []; 
             }else{
                sc.todoCategoryList = rsc.todoCategoryList = data;                
             }
        });
    }
    this.createTodoCatRecord = function (name, list) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/todocat.php',{'action':'createRecord', 'name':name}).success(function(data) {
            //data returns the id of the new record
            ListService.setId(name, data, list);                      
        });
    }
    this.deleteTodoCatRecord = function (id) {
      $http.post('http://www.leeuwdesign.nl/todo/backend/todocat.php',{'action':'deleteRecord', 'id':id}).success(function(data) {
                         
        });
    }
    this.updateTodoCat = function (todoCat, callBack) {
       $http.post('http://www.leeuwdesign.nl/todo/backend/todocat.php',{'action':'update', 'id':todoCat.id, 'name':todoCat.name, 'color':todoCat.color }).success(function(data) {
             callBack("Your category is saved.");         
         });
    }
    //TOBUY CATEGORIES
    this.getAllTobuyCategories = function (sc, rsc) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/tobuycat.php',{'action':'getAll'}).success(function(data) {
            if(data == "0 results"){
                sc.tobuyCategoryList = rsc.tobuyCategoryList = []; 
             }else{
                sc.tobuyCategoryList = rsc.tobuyCategoryList = data;                
             }
        });
    }
    this.createTobuyCatRecord = function (name, list) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/tobuycat.php',{'action':'createRecord', 'name':name}).success(function(data) {
            //data returns the id of the new record
            ListService.setId(name, data, list);                      
        });
    }
    this.deleteTobuyCatRecord = function (id) {
      $http.post('http://www.leeuwdesign.nl/todo/backend/tobuycat.php',{'action':'deleteRecord', 'id':id}).success(function(data) {
                         
        });
    }
    this.updateTobuyCat = function (tobuyCat, callBack) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/tobuycat.php',{'action':'update', 'id':tobuyCat.id, 'name':tobuyCat.name, 'color':tobuyCat.color }).success(function(data) {
              callBack("Your category is saved.")       
         });
    }
    //PEOPLE
    this.getAllPeople = function (sc, rsc) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/people.php',{'action':'getAll'}).success(function(data) {
           if(data == "0 results"){
                sc.peopleList = rsc.peopleList = []; 
             }else{
                sc.peopleList = rsc.peopleList = data;            
             }              
        });
    }
    this.createPersonRecord = function (name, list) {
       $http.post('http://www.leeuwdesign.nl/todo/backend/people.php',{'action':'createRecord', 'name':name}).success(function(data) {
            //data returns the id of the new record
            ListService.setId(name, data, list);                      
        });
    }
    this.deletePersonRecord = function (id) {
      $http.post('http://www.leeuwdesign.nl/todo/backend/people.php',{'action':'deleteRecord', 'id':id}).success(function(data) {
                         
        });
    }
    this.updatePerson = function (person, callBack) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/people.php',{'action':'update', 'id':person.id, 'name':person.name, 'function':person.function, 'phone' : person.phone, 'email':person.email }).success(function(data) {   
        	callBack("Your person is saved.");                 
         });
    }
    this.addPersonToTodo = function (personId, todoId) {
       $http.post('http://www.leeuwdesign.nl/todo/backend/people.php',{'action':'addPersonToTodo', 'todo_id':todoId, 'person_id':personId }).success(function(data) {
                   
         });
    }
    this.removePersonFromTodo = function (personId, todoId) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/people.php',{'action':'removePersonFromTodo', 'todo_id':todoId, 'person_id':personId }).success(function(data) {
                     
         });
    }
     this.getPeopleForTodo = function (todoId, peopleList, sc) {
         $http.post('http://www.leeuwdesign.nl/todo/backend/people.php',{'action':'getPeopleForTodo', 'todo_id':todoId}).success(function(data) {
            if(data != "0 results"){
                 var peopleForTodoIds = data;
                 var i;
                 for (i in peopleForTodoIds) {
                    var j;
                    for (j in peopleList) {
                       if(peopleForTodoIds[i].person_id == peopleList[j].id && sc.curTodo.people.indexOf(peopleList[j]) == -1  ) {
                           peopleList[j].usedInId = 
                            sc.curTodo.people.push(peopleList[j]);                            
                        }

                    }
                }          
            }             
         });
    }
     //TOBUY
     this.getAllTobuys = function (sc, rsc) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/tobuy.php',{'action':'getAll'}).success(function(data) {
        	if(data == "0 results"){
                sc.tobuyList = rsc.tobuyList = [];
            }else{
                sc.tobuyList = rsc.tobuyList = data;                
            }
        });
    }
    this.createTobuyRecord = function (name, usedIn, list) {
       $http.post('http://www.leeuwdesign.nl/todo/backend/tobuy.php',{'action':'createRecord', 'name':name, 'usedIn':usedIn, 'status':'inprogress', 'creationDate':new Date()}).success(function(data) {
            //data returns the id of the new record
            ListService.setId(name, data, list);           
        });
    }
    this.deleteTobuyRecord = function (id) {
        $http.post('http://www.leeuwdesign.nl/todo/backend/tobuy.php',{'action':'deleteRecord', 'id':id}).success(function(data) {
                       
        });
    }
    this.updateTobuy = function (tobuy, callBack) {
       $http.post('http://www.leeuwdesign.nl/todo/backend/tobuy.php',{'action':'update', 'id':tobuy.id, 'name':tobuy.name, 'price':tobuy.price, 'quantity':tobuy.quantity,'deadline':tobuy.deadline, 'creationDate':tobuy.creationDate, 'status': tobuy.status, 'category':tobuy.category, 'usedIn':tobuy.usedIn, 'supplier':tobuy.supplier}).success(function(data) {
                  callBack("Your tobuy is saved.")       
         });
    }
}]);


'use strict';

planningApp.directive('integer', function() {
  var INTEGER_REGEXP = /^\-?\d+$/;    
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.integer = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }
         
        if (INTEGER_REGEXP.test(viewValue) ) {
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    }
  };
});

'use strict';

planningApp.service('FeedbackService', function() {

	this.giveFeedback = function(message) {
		$(".feedback-text").text(message);
		setTimeout(function() {
			$(".feedback-text").text("");
		}, 3000);
	}
}); 
'use strict';

planningApp.service('FormStateService', function() {
	var isDirty = false;
	var objectToSave = null;
	var saveFunction = null;
	var self = this;

	this.showSaveDialog = function(next) {
		var dialog = $('<p>Do you want to save your changes?</p>').dialog({
			buttons : {
				"Yes" : function() {
					self.saveFunction(self.objectToSave);
					location.href = next;
					dialog.dialog('close');
				},
				"No" : function() {
					self.isDirty = false;
					location.href = next;
					dialog.dialog('close');
				},
				"Cancel" : function() {
					dialog.dialog('close');
				}
			}
		});
	}
}); 
'use strict';

planningApp.service('ListService', function() {

	this.delete = function(id, list) {
		var i
		for (i in list) {
			if (list[i].id == id) {
				list.splice(i, 1);
			}
		}
	}
	this.getIndex = function(id, list) {

		var i
		for (i in list) {
			if (list[i].id == id) {
				return i;
			}
		}
	}
	this.getPropertyById = function(id, prop, list) {
		var i
		for (i in list) {
			if (list[i].id == id) {
				return list[i][prop];
			}
		}
	}
	this.getColor = function(cat, list) {
		var i
		for (i in list) {
			if (list[i].name == cat) {
				return list[i].color;
			}
		}
	}
	this.setId = function(name, id, list) {
		var i
		for (i in list) {
			if (list[i].name == name) {
				list[i].id = id;
				break;
			}
		}
	}
	this.getId = function(name, list) {
		var i
		for (i in list) {
			if (list[i].name == name) {
				return list[i].id;
			}
		}
	}
}); 