/* global qs, qsa, $on, $parent, $delegate */
(function (window) {
	'use strict';

	/**
	 * <b>DESCR:</b><br>
   * View that abstracts away the browser's DOM completely.
   * It has two simple entry points:
   *
   *   - bind(eventName, handler)
   *     Takes a todo application event and registers the handler
   *   - render(command, parameterObject)
   *     Renders the given command with the options
	 *
	 * @constructor
	 *
	 * @param {object} template Instance of the Template class.
   */
	function View(template) {
		this.template = template;

		this.ENTER_KEY = 13;
		this.ESCAPE_KEY = 27;

		this.$todoList = qs('.todo-list');
		this.$todoItemCounter = qs('.todo-count');
		this.$clearCompleted = qs('.clear-completed');
		this.$main = qs('.main');
		this.$footer = qs('.footer');
		this.$toggleAll = qs('.toggle-all');
		this.$newTodo = qs('.new-todo');
	}

// MÉTHODES (11) ______________________________________ */

	/**
	 * <b>DESCR:</b><br>
	 * Will remove one item based on its ID.
	 *
	 * @param {number} id The item's ID.
	 *
	 */
	View.prototype._removeItem = function (id) {
		var elem = qs('[data-id="' + id + '"]');

		if (elem) {
			this.$todoList.removeChild(elem);
		}
	};

	/**
	 * <b>DESCR:</b><br>
	 * Will remove all completed items on button click.
	 *
	 * @param {number} completedCount Number of items completed.
	 * @param {boolean} visible Item is || isn't visible.
	 *
	 */
	View.prototype._clearCompletedButton = function (completedCount, visible) {
		this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
		this.$clearCompleted.style.display = visible ? 'block' : 'none';
	};

	/**
	 * <b>DESCR:</b><br>
	 * Applies filter to the view.
	 *
	 * @param {string} currentPage '' | 'active' | 'completed'
	 *
	 */
	View.prototype._setFilter = function (currentPage) {
		qs('.filters .selected').className = '';
		qs('.filters [href="#/' + currentPage + '"]').className = 'selected';
	};

	/**
	 * <b>DESCR:</b><br>
	 * Sets item status to 'completed'
	 *
	 * @param {number} id The item's ID.
	 * @param {boolean} completed Item's completed status.
	 *
	 */
	View.prototype._elementComplete = function (id, completed) {
		var listItem = qs('[data-id="' + id + '"]');

		if (!listItem) {
			return;
		}

		listItem.className = completed ? 'completed' : '';

		qs('input', listItem).checked = completed;
	};

	/**
	 * <b>DESCR:</b><br>
	 * Edit item's content.
	 *
	 * @param {number} id The item's ID.
	 * @param {string} title Item's title.
	 *
	 */
	View.prototype._editItem = function (id, title) {
		var listItem = qs('[data-id="' + id + '"]');
		if (!listItem) {
			return;
		}

		listItem.className = listItem.className + ' editing';

		var input = document.createElement('input');
		input.className = 'edit';

		listItem.appendChild(input);
		input.focus();

		input.value = title;
	};

	/**
	 * <b>DESCR:</b><br>
	 * Exits Item editing mode.
	 *
	 * @param {number} id The item's ID.
	 * @param {string} title Item's title.
	 *
	 */
	View.prototype._editItemDone = function (id, title) {
		var listItem = qs('[data-id="' + id + '"]');

		if (!listItem) {
			return;
		}

		var input = qs('input.edit', listItem);
		listItem.removeChild(input);

		listItem.className = listItem.className.replace('editing', '');

		qsa('label', listItem).forEach(function (label) {
			label.textContent = title;
		});
	};

	/**
	 * <b>DESCR:</b><br>
	 * Renders view for all the methods of this object.
	 *
	 * @param {string} viewCmd The command to execute.
	 * @param {number|object} parameter The data to pass in the called function.
	 *
	 */
	View.prototype.render = function (viewCmd, parameter) {
		var self = this;

		var viewCommands = {
			showEntries: function () {
				self.$todoList.innerHTML = self.template.show(parameter);
			},
			removeItem: function () {
				self._removeItem(parameter);
			},
			updateElementCount: function () {
				self.$todoItemCounter.innerHTML = self.template.itemCounter(parameter);
			},
			clearCompletedButton: function () {
				self._clearCompletedButton(parameter.completed, parameter.visible);
			},
			contentBlockVisibility: function () {
				self.$main.style.display = self.$footer.style.display = parameter.visible ? 'block' : 'none';
			},
			toggleAll: function () {
				self.$toggleAll.checked = parameter.checked;
			},
			setFilter: function () {
				self._setFilter(parameter);
			},
			clearNewTodo: function () {
				self.$newTodo.value = '';
			},
			elementComplete: function () {
				self._elementComplete(parameter.id, parameter.completed);
			},
			editItem: function () {
				self._editItem(parameter.id, parameter.title);
			},
			editItemDone: function () {
				self._editItemDone(parameter.id, parameter.title);
			}
		};

		viewCommands[viewCmd]();
	};

	/**
	 * <b>DESCR:</b><br>
	 * Finds one item's ID based on its DOM dataset.
	 *
	 * @param {string} element The DOM element containing item's dataset.
	 *
	 * @returns {number} The item's ID.
	 */
	View.prototype._itemId = function (element) {
		var li = $parent(element, 'li');

		return parseInt(li.dataset.id, 10);
	};

	/**
	 * <b>DESCR:</b><br>
	 * ???
	 *
	 * @param {function} handler
	 */
	View.prototype._bindItemEditDone = function (handler) {
		var self = this;
		$delegate(self.$todoList, 'li .edit', 'blur', function () {
			if (!this.dataset.iscanceled) {
				handler({
					id: self._itemId(this),
					title: this.value
				});
			}
		});

		$delegate(self.$todoList, 'li .edit', 'keypress', function (event) {
			if (event.keyCode === self.ENTER_KEY) {
				this.blur();
			}
		});
	};

	/**
	 * <b>DESCR:</b><br>
	 * ???
	 *
	 * @param {function} handler
	 */
	View.prototype._bindItemEditCancel = function (handler) {
		console.log(handler)
		var self = this;
		$delegate(self.$todoList, 'li .edit', 'keyup', function (event) {
			if (event.keyCode === self.ESCAPE_KEY) {
				this.dataset.iscanceled = true;
				this.blur();

				handler({id: self._itemId(this)});
			}
		});
	};

	/**
	 * <b>DESCR:</b><br>
	 * Binds an event to a function handler.
	 *
	 * @param {string} event The name of the event.
	 * @param {function} handler The function to call with the event.
	 */
	View.prototype.bind = function (event, handler) {
		var self = this;
		if (event === 'newTodo') {
			$on(self.$newTodo, 'change', function () {
				handler(self.$newTodo.value);
			});

		} else if (event === 'removeCompleted') {
			$on(self.$clearCompleted, 'click', function () {
				handler();
			});

		} else if (event === 'toggleAll') {
			$on(self.$toggleAll, 'click', function () {
				handler({completed: this.checked});
			});

		} else if (event === 'itemEdit') {
			$delegate(self.$todoList, 'li label', 'dblclick', function () {
				handler({id: self._itemId(this)});
			});

		} else if (event === 'itemRemove') {
			$delegate(self.$todoList, '.destroy', 'click', function () {
				handler({id: self._itemId(this)});
			});

		} else if (event === 'itemToggle') {
			$delegate(self.$todoList, '.toggle', 'click', function () {
				handler({
					id: self._itemId(this),
					completed: this.checked
				});
			});

		} else if (event === 'itemEditDone') {
			self._bindItemEditDone(handler);

		} else if (event === 'itemEditCancel') {
			self._bindItemEditCancel(handler);
		}
	};

	window.app = window.app || {};
	window.app.View = View;
})(window);
