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