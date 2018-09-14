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