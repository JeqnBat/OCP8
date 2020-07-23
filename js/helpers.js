/*global NodeList */
(function (window) {
	'use strict';
	/**
	 * <b>DESCR:</b><br>
	 * Get element(s) by CSS selector.
	 * @function
	 * @name qs
	 *
	 * @param {string} selector
	 * @param {string} scope
	 *
	 * @returns {object} a DOM element found in scope.
	 */
	window.qs = function (selector, scope) {
		return (scope || document).querySelector(selector);
	};

	/**
	 * <b>DESCR:</b><br>
	 * Selects all elements inside the scope.
	 * @function
	 * @name qsa
	 *
	 * @param {string} selector
	 * @param {string} scope
	 *
	 * @returns {object} all DOM elements found in scope.
	 */
	window.qsa = function (selector, scope) {
		return (scope || document).querySelectorAll(selector);
	};

	/**
	 * <b>DESCR:</b><br>
	 * AddEventListener wrapper.
	 * @function
	 * @name $on
	 *
	 * @param {object} target
	 * @param {string} type
	 * @param {function} callback
	 * @param {boolean} useCapture
	 */
	window.$on = function (target, type, callback, useCapture) {
		target.addEventListener(type, callback, !!useCapture);
	};

	/**
	 * <b>DESCR:</b><br>
	 * Attach a handler to event for all elements that match the selector,
 	 * now or in the future, based on a root element.
	 * @function
	 * @name $delegate
	 *
	 * @param {object} target
	 * @param {string} selector
	 * @param {string} type
	 * @param {function} handler
	 */
	window.$delegate = function (target, selector, type, handler) {
		function dispatchEvent(event) {
			var targetElement = event.target;
			var potentialElements = window.qsa(selector, target);
			var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

			if (hasMatch) {
				handler.call(targetElement, event);
			}
		}

		var useCapture = type === 'blur' || type === 'focus';

		window.$on(target, type, dispatchEvent, useCapture);
	};

	/**
	 * <b>DESCR:</b><br>
	 * Finds the element's parent with the given tag name, ex:
	 * $parent(qs('a'), 'div')
	 * @function
	 * @name $parent
	 *
	 * @param {object} element
	 * @param {string} tagName
	 */
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
