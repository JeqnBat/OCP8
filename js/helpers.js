/*global NodeList */
(function (window) {
	'use strict';
/* helpers.js
	1. Définit des variables utilisées par l'appli comme sélecteurs CSS
	2. Ajoute un event listener sur le document entier (window)
		 cet event listener est appelé deux fois dans app.js
		 	a. 	$on(window, 'load', setView);
			b.	$on(window, 'hashchange', setView);
		 pour deux types d'événements différents :
		 	a. chargement de la fenêtre
			b. changement du 'hash'
		 pour chacun de ces événements, l'event listener appelle une fonction 'setView()'
*/
// SÉLECTEURS de classes CSS
	// Sélectionne le PREMIER élément dans un contexte défini (scope)
	window.qs = function (selector, scope) {
		// soit TOUT le document, soit un SCOPE plus restreint (à passer en argument à l'appel)
		return (scope || document).querySelector(selector);
	};
	// Sélectionne TOUS les éléments dans un contexte défini (scope)
	window.qsa = function (selector, scope) {
		// soit TOUT le document, soit un SCOPE plus restreint (à passer en argument à l'appel)
		return (scope || document).querySelectorAll(selector);
	};

	// event listener de window appelé dans app.js
	window.$on = function (target, type, callback, useCapture) {
		// à quoi sert useCapture et pkoi doit-il être différent ?
		target.addEventListener(type, callback, !!useCapture);
	};

// Méthode appelée dans view.js
	window.$delegate = function (target, selector, type, handler) {
		function dispatchEvent(event) {
			var targetElement = event.target;
			var potentialElements = window.qsa(selector, target);
			// indexOf renvoie -1 si son résultat est négatif (aucune occurence de l'élément recherché)
			// donc hasMatch = true || false
			var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

			// if hasMatch == true
			if (hasMatch) {
				handler.call(targetElement, event);
			}
		}

		// https://developer.mozilla.org/en-US/docs/Web/Events/blur
		// 'blur' ou 'focus' sont deux événements:
		// 'blur' se déclenche qd l'élément cible a perdu son focus
		// (ex: user clique ailleurs à l'extérieur d'un champ de saisi après l'avoir rempli :
		//  le champ perd son focus, il devient blur, l'event est déclenché)
		var useCapture = type === 'blur' || type === 'focus';

		window.$on(target, type, dispatchEvent, useCapture);
	};

	// Find the element's parent with the given tag name:
	// $parent(qs('a'), 'div');
	window.$parent = function (element, tagName) {
		if (!element.parentNode) {
			return;
		}
		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element.parentNode;
		}
		return window.$parent(element.parentNode, tagName);
	};

	// Allow for looping on nodes by chaining:
	// qsa('.foo').forEach(function () {})
	NodeList.prototype.forEach = Array.prototype.forEach;
})(window);
