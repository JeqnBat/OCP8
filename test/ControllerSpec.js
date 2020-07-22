/*global app, jasmine, describe, it, beforeEach, expect */

describe('controller', function () {
	'use strict';
	// ces 3 variables sont définies dans beforeEach
	var subject, model, view, controller;

	// fonction 'setUpModel(todos)' - prépare l'objet 'model', 2nd paramètre de 'controller'
	var setUpModel = function (todos) {
		// '.and.callFake' simule un appel de model.read() en appelant les mêmes arguments
		model.read.and.callFake(function (query, callback) {
			callback = callback || query;
			callback(todos);
		});

		// obtient le nombre de todos actifs, terminés et le total
		model.getCount.and.callFake(function (callback) {

			var todoCounts = {
				active: todos.filter(function (todo) {
					return !todo.completed;
				}).length,
				completed: todos.filter(function (todo) {
					// double !! = booléen inversé, retourne true ou false
					return !!todo.completed;
				}).length,
				total: todos.length
			};

			callback(todoCounts);
		});

		model.remove.and.callFake(function (id, callback) {
			callback();
		});

		model.create.and.callFake(function (title, callback) {
			callback();
		});

		model.update.and.callFake(function (id, updateData, callback) {
			callback();
		});
	};

	// 'view' = paramètre #2 de l'objet controller
	var createViewStub = function () {
		var eventRegistry = {};
		return {
			render: jasmine.createSpy('render'),
			bind: function (event, handler) {
				eventRegistry[event] = handler;
			},
			trigger: function (event, parameter) {
				eventRegistry[event](parameter);
			}
		};
	};
	// run avant chaque test
	beforeEach(function () {
		// mock = simuler; on simule des appels au code
		// on utilise des SPIES pour MOCKER, çàd simuler des appels de fonction
		model = jasmine.createSpyObj('model', ['read', 'getCount', 'remove', 'create', 'update']);
		/* createSpyObj retourne un objet ( ici 'model') qui a des propriétés pour chaque string
					 model.read()
				   model.getCount()
					 model.remove()
					 model.create()
					 model.update()
	 */
		view = createViewStub();
		// hérite de toutes les méthodes & propriétés de l'objet controller
		subject = new app.Controller(model, view);
	});
	/* LEXIQUE :
			.entry = une ligne dans le modèle (une valeur supplémentaire à l'array data[])
			.route = suffixe de l'url (ex: '/#', '/#/active')
			.[object object] dans la console = paire clé: propriété (ex: '{completed: true}')
			. ATTENTION!! l'ajout d'un string dans la console rend impossible la lecture de l'OBJET!!
			. pour lire l'objet il faut l'afficher SEUL dans la console : console.log(todos); sans + 'TODOS'
			.Structure des objets todos (3 propriétés) :
								todos:[{
									"title":"eazeazea",
									"completed":true,
									"id":99663
								}]
			  On peut retrouver ces objets dans store.js, méthode findAll()
			.Impossible d'accéder aux propriétés de l'objet MODEL car celui qu'on utilise ici est un MOCK
					On a faké les méthodes de model pour SPYON et vérifier les valeurs avec lesquelles elles sont appelées.
					MAIS, tout le reste est inaccessible : il est donc impossible de vérifier combien de todos sont actifs
					puisque cette information est stockée dans le vrai MODEL et qu'on n'y accède pas.
	*/
	// TEST #1
	it('should show entries on start-up', function () {
		var todo = [
			{title: 'my todo1', completed: true},
			{title: 'my todo2', completed: true},
			{title: 'my todo3', completed: true},
			{title: 'my todo4', completed: false},
			{title: 'my todo5', completed: false}
		];
		setUpModel(todo);

		subject.setView('');

		expect(model.read).toHaveBeenCalledWith(jasmine.any(Function));
		expect(view.render).toHaveBeenCalledWith('showEntries', todo);
	});

	describe('routing', function () {
		// TEST #2
		it('should show all entries without a route', function () {
			var todo = [
				{title: 'my todo1', completed: true},
				{title: 'my todo2', completed: true},
				{title: 'my todo3', completed: true},
				{title: 'my todo4', completed: false},
				{title: 'my todo5', completed: false}
			];
			setUpModel(todo);

			subject.setView('');

			expect(model.read).toHaveBeenCalledWith(jasmine.any(Function));
			expect(view.render).toHaveBeenCalledWith('showEntries', todo);
		});

		it('should show all entries without "all" route', function () {
			var todo = [
				{title: 'my todo1', completed: true},
				{title: 'my todo2', completed: true},
				{title: 'my todo3', completed: true},
				{title: 'my todo4', completed: false},
				{title: 'my todo5', completed: false}
			];
			setUpModel(todo);

			subject.setView('#/');
			expect(model.read).toHaveBeenCalledWith(jasmine.any(Function));
			expect(view.render).toHaveBeenCalledWith('showEntries', todo);
		});
		// TEST #3
		it('should show active entries', function () {
			var todo = [
				{title: 'my todo1', completed: true},
				{title: 'my todo2', completed: true},
				{title: 'my todo3', completed: true},
				{title: 'my todo4', completed: false},
				{title: 'my todo5', completed: false}
			];
			setUpModel(todo);

			subject.setView('#/active');

			expect(model.read).toHaveBeenCalledWith({completed: false}, jasmine.any(Function));
			expect(view.render).toHaveBeenCalledWith('showEntries', todo);
		});
		// TEST #4
		it('should show completed entries', function () {
			var todo = [
				{title: 'my todo1', completed: true},
				{title: 'my todo2', completed: true},
				{title: 'my todo3', completed: true},
				{title: 'my todo4', completed: false},
				{title: 'my todo5', completed: false}
			];
			setUpModel(todo);

			subject.setView('#/completed');

			expect(model.read).toHaveBeenCalledWith({completed: true}, jasmine.any(Function));
			expect(view.render).toHaveBeenCalledWith('showEntries', todo);
		});
	});

	it('should show the content block when todos exists', function () {
		setUpModel([{title: 'my todo', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: true
		});
	});

	it('should hide the content block when no todos exists', function () {
		setUpModel([]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: false
		});
	});

	it('should check the toggle all button, if all todos are completed', function () {
		setUpModel([{title: 'my todo', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('toggleAll', {
			checked: true
		});
	});

	it('should set the "clear completed" button', function () {
		var todo = {id: 42, title: 'my todo', completed: true};
		setUpModel([todo]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
			completed: 1,
			visible: true
		});
	});
	// TEST #5
	it('should highlight "All" filter by default', function () {
		var todo = {id: 42, title: 'my todo', completed: true};
		setUpModel([todo]);

		subject.setView('');
		expect(view.render).toHaveBeenCalledWith('setFilter', '');
	});
// TEST #6
	it('should highlight "Active" filter when switching to active view', function () {
		var todo = {id: 78, title: 'my active todo', completed: false};
		setUpModel([todo]);

		subject.setView('#/active');
		expect(view.render).toHaveBeenCalledWith('setFilter', 'active');
	});

	describe('toggle all', function () {
		// TEST #7
		it('should toggle all todos to completed', function () {
			var todo = [
				{title: 'my todo1', completed: true},
				{title: 'my todo2', completed: true},
				// {title: 'my todo3', completed: false},
				{title: 'my todo4', completed: true}
			];
			setUpModel(todo);

			subject.setView('');

			view.trigger('toggleAll', jasmine.any(Function));

			expect(view.render).toHaveBeenCalledWith('toggleAll', {checked: true});

		});
		// TEST #8
		it('should update the view', function () {
			var todo = [
				{title: 'my todo1', completed: true},
				{title: 'my todo2', completed: true},
				{title: 'my todo3', completed: false}
				// {title: 'my todo4', completed: false}
			];
			setUpModel(todo);

			subject.setView('');

			expect(model.getCount).toHaveBeenCalled();
			expect(view.render).toHaveBeenCalledWith('updateElementCount', 1);
			expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
						completed: 2,
						visible: true
					});
			expect(view.render).toHaveBeenCalledWith('toggleAll', {checked: false});
			expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {visible: true});
		});
	});

	describe('new todo', function () {
		// TEST #9
		it('should add a new todo to the model', function () {
			setUpModel([]);

			subject.setView('');

			view.trigger('newTodo', 'a new todo');

			expect(model.create).toHaveBeenCalledWith('a new todo', jasmine.any(Function));
		});

		it('should add a new todo to the view', function () {
			setUpModel([]);

			subject.setView('');

			view.render.calls.reset();
			model.read.calls.reset();
			model.read.and.callFake(function (callback) {
				callback([{
					title: 'a new todo',
					completed: false
				}]);
			});

			view.trigger('newTodo', 'a new todo');

			expect(model.read).toHaveBeenCalled();

			expect(view.render).toHaveBeenCalledWith('showEntries', [{
				title: 'a new todo',
				completed: false
			}]);
		});

		it('should clear the input field when a new todo is added', function () {
			setUpModel([]);

			subject.setView('');

			view.trigger('newTodo', 'a new todo');

			expect(view.render).toHaveBeenCalledWith('clearNewTodo');
		});
	});

	describe('element removal', function () {
		it('should remove an entry from the model', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(model.read).toHaveBeenCalledWith(jasmine.any(Function));
			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		it('should remove an entry from the view', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});

		it('should update the element count', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('updateElementCount', 0);
		});
	});

	describe('remove completed', function () {
		it('should remove a completed entry from the model', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(model.read).toHaveBeenCalledWith({completed: true}, jasmine.any(Function));
			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		it('should remove a completed entry from the view', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});
	});

	describe('element complete toggle', function () {
		it('should update the model', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', {id: 21, completed: true});

			expect(model.update).toHaveBeenCalledWith(21, {completed: true}, jasmine.any(Function));
		});

		it('should update the view', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', {id: 42, completed: false});

			expect(view.render).toHaveBeenCalledWith('elementComplete', {id: 42, completed: false});
		});
	});

	describe('edit item', function () {
		it('should switch to edit mode', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEdit', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItem', {id: 21, title: 'my todo'});
		});

		it('should leave edit mode on done', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'new title'});
		});

		it('should persist the changes on done', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(model.update).toHaveBeenCalledWith(21, {title: 'new title'}, jasmine.any(Function));
		});

		it('should remove the element from the model when persisting an empty title', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
		});

		it('should remove the element from the view when persisting an empty title', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(view.render).toHaveBeenCalledWith('removeItem', 21);
		});

		it('should leave edit mode on cancel', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'my todo'});
		});

		it('should not persist the changes on cancel', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(model.update).not.toHaveBeenCalled();
		});
	});
});
