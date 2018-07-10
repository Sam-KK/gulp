/*
* @Author: xianghong.yan
* @Date:   2017-09-29 18:09:34
* @Last Modified by:   xianghong.yan
* @Last Modified time: 2017-09-30 10:01:16
*/
;(function($, window, document, undefined) {
	'use strict';

	var Tab = function(element) {
		this.element = $(element)
	};

	Tab.prototype.show = function() {
		var $this = this.element;
		console.log($this);
		var $ul = $this.closest('ul');
		console.log($ul);
		var selector = $this.data('target');
		console.log(selector);

		if (!selector) {
			selector = $this.attr('href');
			selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
		}

		if ($this.parent('li').hasClass('is-active')) return;

		var hideEvent = $.Event('hide.bs.tab', {
			relatedTarget: $this[0]
		});
		var showEvent = $.Event('show.bs.tab');

		$this.trigger(showEvent);

		if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

		var $target = $(selector);

		this.activate($this.closest('li'), $ul);
		this.activate($target, $target.parent());
	};

	Tab.prototype.activate = function(element, container, callback) {
		var $active = container.find('> .is-active');
		var transition = callback;

		function next() {
			$active
				.removeClass('is-active')
				.end()
				.find('[data-toggle="tab"]')
				.attr('aria-expanded', false);

			element
				.addClass('is-active')
				.find('[data-toggle="tab"]')
				.attr('aria-expanded', true);
			callback && callback();
		}

		$active.length
		$active
			.one(next);
		next();
	};

	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var data = $this.data('bs.tab');

			if (!data) $this.data('bs.tab', (data = new Tab(this)));
			if (typeof option == 'string') data[option]();
		})
	}

	var old = $.fn.tab;

	$.fn.tab = Plugin;
	$.fn.tab.Constructor = Tab;

	$.fn.tab.noConflict = function() {
		$.fn.tab = old;
		return this;
	};

	var clickHandler = function(e) {
		e.preventDefault();
		Plugin.call($(this), 'show');
	};

	$(document)
		.on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)

})(jQuery, window, document);
