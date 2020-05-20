(function (window) {
	'use strict';

// OBJET Model ________________________________________ */
// 1. Crée des instances de Model
// 2. Connecte le storage à ces instances en le prenant en paramètre
	function Model(storage) {
		this.storage = storage;
	}
// MÉTHODES ___________________________________________ */
// I. model.create()
// 1. Crée un nouveau todo model
	Model.prototype.create = function (title, callback) {
		// S'il y a un title en argument lors de l'appel, alors le sélectionner
		// (la chaîne logique s'interrompt sur le premier true qu'elle rencontre)
		title = title || ''; // remplace if/else
		// pareil pour le callback, soit il est appelé lors de l'appel
		callback = callback || function () {}; // soit c'est une fonction vide
		// objet newItem a un titre et un état completed faux par défaut
		var newItem = {
			title: title.trim(),
			completed: false
		};
		// Utilise la méthode de store.js pour sauvegarder l'item dans le localStorage
		this.storage.save(newItem, callback);
	};

// II. model.read()
// 1. Trouve et retourne un modèle à l'intérieur du storage.
// 2. Retourne tout le storage si la méthode est appelée sans requête au départ.
// 3. Cherche un modèle dans le storage grâce à son ID en passant un string ou un number à la méthode qui les compare
// 4. Compare à un objet qui lui est envoyé
/** examples:
	 * model.read(1, func); // Will find the model with an ID of 1
	 * model.read('1'); // Same as above
	 * Below will find a model with foo equalling bar and hello equalling world.
	 * model.read({ foo: 'bar', hello: 'world' });
	 */
	Model.prototype.read = function (query, callback) {
		// stocke le data type de 'query' dans queryType
		var queryType = typeof query; // string, boolean, number (?)
		callback = callback || function () {};

		// si le data type de query est 'function' (ndlr: ce data type est incorrect mais utilisé par convention)
		if (queryType === 'function') {
			// alors le callback devient cette fonction
			callback = query;
			// retourne le résultat de la méthode findAll() de store avec le callback en argument
			return this.storage.findAll(callback);
		// si le data type de query est string ou number
		} else if (queryType === 'string' || queryType === 'number') {
			// on transforme query en entier
			// NOTE: As of ECMAScript 5, the default is the decimal radix (10) -> ça ne devrait donc rien changer avec ou sans '10'
			query = parseInt(query, 10);
			this.storage.find({ id: query }, callback);
		} else {
			this.storage.find(query, callback);
		}
	};

	/**
	 * Updates a model by giving it an ID, data to update, and a callback to fire when
	 * the update is complete.
	 *
	 * @param {number} id The id of the model to update
	 * @param {object} data The properties to update and their new value
	 * @param {function} callback The callback to fire when the update is complete.
	 */
	Model.prototype.update = function (id, data, callback) {
		this.storage.save(data, callback, id);
	};

	/**
	 * Removes a model from storage
	 *
	 * @param {number} id The ID of the model to remove
	 * @param {function} callback The callback to fire when the removal is complete.
	 */
	Model.prototype.remove = function (id, callback) {
		this.storage.remove(id, callback);
	};

	/**
	 * WARNING: Will remove ALL data from storage.
	 *
	 * @param {function} callback The callback to fire when the storage is wiped.
	 */
	Model.prototype.removeAll = function (callback) {
		this.storage.drop(callback);
	};

	/**
	 * Returns a count of all todos
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

	// Export to window
	window.app = window.app || {};
	window.app.Model = Model;
})(window);
