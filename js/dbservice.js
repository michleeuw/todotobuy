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

