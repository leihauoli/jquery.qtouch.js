/*!
 * jquery.qtouch.js v1.0 - jQuery custom event for quick touch on smartphone.
 * Copyright (c) 2014 Lei Hau'oli Co.,Ltd. - https://github.com/leihauoli/jquery.qtouch.js
 * License: MIT
 */
(function ($) {
	var Qtouch = function ($trigger, fn) {
		this.$trigger = $trigger;
		this.fn = fn;
		this.flagTouching = false;
		this.flagCancel = false;

		if (typeof this.fn !== 'function') {
			return;
		}

		this.init();
	};
	Qtouch.prototype = {
		init: function () {
			this.bindEvents();
		},
		bindEvents: function () {
			var _self = this;

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
				$.proxy(this.fn, this.$trigger[0])(e);
			}

			this.flagTouching = false;
			this.flagCancel = false;
		}
	};
	$.fn.qtouch = function (fn) {
		return this.each(function () {
			new Qtouch($(this), fn);
		});
	};

	var QtouchHover = function ($trigger, fnOver, fnOut) {
		this.$trigger = $trigger;
		this.fnOver = fnOver;
		this.fnOut = fnOut;

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
		},
		startTouch: function (e) {
			e.type = 'qtouchhoveron';

			$.proxy(this.fnOver, this.$trigger[0])(e);
		},
		endTouch: function (e) {
			e.type = 'qtouchhoveroff';

			$.proxy(this.fnOut, this.$trigger[0])(e);
		}
	};
	$.fn.qtouchhover = function (fnOver, fnOut) {
		return this.each(function () {
			new QtouchHover($(this), fnOver, fnOut);
		});
	};
})(jQuery);
