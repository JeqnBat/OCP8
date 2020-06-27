/*global app, $on */
(function () {
	'use strict';
// 1. description textuelle
// 2. (a)type de paramètre, (b)nom du paramètre, (c)description textuelle du paramètre
	/**
	 * @param {string} name The name of your new to do list.
	 */

// OBJET 'TODO' _______________________________________ */
/* Objet principal(1)
		contient 5 autres objets & leurs méthodes :
		1. store
		2. model
				1. store
		3. template
		4. view
				3. template
		5. controller
				2. model
				4. view

		le dernier objet(7) est 'helpers.js'
		il est chargé en premier dans 'index.html'
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
		/* location.hash :
		 		Return the anchor part of a URL.
				Assume that the current URL is http://www.example.com/test.htm#part2
					var x = location.hash;
				The result of x will be:
					#part2
		*/
	}

	console.log(document.location.hash);
	$on(window, 'load', setView);
	$on(window, 'hashchange', setView);

})();
