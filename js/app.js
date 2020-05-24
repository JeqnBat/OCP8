/*global app, $on */
(function () {
	'use strict';
// 1. description textuelle
// 2. (a)type de paramètre, (b)nom du paramètre, (c)description textuelle du paramètre
	/**
	 * @param {string} name The name of your new to do list.
	 */

// OBJET 'TODO' _______________________________________ */
/* Objet principal qui contient tous les autres objets & leurs méthodes
		1. store
		2. model
				2a. store
		3. template
		4. view
				4a. template
		5. controller
				5a. model
				5b. view
*/
// OBJET 'Todo' qui prend un 'name' en paramètre
	function Todo(name) {
		this.storage = new app.Store(name);
		this.model = new app.Model(this.storage);
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.model, this.view);
	}

// INSTANCE de 'TODO' nommée 'todos-vanillajs'
	var todo = new Todo('todos-vanillajs');

	function setView() {
		todo.controller.setView(document.location.hash);
	}

	$on(window, 'load', setView);
	$on(window, 'hashchange', setView);
})();
