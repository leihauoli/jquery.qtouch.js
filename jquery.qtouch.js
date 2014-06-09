/*!
 * jquery.qtouch.js v0.910 - jQuery custom event for quick touch on smartphone.
 * Copyright (c) 2014 Lei Hau'oli Co.,Ltd. - https://github.com/leihauoli/jquery.qtouch.js
 * License: MIT
 */
;(function ($) {
	var Qtouch = function ($trigger, fn) {
		this.$trigger = $trigger;
		this.flagTouching = false;
		this.flagCancel = false;
		this.hasTouch = 'ontouchstart' in window;
		this.fn = fn;

		this.init();
	};
	Qtouch.prototype = {
		init: function () {
			this.removeTapHighlightColor();
			this.bindEvents();
		},
		bindEvents: function () {
			var _self = this;

			if (this.hasTouch) {
				this.$trigger
					.on('click', function (e) {
						e.preventDefault();
					})
					.on('touchstart', function () {
						_self.startTouch();
					})
					.on('touchmove touchcancel', function () {
						_self.cancelTouch();
					})
					.on('touchend', function (e) {
						_self.endTouch(e);
					});
			} else {
				this.$trigger.on('click', function (e) {
					_self.trigger(e);
				});
			}
		},
		removeTapHighlightColor: function () {
			this.$trigger.css({
				webkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
			});
		},
		startTouch: function () {
			this.flagTouching = true;
		},
		cancelTouch: function () {
			if (this.flagTouching) {
				this.flagCancel = true;
			}
		},
		endTouch: function (e) {
			e.type = 'qtouch';

			if (!this.flagCancel) {
				this.trigger(e);
			}

			this.flagTouching = false;
			this.flagCancel = false;
		},
		trigger: function (e) {
			if (typeof this.fn === 'function') {
				$.proxy(this.fn, this.$trigger[0])(e);
			} else {
				this.$trigger.trigger('qtouch');
			}
		}
	};
	$.fn.qtouch = function (fn) {
		return this.each(function () {
			new Qtouch($(this), fn);
		});
	};
	$.event.special.qtouch = {
		setup: function () {
			new Qtouch($(this));
		}
	};
	var QtouchHover = function ($trigger, fnOver, fnOut) {
		this.$trigger = $trigger;
		this.fnOver = fnOver;
		this.fnOut = fnOut;
		this.hasTouch = 'ontouchstart' in window;

		if (typeof this.fnOver !== 'function' || typeof this.fnOut !== 'function') {
			return;
		}

		this.init();
	};
	QtouchHover.prototype = {
		init: function () {
			this.bindEvents();
		},
		bindEvents: function () {
			var _self = this;

			if (this.hasTouch) {
				this.$trigger
					.on('click', function (e) {
						e.preventDefault();
					})
					.on('touchstart', function (e) {
						_self.startTouch(e);
					})
					.on('touchmove touchcancel touchend', function (e) {
						_self.endTouch(e);
					});
			} else {
				this.$trigger
					.on('mouseenter', function (e) {
						_self.startTouch(e);
					})
					.on('mouseleave', function (e) {
						_self.endTouch(e);
					});
			}
		},
		startTouch: function (e) {
			e.type = 'qtouchenter';

			$.proxy(this.fnOver, this.$trigger[0])(e);
		},
		endTouch: function (e) {
			e.type = 'qtouchleave';

			$.proxy(this.fnOut, this.$trigger[0])(e);
		}
	};
	$.fn.qtouchhover = function (fnOver, fnOut) {
		return this.each(function () {
			new QtouchHover($(this), fnOver, fnOut);
		});
	};
})(jQuery);
