/*global NodeList */
(function (window) {
	'use strict';

	/**
	 * <b>DESCR:</b><br>
	 * Get element(s) by CSS selector.
	 * @function
	 * @name qs
	 *
	 * @param {string} selector the DOM element to select
	 * @param {string|undefined} scope the DOM element where to select
	 *
	 * @returns {object} a DOM element found in scope & matching the selector
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
	 * @param {string} selector the DOM elements to select
	 * @param {string|undefined} scope the DOM element where to select
	 *
	 * @returns {object} all DOM elements found in scope & matching the selector
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
	 * @param {string|object} target either a DOM element OR the entire window
	 * @param {string} type the event's listener
	 * @param {function} callback the function to call after the event
	 * @param {boolean|undefined} useCapture sorts events order with capture 'true' or 'false'
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
	 * @param {object} target a DOM element
	 * @param {string} selector a CSS class or HTML tag used as a selector
	 * @param {string} type the event's listener
	 * @param {function} handler the function to call when the event is fired
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
	 * @param {object} element the DOM element inside which to find the parent
	 * @param {string} tagName an HTML tag type
	 *
	 * @returns {object} the parent node of the target inside the DOM
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
