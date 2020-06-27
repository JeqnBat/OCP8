(function (window) {
	'use strict';

// OBJET Model ________________________________________ */
// 1. Crée des instances de Model
// 2. Connecte le storage à ces instances en le prenant en paramètre
	/**
	 * @param {object} storage
	 */
	function Model(storage) {
		this.storage = storage;
	}
// MÉTHODES (6) _______________________________________ */
// I. model.create(title, callback)
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
		// marker pour les tests
		console.log(`Model.create(${title}, callback) (1)`);
	};

// II. model.read(query, callback)
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
			// NOTE: As of ECMAScript 5, the default is the decimal radix (10) ->
			// ça ne devrait donc rien changer avec ou sans '10'; proposer de le retirer ?
			query = parseInt(query, 10);
			// on utilise la méthode storage.find() avec la valeur de query
			this.storage.find({ id: query }, callback);
		} else {
		// si le data type de query n'est ni 'function' ni 'string' ni 'number'
			// on utilise storage.find() avec la query telle qu'elle est entrée dans l'appel
			this.storage.find(query, callback);
		}
		// marker pour les tests
		console.log(`Model.read(${query}, ${callback}) (2)`);
	};

// III. model.update(id, data, callback)
// 1. Met à jour un modèle en lui attribuant une ID
// 2. Met à jour les data du modèle
// 3. Appelle un callback qd la mise à jour est achevée
	/**
	 * @param {number} id l'ID du modèle à mettre à jour
	 * @param {object} data Les propriétés à mettre à jour avec leurs nouvelles valeurs
	 * @param {function} callback Le callback à appeler lorsque la mise à jour est terminée
	 */
	Model.prototype.update = function (id, data, callback) {
		this.storage.save(data, callback, id);
		// marker pour les tests
		console.log(`Model.update(${id}, ${data}, callback) (3)`);
	};

// IV. model.remove(id, callback)
// 1. Retire un modèle du storage
	/**
	 * @param {number} id ID du modèle à retirer
	 * @param {function} callback le callback à appeler après
	 */
	Model.prototype.remove = function (id, callback) {
		this.storage.remove(id, callback);
		// marker pour les tests
		console.log(`Model.remove(${id}, callback) (4)`);
	};

// V. model.removeAll(callback)
// 1. Retire TOUTES les données du storage
	/**
	 * @param {function} callback le callback à appeler après
	 */
	Model.prototype.removeAll = function (callback) {
		this.storage.drop(callback);
		// marker pour les tests
		console.log(`Model.removeAll(callback) (5)`);
	};

// VI. model.getCount(callback)
// 1. retourne la somme de tous les todos
	/**
	 * Returns a count of all todos
	 */
	Model.prototype.getCount = function (callback) {
		// création d'un objet qui rassemble toutes les statistques des todos
		var todos = {
			active: 0,
			completed: 0,
			total: 0
		};
		//
		this.storage.findAll(function (data) {
			// pour chaque membre de data
			data.forEach(function (todo) {
				// si todo.completed est true alors
				if (todo.completed) {
					// ajouter +1 à la propriété 'completed' de 'todos'
					todos.completed++;
				} else {
					// ajouter +1 à la propriété 'active' de 'todos'
					todos.active++;
				}
				// dans tous les cas, ajouter +1 à chaque tour pour obtenir le total
				todos.total++;
			});
			// appeler le callback avec l'objet todos en argument
			callback(todos);
		});
		// marker pour les tests
		console.log(`Model.getCount(callback) (6)`);
	};

	// Exporter l'objet Model avec toutes ses méthodes à window.app
	window.app = window.app || {};
	// = new Model ?
	window.app.Model = Model; // c'est ici que se fait l'équivalence dans app.js
})(window);
