'use strict';

planningApp.service('FeedbackService', function() {

	this.giveFeedback = function(message) {
		$(".feedback-text").text(message);
		setTimeout(function() {
			$(".feedback-text").text("");
		}, 3000);
	}
}); 