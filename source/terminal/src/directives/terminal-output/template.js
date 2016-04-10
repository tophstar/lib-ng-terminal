(function () {
    define([], function () {
        return "" +
			"<section class='terminal' ng-paste='handlePaste($event)'>" +
				"<div class='terminal-viewport'>" +
					"<div class='terminal-results'></div>" +
					"<span class='terminal-prompt' ng-show='showPrompt'>{{prompt.text}}</span>" +
					"<span class='terminal-input'>{{commandLine}}</span>" +
					"<span class='terminal-cursor'>_</span>" +
					"<input type='text' ng-model='commandLine' class='terminal-target'/>" +
				"</div>" +
//				"<div ng-transclude></div>" +
			"</section>";
    });
}());

