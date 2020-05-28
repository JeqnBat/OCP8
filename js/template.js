/*jshint laxbreak:true */
(function (window) {
	'use strict';

// Objet htmlEscapes stocke des valeurs html correspondant à leur caractère UTF8
	var htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#x27;',
		'`': '&#x60;'
	};

// Variable qui sert de sélecteur à l'objet htmlEscapes
	var escapeHtmlChar = function (chr) {
		return htmlEscapes[chr];
	};

	var reUnescapedHtml = /[&<>"'`]/g;
	var reHasUnescapedHtml = new RegExp(reUnescapedHtml.source);

// L'opérateur (ternaire) conditionnel est le seul opérateur JavaScript
// qui comporte trois opérandes. Cet opérateur est fréquemment utilisé comme
// raccourci pour la déclaration de Instructions/if...else.
// ici on teste pour savoir si un caractère spécial doit être remplacé dans le DOM
	var escape = function (string) {
		// condition ? exprSiVrai : exprSiFaux
		// teste 'string & reHasUnescapedHtml.test(string)'
		return (string && reHasUnescapedHtml.test(string))
			// Écrire après un return ? Pq c'est censé être sur la même ligne : opérateur conditionnel
			// si le test renvoie true alors remplacer la string
			? string.replace(reUnescapedHtml, escapeHtmlChar)
			// si renvoie faux alors ne pas changer la string
			: string;
	};

// OBJET Template _____________________________________ */
// 1. Prépare des valeurs par défaut pour toutes les méthodes de Template, comme un template par défaut (?)
	/**
	 * @constructor
	 */
	function Template() {
		// apparence de la liste contenant les Todos
		this.defaultTemplate
		=	'<li data-id="{{id}}" class="{{completed}}">'
		+		'<div class="view">'
		+			'<input class="toggle" type="checkbox" {{checked}}>'
		+			'<label>{{title}}</label>'
		+			'<button class="destroy"></button>'
		+		'</div>'
		+	'</li>';
	}
// MÉTHODES (3) _______________________________________ */
// I. template.show(data)
// 1. Crée un string HTML avec <li>
// 2. Renvoie ce string dans l'appli
// Note: En réalité il faudrait utiliser un moteur de templating tel que Mustache
//			 ou Handlebars, toutefois, ceci est un exemple vanilla js.
	/**
	 * @param {object} data Objet contenant les valeurs que l'on souhaite remplacer
	 * @returns {string} String d'un élément HTML de type <li>
	 *
	 * @example
	 * view.show({
	 *	id: 1,
	 *	title: "Hello World",
	 *	completed: 0,
	 * });
	 */
	Template.prototype.show = function (data) {
		var i, l;
		var view = '';
		// pour chaque membre de data
		for (i = 0, l = data.length; i < l; i++) {
			var template = this.defaultTemplate;
			var completed = '';
			var checked = '';
			// si la propriété 'completed' de data[i] est TRUE alors
			if (data[i].completed) {
				// modifier la variable completed
				completed = 'completed';
				// modifier la variable checked
				checked = 'checked';
			}
			// remplace les placeholders par les vraies valeurs
			template = template.replace('{{id}}', data[i].id);
			template = template.replace('{{title}}', escape(data[i].title));
			template = template.replace('{{completed}}', completed);
			template = template.replace('{{checked}}', checked);

			view = view + template;
		}

		return view;
	};
// II. template.itemCounter(activeTodos)
// 1. Affiche un compteur du nombre de Todos à compléter
	/**
	 * @param {number} activeTodos Le nombre des todos actifs.
	 * @returns {string} un string contenant le nombre.
	 */
	Template.prototype.itemCounter = function (activeTodos) {
		// si activeTodos = 1 alors plural est vide, sinon il équivaut à la string 's'
		var plural = activeTodos === 1 ? '' : 's';
		// retourne activeTodos en BOLD + rajoute un 's' à 'item' si jamais il y a + d'un activeTodo
		return '<strong>' + activeTodos + '</strong> item' + plural + ' left';
	};
// III. template.clearCompletedButton(completedTodos)
// 1. Met à jour le text à l'intérieur du bouton "clear completed"
	/**
	 * @param  {[type]} completedTodos le nombre de todos complétés
	 * @returns {string} un string contenant ce nombre
	 */
	Template.prototype.clearCompletedButton = function (completedTodos) {
		if (completedTodos > 0) {
			return 'Clear completed';
		} else {
			return '';
		}
	};

	// Export to window
	window.app = window.app || {};
	window.app.Template = Template;
})(window);
