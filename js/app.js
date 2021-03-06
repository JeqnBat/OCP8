/*global app, $on */
(function () {
	'use strict';

	/**
	 * <b>DESCR:</b><br>
	 * 'Todo' is the app's main class. It contains all the other classes :
	 *
	 *   - Controller
	 *   - Model
	 *   - Store
	 *   - Template
	 *   - View
	 *
	 * @constructor
	 * @param {string} name The name of your new to do list.
	 */
	function Todo(name) {
		this.storage = new app.Store(name);
		this.model = new app.Model(this.storage);
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.model, this.view);
	}

	var todo = new Todo('todos-vanillajs');

	function setView() {
		todo.controller.setView(document.location.hash);
	}
	$on(window, 'load', setView);
	$on(window, 'hashchange', setView);
})();
