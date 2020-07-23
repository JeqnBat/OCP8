(function (window) {
	'use strict';
	/**
	 * <b>DESCR:</b><br>
	 * Creates a new Model instance and hooks up the storage.
	 *
	 * @constructor
	 *
	 * @param {object} storage A reference to the client side storage class.
	 */
	function Model(storage) {
		this.storage = storage;
	}

// MÉTHODES (6) _______________________________________ */

	/**
	 * <b>DESCR:</b><br>
	 * Creates a new todo model.
	 *
	 * @param {string} title The title of the task.
	 * @param {function} callback The callback to fire after the model is created.
	 */
	Model.prototype.create = function (title, callback) {
		title = title || '';
		callback = callback || function () {};
		var newItem = {
			title: title.trim(),
			completed: false
		};

		this.storage.save(newItem, callback);
	};

	/**
	 * <b>DESCR:</b><br>
	 * Finds and returns a model in storage. If no query is given it'll simply
	 * return everything. If you pass in a string or number it'll look that up as
	 * the ID of the model to find. Lastly, you can pass it an object to match
	 * against.
	 *
	 * @param {string|number|object} query A query to match models against.
	 * @param {function} callback The callback to fire after the model is found.
	 *
	 * @example
	 * // Will find the model with an ID of 1
	 * model.read(1, func);
 	 * @example
	 * // Same as above
	 * model.read('1');
	 * Below will find a model with foo equalling bar and hello equalling world.
	 * model.read({ foo: 'bar', hello: 'world' });
	 */
	Model.prototype.read = function (query, callback) {
		var queryType = typeof query;
		callback = callback || function () {};

		if (queryType === 'function') {
			callback = query;
			return this.storage.findAll(callback);
		} else if (queryType === 'string' || queryType === 'number') {
			// NOTE: As of ECMAScript 5, the default is the decimal radix (10) ->
			// ça ne devrait donc rien changer avec ou sans '10'; proposer de le retirer ?
			query = parseInt(query, 10);
			this.storage.find({ id: query }, callback);
		} else {
			this.storage.find(query, callback);
		}
	};

	/**
	 * <b>DESCR:</b><br>
	 * Updates a model by giving it an ID, data to update, and a callback to fire when
	 * the update is complete.
	 *
	 * @param {number} id The id of the model to update.
	 * @param {object} data The properties to update and their new value.
	 * @param {function} callback The callback to fire when the update is complete.
	 */
	Model.prototype.update = function (id, data, callback) {
		this.storage.save(data, callback, id);
	};

	/**
	 * <b>DESCR:</b><br>
	 * Removes a model from storage.
	 *
	 * @param {number} id The ID of the model to remove.
	 * @param {function} callback The callback to fire when the removal is complete.
	 */
	Model.prototype.remove = function (id, callback) {
		this.storage.remove(id, callback);
	};

	/**
	 * <b>DESCR:</b><br>
	 * WARNING: Will remove ALL data from storage.
	 *
	 * @param {function} callback The callback to fire when the storage is wiped.
	 */
	Model.prototype.removeAll = function (callback) {
		this.storage.drop(callback);
	};

 /**
	* <b>DESCR:</b><br>
	* Returns a count of all todos.
	*
	* @param {function} callback The callback to fire when the todos are counted.
	*/
	Model.prototype.getCount = function (callback) {
		var todos = {
			active: 0,
			completed: 0,
			total: 0
		};

		this.storage.findAll(function (data) {
			data.forEach(function (todo) {
				if (todo.completed) {
					todos.completed++;
				} else {
					todos.active++;
				}
				todos.total++;
			});
			callback(todos);
		});
	};

	window.app = window.app || {};
	window.app.Model = Model;
})(window);
