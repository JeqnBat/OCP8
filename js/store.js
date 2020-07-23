/* jshint eqeqeq:false */
(function (window) {
	'use strict';

	/**
	 * <b>DESCR:</b><br>
	 * Creates a new client side storage object and will create an empty
	 * collection if no collection already exists.
	 *
	 * @constructor
	 *
	 * @param {string} name The name of our DB we want to use.
	 * @param {function} callback Our fake DB uses callbacks because in
	 * real life you probably would be making AJAX calls.
	 */
	function Store(name, callback) {
		callback = callback || function () {};
		this._dbName = name;

		if (!localStorage[name]) {
			var data = {
				todos: []
			};
			localStorage[name] = JSON.stringify(data);
		}

		callback.call(this, JSON.parse(localStorage[name]));
	}

// MÉTHODES (5) _______________________________________ */

	/**
	 * <b>DESCR:</b><br>
	 * Finds items based on a query given as a JS object.
	 *
	 * @param {object} query The query to match against (i.e. {foo: 'bar'}).
	 * @param {function} callback The callback to fire when the query has
	 * completed running.
	 *
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
	 *	 // data will return any items that have foo: bar and
	 *	 // hello: world in their properties
	 * });
	 */
	Store.prototype.find = function (query, callback) {
		if (!callback) {
			return;
		}

		var todos = JSON.parse(localStorage[this._dbName]).todos;

		callback.call(this, todos.filter(function (todo) {
			for (var q in query) {
				if (query[q] !== todo[q]) {
					return false;
				}
			}
			return true;
		}));
	};

	/**
	 * <b>DESCR:</b><br>
	 * Will retrieve all data from the collection.
	 *
	 * @param {function} callback The callback to fire upon retrieving data.
	 */
	Store.prototype.findAll = function (callback) {
		callback = callback || function () {};
		callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
	};

	/**
	 * <b>DESCR:</b><br>
	 * Generates a random 6 digits number and returns it.
	 *
	 * @function
	 * @name generateNewId
	 *
	 * @returns {string} The generated number.
	 */
	function generateNewId() {
		var generatedId = "";
		var charset = "0123456789";

		for (var i = 0; i < 6; i++) {
			generatedId += charset.charAt(Math.floor(Math.random() * charset.length));
		}
		return generatedId;
	}

	/**
	 * <b>DESCR:</b><br>
	 * Checks if the generated number is not already present in the database.
	 *
	 * @function
	 * @name isExistingId
	 *
	 * @param {string} id The generated 6 digits number.
	 * @param {object} todos The object containing all the todos
	 *
	 * @returns {boolean}
	 */
	function isExistingId(id, todos) {
		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == id) {
				return true
			}
		}
		return false
	}

	/**
	 * <b>DESCR:</b><br>
 	 * Will save the given data to the DB. If no item exists it will create a new
 	 * item, otherwise it'll simply update an existing item's properties.
 	 *
 	 * @param {object} updateData The data to save back into the DB.
 	 * @param {function} callback The callback to fire after saving.
 	 * @param {number} id An optional param to enter an ID of an item to update.
 	 */
	Store.prototype.save = function (updateData, callback, id) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;

		callback = callback || function () {};

		if (id) {
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					for (var key in updateData) {
						todos[i][key] = updateData[key];
					}
					break;
				}
			}

			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, todos);

		} else {
			var newId = generateNewId();

			while (isExistingId(newId, todos)) {
				newId = generateNewId();
			}

			updateData.id = parseInt(newId);
			todos.push(updateData);

			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, [updateData]);
		}
	};

	/**
	 * <b>DESCR:</b><br>
	 * Will remove an item from the Store based on its ID.
	 *
	 * @param {number} id The ID of the item you want to remove.
	 * @param {function} callback The callback to fire after saving.
	 */
	Store.prototype.remove = function (id, callback) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;
		var todoId;

		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == id) {
		// OPTIMISATION #1
				todos.splice(i, 1)
			}
		}
		// OPTIMISATION #2
		// deuxième boucle redondante?
		// pour chaque membre de l'array 'todos'
		// for (var i = 0; i < todos.length; i++) {
		// 	// si l'id du membre[i] correspond à todoId
		// 	if (todos[i].id == todoId) {
		// 		// coupe l'array 'todos' à hauteur du membre[i] pour 1 élément
		// 		todos.splice(i, 1);
		// 	}
		// }

		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, todos);
	};

	/**
	 * <b>DESCR:</b><br>
	 * Will drop all storage and start fresh.
	 *
	 * @param {function} callback The callback to fire after dropping the data.
	 */
	Store.prototype.drop = function (callback) {
		var data = {todos: []};

		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, data.todos);
	};

	window.app = window.app || {};
	window.app.Store = Store;
})(window);
