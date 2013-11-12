
$.fn.ajaxForm = function(options) {
	return $(this).each(function(i, el) {
		var $form = $(el);
		$form.on('submit', function(ev) {
			ev.preventDefault();
			$.ajax(_.extend({
				url: $form.attr('action'),
				type: $form.attr('method'),
				data: _.extend($form.serializeJSON(), options.data)
			}, options));
		});
	});
}
