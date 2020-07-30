(function (window) {
	'use strict';

	/**
	 * <b>DESCR:</b><br>
	 * Takes a model and view and acts as the controller between them.
	 *
	 * @constructor
	 *
	 * @param {object} model one instance of 'model'
	 * @param {object} view one instance of 'view'
	 */
	function Controller(model, view) {
		var self = this;
		self.model = model;
		self.view = view;

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

	/**
	 * <b>DESCR:</b><br>
	 * Loads & initialises the view.
	 *
	 * @param {string} '' | 'active' | 'completed'
	 */
	Controller.prototype.setView = function (locationHash) {
		var route = locationHash.split('/')[1];
		var page = route || '';
		this._updateFilterState(page);
	};

	/**
	 * <b>DESCR:</b><br>
	 * An event to fire on load. Will get all items and display them in the
	 * todo-list.
	 */
	Controller.prototype.showAll = function () {
		var self = this;
		self.model.read(function (data) {
			self.view.render('showEntries', data);
		});
	};

	/**
	 * <b>DESCR:</b><br>
	 * Displays all active tasks.
	 */
	Controller.prototype.showActive = function () {
		var self = this;
		self.model.read({ completed: false }, function (data) {
			self.view.render('showEntries', data);
		});
	};

	/**
	 * <b>DESCR:</b><br>
	 * Displays all completed tasks.
	 */
	Controller.prototype.showCompleted = function () {
		var self = this;
		self.model.read({ completed: true }, function (data) {
			self.view.render('showEntries', data);
		});
	};

	/**
	 * <b>DESCR:</b><br>
	 * An event that fires everytime an item is added. Simply pass in the event
	 * object and it'll handle the DOM insertion and saving of the new item.
	 *
	 * @param {string} title the new item's title
	 */
	Controller.prototype.addItem = function (title) {
		var self = this;

		if (title.trim() === '') {
			return;
		}

		self.model.create(title, function () {
			self.view.render('clearNewTodo');
			self._filter(true);
		});
	};

	/**
	 * <b>DESCR:</b><br>
	 * Triggers the item editing mode.
	 *
	 * @param {number} id the edited item's ID
	 */
	Controller.prototype.editItem = function (id) {
		var self = this;
		self.model.read(id, function (data) {
			self.view.render('editItem', {id: id, title: data[0].title});
		});
	};

	/**
	 * <b>DESCR:</b><br>
	 * Finishes the item editing mode successfully.
	 *
	 * @param {number} id the edited item's ID
	 * @param {string} title the edited item's title
	 */
	Controller.prototype.editItemSave = function (id, title) {
		var self = this;
		// OPTIMIZATION #2
		title = title.trim()

		if (title.length !== 0) {
			self.model.update(id, {title: title}, function () {
				self.view.render('editItemDone', {id: id, title: title});
			});
		} else {
			self.removeItem(id);
		}
	};

	/**
	 * <b>DESCR:</b><br>
	 * Cancels the item editing mode.
	 *
	 * @param {number} id the edited item's ID
	 */
	Controller.prototype.editItemCancel = function (id) {
		var self = this;
		self.model.read(id, function (data) {
			self.view.render('editItemDone', {id: id, title: data[0].title});
		});
	};

	/**
	 * <b>DESCR:</b><br>
	 * By giving it an ID it'll find the DOM element matching that ID,
	 * remove it from the DOM and also remove it from storage.
	 *
	 * @param {number} id the ID of the item to remove from the DOM and storage
	 */
	Controller.prototype.removeItem = function (id) {
		var self = this;
		var items;

		self.model.read(function(data) {
			items = data;
		});
		self.model.remove(id, function () {
			self.view.render('removeItem', id);
		});

		self._filter();
	};

	/**
	 * <b>DESCR:</b><br>
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
	 * <b>DESCR:</b><br>
	 * Give it an ID of a model and a checkbox and it will update the item
	 * in storage based on the checkbox's state.
	 *
	 * @param {number} id the ID of the item to complete or uncomplete
	 * @param {boolean} completed item is completed:true, or not:false
	 * @param {boolean|undefined} silent prevent re-filtering the todo items
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
	 * <b>DESCR:</b><br>
	 * Will toggle ALL checkboxes' on/off state and completeness of models.
 	 * Just pass in the event object.
	 *
	 * @param {boolean} completed prevent re-filtering the todo items
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
	 * <b>DESCR:</b><br>
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
	 * <b>DESCR:</b><br>
	 * Re-filters the todo items, based on the active route.
	 *
	 * @param {boolean|undefined} force forces a re-painting of todo items
	 */
	Controller.prototype._filter = function (force) {
		var activeRoute = this._activeRoute.charAt(0).toUpperCase() + this._activeRoute.substr(1);

		this._updateCount();

		if (force || this._lastActiveRoute !== 'All' || this._lastActiveRoute !== activeRoute) {
			this['show' + activeRoute]();
		}

		this._lastActiveRoute = activeRoute;
	};

	/**
	 * <b>DESCR:</b><br>
	 * Simply updates the filter state
	 *
	 * @param {string} currentPage '' | 'active' | 'completed'
	 */
	Controller.prototype._updateFilterState = function (currentPage) {
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
