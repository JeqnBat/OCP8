(function (window) {
	'use strict';

// OBJECT Controller __________________________________ */
// 1. Prend un objet 'model' et un objet 'view' et agit comme un contrôleur entre eux
	/**
	 * @constructor
	 * @param {object} model l'instance de 'model'
	 * @param {object} view l'instance de 'view'
	 */
	function Controller(model, view) {
		var self = this;
		// TEST DU TEST
		self.value = 5;

		self.model = model;
		self.view = view;
		// APPELS de la méthode 'view.bind(event, handler)'
		self.view.bind('newTodo', function (title) {
			self.addItem(title);
		});

		self.view.bind('itemEdit', function (item) {
			self.editItem(item.id);
		});

		self.view.bind('itemEditDone', function (item) {
			self.editItemSave(item.id, item.title);
		});

		self.view.bind('itemEditCancel', function (item) {
			self.editItemCancel(item.id);
		});

		self.view.bind('itemRemove', function (item) {
			self.removeItem(item.id);
		});

		self.view.bind('itemToggle', function (item) {
			self.toggleComplete(item.id, item.completed);
		});

		self.view.bind('removeCompleted', function () {
			self.removeCompletedItems();
		});

		self.view.bind('toggleAll', function (status) {
			self.toggleAll(status.completed);
		});
	}

// TEST DU TEST
Controller.prototype.quiSuisJe = function () {
	var myName = 'JB';
	return myName;
};

// MÉTHODES (15) ______________________________________ */
// I. controller.setView(locationHash)
// 1. Charge & initialise la vue
	/**
	 * @param {string} '' | 'active' | 'completed'
	 * ici 'hash' doit être compris comme "morceau de"
	 */
	Controller.prototype.setView = function (locationHash) {
		// La méthode split() permet de diviser une chaîne de caractères
		// à partir d'un séparateur pour fournir un tableau de sous-chaînes.
		// Ici, divise 'locationHash' à partir de '/' et crée un array avec les morceaux découpés.
		var route = locationHash.split('/')[1]; // renvoie le 2eme membre de l'array créé par division de 'locationHash'
		var page = route || ''; // ?? route ou '' ?
		this._updateFilterState(page);
		// marker pour les tests
		console.log(`Controller.setView(${locationHash}) (1)`);
	};
// II. controller.showAll()
// 1. un événement à démarrer au chargement.
// 2. affichera tous les items de la todo list
	/**
	 */
	Controller.prototype.showAll = function () {
		var self = this;
		// appel à la méthode (read) de model.
		self.model.read(function (data) {
			// appel à render(viewCmd, parameter) de view
			self.view.render('showEntries', data);
		});
		// marker pour les tests
		console.log(`Controller.showAll() (2)`);
	};
// III. controller.showActive()
// 1. affiche toutes les tâches actives
	/**
	 */
	Controller.prototype.showActive = function () {
		var self = this;
		self.model.read({ completed: false }, function (data) {
			self.view.render('showEntries', data);
		});
		// marker pour les tests
		console.log(`Controller.showActive() (3)`);
	};
// IV. controller.showCompleted()
// 1. toutes les tâches complétées…
	/**
	 */
	Controller.prototype.showCompleted = function () {
		var self = this;
		self.model.read({ completed: true }, function (data) {
			self.view.render('showEntries', data);
		});
		// marker pour les tests
		console.log(`Controller.showCompleted() (4)`);
	};
// V. controller.addItem(title)
// 1. un événement à envoyer dès qu'on ajoute un item.
// 2. envoie l'objet de l'event qui s'occupe du DOM & sauvegarde la nouvelle item
	/**
	 */
	Controller.prototype.addItem = function (title) {
		var self = this;
		// La méthode trim() permet de retirer les blancs en début et fin de chaîne.
		// Les blancs considérés sont les caractères d'espacement
		// (espace, tabulation, espace insécable, etc.)
		// ainsi que les caractères de fin de ligne (LF, CR, etc.).

		// si le titre une fois 'trimé' est un string vide,
		// c'est qu'il ne contenait pas de caractères : arrête la fonction
		if (title.trim() === '') {
			return;
		}
		// sinon
		self.model.create(title, function () {
			self.view.render('clearNewTodo');
			self._filter(true);
		});
		// marker pour les tests
		console.log(`Controller.addItem(${title}) (5)`);
	};
// VI. controller.editItem
// 1. déclenche le mode d'édition d'item
	/*
	 */
	Controller.prototype.editItem = function (id) {
		var self = this;
		self.model.read(id, function (data) {
			self.view.render('editItem', {id: id, title: data[0].title});
		});
		// marker pour les tests
		console.log(`Controller.editItem(${id}) (6)`);
	};
// VII. controller.editItemSave(id, title)
// 1. clot le mode édition après un succès
	/*
	 */
	Controller.prototype.editItemSave = function (id, title) {
		var self = this;
		// OPTIMISATION #2 : trim() ici ?
		// tant que title[0] égale un espace
		// while (title[0] === " ") {
			// title = title moins le premier caractère
		// 	title = title.slice(1);
		// }
		// tant que title[title.length-1] égale un espace
		// while (title[title.length-1] === " ") {
			// title = title à partir de 0 moins les deux derniers caractères
		// 	title = title.slice(0, -1);
		// }

		// supprime les espaces avant et après le titre
		title = title.trim()
		// si le titre contient des caractères
		if (title.length !== 0) {
			self.model.update(id, {title: title}, function () {
				self.view.render('editItemDone', {id: id, title: title});
			});
		} else {
			// si le titre est vide
			self.removeItem(id);
		}
		// marker pour les tests
		console.log(`Controller.editItemSave(${id}, ${title}) (7)`);
	};
// VIII. controller.editItemCancel(id)
	/*
	 */
	Controller.prototype.editItemCancel = function (id) {
		var self = this;
		self.model.read(id, function (data) {
			self.view.render('editItemDone', {id: id, title: data[0].title});
		});
		// marker pour les tests
		console.log(`Controller.editItemCancel(${id}) (8)`);
	};
// IX. controller.removeItem(id)
// 1. efface l'élément du DOM avec l'id correspondante
// 2. efface l'élément du storage avec l'id correspondante
	/**
	 * @param {number} id l'id de l'élément à retirer
	 */
	Controller.prototype.removeItem = function (id) {
		var self = this;
		var items;
		self.model.read(function(data) {
			items = data;
		});

		// optimisation#3 : à quoi ça sert ?
		// items.forEach(function(item) {
		// 	if (item.id === id) {
				// console.log("Element with ID: " + id + " has been removed.");
		// 	}
		// });

		self.model.remove(id, function () {
			self.view.render('removeItem', id);
		});

		self._filter();
		// marker pour les tests
		console.log(`Controller.removeItem(${id}) (9)`);
	};
// X. controller.removeCompleted()
// 1. efface tous les items 'completed' du DOM & du Storage
	/**
	 */
	Controller.prototype.removeCompletedItems = function () {
		var self = this;
		self.model.read({ completed: true }, function (data) {
			data.forEach(function (item) {
				self.removeItem(item.id);
			});
		});

		self._filter();
		// marker pour les tests
		console.log(`Controller.removeCompletedItems() (10)`);
	};
// XI. controller.toggleComplete(id, completed, silent)
// 1. prend un ID et une checkbox et met à jour l'item dans le storage
	/**
	 * @param {number} id ID de l'élément à mettre "completed" ou "uncompleted"
	 * @param {object} checkbox La checkbox qui vérifie l'état
	 * @param {boolean|undefined} silent empêche le refiltrage des items de todo
	 */
	Controller.prototype.toggleComplete = function (id, completed, silent) {
		var self = this;
		self.model.update(id, { completed: completed }, function () {
			self.view.render('elementComplete', {
				id: id,
				completed: completed
			});
		});

		if (!silent) {
			self._filter();
		}
		// marker pour les tests
		console.log(`Controller.toggleComplete(${id}, ${completed}, ${silent}) (11)`);
	};
// XII. controller.toggleAll(completed)
// 1. modifie l'état de TOUTES les checkbox (on/off)
// 2. prend un objet event en argument
	/**
	 */
	Controller.prototype.toggleAll = function (completed) {
		var self = this;
		self.model.read({ completed: !completed }, function (data) {
			data.forEach(function (item) {
				self.toggleComplete(item.id, completed, true);
			});
		});

		self._filter();
		// marker pour les tests
		console.log(`Controller.toggleAll(${completed}) (12)`);
	};
// XIII. controller._updateCount()
// 1. Met à jour les morceaux de page qui doivent changer selon les todos qui restent à compléter
	/**
	 */
	Controller.prototype._updateCount = function () {
		var self = this;
		self.model.getCount(function (todos) {
			self.view.render('updateElementCount', todos.active);
			self.view.render('clearCompletedButton', {
				completed: todos.completed,
				visible: todos.completed > 0 // boolean
			});

			self.view.render('toggleAll', {checked: todos.completed === todos.total});
			self.view.render('contentBlockVisibility', {visible: todos.total > 0});
		});
		// marker pour les tests
		console.log(`Controller._updateCount() (13)`);
	};
// XIV. controller._filter(force)
// 1. Refiltre la liste des items, en se basant sur les actifs
	/**
	 * @param {boolean|undefined} force force un display des items du todo
	 */
	Controller.prototype._filter = function (force) {
		var activeRoute = this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);

		// Update the elements on the page, which change with each completed todo
		this._updateCount();

		// If the last active route isn't "All", or we're switching routes, we
		// re-create the todo item elements, calling:
		//   this.show[All|Active|Completed]();
		if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
			this['show' + activeRoute]();
		}

		this._lastActiveRoute = activeRoute;
		// marker pour les tests
		console.log(`Controller._filter(${force}) (14)`);
	};
// XV. controller._updateFilterState(currentPage)
// 1. met à jour l'état du filtre
	/**
	 */
	Controller.prototype._updateFilterState = function (currentPage) {
		// Store a reference to the active route, allowing us to re-filter todo
		// items as they are marked complete or incomplete.
		this._activeRoute = currentPage;

		if (currentPage === '') {
			this._activeRoute = 'All';
		}

		this._filter();

		this.view.render('setFilter', currentPage);
		// marker pour les tests
		console.log(`Controller._updateFilterState(${currentPage}) (15)`);
	};

	// Export to window
	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);
