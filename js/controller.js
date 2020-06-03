(function (window) {
	'use strict';

// OBJECT Controller __________________________________ */
// 1. Prend un objet 'model' et un objet 'view' et agit comme un contrôleur entre eux
	/**
	 * @constructor
	 * @param {object} model The model instance
	 * @param {object} view The view instance
	 */
	function Controller(model, view) {
		var self = this;
		self.model = model;
		self.view = view;
		// on utilise la méthode 'view.bind(event, handler)'
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
// MÉTHODES (5) _______________________________________ */
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
	};
// VII. controller.editItemSave(id, title)
// 1. clot le mode édition après un succès
	/*
	 */
	Controller.prototype.editItemSave = function (id, title) {
		var self = this;
		// OPTIMISATION #2 : trim() ici ?
		// tant que title[0] égale un espace
		while (title[0] === " ") {
			// title = title moins le premier caractère
			title = title.slice(1);
		}
		// tant que title[title.length-1] égale un espace
		while (title[title.length-1] === " ") {
			// title = title à partir de 0 moins les deux derniers caractères
			title = title.slice(0, -1);
		}
		// si le titre contient des caractères
		if (title.length !== 0) {
			self.model.update(id, {title: title}, function () {
				self.view.render('editItemDone', {id: id, title: title});
			});
		} else {
			// si le titre est vide
			self.removeItem(id);
		}
	};
// VIII. controller.editItemCancel
	/*
	 */
	Controller.prototype.editItemCancel = function (id) {
		var self = this;
		self.model.read(id, function (data) {
			self.view.render('editItemDone', {id: id, title: data[0].title});
		});
	};

	/**
	 * By giving it an ID it'll find the DOM element matching that ID,
	 * remove it from the DOM and also remove it from storage.
	 *
	 * @param {number} id The ID of the item to remove from the DOM and
	 * storage
	 */
	Controller.prototype.removeItem = function (id) {
		var self = this;
		var items;
		self.model.read(function(data) {
			items = data;
		});
		// optimisation : à quoi ça sert ?
		items.forEach(function(item) {
			if (item.id === id) {
				// console.log("Element with ID: " + id + " has been removed.");
			}
		});

		self.model.remove(id, function () {
			self.view.render('removeItem', id);
		});

		self._filter();
	};

	/**
	 * Will remove all completed items from the DOM and storage.
	 */
	Controller.prototype.removeCompletedItems = function () {
		var self = this;
		self.model.read({ completed: true }, function (data) {
			data.forEach(function (item) {
				self.removeItem(item.id);
			});
		});

		self._filter();
	};

	/**
	 * Give it an ID of a model and a checkbox and it will update the item
	 * in storage based on the checkbox's state.
	 *
	 * @param {number} id The ID of the element to complete or uncomplete
	 * @param {object} checkbox The checkbox to check the state of complete
	 *                          or not
	 * @param {boolean|undefined} silent Prevent re-filtering the todo items
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
	};

	/**
	 * Will toggle ALL checkboxes' on/off state and completeness of models.
	 * Just pass in the event object.
	 */
	Controller.prototype.toggleAll = function (completed) {
		var self = this;
		self.model.read({ completed: !completed }, function (data) {
			data.forEach(function (item) {
				self.toggleComplete(item.id, completed, true);
			});
		});

		self._filter();
	};

	/**
	 * Updates the pieces of the page which change depending on the remaining
	 * number of todos.
	 */
	Controller.prototype._updateCount = function () {
		var self = this;
		self.model.getCount(function (todos) {
			self.view.render('updateElementCount', todos.active);
			self.view.render('clearCompletedButton', {
				completed: todos.completed,
				visible: todos.completed > 0
			});

			self.view.render('toggleAll', {checked: todos.completed === todos.total});
			self.view.render('contentBlockVisibility', {visible: todos.total > 0});
		});
	};

	/**
	 * Re-filters the todo items, based on the active route.
	 * @param {boolean|undefined} force  forces a re-painting of todo items.
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
	};

	/**
	 * Simply updates the filter nav's selected states
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
	};

	// Export to window
	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);
