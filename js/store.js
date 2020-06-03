/* jshint eqeqeq:false
-> Cette option interdit l'utilisation de == et !=
en faveur de === et !==
Les opérateurs == et =! tente de contraindre les valeurs
avant de les comparer (ce qui peut amener à des résultats inattendus)
Les opérateurs === et !== ne contraignent pas les valeurs qu'ils comparent
et sont donc généralement plus sûrs.
Pour en savoir plus sur la coercition in JavaScript,
voir Truth, Equality and JavaScript by Angus Croll.*/
(function (window) {
	'use strict';

	function generateNewId() {
		var generatedId = "";
		var charset = "0123456789";
		// génère un nombre aléatoire composé de 6 chiffres
		for (var i = 0; i < 6; i++) {
			generatedId += charset.charAt(Math.floor(Math.random() * charset.length));
		}
		return generatedId;
	}

	function isExistingId(id, todos) {
		// vérifie que l'ID générée n'existe pas déjà dans la DB
		for (var i = 0; i < todos.length; i++) {
			// s'il existe déjà
			if (todos[i].id == id) {
				return true
			}
		}
		return false
	}
// OBJET Store ________________________________________ */
// 1. Crée un 'objet de stockage' côté client
// 2. Crée une 'collection' si elle n'existe pas déjà
	/**
	 * @param {string} name le nom de la base de données à utiliser
	 * @param {function} callback notre fausse DB utilise des callbacks parce que
	 * dans la réalité on utiliserait probablement des appels AJAX
	 */
	function Store(name, callback) {
		// soit un callback est appelé avec la fonction, soit il correspond à une fonction vide
		callback = callback || function () {};
		// le nom correspond à celui du conteneur 'Todo' (dans cet exemple son nom est 'todos-vanillajs')
		this._dbName = name; // expected output: 'todos-vanillajs'
		// si localStorage[name] renvoie false (çàd qu'il existe déjà?)
		if (!localStorage[name]) {
			// créer un objet 'data' qui contient un tableau 'todos'
			var data = {
				todos: []
			};
			// convertit l'objet 'data' en string et stocke le résultat dans localStorage[name]
			localStorage[name] = JSON.stringify(data);
		}
		// convertit localStorage[name] en objet
		// appelle le callback avec le this de cet objet (Store) + l'objet localStorage[name]
		// de cette façon, callback peut accéder aux propriétés de cet objet
		callback.call(this, JSON.parse(localStorage[name]));
	}

// MÉTHODES (5) _______________________________________ */
// I. store.find(query, callback)
// 1. Trouve des items à partir d'une requête envoyée par un objet JS
	/**
	 * @param {object} query la requête à comparer (i.e. {foo: 'bar'})
	 * @param {function} callback	 le callback à exécuter une fois la requête
	 * terminée
	 *
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
	 *	 // data retournera toute item avec foo: bar et
	 *	 // hello: world dans leurs proprietes
	 * });
	 */
	Store.prototype.find = function (query, callback) {
		// Si aucun callback n'a été appelé -> arrêter la méthode
		if (!callback) {
			return;
		}
		// convertit localStorage[this._dbName] en objet
		// stocke la propriété 'todos' de cet objet dans la variable 'todos'
		var todos = JSON.parse(localStorage[this._dbName]).todos;

		// appelle le callback avec le this de cette méthode
		// appelle la méthode filter sur la variable todos
		// la méthode filter() crée et retourne un nouveau tableau
		// contenant tous les éléments du tableau d'origine qui
		// remplissent une condition déterminée par la fonction callback.
		callback.call(this, todos.filter(function (todo) {
			// pour chaque valeur 'q' de 'query'
			for (var q in query) {
				// si query[q] est différent de todo[q]
				if (query[q] !== todo[q]) {
					// callback renvoie false
					return false;
				}
			}
			// si chaque query[q] correspond à chaque todo[q]
			// callback renvoie true
			return true;
		}));
	};

// II. store.findAll(callback)
// 1. Va chercher toutes les Datas de la collection
	/**
	 * @param {function} callback le callback a appelé après avoir reçu les Datas
	 */
	Store.prototype.findAll = function (callback) {
		// si un callback a été appelé on l'utilise, sinon callback égale une fonction vide
		callback = callback || function () {};
		// appelle le callback avec le this de cette méthode
		// convertit localStorage[this._dbName] en objet
		callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
	};

// III. store.save(updateData, callback, id)
// 1. Sauvegarde la donnée dans la DB.
// 2. Si aucune item n'existe, une nouvelle item sera créée
// 3. Sinon, les propriétés de l'item existante seront mises à jour
	/**
	 * @param {object} updateData les données à sauvegarder dans la BDD
	 * @param {function} callback le callback a appelé après avoir sauvegardé
	 * @param {number} id paramètre optionnel : ID de l'item à sauvegarder
	 */
	Store.prototype.save = function (updateData, callback, id) {
		// convertit localStorage[this._dbName] en objet JS
		// stocke la propriété 'todos' de data dans la variable 'todos'
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;

		callback = callback || function () {};

		// Si on a appelé la méthode avec un ID en argument
		// Trouve l'item associé à l'ID et update ses propriétés
		if (id) {
			for (var i = 0; i < todos.length; i++) {
				// si un ID de l'array 'todos' correspond à l'ID appelé
				if (todos[i].id === id) {
					// pour chaque valeur de l'array updateData envoyé en argument de cette méthode
					// le mettre à jour avec la valeur de 'todos[i]'
					for (var key in updateData) {
						todos[i][key] = updateData[key];
					}
					break;
				}
			}

			// convertit 'data' en string et stocke le résultat dans localStorage[this._dbName]
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, todos);
		// Si aucun ID n'a été mis en argument lors de l'appel de la méthode
		} else {
			// génère un nouvel ID
			var newId = generateNewId();
			// tant que l'ID existe déjà
			while (isExistingId(newId, todos)) {
				newId = generateNewId();
			}
			// suppr console.log()
			// console.log('Element with ID: ' + newId + ' has been created')
  		// assigne la nouvelle ID
			updateData.id = parseInt(newId);
			// push l'array 'todos' avec updateData
			todos.push(updateData);
			// covnertit 'data' en string et le stocke dans localStorage[this._dbName]
			localStorage[this._dbName] = JSON.stringify(data);
			// ??
			callback.call(this, [updateData]);
		}
	};

// IV. store.remove(id, callback)
// 1. Retire un item du store en se basant sur son ID
	/**
	 * @param {number} id l'ID de l'item à retirer
	 * @param {function} callback le callback à appeler après l'action
	 */
	Store.prototype.remove = function (id, callback) {
		// convertit localStorage[this._dbName] en objet JS et le stocke dans data
		var data = JSON.parse(localStorage[this._dbName]);
		// stocke la propriété 'todos' de 'data' dans la variable 'todos'
		var todos = data.todos;
		var todoId;
		// pour chaque membre de l'array 'todos'
		for (var i = 0; i < todos.length; i++) {
			// si l'id du membre[i] correspond à l'id appelé en argument
			if (todos[i].id == id) {
				// stocke cet id dans la variable 'todoId'
				todoId = todos[i].id;
			}
		}
		// OPTIMISATION #1
		// deuxième boucle redondante?
		// pour chaque membre de l'array 'todos'
		for (var i = 0; i < todos.length; i++) {
			// si l'id du membre[i] correspond à todoId
			if (todos[i].id == todoId) {
				// coupe l'array 'todos' à hauteur du membre[i] pour 1 élément
				todos.splice(i, 1);
			}
		}
		// convertit 'data' en string et stocke le résultat dans localStorage[this._dbName]
		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, todos);
	};

// V. store.drop(callback)
// 1. Largue tout le storage et repart à 0
	/**
	 * @param {function} callback The callback to fire after dropping the data
	 */
	Store.prototype.drop = function (callback) {
		// crée un objet 'data' avec une propriété 'todos' qui est un tableau
		var data = {todos: []};
		// convertit l'objet 'data' en string et stocke le résultat dans localStorage[this._dbName]
		localStorage[this._dbName] = JSON.stringify(data);
		// appelle le callback
		callback.call(this, data.todos);
	};

	// Export to window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);
