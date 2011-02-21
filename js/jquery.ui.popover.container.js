(function($) {
	$.ui.widget.subclass('ui.popoverContainer', {
		options : {
			container : {
				position : 'bottom', // top, bottom, left, right
				contents : null
			}
			
		},
		_setOption: function(option, value) {
			$.Widget.prototype._setOption.apply( this, arguments );
		},
		_create: function() {
			var self = this,
				o = self.options,
				el = self.element,
				container = self.container = $('<div></div>').addClass("ui-widget ui-popover ui-state-default ui-corner-all").hide().appendTo('body'),
				triangle = self.triangle = self._buildTriangle();

			self._isOpen = false;

			el.bind('click.popover', function(e) {
				e.preventDefault();

				if ( self._isOpen ) {
					self._hideContainer();
				}
				else {
					self._showContainer();
				}
			});

			$('html, body').bind('click.popover', function(e) {
				if ( ! $(e.target).closest([el]).length ) {
					if ( self._isOpen ) {
						self._hideContainer();
					}
				}
			});
			
		},
		destroy: function() {
			$('html, body').unbind('click.popover');
			this.element.unbind('click.popover');
			this.container.remove();
			this.triangle.remove();
		},
		_positionContainer : function() {
			var self = this,
				o = self.options,
				el = self.element,
				container = self.container,
				triangle = self.triangle;



			switch(o.container.position) {
				case 'top':
					container.position({
						my : 'bottom',
						at : 'top',
						of : el,
						offset : '0 -18',
						collision : 'fit none',
						using : function(position) {
							if ( position.left <= 0 ) {
								$(this).offset({'top' : position.top, 'left' : position.left + 10});
							}
							else if ( (position.left + container.outerWidth()) >= $(window).width() ) {
								$(this).offset({'top' : position.top, 'left' : position.left - 10});
							}
							else {
								$(this).offset({'top' : position.top, 'left' : position.left});
							}
						}
					});
					break;
				case 'right':
					container.position({
						my : 'left',
						at : 'right',
						of : el,
						offset : '18 0',
						collision : 'none fit',
						using : function(position) {
							if ( position.top <= 0 ) {
								$(this).offset({'top' : position.top + 10, 'left' : position.left });
							}
							else if ( (position.top + container.outerHeight()) >= $(window).height() ) {
								$(this).offset({'top' : position.top - 10, 'left' : position.left});
							}
							else {
								$(this).offset({'top' : position.top, 'left' : position.left});
							}
						}
					});
					break;
				case 'left':
					container.position({
						my : 'right',
						at : 'left',
						of : el,
						offset : '-18 0',
						collision : 'none fit',
						using : function(position) {
							if ( position.top <= 0 ) {
								$(this).offset({'top' : position.top + 10, 'left' : position.left });
							}
							else if ( (position.top + container.outerHeight()) >= $(window).height() ) {
								$(this).offset({'top' : position.top - 10, 'left' : position.left});
							}
							else {
								$(this).offset({'top' : position.top, 'left' : position.left});
							}
						}
					});
					break;
				default:
					container.position({
						my : 'top',
						at : 'bottom',
						of : el,
						offset : '0 18',
						collision : 'fit none',
						using : function(position) {
							if ( position.left <= 0 ) {
								$(this).offset({'top' : position.top, 'left' : position.left + 10});
							}
							else if ( (position.left + container.outerWidth()) >= $(window).width() ) {
								$(this).offset({'top' : position.top, 'left' : position.left - 10});
							}
							else {
								$(this).offset({'top' : position.top, 'left' : position.left});
							}
						}
					});
					break;
			}


		},
		_positionTriangle : function() {
			var self = this,
				o = self.options,
				el = self.element,
				container = self.container,
				triangle = self.triangle;

			switch(o.container.position) {
				case 'top':
					triangle.position({
						my : 'top',
						at : 'bottom',
						of : container,
						using : function( position ) {
							$(this).position({
								my : 'bottom',
								at : 'top',
								of : el,
								using : function( elPosition ) {
									$(this).offset({ 'top' : position.top, 'left' : elPosition.left });
								}
							});
						}
					});
					break;
				case 'right':
					triangle.position({
						my : 'right',
						at : 'left',
						of : container,
						using : function( position ) {
							$(this).position({
								my : 'left',
								at : 'right',
								of : el,
								using : function( elPosition ) {
									$(this).offset({ 'top' : elPosition.top, 'left' : position.left });
								}
							});
						}
					});
					break;
				case 'left':
					triangle.position({
						my : 'left',
						at : 'right',
						of : container,
						using : function( position ) {
							$(this).position({
								my : 'right',
								at : 'left',
								of : el,
								using : function( elPosition ) {
									$(this).offset({ 'top' : elPosition.top, 'left' : position.left });
								}
							});
						}
					});
					break;
				default:
					triangle.position({
						my : 'bottom',
						at : 'top',
						of : container,
						using : function( position ) {
							$(this).position({
								my : 'top',
								at : 'bottom',
								of : el,
								using : function( elPosition ) {
									$(this).offset({ 'top' : position.top, 'left' : elPosition.left });
								}
							});
						}
					});
					break;
			}
		},
		_showContainer : function() {
			this._positionContainer();
			this.container.stop(true, true).fadeIn('fast');
			this._positionTriangle();
			this.triangle.stop(true, true).fadeIn('fast');
			this.element.addClass('ui-popover-list-item-active');

			this._isOpen = true;
		},
		_hideContainer : function() {
			this.container.stop(true, true).fadeOut('fast');
			this.triangle.stop(true, true).fadeOut('fast');
			this.element.removeClass('ui-popover-list-item-active');

			this._isOpen = false;
		},
		_buildTriangle : function() {
			var self = this, o = self.options;
			var triangle = $('<div></div>')
				.addClass("ui-popover-triangle")
				.hide()
				.appendTo('body');

			switch( o.container.position ) {
				case 'top':
					triangle.css({'position' : 'absolute',
						  'border-bottom' : '14px solid transparent',
						  'border-left' : '14px solid transparent',
						  'border-right' : '14px solid transparent',
						  'border-top' : '14px solid ' + self.container.css('background-color')});
					break;
				case 'right':
					triangle.css({'position' : 'absolute',
						  'border-top' : '14px solid transparent',
						  'border-left' : '14px solid transparent',
						  'border-bottom' : '14px solid transparent',
						  'border-right' : '14px solid ' + self.container.css('background-color')});
					break;
				case 'left':
					triangle.css({'position' : 'absolute',
						  'border-top' : '14px solid transparent',
						  'border-bottom' : '14px solid transparent',
						  'border-right' : '14px solid transparent',
						  'border-left' : '14px solid ' + self.container.css('background-color')});
					break;
				// Default is bottom
				default:
					triangle.css({'position' : 'absolute',
						  'border-top' : '14px solid transparent',
						  'border-left' : '14px solid transparent',
						  'border-right' : '14px solid transparent',
						  'border-bottom' : '14px solid ' + self.container.css('background-color')});
					break;
			}

			return triangle;
		}
	});
})(jQuery);
