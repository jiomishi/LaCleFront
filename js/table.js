;( function( $, window, undefined ) {

'use strict';
	

	$.table = function( options, element ) {
		
		this.$el = $( element );
		this._init( options );

		
	};

	// the options
	$.table.defaults = {
		
		onRoomClick : function( $el, $content) { return false; }
	};

	$.table.prototype = {

		_init : function( options ) {
			this.options = $.extend( true, {}, $.table.defaults, options );
			this._generateTemplate();
			this._initEvents();
		},

		_initEvents : function() {

			var self = this;

			this.$el.on( 'click.table', 'div.table-row > div', function() {

				var $cell = $( this ),
					idx = $cell.index(),
					$content = $cell.children( 'div' ),
					roomProp = {
						room :"roomTest"
				
					};
					
				if( roomProp.room ) {
					self.options.onRoomClick( $cell, $content );
				}

			} );

		},
		
		
		_generateTemplate : function( callback ) {
			
			var head = this._getHead(),
				body = this._getBody();
			this.$table = $( '<div class="table-container">' ).append( head, body );
			this.$el.find( 'div.table' ).remove().end().append( this.$table );

			if( callback ) { callback.call(); }

		},
		_getHead : function() {

			var html = '<div class="table-head">';
		
			for ( var i = 0; i <= 11; i++ ) {

				

				html += '<div>';
				html += 'room '+i;
				html += '</div>';

			}

			html += '</div>';

			return html;

		},

		_getBody : function() {


			var html = '<div class="table-body">',
			tuteur = "Jean Michel",
			apprenant ="Jean Michel"
			// this loop is for weeks (rows)
			for ( var i = 0; i < 10; i++ ) {
				

				
				html += '<div class="table-row">';
				var hours=8+i;
				if(hours.toString().length==1)
				{html += '<span class="hours"> 0'+hours+'h00</span>'}
				else
				{html += '<span class="hours">'+hours+'h00</span>'}
				// this loop is for weekdays (cells)
				for ( var j = 0; j <= 11; j++ ) {

					
						var inner = '',
						content = '';

						inner += '<span class="table-content-tuteur">'+ tuteur+'</span>';
						inner += '<span class="table-content-apprenant">'+ apprenant +'</span>';
						inner += '<button class=new-data></button>';
						inner += '<button class=delete-data></button>';
						inner += '<button class=update-data></button>';
						var cellClasses ='table-class';
						var cellId = 'room-'+j+'-'+i ;
					

						html += cellClasses !== '' ? '<div class="' + cellClasses + '" id="'+ cellId+'">' : '<div>';
						html += inner;
						html += '</div>';
					}
					
					
					html += '</div>';

			}
			html += '</div>';
			return html;
		},
		
		
		/************************* 
		******PUBLIC METHODS *****
		**************************/
		addData: function(){

		},

		deleteCellValue: function($el){
			var elementId=$el[0].id;
			 $( '#'+elementId ).find('span.table-content-tuteur').contents().remove();
			 $( '#'+elementId ).find('span.table-content-apprenant').contents().remove();
		},

		getCellState : function($el) {
			var elementId=$el[0].id;
			var tuteur =$( '#'+elementId ).find('span.table-content-tuteur').text();
			var apprenant =$( '#'+elementId ).find('span.table-content-apprenant').text();
			if(!tuteur && !apprenant){
				return false;
			}
			else{return true;}
			
		},
		setApprenant : function(apprenant) {
			apprenant = apprenant || {};
			$.extend( this.apprenant, apprenant );
			this._generateTemplate();
		},
		

		reload : function(){
			this._generateTemplate();
		}

	};

		var logError = function( message ) {

			if ( window.console ) {

			window.console.error( message );
		
		}

	};

	$.fn.table = function( options ) {

		var instance = $.data( this, 'table' );
		
		if ( typeof options === 'string' ) {
			
			var args = Array.prototype.slice.call( arguments, 1 );
			
			this.each(function() {
			
				if ( !instance ) {

					logError( "cannot call methods on table ; " +
					"attempted to call method '" + options + "'" );
					return;
				
				}
				
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {

					logError( "no such method '" + options + "' for calendario instance" );
					return;
				
				}
				
				instance[ options ].apply( instance, args );
			
			});
		
		} 
		else {
		
			this.each(function() {
				
				if ( instance ) {

					instance._init();
				
				}
				else {

					instance = $.data( this, 'table', new $.table( options, this ) );
				
				}

			});
		
		}
		
		return instance;
		
	};


})( jQuery, window );