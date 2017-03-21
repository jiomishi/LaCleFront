;( function( $, window, undefined ) {

'use strict';
	
	var my_http= require('http')  ;
	var remote = require('electron').remote; 
	var jsonRoom="";

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

			this.$table = $( '<div id="DashBoard" class="table-container">' ).append( head, body );
			this.$el.find( 'div.table' ).remove().end().append( this.$table );

			if( callback ) { callback.call(); }

		},
		_getHead : function() {

			var html = '<div class="table-head">';
		
			for ( var i = 1; i <= 12; i++ ) {

				

				html += '<div>';
				html += 'room '+i;
				html += '</div>';

			}

			html += '</div>';

			return html;

		},

		_getJson :function(url){
     var r = false,
         xmlhttp = new XMLHttpRequest();
     xmlhttp.onreadystatechange = function() {
         if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
             // update the variable response
             r = JSON.parse(xmlhttp.responseText);
         }
     }
     xmlhttp.open("GET", url, false); // change async to false to wait for response although this is bad!
     xmlhttp.send();
     return r;
		},



		_getBody : function() {


			var html = '<div class="table-body">',
			tuteur = "Jean Michel",
			apprenant ="Jean Michel",
			date=new Date(remote.getGlobal('sharedObj').date);
			console.log(date);
			var dd = date.getDate()-1;
            var mm = date.getMonth()+1; //January is 0!

            var yyyy = date.getFullYear();
            if(dd<10){
              dd='0'+dd;
            } 
            if(mm<10){
              mm='0'+mm;
            } 
            date = dd+'-'+mm+'-'+yyyy;
			

			var json=this._getJson("http://lacle.humanitech.fr/lesson/search?start="+date+" 01:00&end="+date+" 23:00");

			console.log(json[0]);
			
			
      		


			function make_base_auth(user, password) {
    			var tok = user + ':' + password;
    			var hash = btoa(tok);
   				 return 'Basic ' + hash;
			}
			
			/*

			$.ajax({

   				url: 'http://humanitech.fr:8080/student/',
   				type: 'POST',
   				beforeSend: function (xhr) 
   				 {
        			xhr.setRequestHeader('Authorization', make_base_auth("admin","password"));
    				},
    			contentType: 'application/json',
    			data: JSON.stringify({"name": "Romain"}),
    			dataType: 'application/json', // or $('#myform').serializeArray()
    			success: function() { alert('POST completed'); }
				});
			*/
			
			
			// this loop is for weeks (rows)
			for ( var i = 0; i < 10; i++ ) {

				var resultsHours = [];
				var searchField = "date";
				var searchVal= "";


				html += '<div class="table-row">';
				var hours=8+i;
				if(hours.toString().length==1)
				{html += '<span class="hours"> 0'+hours+'h00</span>';
				 searchVal = date+" 0"+hours+":00";}
				else
				{html += '<span class="hours">'+hours+'h00</span>';
				 searchVal = date+" "+hours+":00";}

				for (var k=0 ; k < json.length ; k++)
				{
   		 		if (json[k][searchField] == searchVal)
   		 			{
        				resultsHours.push(json[k]);
    				}
				}

				

				// this loop is for weekdays (cells)
				for ( var j = 1; j <= 12; j++ ) 
				{
						var resultLesson =[];
						for(var h=0; h<resultsHours.length; h++)
						{	
							
							if (resultsHours[h]["room"]["number"] == j)
   		 					{

        						resultLesson.push(resultsHours[h]);
        						break;
    						}
						}
						if(resultLesson[0]!="" && resultLesson[0]!=null && resultLesson[0]["teacher"]!=null && resultLesson[0]["student"]!=null) 
						{
							var inner = '',
						content = '';
						console.log(resultLesson[0]);
						inner += '<span class="table-content-tuteur">'+resultLesson[0]["teacher"]["name"]+'</span>';
						inner += '<span class="table-content-apprenant">'+resultLesson[0]["student"]["name"]+'</span>';
						inner += '<button class=new-data></button>';
						inner += '<button class=delete-data></button>';
						inner += '<button class=update-data></button>';
						var cellClasses ='table-class';
						var cellId = 'room-'+j+'-'+hours+'-'+resultLesson[0]["id"] ;
					

						html += cellClasses !== '' ? '<div class="' + cellClasses + '" id="'+ cellId+'">' : '<div>';
						html += inner;
						html += '</div>';
						}	
						else{
							var inner = '',
							content = '';

							inner += '<span class="table-content-tuteur"></span>';
							inner += '<span class="table-content-apprenant"></span>';
							inner += '<button class=new-data></button>';
							inner += '<button class=delete-data></button>';
							inner += '<button class=update-data></button>';
							var cellClasses ='table-class';
							var cellId = 'room-'+j+'-'+hours ;
					

							html += cellClasses !== '' ? '<div class="' + cellClasses + '" id="'+ cellId+'">' : '<div>';
							html += inner;
							html += '</div>';
						}
					}
					
					
					html += '</div>';

			}
			html += '</div>';
			return html;
		},
		
		
		/************************* 
		******PUBLIC METHODS *****
		**************************/
		addData: function()
		{
			function make_base_auth(user, password) {
        	var tok = user + ':' + password;
          	var hash = btoa(tok);
            return 'Basic ' + hash;
      	}

      	var date=new Date(remote.getGlobal('sharedObj').date);
			var dd = date.getDate()-1;
            var mm = date.getMonth()+1; //January is 0!

            var yyyy = date.getFullYear();
            if(dd<10){
              dd='0'+dd;
            } 
            if(mm<10){
              mm='0'+mm;
            } 
            date = dd+'-'+mm+'-'+yyyy;
			

      	var student=this._getJson("http://lacle.humanitech.fr/student");
      	var results = [];
		var searchField = "name";
		var searchVal = document.add.nameStudent.value;
		for (var i=0 ; i < student.length ; i++)
		{
   		 	if (student[i][searchField] == searchVal)
   		 	{
        		results.push(student[i]);
        		break;
    		}
		}

		var teacher=this._getJson("http://lacle.humanitech.fr/teacher");
      	var resultsTeacher = [];
		var searchField = "name";
		var searchVal = document.add.nameTeacher.value;
		for (var i=0 ; i < teacher.length ; i++)
		{
   		 	if (teacher[i][searchField] == searchVal)
   		 	{
        		resultsTeacher.push(teacher[i]);
        		break;
    		}
		}
		
		var test=remote.getGlobal('roomObj').id.split("-");
		
			if(document.add.nameTeacher.value!="" && document.add.nameTeacher.value!=null && document.add.nameStudent.value!="" && document.add.nameStudent.value!=null && resultsTeacher && results )
			{$.ajax({

         			url: 'http://lacle.humanitech.fr/lesson/',
          			type: 'POST',
         			beforeSend: function (xhr) 
           			{
             		 xhr.setRequestHeader('Authorization', make_base_auth("admin","password"));
           			 },
         			 contentType: 'application/json',
          			data: JSON.stringify({"course":{ "id":1, "name":"Info" }, "room":{ "id":test[1], "number":test[1] }, "student":results[0], "teacher":resultsTeacher[0], "date":date+" "+test[2]+":00"}),
          			dataType: 'application/json', // or $('#myform').serializeArray()
          			success: function() { console.log('POST completed'); }
        			});
				
				
				
			}
				$('#'+remote.getGlobal('roomObj').id).find('span.table-content-tuteur').text(resultsTeacher[0]["name"]);
				$('#'+remote.getGlobal('roomObj').id).find('span.table-content-apprenant').text(results[0]["name"]);
				$('#'+remote.getGlobal('roomObj').id).css("background-color","#fff");
                $('#'+remote.getGlobal('roomObj').id).find('button.new-data').css("visibility","hidden");
                $('#'+remote.getGlobal('roomObj').id).find('button.update-data').css("visibility","hidden");
                $('#'+remote.getGlobal('roomObj').id).find('button.delete-data').css("visibility","hidden");
                $('#'+remote.getGlobal('roomObj').id).find('button.delete-data').attr('id','');
                $('#'+remote.getGlobal('roomObj').id).find('button.update-data').attr('id','');
                $('#'+remote.getGlobal('roomObj').id).find('button.new-data').attr('id','');
			

			$('#addPopUp').toggle(500);
			
		},

		deleteCellValue: function($el){
			var elementId=$el[0].id;
			 $( '#'+elementId ).find('span.table-content-tuteur').contents().remove();
			 $( '#'+elementId ).find('span.table-content-apprenant').contents().remove();
			 function make_base_auth(user, password)
			 {
        		var tok = user + ':' + password;
          		var hash = btoa(tok);
            	return 'Basic ' + hash;
      		}
      		var test=remote.getGlobal('roomObj').id.split("-");
      		$.ajax({

         			url: 'http://lacle.humanitech.fr/lesson/'+test[3],
          			type: 'DELETE',
         			beforeSend: function (xhr) 
           			{
             		 xhr.setRequestHeader('Authorization', make_base_auth("admin","password"));
           			 },
          			success: function() { console.log('POST completed'); }
        	});

		},

	updateData: function()
		{
			function make_base_auth(user, password) {
        	var tok = user + ':' + password;
          	var hash = btoa(tok);
            return 'Basic ' + hash;
      	}

      	var date=new Date(remote.getGlobal('sharedObj').date);
			var dd = date.getDate()-1;
            var mm = date.getMonth()+1; //January is 0!

            var yyyy = date.getFullYear();
            if(dd<10){
              dd='0'+dd;
            } 
            if(mm<10){
              mm='0'+mm;
            } 
            date = dd+'-'+mm+'-'+yyyy;
			

      	var student=this._getJson("http://lacle.humanitech.fr/student");
      	var results = [];
		var searchField = "name";
		var searchVal = document.update.nameStudent.value;
		for (var i=0 ; i < student.length ; i++)
		{
   		 	if (student[i][searchField] == searchVal)
   		 	{
        		results.push(student[i]);
        		break;
    		}
		}

		var teacher=this._getJson("http://lacle.humanitech.fr/teacher");
      	var resultsTeacher = [];
		var searchField = "name";
		var searchVal = document.update.nameTeacher.value;
		for (var i=0 ; i < teacher.length ; i++)
		{
   		 	if (teacher[i][searchField] == searchVal)
   		 	{
        		resultsTeacher.push(teacher[i]);
        		break;
    		}
		}
		
		var test=remote.getGlobal('roomObj').id.split("-");
		console.log(test[3]);
			if(document.update.nameTeacher.value!="" && document.update.nameTeacher.value!=null && document.update.nameStudent.value!="" && document.update.nameStudent.value!=null && resultsTeacher && results )
			{$.ajax({

         			url: 'http://lacle.humanitech.fr/lesson/'+test[3],
          			type: 'PUT',
         			beforeSend: function (xhr) 
           			{
             		 xhr.setRequestHeader('Authorization', make_base_auth("admin","password"));
           			 },
         			 contentType: 'application/json',
          			data: JSON.stringify({"id":test[3], "course":{ "id":1, "name":"Info" }, "room":{ "id":test[1], "number":test[1] }, "student":results[0], "teacher":resultsTeacher[0], "date":date+" "+test[2]+":00"}),
          			dataType: 'application/json', // or $('#myform').serializeArray()
          			success: function() { console.log('Put completed'); }
        			});
				

			}
			$( '#'+remote.getGlobal('roomObj').id ).find('span.table-content-tuteur').contents().remove();
				$( '#'+remote.getGlobal('roomObj').id ).find('span.table-content-apprenant').contents().remove();
				$( '#'+remote.getGlobal('roomObj').id).find('span.table-content-tuteur').append(resultsTeacher[0]["name"]);
				$( '#'+remote.getGlobal('roomObj').id).find('span.table-content-apprenant').append(results[0]["name"]);
				$('#'+remote.getGlobal('roomObj').id).css("background-color","#fff");
                $('#'+remote.getGlobal('roomObj').id).find('button.new-data').css("visibility","hidden");
                $('#'+remote.getGlobal('roomObj').id).find('button.update-data').css("visibility","hidden");
                $('#'+remote.getGlobal('roomObj').id).find('button.delete-data').css("visibility","hidden");
                $('#'+remote.getGlobal('roomObj').id).find('button.delete-data').attr('id','');
                $('#'+remote.getGlobal('roomObj').id).find('button.update-data').attr('id','');
                $('#'+remote.getGlobal('roomObj').id).find('button.new-data').attr('id','');


			$('#updatePopUp').hide(500);
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
			$('#DashBoard').remove();
			this._generateTemplate();
			this._initEvents();
			
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