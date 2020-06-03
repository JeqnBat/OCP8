/*global qs, qsa, $on, $parent, $delegate */
(function (window) {
	'use strict';

// OBJET View _________________________________________ */
// 1. L'objet View représente le DOM
// 2. Il a 2 points d'entrée dans l'appli (2 méthodes):
//			a. bind(eventName, handler)
//			   Prend un event et enregistre le handler
//			b. render(command, parameterObject)
//				 Effectue la commande appelée avec les options
	function View(template) {
		this.template = template;

		this.ENTER_KEY = 13;
		this.ESCAPE_KEY = 27;
		// 'qs' défini dans 'helpers.js' -> qs(selector, scope)
		this.$todoList = qs('.todo-list');
		this.$todoItemCounter = qs('.todo-count');
		this.$clearCompleted = qs('.clear-completed');
		this.$main = qs('.main');
		this.$footer = qs('.footer');
		this.$toggleAll = qs('.toggle-all');
		this.$newTodo = qs('.new-todo');
	}
// MÉTHODES ( ) _______________________________________ */
// I. view._removeItem(id)
// 1. Retire un élément de la <li> grâce à son id
	View.prototype._removeItem = function (id) {
		var elem = qs('[data-id="' + id + '"]');
		// si 'elem' existe
		if (elem) {
			// retirer 'elem' de '$todolist'
			this.$todoList.removeChild(elem);
		}
	};
// II. view._clearCompletedButton(completedCount, visible)
// 1.
	View.prototype._clearCompletedButton = function (completedCount, visible) {
		this.$clearCompleted.innerHTML = this.template.clearCompletedButton(completedCount);
		// si 'visible' est true -> display:block; else, display:none;
		this.$clearCompleted.style.display = visible ? 'block' : 'none';
	};
// III. view._setFilter(currentPage)
	View.prototype._setFilter = function (currentPage) {
		// sélectionne les éléments de classe filters dans le scope selected et
		// les vide de leurs classes
		qs('.filters .selected').className = '';
		// sélectionne les éléments de classe filters dans le scope [href="#/' + currentPage + '"]
		// et leur affecte la classe 'selected'
		qs('.filters [href="#/' + currentPage + '"]').className = 'selected';
	};
// IV. view._elementComplete(id, completed)
// 1.
	View.prototype._elementComplete = function (id, completed) {
		var listItem = qs('[data-id="' + id + '"]');
		// si 'listItem' n'existe pas
		if (!listItem) {
			return;
		}
		// si 'listItem' existe
			// si completed existe alors className de listItem = 'completed', sinon className = ''
		listItem.className = completed ? 'completed' : '';

		// In case it was toggled from an event and not by clicking the checkbox
		qs('input', listItem).checked = completed;
	};
// V. view._editItem(id, title)
// 1.
	View.prototype._editItem = function (id, title) {
		// 'listItem' stocke l'élément du DOM dont l'id a été appelé
		var listItem = qs('[data-id="' + id + '"]');
		// si 'listItem' n'existe pas : return
		if (!listItem) {
			return;
		}
		// Sinon, modifie le className de listItem	en ajoutant la string ' editing'
		listItem.className = listItem.className + ' editing';
		// crée une variable input qui stocke un élément créé du DOM et appelé 'input'
		var input = document.createElement('input');
		// ajoute la classe 'edit' à cet élément
		input.className = 'edit';
		// ajoute input à listItem
		listItem.appendChild(input);
		// focus input
		input.focus();
		// passer 'title' comme valeur de input
		input.value = title;
	};
// VI. view._editItemDone(id, title)
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
// VII. view.render(viewCmd, parameter)
// 1. Distribue les méthodes précédentes par le biais d'un objet (viewCommands)
	View.prototype.render = function (viewCmd, parameter) {
		var self = this;
		// crée un objet 'viewCommands'
		// chaque clef de l'objet représente une commande, chaque valeur, l'action à effectuer lorsque la commande est appelée
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
		// lors de l'appel, une des clefs de viewCommands remplace viewCmd
		viewCommands[viewCmd]();
	};
// VIII. view_editItemDone
	View.prototype._itemId = function (element) {
		var li = $parent(element, 'li');
		return parseInt(li.dataset.id, 10);
	};
// IX. view._bindItemEditDone(handler)
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
				// Remove the cursor from the input when you hit enter just like if it
				// were a real form
				this.blur();
			}
		});
	};
// X. view._bindItemEditCancel(handler)
	View.prototype._bindItemEditCancel = function (handler) {
		var self = this;
		$delegate(self.$todoList, 'li .edit', 'keyup', function (event) {
			if (event.keyCode === self.ESCAPE_KEY) {
				this.dataset.iscanceled = true;
				this.blur();

				handler({id: self._itemId(this)});
			}
		});
	};
// XI. view.bind(event, handler)
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

	// Export to window
	window.app = window.app || {};
	window.app.View = View;
}(window));
