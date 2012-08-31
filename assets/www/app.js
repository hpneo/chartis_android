window.static_services = [{"description":"Nuestros combustibles est\u00e1n reforzados con aditivos de \u00faltima generaci\u00f3n para un desempe\u00f1o superior del motor, brindando mayor aceleraci\u00f3n y potencia, reduciendo los costos de mantenimiento.","id":3,"name":"Combustibles L\u00edquidos"},{"description":"En las estaciones de servicio PRIMAX tambi\u00e9n encuentras GNV (Gas Natural Vehicular)","id":4,"name":"GNV"},{"description":"En las estaciones de servicio PRIMAX tambi\u00e9n encuentras GLP (Gas Licuado de Petr\u00f3leo)","id":5,"name":"GLP"},{"description":"En las tiendas Listo! encuentras cajeros BCP que te permiten realizar transacciones desde tus cuentas las 24 horas del d\u00eda los 7 d\u00edas de la semana.","id":7,"name":"Cajero BCP"},{"description":"En las tiendas Listo! encuentras mini agencias BCP donde puedes realizar todas las operaciones de banca  personal en un horario especial: De lunes a s\u00e1bado de 9:00am a 8:00 pm.","id":8,"name":"Agencia BCP"},{"description":"En las tiendas Listo! ahora encuentras SOAT de Pac\u00edfico Seguros, as\u00ed podr\u00e1s encontrar un servicio m\u00e1s en un solo lugar.","id":9,"name":"SOAT Pac\u00edfico"},{"description":"En Listo! encuentras todos los productos y servicios que hacen m\u00e1s f\u00e1cil tu d\u00eda. Mientras disfrutas un sabroso caf\u00e9 o un delicioso Kilom\u00e9trico, puedes acceder a internet a trav\u00e9s de la red WiFi.","id":10,"name":"Wi-Fi"},{"description":"En Listo! encuentras todos los productos y servicios que hacen m\u00e1s f\u00e1cil tu d\u00eda. Mientras disfrutas un sabroso caf\u00e9 o un delicioso Kilom\u00e9trico, puedes disfrutar de un emocionante partido de f\u00fatbol o conocer las noticias de \u00faltima hora.","id":11,"name":"Direct TV"},{"description":"Las Tiendas de conveniencia Listo! te esperan las 24 horas del d\u00eda los 7 d\u00edas de la semana con la mayor variedad de productos de la mejor calidad y la mejor atenci\u00f3n.","id":6,"name":"Listo!"}];

function arrayContains(array, value){
  for(i in array){
    if(array[i] == value) return true;
  }
  return false;
};

function getServiceById(array, id){
	for(i in array){
		if(array[i].id==id) return array[i];
	}
	return null;
}

window.places = {};

var isiOS = false;
// safari
//resizeTo(328,567);
//resizeTo(328,567 - 20);
//resizeTo(320,544);
//resizeTo(320,480); // iPhone 3-
//resizeTo(640,960); // iPhone 4+

/*
// A fix for iPhone viewport scale bug
// http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
(function(doc) {

	var addEvent = 'addEventListener',
		type = 'gesturestart',
		qsa = 'querySelectorAll',
		scales = [1, 1],
		meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

	function fix() {
		meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
		doc.removeEventListener(type, fix, true);
		scroll(0,0);
	}

	if ((meta = meta[meta.length - 1]) && addEvent in doc) {
		fix();
		scales = [.25, 1.6];
		doc[addEvent](type, fix, true);
	}

}(document));
// -- */


$.support.cors = true; // http://enable-cors.org/

$.ajaxSetup({
    timeout: 20000
});

//var clickEvent = (isiOS ? 'touchstart' : 'click');
var clickEvent = ($.support.touch ? 'touchstart' : 'click');

//--


var domainBase 	= 'http://chartis.herokuapp.com/';
var proxyURL 	= 'http://labs.renzocastro.com/proxy.php';


// Functions Common
$.exists = function(selector) {return ($(selector).length > 0)}
$.fn.excerpt = function(maxWidth){
	var self = $(this);
	var text = self.text();

	while( self.width() > maxWidth )
	{
		text = text.substr(0, text.length-4) + '...';
		self.text(text);
	}

	return text;
}

// console

if( $.browser.mozilla )
{	// Firefox
	if (!window.console) console = {};
	$.log   = console.log   || function(){};
	$.warn  = console.warn  || function(){};
	$.error = console.error || function(){};
	$.info  = console.info  || function(){};
}
else
{	//chrome
	$.log   = function(){};
	$.warn  = function(){};
	$.error = function(){};
	$.info  = function(){};
}
// --


var app = app || (function($,undefined){
	var app = {};

	app.map 			= null;
	app.mapResult 		= null;
	app.mapRoute 		= null;
	app.mapPromoStations = null;
	app.currentMap		= null;
	app.retina 			= (window.devicePixelRatio > 1);
	app.placesLoading 	= false;
	app.contentHeight 	= 0;
	app.markerSelected	= null;
	app.markerLocation	= null;
	app.overlayItem 	= null;
	app.location 		= null;
	app.geocoder 		= new google.maps.Geocoder();
	app.placeNearest  	= null;
	app.routeColor		= '#8a08ee'; //'#ee5008';
	app.routeMarkers	= [];
	app.services = window.static_services;
  app.scrolls = {};
  app.clusterer = null;
  app.viewWidth = document.width;

	app.ready = function(){
		$.info('[ready]');

		MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = 'images/group_background';

    app.servicesList = [];
    app.servicesList['Combustibles Líquidos']   = 1;
    app.servicesList['GNV']           = 2;
    app.servicesList['GLP']           = 3;
    app.servicesList['Listo!']          = 4;
    app.servicesList['Cajero BCP']        = 5;
    app.servicesList['Agencia BCP']       = 6;
    app.servicesList['SOAT Pacífico']       = 7;
    app.servicesList['Wi-Fi']           = 8;
    app.servicesList['Direct TV']         = 9;

    app.servicesIcon = [];
    $.each(app.services, function(index){
      app.servicesIcon[this.id] = app.servicesList[this.name];
    });

		
		$(document).bind('touchmove',function(e){ e.preventDefault(); }, false);
		$('body').bind('touchmove',function(e){ e.preventDefault(); }, false);
		

		$(window).bind('resize', function(e){
			if($('.route-start').length > 0){
        $('.route-start').width($('.route-final').width()+10);
      }
			if( app.currentMap ){
				app.currentMap.fixResize();
			}
		});

		$(document).bind('pageinit', 		onPageInit);
		$(document).bind('pagecreate', 		onPageCreate);
		$(document).bind('pagebeforeshow', 	onPageBeforeShow);
		$(document).bind('pageshow', 		onPageShow);

		$('#page-main')		.live('pageinit', app.onInitMain);
		$('#page-services')	.live('pageinit', app.onInitServices);
		$('#page-info')		.live('pageinit', app.onInitInfo);
		$('#page-result')	.live('pageinit', app.onInitResult);
		$('#page-route')	.live('pageinit', onInitRoute);
		$('#page-promo')	.live('pageinit', onInitPromo);


		$(document).ready(function(){
			$.info('[document] ready');
		});
	};

	app.navigateToURL = function(url){
		if(window.plugins.childBrowser ){
			try{
				window.plugins.childBrowser.showWebPage(url, {showLocationBar: false});
			}catch(err){
				app.alert(err);
			}
		}else{
			app.alert(url);
		}
	}

	app.loader = {}
	app.loader.show = function(){
		//$('#box-wrapper').show()
		app.notification.activityStart()
		app.loader.abort()
	}
	app.loader.abort = function(){
		if( app.jqXHR != null ){
			try {
				app.jqXHR.abort();
			} catch(err) {}
			app.jqXHR = null;
		}
	}
	app.loader.hide = function(){
		//$('#box-wrapper').hide()
		app.notification.activityStop()
		app.jqXHR = null
	}

	function onInitPromo(e){
		$('#page-promo').live('pageshow', onShowPromo);

		app.promoFilter = 'todos';
		$('#page-promo input[type="radio"]').bind('change',function(e){
			e.preventDefault();

			app.promoFilter = $(this).val();
			app.loadPromos(app.promoFilter);

		});

	}
	function onShowPromo(e){
		// Check if have a class ui-radio-on and active radio
		$('.ui-page:visible .ui-radio label').each(function(index){
			if( $(this).hasClass('ui-radio-on') ){
				$('.ui-page:visible input[type="radio"]:eq('+index+')')
					.attr('checked', true)
					.checkboxradio("refresh");
			}
		});

		if( $('.ui-page:visible input[type="radio"]:checked').length == 0 ){
			$('.ui-page:visible input[type="radio"]:first')
				.attr('checked', true)
				.checkboxradio("refresh");
		}

	}

	function onInitRoute(e){
		$('#page-route').live('pageshow', onShowRoute);

		$('#page-route #btnChange').bind(clickEvent, function(e){
			var sw = ($('#edit-route .box .form1').css('display')=='block');
			$('#edit-route .box .form1').css({display:( sw ? 'none' : 'block' )});
			$('#edit-route .box .form2').css({display:( !sw ? 'none' : 'block' )});


			$('#page-route select:eq('+ (sw?'1':'0') +')')[0].selectedIndex = $('#page-route select:eq('+ (!sw?'1':'0') +')')[0].selectedIndex;
			$('#page-route select:eq('+ (sw?'1':'0') +')').selectmenu('refresh');
			
			$('#page-route .ui-input-text:eq('+ (sw?'1':'0') +')').val( $('#page-route .ui-input-text:eq('+ (!sw?'1':'0') +')').val() );

		});

		$('#page-route #route-edit').bind(clickEvent, function(e){
			$('#page-route #edit-route').show();
			$('.route-start').width($('.route-final').width()+10)
		});
		$('#page-route #route-cancel').bind(clickEvent, function(e){
			$('#page-route #edit-route').hide();
		});

		$('#page-route #route-search').bind(clickEvent, function(e){
			
			var sw = ($('#edit-route .box .form1').css('display')=='block'); // si 1ro es visible
			
			// TODO: validar
			var start = $('#page-route .route-start:visible').val();
			var finish = $('#page-route .route-final:visible').val();

			var placeIndex = (!sw ? start : finish);

			app.stationSelected = app.map.markers[placeIndex].station;
			
			app.geocode({
        address: (sw ? start : finish),
        callback: function(results, status){
        	switch(status){
        		case 'OK':
							var latlng = results[0].geometry.location;
							app.routeLocation = {
								lat: latlng.lat(),
								lng: latlng.lng(),
								title: 'Ubicación Actual',
								address: ''
							};

							app.markerLocation.setPosition(new google.maps.LatLng(app.routeLocation.lat, app.routeLocation.lng));

							// GET address with GeoCode (reverse)
							app.geocode({
								lat: app.routeLocation.lat,
								lng: app.routeLocation.lng,
								callback: function(results, status){
									switch(status) {
										case 'OK':
											app.routeLocation.address = (results.length ? results[0].formatted_address : '');
											break;
										default:
											app.routeLocation.address = '...';
											break;
									}
									app.setRoute(app.stationSelected, app.routeLocation, app.routeTravelMode);
									app.currentMap.setCenter(latlng.lat(), latlng.lng());
									$('#edit-route').hide();

								} //callback
							}); //geocode
							
							
							break;
						
						case 'ZERO_RESULTS':
						default:
							app.alert('La dirección ingresada no pudo ser encontrada.');
							break;
					}

				}
	        });
		});
		

		$('#page-route .GPS a').bind(clickEvent, function(e){
			e.preventDefault();

			if( app.routeLocationMarker )
				app.currentMap.removeMarker(app.routeLocationMarker);

			app.setLocation({
				success: function(){
					app.routeLocationMarker = app.setMarkerCurrentPosition({type:'dot'});
				}
			});
		});


          
        app.polygons = [];

		$('#page-route #route-left').css({cursor:'auto'});
		//$('#page-route #route-left .ui-icon').css({opacity:0.3});


		$('#page-route #route-left').click(function(e){
			e.preventDefault();
			
			if(app.step_index == 0) return;
			
			app.step_index--;
			if( app.step_index == 0){
				$('#page-route .message p').html('Inicia tu recorrido hacia el <strong>Primax</strong> de ' + app.stationSelected.name);
				app.currentMap.setCenter( app.location.lat, app.location.lng );
			}else{
				$('#page-route .message p').html(app.step[app.step_index-1].instructions);
				app.currentMap.setCenter( app.step[app.step_index-1].end_point.lat(), app.step[app.step_index-1].end_point.lng() );
			}
			
			$('#page-route h1:eq(1)').text((app.step_index+1) + ' de ' + (app.step.length + 1));
			app.polygons[app.step_index].setMap(null);
			
			// buttons
			$('#page-route #route-right').css({cursor:'pointer'});
			$('#page-route #route-right .ui-icon').css({opacity:1.0});

			if( app.step_index == 0 ){
				$('#page-route #route-left').css({cursor:'auto'});
				$('#page-route #route-left .ui-icon').css({opacity:0.3});
			}
		});

		$('#page-route #route-right').click(function(e){
			e.preventDefault();
			
			if(app.step_index >= app.step.length){
        $.mobile.changePage($('#page-station-details'));
        $('#page-route #route-right .ui-icon').css({opacity:1.0});
      }
			
			if(app.step[app.step_index])
				app.polygons[app.step_index] = app.currentMap.drawPolyline({
					path: app.step[app.step_index].path,
					strokeColor: app.routeColor,
					strokeOpacity: 0.4,
					strokeWeight: 6
				});
			$('#page-route h1:eq(1)').text((app.step_index+2) + ' de ' + (app.step.length+1));
			if(app.step[app.step_index])
				app.currentMap.setCenter( app.step[app.step_index].end_point.lat(), app.step[app.step_index].end_point.lng() );
			
			if(app.step_index == app.step.length - 1){
				$('#page-route .message p').html("Llegaste al <strong>PRIMAX</strong> de " + app.stationSelected.name);
			}else{
				$('#page-route .message p').html(app.step[app.step_index].instructions);
			}

			app.step_index++;

			// buttons
			$('#page-route #route-left').css({cursor:'pointer'});
			$('#page-route #route-left .ui-icon').css({opacity:1.0});

			if( app.step_index == app.step.length ){
				$('#page-route #route-right').css({cursor:'auto'});
				//$('#page-route #route-right .ui-icon').css({opacity:0.3});
			}
		});
		
	}

	app.setRoute = function(vPlace, vLocation, vTravelMode){
		app.currentMap.removeMarkers();
		app.currentMap.removeOverlays();
		app.currentMap.removePolylines();

		app.setMarkerCurrentPosition({location:vLocation}); //{location:vLocation, pinType:'red'});
		app.stationSelected = vPlace;

		app.currentMap.setCenter(vLocation.lat, vLocation.lng);

		// Add Marker
		var marker = app.currentMap.addMarker({
			lat: vPlace.lat,
			lng: vPlace.lng,
			title: vPlace.name,
			address: vPlace.address,
			station: vPlace,
			click: function(e){
				if( e.preventDefault )
					e.preventDefault();

				if( app.overlayItem )
					app.currentMap.removeOverlay(app.overlayItem);
				//end

				var lat = e.position.lat();
				var lng = e.position.lng();

				app.markerSelected = e;
				app.currentMap.setCenter(lat, lng);

				app.setOverlayItem();

			} //click
		}); //addMarker

		// BEGIN: Set PIN
		marker.icon = new google.maps.MarkerImage(
			'images/map/pin-primax'+(app.retina ? '@2x' : '')+'.png',
			new google.maps.Size(27,31),
			new google.maps.Point(0,0),
			new google.maps.Point(2,29),
			(app.retina ? new google.maps.Size(27,31) : null)
		);

		// DRAW ROUTE
		app.currentMap.drawRoute({
			origin: [
				vLocation.lat,
				vLocation.lng
			],
			destination: [
				vPlace.lat,
				vPlace.lng
			],
			travelMode: vTravelMode,
			strokeColor: app.routeColor,
			strokeOpacity: 0.3,
			strokeWeight: 6
		});
		// --
		
		
		app.step = [];
		app.currentMap.getRoutes({
			travelMode: vTravelMode,
			origin: [vLocation.lat, vLocation.lng],
			destination: [vPlace.lat, vPlace.lng],
			callback: function(e, s){
				if(e.length>0){
					route = e[e.length-1];

					if(route.legs.length>0)
					for(i in route.legs[0].steps){
						step = route.legs[0].steps[i];
						step['step_number'] = i;

						app.step.push( step );
					}
					
					app.step_index = 0;
					app.step_length = app.step.length;

					//app.route = route;
					$('#page-route .message p').html('Inicia tu recorrido hacia el <strong>Primax</strong> de ' + vPlace.name);
					$('#page-route h1:eq(1)').text('1 de ' + (app.step.length + 1));
					//$('#page-route #route-right').trigger('click');


					//$.mobile.hidePageLoadingMsg();
					app.notification.activityStop();
				
					app.route = new GMaps.Route({
						map: app.currentMap,
						route: e[0],
						strokeColor: app.routeColor,
						strokeOpacity: 0.7,
						strokeWeight: 6
					});
				}
				else{
					app.alert('No se pudo encontrar una ruta a esta estación.');
					app.loader.hide();
					history.back();
				}
			}
        });
	};

	function onShowRoute(e){
		var $header = $('div:jqmData(role="header"):visible');
		var $footer = $('div:jqmData(role="footer"):visible');
		app.contentHeight = app.getHeight() - $header.outerHeight() - $footer.outerHeight();
		$('#map-route')
			.width( app.getWidth() ) // iOS
			.height( app.contentHeight )
			.parent().height( app.contentHeight );
		
		$('#edit-route').height( app.getHeight() );

		// Check if have a class ui-radio-on and active radio
		$('.ui-page:visible .ui-radio label').each(function(index){
			if( $(this).hasClass('ui-radio-on') ){
				$('.ui-page:visible input[type="radio"]:eq('+index+')')
					.attr('checked', true)
					.checkboxradio("refresh");
			}
		});

		// if not have radio check then check one
		if( $('.ui-page:visible input[type="radio"]:checked').length == 0  ){
			$('.ui-page:visible input[type="radio"]:first')
				.attr('checked', true)
				.checkboxradio("refresh");
		}

		//app.location = {lat:-12.1192704, lng:-77.0336914};

		app.stationSelected = app.markerSelected.station;

		//$.mobile.showPageLoadingMsg();
		app.notification.activityStart();
		$('#page-route .message p').html('');
		$('#page-route h1:eq(1)').text('');

		//app.currentMap
		app.setLocation({
			success: function(){
				app.mapRoute = app.mapRoute || new GMaps({
					div: '#map-route',
					lat: app.location.lat,
					lng: app.location.lng,
					zoom: 14, // default: 15
					disableDefaultUI: true,
					click: function(e){
						if( app.overlayItem ){
							app.currentMap.removeOverlay(app.overlayItem);
						}
					} 
				});
				app.currentMap = app.mapRoute;
				app.currentMap.fixResize();

				app.setRoute(app.stationSelected, app.location, app.resultTravelMode);
				
			},
      error: function(){
        app.location = {
          lat: -12.055605255747423,
          lng: -77.02729189416506
        };
        app.mapRoute = app.mapRoute || new GMaps({
          div: '#map-route',
          lat: app.location.lat,
          lng: app.location.lng,
          zoom: 14, // default: 15
          disableDefaultUI: true,
          click: function(e){
            if( app.overlayItem ){
              app.currentMap.removeOverlay(app.overlayItem);
            }
          } 
        });
        app.currentMap = app.mapRoute;
        app.currentMap.fixResize();

        app.setRoute(app.stationSelected, app.location, app.resultTravelMode);
      }
		});
	}

	function onPageInit(e){
		var $page = $(e.target);

		switch( $page.attr('id') ){
			case 'page-promo-details':
	      $('#btn-share').live(clickEvent, function(e){
	        e.preventDefault();

	        $('#promo-dialog-loader').show();
	        $('#promo-dialog-loader .dialog').slideDown();
	      });
      break;
		}
	}
	function onPressed(e){
		//e.preventDefault();
		
		$(this)
			.css({opacity:0.5})
			.delay(300)
			.css({opacity:1});

		$btnCover = $(this).find('.primax-btn-cover');
		if( $btnCover.length ){
			$btnCover
				.removeClass('pressed')
				.addClass('pressed')
				.delay(300)
				.removeClass('pressed');
		}
	}
	function onPageCreate(e){
		var $page = $(e.target);
		// FIX: Blink in first page transition in iOS
		$page.css( 'minHeight', app.getHeight() );
		// --

		// PRESSED
		btnCover = '<div class="primax-btn-cover"></div>';
		
		$page.find('.ui-header .ui-btn')
			.prepend(btnCover)
			//.bind(clickEvent, onPressed);

		$page.find('.ui-content .ui-btn')
			.prepend(btnCover)
			//.bind(clickEvent, onPressed);
		// --

		switch( $page.attr('id') )
		{
			case 'page-list':
				$page.find('input[type="radio"]').bind('change',function(e){
					e.preventDefault();

					app.loadStations( $(this).val() );
				});
				break;
			case 'page-promo-details':
				$('#btn-share').bind(clickEvent, function(e){
					e.preventDefault();

					$('.ui-page:visible .dialog-loader').show();
				});
				break;
			
			case 'page-station-details':
				
				break;
			
			case 'page-route':
				
				var options = '';
				$.each(app.map.markers, function(index){
					if(this.station)
						options += '<option value="'+index+'">'+this.station.name+'</option>';
				});
				
				$('#edit-route .box .form .ui-select').each(function(){
					$(this).find('select').append( options );
				});
				
				app.routeTravelMode = 'driving';
				$page.find('input[type="radio"]').bind('change',function(e){
					e.preventDefault();

					app.routeTravelMode = $(this).val();
				});

				break;
		}
	}



	function onPageShow(e){
		var $page = $(e.target);
		var page_id = $page.attr("id");
		var section = '';
		$.log('[onPageShow] ' + page_id );

		switch(page_id)
		{
			case 'page-services':
			case 'page-info':
			case 'page-result':
			case 'page-route':
				section = 'page-main';
				break;
			
			case 'page-station-details':
			case 'page-foursquare':
			case 'page-checkin':
				section = 'page-list';
				break;

			case 'page-promo-details':
				section = 'page-promo';

				height = app.contentHeight-$.mobile.activePage.find('.message').height()-$.mobile.activePage.find('.aviso').height();
				$.mobile.activePage.find('.bannerContainer').height(height);
				$.mobile.activePage.find('.bannerContainer').css('line-height', height+'px');
				break;
			default:
				section = page_id;
		}
		
		// highlight the current nav button (necessary when re-loading cached pages)
		$("div:jqmData(role='footer'):visible a[href='#" + section + "']").addClass("ui-btn-active");

		$.log(page_id, $page.find('[data-iscroll="scroller"]') );

		if( $page.find('[data-iscroll="scroller"]').length ){
			$.log('iscroll');
			app.setScroll( $page );
		} else {
			$.log('no scroll');
		}
		
		$('div:jqmData(role="header"):visible').css({
			'z-index': 1000
		});
		$('div:jqmData(role="footer"):visible').css({
			'z-index': 1000
		});


		switch(page_id)
		{
			case 'page-station-promos':
				$.mobile.activePage.find('h1').html( app.stationSelected.name );

				$.mobile.activePage.find('div:jqmData(role="content") ul[data-role="listview"]:first').html('');

				app.jqXHR = $.getJSON(window.domainBase + "offers.json?callback=?&place_id=" + app.stationSelected.id)
				.success(function(data){
					if( data.length ) {
						$.mobile.activePage.find('.search_promos').show();
						app.offerSelected = null;

						app.stationSelected.offers = data;

						var content = '';
						$.each(data, function(){
							content += '<li><a href="#page-promo-details"><h3>'+ this.name +'</h3></a></li>';
						});

						$.mobile.activePage.find('div:jqmData(role="content")')
				    .find('ul[data-role="listview"]:first')
				    .html(content);

				    $.mobile.activePage.find('div:jqmData(role="content")')
				    .find('ul[data-role="listview"]:first').listview("refresh");
						
						$page.find('a[href="#page-promo-details"]').each(function(index){
							$(this).click(function(e){
								app.offerSelected = app.stationSelected.offers[index];
							});
						});
					}else {
	          app.loader.hide();
						$.mobile.activePage.find('.search_promos').hide();
	          $.mobile.activePage.find('div:jqmData(role="content")').find('ul[data-role="listview"]:first').append('<li><img src="images/error_background.png" width="'+app.viewWidth+'" /></li>');
					}

					$.mobile.fixedToolbars.show(true);
				})
				.error(function(data){
					app.ajaxError(data, $('#page-promo div:jqmData(role="content")'));
				})
				.always(function(data){
					app.loader.hide();
				});

				break;

			case 'page-promo-stations':
				var $header = $('div:jqmData(role="header"):visible');
				var $footer = $('div:jqmData(role="footer"):visible');
				app.contentHeight = app.getHeight() - $header.outerHeight() - $footer.outerHeight();

				$('div:jqmData(role="content"):visible .content-inner')
						.height( app.contentHeight );
				
				$.mobile.fixedToolbars.show(true);

				$.log('offer_id:'+ app.offerSelected.id);

				app.jqXHR = $.getJSON(window.domainBase + "places.json?callback=?&offer_id=" + app.offerSelected.id)
					.success(function(data){
						app.jqXHR = null;
						app.stationsPromo = data;

						app.setLocation({
							success: function(){
								app.mapPromoStations = app.mapPromoStations || new GMaps({
				          div: '#map-promo-stations',
				          lat: app.location.lat,
				          lng: app.location.lng,
				          zoom: 13,
				          disableDefaultUI: true,
				          click: function(e){
				            if( app.overlayItem ){
				              app.currentMap.removeOverlay(app.overlayItem);
				            }
				          } 
				        });

				        app.currentMap = app.mapPromoStations;
		        		app.currentMap.fixResize();

				        if(app.overlayItem)
									app.currentMap.removeOverlay(app.overlayItem);
								app.currentMap.removeMarkers();

				        app.setMarkerCurrentPosition();
				        app.currentMap.setCenter(app.location.lat, app.location.lng);

								if( app.stationsPromo.length == 0 ){
									app.alert('No existen estaciones con esta promoción.');
									$.mobile.fixedToolbars.show(true);
									return;
								}
								else{
									app.addPlacesInMap(data);
									bounds = new google.maps.LatLngBounds(app.currentMap.markers[0].getPosition(), app.currentMap.markers[1].getPosition());

									app.currentMap.map.fitBounds(bounds);
								}
								$.mobile.fixedToolbars.show(true);
							},
							error: function(){
								app.location = {
				          lat: -12.055605255747423,
				          lng: -77.02729189416506
				        };

								app.mapPromoStations = app.mapPromoStations || new GMaps({
				          div: '#map-promo-stations',
				          lat: app.location.lat,
				          lng: app.location.lng,
				          zoom: 13,
				          disableDefaultUI: true,
				          click: function(e){
				            if( app.overlayItem ){
				              app.currentMap.removeOverlay(app.overlayItem);
				            }
				          } 
				        });

				        app.currentMap = app.mapPromoStations;
		        		app.currentMap.fixResize();

				        if(app.overlayItem)
									app.currentMap.removeOverlay(app.overlayItem);
								app.currentMap.removeMarkers();

				        app.setMarkerCurrentPosition();
				        app.currentMap.setCenter(app.location.lat, app.location.lng);

								if( app.stationsPromo.length == 0 ){
									app.alert('No existen estaciones con esta promoción.');
									$.mobile.fixedToolbars.show(true);
									return;
								}
								else{
									app.addPlacesInMap(data);

									bounds = new google.maps.LatLngBounds(app.currentMap.markers[0].getPosition(), app.currentMap.markers[1].getPosition());
									
									app.currentMap.map.fitBounds(bounds);
								}
								$.mobile.fixedToolbars.show(true);
							}
						});
					})
					.error(function(data){
						app.ajaxError(data, $page.find('div:jqmData(role="content")'));
					})
					.always(function(data){
						app.loader.hide();
					});
				break;

			case 'page-info': 
				/*
				var $header = $('div:jqmData(role="header"):visible');
				var $footer = $('div:jqmData(role="footer"):visible');
				app.contentHeight = app.getHeight() - $header.outerHeight() - $footer.outerHeight();
				$('div:jqmData(role="content"):visible').height( app.contentHeight - (15*2) );
				*/
				$('div:jqmData(role="content"):visible ul:first').listview({
					create:function(){
						setTimeout(function () { app.scrolls[$.mobile.activePage.attr('id')].refresh() }, 0);
						$.mobile.fixedToolbars.show(true);
					}
				});

				break;

			case 'page-list':
				var $header = $('div:jqmData(role="header"):visible');
				var $footer = $('div:jqmData(role="footer"):visible');
				app.contentHeight = app.getHeight() - $header.outerHeight() - $footer.outerHeight();
				
				$('div:jqmData(role="content"):visible .content-inner')
					.height( app.contentHeight ); // - (15*2) );
				

				// Check if have a class ui-radio-on and active radio
				$('.ui-page:visible .ui-radio label').each(function(index){
					if( $(this).hasClass('ui-radio-on') ){
						$('.ui-page:visible input[type="radio"]:eq('+index+')')
							.attr('checked', true)
							.checkboxradio("refresh");
					}
				});
				
				if( $('.ui-page:visible input[type="radio"]:checked').length == 0 ){
					$('.ui-page:visible input[type="radio"]:first')
						.attr('checked', true)
						.checkboxradio("refresh");
				}

				break;
			case 'page-station-details':
				var $header = $('div:jqmData(role="header"):visible');
				var $footer = $('div:jqmData(role="footer"):visible');
				app.contentHeight = app.getHeight() - $header.outerHeight() - $footer.outerHeight();
				/*$('#map-route').width( app.getWidth() );*/
			
				$('div:jqmData(role="content"):visible .content-inner')
						.height( app.contentHeight );

				$page.find('.message p').html( app.stationSelected.address );
				$page.find('.subtitle .name').html( app.stationSelected.name );
				$page.find('h1').html( app.stationSelected.name );

				$page.find('.services').html('');

        app.mapStation = app.mapStation || new GMaps({
          div: '#map-station',
          lat: app.stationSelected.lat,
          lng: app.stationSelected.lng,
          zoom: 15, // default: 15
          disableDefaultUI: true,
          dragstart: function(){
            if(app.scrolls[$.mobile.activePage.attr('id')]){
              app.scrolls[$.mobile.activePage.attr('id')].scrollTo(0, 0, 100);
              app.scrolls[$.mobile.activePage.attr('id')].disable();
            }
          },
          bounds_changed: function(){
            if(app.scrolls[$.mobile.activePage.attr('id')])
              app.scrolls[$.mobile.activePage.attr('id')].enable();
          },
          click: function(e){
            if(e.preventDefault)
              e.preventDefault();
            
            if(e.stopPropagation)
              e.stopPropagation();
          } 
        });
        app.mapStation.fixResize();
        app.mapStation.setCenter(app.stationSelected.lat, app.stationSelected.lng);

        app.mapStation.removeMarkers();

				// Add Marker For PRIMAX
				var marker = app.mapStation.addMarker({
          lat: app.stationSelected.lat,
          lng: app.stationSelected.lng,
          title: app.stationSelected.name,
          address: app.stationSelected.address,
          station: app.stationSelected,
          icon: new google.maps.MarkerImage(
            'images/map/pin-red'+(app.retina ? '@2' : '')+'.png',
            new google.maps.Size(32,32),
            new google.maps.Point(0,0),
            new google.maps.Point(16,32),
            (app.retina ? new google.maps.Size(32,32) : null)
          ),
          click: function(e){
            if( e.preventDefault )
              e.preventDefault();
          } //click
        }); //addMarker
        app.stationSelected.marker = marker;
				
				app.markerSelected = app.stationSelected.marker;

				if( app.stationSelected.services_ids.length > 0 )
				{
					var contentList = '<ul data-role="listview">';
					$.each(app.stationSelected.services_ids, function(index, item){
						service = getServiceById(app.services, item);
						contentList += '<li>';
						contentList +=  '<img src="images/services/s'+service.id+(app.retina ? '@2x' : '')+'.png" width="62" height="63" data-place="'+ service.id +'" />';
						contentList += 	'<div class="li-inner">';
						contentList += 		'<h3>'+ service.name +'</h3>';
						contentList += 		'<p>'+ (service.description || '') +'</p>';
						contentList += 	'</div>';
						contentList += '</li>';
					});
					contentList += '</ul>';

					$page.find('.services')
						.html(contentList)
						.find('ul:first').listview({
							create:function(){
								setTimeout(function () { app.scrolls[$.mobile.activePage.attr('id')].refresh() }, 0)
							}
						});
				}

				

				break;

			case 'page-foursquare':
				$page.find('.station-info .name').text(app.stationSelected.name);
				$page.find('.station-info .address').text(app.stationSelected.address);

				app.hereNow = {
					mayor:null,
					users:[]
				}
				var tips = [];

				// Load Venue DATA
				var venue_url = window.plugins.foursquare.api('venues/' + '4cf8607701568cfa3be11fe7'); //app.stationSelected.venue_id)
				$.getJSON(venue_url, function(data){
					if(data.meta.code == 200){

						app.hereNow = {
							mayor:null,
							users:[]
						}

						var user;
						if( data.response.venue.mayor != null){
							user = data.response.venue.mayor.user;
							app.hereNow.mayor = {
								type:'mayor',
								name: user.firstName + (user.lastName == undefined ? '' : ' ' + user.lastName),
								photo: user.photo,
								location: user.homeCity
							};
						}
						
						$.each(data.response.venue.hereNow.groups, function(gKey, gVal){
							$.each(gVal.items,function(iKey,iVal){
								user = iVal.user;
								app.hereNow.users.push({
									type: gVal.type,
									name: user.firstName + (user.lastName == undefined ? '' : ' ' + user.lastName),
									photo: user.photo,
									time: $.timeago( new Date(user.createdAt*1000) ),
									location: user.homeCity
								});
							})
						})
						
						tips = [];
						if(data.response.venue.tips.count>0){
							$.each(data.response.venue.tips.groups, function(gKey, gVal){
								$.each(gVal.items,function(iKey,iVal){
									user = iVal.user;
									tips.push({
										type: gVal.type,
										name: user.firstName + (user.lastName == undefined ? '' : ' ' + user.lastName),
										photo: user.photo,
										time: $.timeago( new Date(user.createdAt*1000) ),
										text: iVal.text
									});

								});
							});
						}
						
						$('#page-foursquare #btn-hereNow').trigger(clickEvent);
					}else{
						app.alert('Lo sentimos, tuvimos problemas para cargar los datos.');
					}
				});

				$page.find('#checkin-here').bind(clickEvent, function(e){
					e.preventDefault();

					app.notification.activityStart();
					var checkin_url = window.plugins.foursquare.api('checkins/add', {
						venueId: '4cf8607701568cfa3be11fe7', //app.stationSelected.venue_id,
						shout: 'He llegado!', //message
						broadcast: 'public',
						ll: app.location.lat + ',' + app.location.lng // TODO: geolocalion
					});
						
					$.ajax({
						url: checkin_url,
						type: 'POST',
						dataType: 'json',
						success: function(data){
							app.notification.activityStop();
							app.alert('Check In realizado exitosamente.');
						}
					});

					return false;
				});
				
				$page.find('#btn-hereNow').bind(clickEvent,function(e){
					e.preventDefault();

					// LISTS
					var content = '';
					content += '<ul data-role="listview">'; //' data-filter="true" data-filter-placeholder="Buscar">';
					
					if( app.hereNow.mayor != null ){
						content += '<li data-role="list-divider"><span class="icon-mayor"></span>Mayor</li>';
						content += '<li>';
							//content += '<a href="#">';
								content += '<img src="'+ app.hereNow.mayor.photo +'" width="38" height="38" />';
								content += '<h3>'+ app.hereNow.mayor.name +'</h3>';
								content += '<p>'+ app.hereNow.mayor.location +'</p>';
							//content += '</a>';
						content += '</li>';
					}

					if(app.hereNow.users.length>0){
						content += '<li data-role="list-divider">Quién está aquí</li>';

						$.each(app.hereNow.users, function(index, user){
							content += '<li>';
								//content += '<a href="#">';
									content += '<img src="'+ user.photo +'" width="38" height="38" />';
									content += '<h3>'+ user.name +'</h3>';
									content += '<p>'+ user.location +'<br />'+ user.time +'</p>';
								//content += '</a>';
							content += '</li>';
						});
					};
					content += '</ul>';

					$('#page-foursquare #content-list')
						.html(content)
						.find('ul:first').listview({
							create:function(){
								//app.setScroll( $('#page-foursquare') );
								setTimeout(function () { app.scrolls[$.mobile.activePage.attr('id')].refresh() }, 0);
								$.mobile.fixedToolbars.show(true);
							}
						});
					
					$.mobile.fixedToolbars.show(true);

					return false;
				});

				$page.find('#btn-tips').bind(clickEvent,function(e){
					e.preventDefault();

					// LISTS
					var content = '';
					content += '<ul data-role="listview">'; //' data-filter="true" data-filter-placeholder="Buscar">';
					
					if(tips.length>0){
						$.each(tips, function(index, tip){
							content += '<li>';
								//content += '<a href="#">';
									content += '<img src="'+ tip.photo +'" width="38" height="38" />';
									content += '<h3>'+ tip.name +'</h3>';
									content += '<p>'+ tip.text +'</p>';
								//content += '</a>';
							content += '</li>';
						});
					};
					content += '</ul>';

					$('#page-foursquare #content-list')
						.html(content)
						.find('ul:first').listview({
							create:function(){
								//app.setScroll( $('#page-foursquare') );
								setTimeout(function () { app.scrolls[$.mobile.activePage.attr('id')].refresh() }, 0);
								$.mobile.fixedToolbars.show(true);
							}
						});
					
					//setTimeout(function () { app.scrolls[$.mobile.activePage.attr('id')].refresh() }, 0);
					$.mobile.fixedToolbars.show(true);

					return false;
				});


				break;
		}
	}

	app.ajaxError = function(data, $content){
		var msg = '';
		switch(data.statusText){
			case 'timeout':
				msg = 'Se ha superado el tiempo máximo de carga. Vuelva a intentarlo más tarde.';
				break;
			
			case 'abort':
				msg = 'Lo sentimos, no pudieron cargarse los datos. Por favor vuelva a intentarlo.';
				break;

			default:
				msg = 'Hubo un inconveniente al solicitar los datos. Por favor vuelva a intentarlo.';
				$.error(data);
				break;
		}

		if( $content == undefined || $content.length == 0){
			app.alert(msg);
		}else{
			if(data.statusText=='timeout')
				$.mobile.activePage.find('div:jqmData(role="content")').find('ul[data-role="listview"]:first').append('<li><img src="images/timeout_background.png" width="'+app.viewWidth+'" /></li>');
			else
				$.mobile.activePage.find('div:jqmData(role="content")').find('ul[data-role="listview"]:first').append('<li><img src="images/error_background.png" width="'+app.viewWidth+'" /></li>');
			//$content.html(msg);
		}
	}

	app.setScroll = function($elm){
		$wrapper = $elm.find('[data-iscroll="scroller"]');
    if($wrapper.length == 0) return;
    
    // Fix Height
    var $header = $('div:jqmData(role="header"):visible');
    var $footer = $('div:jqmData(role="footer"):visible');
    var contentHeight = app.getHeight() - $header.outerHeight() - $footer.outerHeight();
    if($.mobile.activePage.find('.search_stations').length > 0)
      $wrapper.height( contentHeight - $elm.find('.search_stations').outerHeight());
    else if($.mobile.activePage.find('.search_promos').length > 0 && $elm.find('.search_promos').css('display')!='none')
      $wrapper.height( contentHeight - $elm.find('.search_promos').outerHeight());
    else
      $wrapper.height( contentHeight );
    
    $wrapper.bind('touchmove', function (e) { e.preventDefault(); });

    if($elm.attr('id') in app.scrolls){
      app.scrolls[$elm.attr('id')].refresh();
    }
    else{
      app.scrolls[$elm.attr('id')] = new iScroll($wrapper.get(0), {desktopCompatibility:true});
    }
		// $wrapper = $elm.find('[data-iscroll="scroller"]');
		// if($wrapper.length == 0) return;
		
		// // Fix Height
		// var $header = $('div:jqmData(role="header"):visible');
		// var $footer = $('div:jqmData(role="footer"):visible');
		// var contentHeight = app.getHeight() - $header.outerHeight() - $footer.outerHeight();
		// $wrapper.height( contentHeight );
		
		// $wrapper.bind('touchmove', function (e) { e.preventDefault(); });

		// // set iScroll
		// setTimeout(function(){
		// 	app.scrolls[$.mobile.activePage.attr('id')] = new iScroll($wrapper.get(0), {desktopCompatibility:true});

		// 	if( app.scrolls[$.mobile.activePage.attr('id')] == undefined )
		// 	{
		// 		setTimeout(function(){
		// 			app.scrolls[$.mobile.activePage.attr('id')] = new iScroll($wrapper.get(0), {desktopCompatibility:true});
		// 		}, 100);
				
		// 	}
		// },0);
	}

	function onPageBeforeShow(e){
		//page.find("div:jqmData(role='footer') a[href='#" + section + "']").addClass("ui-btn-active");
		var page = $(e.target);
		var page_id = page.attr("id");
		//--

		app.loader.abort();

		switch(page_id)
		{
			case 'page-services':
				page.find('.dialog-loader').hide();
				break;

			case 'page-list':
				app.loadStations();
				break;

			case 'page-promo':
				app.loadPromos(app.promoFilter);
				break;

			case 'page-promo-details':
				var $header = $('div:jqmData(role="header"):visible');
				var $footer = $('div:jqmData(role="footer"):visible');
				app.contentHeight = app.getHeight() - $header.outerHeight() - $footer.outerHeight();

				$.mobile.activePage.find('div:jqmData(role="content") .content-inner')
						.height( app.contentHeight );
				page.find('.dialog-loader').hide();

				page.find('.bannerContainer').width( app.getWidth());
				page.find('.aviso').width( app.getWidth() - 24);

				$('#page-promo-details .message p').html( app.offerSelected.name );
				$('#page-promo-details .bannerContainer img').attr('src', app.offerSelected['banner_' + (app.retina ? 'hd' : 'normal')] );

				$('#page-promo-details .btn-twitter').click(function(e){
					e.preventDefault();
					//$('[data-role="content"]:visible').html('').css({'font-size':'11px'});
					app.navigateToURL('http://twitter.com/share?url=' + encodeURIComponent(app.offerSelected['banner_hd']) + '&text=' + encodeURIComponent(app.offerSelected.name) + '&lang=es');
				});

				$('#page-promo-details .btn-facebook').click(function(e){
					e.preventDefault();
					
					//$('[data-role="content"]:visible').html('').css({'font-size':'11px'});
					//app.navigateToURL('http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(app.offerSelected['banner_hd']) + '&text=' + encodeURIComponent(app.offerSelected.name) );

					app.fbShare("Disfrutando mi promoción PRIMAX", app.offerSelected['banner_hd'], app.offerSelected['banner_hd']);
				});

				
				if (window.plugins.childBrowser && typeof window.plugins.childBrowser.onLocationChange !== "function") {
					window.plugins.childBrowser.onLocationChange = function(loc){
						if( loc.indexOf('twitter.com/intent/tweet/complete?') > -1 ||
							loc.indexOf('facebook.com/ajax/sharer/submit_page/') > -1 ||
							loc == '' ){
								window.plugins.childBrowser.close();
								return;
						}

						//$('[data-role="content"]:visible').html( $('[data-role="content"]:visible').html() + '<br/><br/>- ' + loc );
					}
				}
				

				break;

			case 'page-checkin':
				var $header = $('div:jqmData(role="header"):visible');
				var $footer = $('div:jqmData(role="footer"):visible');
				app.contentHeight = app.getHeight() - $header.outerHeight() - $footer.outerHeight();
				$('div:jqmData(role="content"):visible').height( app.contentHeight );

				page.find('#btn-foursquare').bind(clickEvent, function(e){
					e.preventDefault();

					app.notification.activityStart();
					if (window.plugins.foursquare == undefined) {
						Foursquare.install();
					}

					window.plugins.foursquare.onConnect = function(){
						window.plugins.foursquare.onConnect = null;
						delete window.plugins.foursquare.onConnect;
						
						// We have the Token
						$.mobile.changePage('#page-foursquare');
						// --

						app.notification.activityStop();
					}
					/*
					if(!$.support.touch){
						window.plugins.foursquare.accessToken = '2FWYUEKX5F5SIAHDFXDA403XOBMNZE350NS50KLYLKZAZL13';
					}*/
					
					if( window.plugins.foursquare.accessToken == undefined ){
						var client_id = "RM0A1MCMM2SKIANDZVYZNEUTOIL2TNJWPDX4HPWD4ZOHIIQO";
						var redir_url = "http://www.primaxapps.com/callback/?callback=true";
						window.plugins.foursquare.connect(client_id, redir_url, "touch");
					}else{
						window.plugins.foursquare.onConnect();
					}

					return false;
				});

				break;
		}

	}

	app.notification = new function (){

		this.activityStart = function(){
			if( isiOS && navigator.notificationEx && navigator.notificationEx.loadingStart){
				
				// @see: http://wiki.phonegap.com/w/page/16494800/iPhone%3A%20Show%20loading%20screen
				navigator.notificationEx.loadingStart({
					fullScreen: false, 			// default: true
					labelText: "Cargando...",	// default: Loading...
				});
			}else{
				
				/*try{
					$.blockUI({
						message: 'Cargando...',
						css: { 
				            border: 'none', 
				            padding: '15px', 
				            backgroundColor: '#222', 
				            '-webkit-border-radius': '10px', 
				            '-moz-border-radius': '10px',
				            color: '#fff',
			        	}
			        }); 
		    	}catch(err){
		    	*/
		    		if( navigator.notification && navigator.notification.activityStart){
						navigator.notification.activityStart(null,'Cargando...');
					}else{
						$.mobile.showPageLoadingMsg();
					}
		    	//}
			}
		}

		this.activityStop = function(){
			if( isiOS && navigator.notificationEx && navigator.notificationEx.loadingStop){
				navigator.notificationEx.loadingStop();
			}else {
				//$.unblockUI();

				if( navigator.notification && navigator.notification.activityStop){
					navigator.notification.activityStop();
				}else{
					$.mobile.hidePageLoadingMsg();
				}
			}
		}

	}

	app.fbShare = function(message, url, image){
		app.notification.activityStart();
		if (window.plugins.fbConnect == undefined) {
			FBConnect.install();
		}

		window.plugins.fbConnect.onConnect = function(){
			window.plugins.fbConnect.onConnect = null;
			delete window.plugins.fbConnect.onConnect;

			window.plugins.fbConnect.postFBWall(message, url, image, function() {
				app.notification.activityStop();
				app.alert('Promoción compartida exitosamente.');
			});
		}

		if( window.plugins.fbConnect.accessToken == undefined ){
			var client_id = "266739226708656";
			var redir_url = "http://www.facebook.com/connect/login_success.html";
			window.plugins.fbConnect.connect(client_id, redir_url, "touch");
		}else{
			window.plugins.fbConnect.onConnect();
		}
	}


	app.loadStations = function(zone){
		app.current_loaded = app.current_loaded || {};
    app.current_loaded['lima'] = app.current_loaded['lima'] || 2;
    app.current_loaded['provincias'] = app.current_loaded['provincias'] || 2;

    if( zone == undefined ) zone = 'lima';

		//if( app.stations && app.stations.length > 0 ) return;

		$.mobile.activePage.find('div:jqmData(role="content")').find('ul:first').html('');
    $.mobile.fixedToolbars.show(true);
    
    //app.loader.show();

    app.zone = zone;

    if(zone == 'lima')
      app.stations = window.places['lima'].slice(0, app.current_loaded['lima']);//[window.places['lima'][0], window.places['lima'][1]];
    else
      app.stations = window.places['provincias'].slice(0, app.current_loaded['provincias']);//[window.places['provincias'][2], window.places['provincias'][3]];

        //app.loader.hide();

    var content = '<li><h3>Estaciones</h3></li>';
    
    for(i in app.stations){
      places_by_district = app.stations[i];
      content += '<li data-role="list-divider">'+ places_by_district.name +'</li>';

      $.each(places_by_district.places, function(index){
        content += '<li><a href="#page-station-details" data-index="'+i+'" data-district="'+places_by_district.name+'" data-place="'+index+'" ><h3>'+ this.name +'</h3><p>'+this.address+'</p></a></li>';
      });
    };
    content += '<li class="load_more"><a href="#">Cargar más estaciones...</a></li>';

    $.mobile.activePage.find('div:jqmData(role="content")')
    .find('ul[data-role="listview"]:first')
    .html(content);

    $.mobile.activePage.find('div:jqmData(role="content")')
    .find('ul[data-role="listview"]:first').listview("refresh");

    app.setScroll($.mobile.activePage);
    
    $.mobile.fixedToolbars.show(true);

    //--
    $('#page-list a[href="#page-station-details"]').each(function(index){
      $(this).click(function(e){
        var i = $(this).attr('data-index');
        var district = $(this).attr('data-district');
        var place = $(this).attr('data-place');

        app.stationSelected = app.stations[i].places[place];
      });
    });
	};


	app.loadPromos = function(filter){
		if( filter == undefined || filter == '') filter = 'todos';

		$.mobile.activePage.find('div:jqmData(role="content")').find('ul:first').html('');
		$.mobile.fixedToolbars.show(true);

		app.loader.show();
		app.jqXHR = $.getJSON(window.domainBase + 'offers.json?callback=?' + (app.retina ? '&retina=true' : '') + '&type=' + filter )
			.success(function(data){
				if(data.length > 0){
					$.mobile.activePage.find('.search_promos').show();
					app.jqXHR = null;
					app.offers = data;
					app.offerSelected = null;

					var content = '';
					$.each(app.offers, function(){
						content += '<li data-name="'+this.name+'"><a href="#page-promo-details"><h3>'+ this.name +'</h3></a></li>';
					});

					$.mobile.activePage.find('div:jqmData(role="content")')
			    .find('ul[data-role="listview"]:first')
			    .html(content);

			    $.mobile.activePage.find('div:jqmData(role="content")')
			    .find('ul[data-role="listview"]:first').listview("refresh");

			    $.mobile.fixedToolbars.show(true);

					$('#page-promo a[href="#page-promo-details"]').each(function(index){
						$(this).click(function(e){
							app.offerSelected = app.offers[index];
						});
					});
				}
				else{
					//$.mobile.activePage.find('div[data-iscroll="scroller"]').height()
          app.loader.hide();
					$.mobile.activePage.find('.search_promos').hide();
          $.mobile.activePage.find('div:jqmData(role="content")').find('ul[data-role="listview"]:first').append('<li><img src="images/error_background.png" width="'+app.viewWidth+'" /></li>');
				}
				app.setScroll($.mobile.activePage);
			})
			.error(function(data){
				app.ajaxError(data, $('#page-promo div:jqmData(role="content")'));
			})
			.always(function(data){	
				app.loader.hide();
			});
	};

	app.changeTitle = function(value){
		if( !$.exists('div:jqmData(role="header"):visible h1 .title-animate') )
			$('div:jqmData(role="header"):visible h1').wrapInner('<div class="title-animate"/>');
		//end
		
		$('.title-animate')
			.animate({
		    	paddingTop: $('.title-animate').parent().height()
			}, 'fast', function(){
		    	$('.title-animate').text(value);
			})
			.animate({
		    	paddingTop: 0
			}, 'fast');
	};

	app.onInitInfo = function(e){
		$.info('[onInitInfo]');
	};

	function findTheNearestLocal(options){
		$.info('[Find the nearest local]');

		
		var distanceMatrixURL = 'http://maps.googleapis.com/maps/api/distancematrix/json?language=es&sensor=false';
		var distanceMatrixParams = {
			origins: app.location.lat +','+ app.location.lng,
			destinations: [],
			mode: 'driving'
		};


		var destinations = [];
		for(index in app.places){
			destinations.push(app.places[index].lat +','+ app.places[index].lng);
			if( destinations.length > 50 ) break;
		}
		distanceMatrixParams.destinations = destinations.join('|');

		for(key in distanceMatrixParams)
			distanceMatrixURL += '&'+ key +'='+ distanceMatrixParams[key];
		//end

		// BEGIN: PROXY
		var proxy = window.proxyURL + '?callback=?&url=';
		distanceMatrixURL = proxy + encodeURIComponent(distanceMatrixURL);
		// END: PROXY
		
		app.jqXHR = $.getJSON( distanceMatrixURL )
			.success(function(data){
				app.jqXHR = null;
				$.info('[findTheNearestLocal] success');

				switch(data.status)
				{
					case 'OK':
						var index = -1,
							distanceMin = 999999999999,
							elements = data.rows[0].elements,
							total = elements.length;

						for(i=0; i<total; ++i){
							element = elements[i];
							if( element.status == 'OK' && element.distance.value < distanceMin ){
								distanceMin = element.distance.value;
								index = i;
							}
						}

						app.placeNearest = app.places[index];
						
						if(options && options.success){
							options.success.apply(window, options.successParams || []);
						}
					break;

					case 'OVER_QUERY_LIMIT':
						$.warn('success:\n', data);
						app.placeNearest = app.places[2];
						
						if(options && options.success){
							options.success.apply(window, options.successParams || []);
						}
					break;

					default:
						$.error('success:\n', data);
					break;
				}

			})
			.error(function(data){
				$.warn('[findTheNearestLocal] ERROR\n', data);
				app.ajaxError(data);
			})
			.always(function(data){
				app.jqXHR = null;
			})
		;

	}

	app.onInitServices = function(e){
		$.info('[onInitServices]');
		$('#page-services').bind('pageshow', app.onShowServices);

		$('#services-search').bind(clickEvent,function(e){
			e.preventDefault();

			var servicesSelected = [];

			$('#services-grid li img').each(function(index){
				if( $(this).attr('src').indexOf('over') > -1 ){
					servicesSelected.push( app.services[index].id );
				}
			});

			if(servicesSelected.length==0){
				app.alert('Debe elegir al menos un servicio para obtener resultados.');
				return false;
			}
			else{
				$('.ui-page:visible .dialog-loader').show();
				app.tmpPlaces = app.places;
				app.setPlaces({
					services: servicesSelected,
					success: $.mobile.changePage,
					successParams: ['#page-result']
				});
			}
			
		});
		$('#services-cancel').bind(clickEvent,function(e){
			e.preventDefault();

			$('.dialog-loader:visible').hide();
		});

		$('ul#services-grid li img').each(function(index){
			this.index = index + 1;

			if(app.retina) this.src = 'images/service' + this.index + '@2.png';
		});

		$('ul#services-grid li img').bind(clickEvent, function(e){
			e.preventDefault();

			if( this.src.match(/over/) ){
				this.src = 'images/service' + this.index + (app.retina ? '@2' : '') + '.png';
			} else {
				this.src = 'images/service' + this.index + (app.retina ? '@2' : '') + '_over.png';
			}
		});

		if(app.retina) {
			$('.info-bottom img')[0].src = 'images/info@2.png';
		}

		app.resultTravelMode = 'driving';
		$('#page-services input[type="radio"]').bind('change', function(e){
			e.preventDefault();

			app.resultTravelMode = $(this).val();
		});
		
		/*
		$('.info-bottom img').bind('click', function(e){
			$.mobile.changePage("#page-info");
		});
		*/

		//$('#page-services div:jqmData(role="header") h1').text( app.markerSelected.title );
		//$('#page-services .details-bar-title').text( app.markerSelected.title );
	}

	app.onShowServices = function(e){
		var contentList = '';
		contentList += '<div data-iscroll="scroller">';
		contentList += '<div>';
		contentList += '<ul data-role="listview">';
		$.each(app.services, function(){
			contentList += '<li>';
			contentList += 	'<img src="images/empty.png" width="62" height="63" data-place="'+ this.id +'" class="icon-service-'+ this.id +'"/>';
			contentList += 	'<div class="li-inner">';
			contentList += 		'<h3>'+ this.name +'</h3>';
			contentList += 		'<p>'+ (this.description || '') +'</p>';
			contentList += 	'</div>';
			contentList += '</li>';
		});
		contentList += '</ul>';
		contentList += '</div>';
		contentList += '</div>';

		$('#page-info div:jqmData(role="content")').html(contentList);
	};
	
	app.onInitMain = function(e){
		$.info('[onInitMain]');

		app.servicesList = [];
		app.servicesList['Combustibles Líquidos'] 	= 1;
		app.servicesList['GNV'] 					= 2;
		app.servicesList['GLP'] 					= 3;
		app.servicesList['Listo!'] 					= 4;
		app.servicesList['Cajero BCP'] 				= 5;
		app.servicesList['Agencia BCP'] 			= 6;
		app.servicesList['SOAT Pacífico'] 			= 7;
		app.servicesList['Wi-Fi'] 					= 8;
		app.servicesList['Direct TV'] 				= 9;
	
		
		$('#page-main a[href="#page-services"]').bind(clickEvent,function(e){
			// Remove Overlay Item
			app.markerSelected = null;
			if( app.overlayItem ){
				app.currentMap.removeOverlay(app.overlayItem);
			}
			// --
		});

		$('#page-main .GPS a, #page-promo-stations .GPS a').bind(clickEvent, function(e){
			e.preventDefault();
			
			// Remove Overlay Item
			app.markerSelected = null;
			if( app.overlayItem ){
				app.currentMap.removeOverlay(app.overlayItem);
			}
			// --
			if( app.markerLocation ) app.markerLocation.setMap(null);

			app.setLocation({
				success: function(){
					app.markerLocation = app.setMarkerCurrentPosition({type:'dot'});
          app.currentMap.setCenter(app.location.lat, app.location.lng);
				}
			});
		});
		

		$('#page-main').bind('pageshow', app.onShowMain);
		$('#page-main').bind('pageshow', app.onShowMainAlways);
	};

	app.onShowMain = function(e){
		$.info('[onShowMain]');
		$('#page-main').unbind('pageshow', app.onShowMain);

		
		var $header = $('div:jqmData(role="header"):visible');
		var $footer = $('div:jqmData(role="footer"):visible');
		app.contentHeight = app.getHeight() - $header.outerHeight() - $footer.outerHeight();
		$('#map')
			.width( app.getWidth() )
			.height( app.contentHeight )
			.parent().height( app.contentHeight );

		//app.changeTitle($('#map').width() +'x'+ $('#map').height());

		if( $.support.touch && navigator.device == undefined ){
			document.addEventListener("deviceready", mainInitialize, false);
		}else{
			mainInitialize();
		}

		$('#load-cancel').bind(clickEvent,function(e){
			app.loader.abort();
			app.loader.hide();
		});

		app.jqXHR = null;

		// Load Services
		// app.jqXHR = $.getJSON(window.domainBase + 'services.json?callback=?')
		// 	.success(function(data){
		// 		app.jqXHR = null;
		// 		app.services = data;

		// 		app.servicesIcon = [];
		// 		$.each(app.services, function(index){
		// 			app.servicesIcon[this.id] = app.servicesList[this.name];
		// 		});

		// 	})
		// 	.error(function(data){
		// 		app.ajaxError(data);
		// 	})
		// 	.always(function(data){
		// 		app.jqXHR = null;
		// 	})
		// ;
		
	};
	
	app.onShowMainAlways = function(e){
		$.info('[onShowMainAlways]');
		
		if( app.map ){
			app.currentMap = app.map;
			app.currentMap.fixResize();

			if( app.overlayItem ){
				app.currentMap.removeOverlay(app.overlayItem);
			}
		}
	};

	function mainInitialize(){
		//app.notification.activityStart();
		$('#map').text('');

    app.map = app.map || new GMaps({
      div: '#map',
      lat: -12.042007,
      lng: -77.029266,
      zoom: 14, // default: 15
      disableDefaultUI: true,
      click: function(){
      	if( app.overlayItem )
					app.currentMap.removeOverlay(app.overlayItem);
      },
      idle: function(e){
        if(app.currentMap.map.getZoom() >= 14){
          for(i in app.currentMap.markers){
          	if(app.currentMap.markers[i].title!='Ubicación Actual')
	            if(app.currentMap.map.getBounds().contains(app.currentMap.markers[i].getPosition())){
	              app.currentMap.markers[i].setMap(app.currentMap.map);
	            }
	            else{
	              app.currentMap.markers[i].setMap(null);
	            }
          }
        }
      },
      zoom_changed: function(e){
        markers_in_viewport = [];
        for(i in app.currentMap.markers){
        	if(app.currentMap.markers[i].title!='Ubicación Actual')
	          if(app.currentMap.map.getBounds().contains(app.currentMap.markers[i].getPosition())){
	            markers_in_viewport.push(app.currentMap.markers[i]);
	          }
        }
        
        app.clusterer.clearMarkers();

        if(app.currentMap.map.getZoom() < 14){
          app.clusterer.addMarkers(markers_in_viewport);
        }
        delete markers_in_viewport;
      }
    });
    app.currentMap = app.map;
    app.clusterer = new MarkerClusterer(app.currentMap.map, [], {gridSize: 60, maxZoom: 15});

    app.setLocation({
      success:function(){
        app.currentMap.setCenter(app.location.lat, app.location.lng);

        app.markerLocation = app.setMarkerCurrentPosition({type:'dot'});

        //if( !$.support.phonegap )
        app.setPlaces({
          success: function(){
            app.addPlacesInMap(app.places);
          }
        });
      }, // success
      error: function(){
      	app.setPlaces({
          success: function(){
            app.addPlacesInMap(app.places);
          }
        });
      }
    });
	}

	app.onInitResult = function(e){
		$.info('[onInitResult]');
		$('#page-result').bind('pageshow', app.onShowResult);
		$('#page-result').bind('pageshow', app.onShowResultForService);

		$('#page-result .GPS a').bind(clickEvent, function(e){
			e.preventDefault();

			if( app.routeLocationMarker )
				app.currentMap.removeMarker(app.routeLocationMarker);

			app.setLocation({
				success: function(){
					app.currentMap.setCenter(app.location.lat, app.location.lng);
					app.routeLocationMarker = app.setMarkerCurrentPosition({type:'dot'});
				}
			});
		});
	};


	app.getHeight = function(){
		return ($.support.touch ? screen.availHeight : $(window).height());
	};
	app.getWidth = function(){
		return ($.support.touch ? screen.availWidth : $(window).width());
	};

	app.onShowResult = function(e){
		
		$.info('[onShowResult]');
		$('#page-result').unbind('pageshow', app.onShowResult);
		

		var $header = $('div:jqmData(role="header"):visible');
    var $footer = $('div:jqmData(role="footer"):visible');
    app.contentHeight = app.getHeight() - $header.outerHeight()  - $footer.outerHeight() ;
    $('#map-result').width( app.getWidth() );
    $('#map-result').height( app.contentHeight );
    $('#map-result').parent().height( app.contentHeight );


		// GMaps
		app.mapResult = app.mapResult || new GMaps({
			div: '#map-result',
			lat: -12.090689,
			lng: -77.010877,
			zoom: 15, // default: 15
			disableDefaultUI: true,
			click: function(e){
				if( app.overlayItem ){
					app.currentMap.removeOverlay(app.overlayItem);
				}
			}
		});
		
	};

	app.onShowResultForService = function(e){
		$.info('[onShowResultForService]');
		
		if( app.mapResult == null) return;

		setTimeout(function(){
			$('#page-result-back').live('click', function(e){
				e.preventDefault();

				if(app.markerSelected)
					$.mobile.changePage('#page-route');
				else{
					app.alert('Debe seleccionar una estación para iniciar el recorrido.');
				}
					
			});
		}, 200);
		
		// Check if have a class ui-radio-on and active radio
		$('.ui-page:visible .ui-radio label').each(function(index){
			if( $(this).hasClass('ui-radio-on') ){
				$('.ui-page:visible input[type="radio"]:eq('+index+')')
					.attr('checked', true)
					.checkboxradio("refresh");
			}
		});

		if( $('.ui-page:visible input[type="radio"]:checked').length == 0 ){
			$('.ui-page:visible input[type="radio"]:first')
				.attr('checked', true)
				.checkboxradio("refresh");
		}

		app.routeLocationMarker = null;

		app.mapResult.removeMarkers();
		app.mapResult.removeOverlays();
		app.mapResult.removePolylines();
		
		app.currentMap = app.mapResult;

		app.addPlacesInMap(app.places);

		// show at center of map the PRIMAX nearstless
		app.currentMap.setZoom(13);
		if(app.location) {
      //app.currentMap.setCenter(app.location.lat, app.location.lng);
      app.markerLocation = app.setMarkerCurrentPosition({type:'dot'});
    }
    else {
      app.currentMap.setCenter(app.places[0].lat, app.places[0].lng);           
    }

		app.places = app.tmpPlaces;
    
    app.currentMap.fixResize();

    delete app.tmpPlaces;
	};

	app.geolocate = function(options){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(
				function(position){
					options.success(position);
					if(options.always)
						options.always();
				}, 
				function(error){
					options.error(error);
					if(options.always)
						options.always();
				} ,
				{
					//timeout: 25000,
					enableHighAccuracy: true // http://docs.phonegap.com/en/1.0.0/phonegap_geolocation_geolocation.md.html#geolocationOptions
				}
			);
		}
		else{
			if(options.not_supported)
				options.not_supported();
			
			if(options.always)
				options.always();
		}
	};
	  
	app.geocode = function(options){
		var callback = options.callback;
		if(options.lat && options.lng)
			options['latLng'] = new google.maps.LatLng(options.lat, options.lng);

		delete options.lat;
		delete options.lng;
		delete options.callback;
		app.geocoder.geocode(options, function(results, status){
			callback(results, status);
		});
	};

	app.setPlaces = function(options){
		$.info('[setPlaces]');

		app.placeNearest = null;
		app.places = app.places || [];
		$.log('Places total: ' + app.places.length);

		if( app.places.length == 0 || (options.services && options.services.length > 0) ){
			app.placesLoad(options);
		}else{
			if(options && options.success){
				options.success.apply(window, options.successParams || []);
			}
		}
		//end
	};



	app.setMarkerCurrentPosition = function(options){
		$.info('[setMarkerCurrentPosition]');

		options = options || {};
		if( options.center == undefined )
			options.center = true;
		
		if( options.pinType == undefined )
			options.pinType = 'red';

		var oLocation = (options.location ? options.location : app.location);

		// Add Marker
		if(app.markerLocation){
			app.markerLocation.setPosition(new google.maps.LatLng(oLocation.lat, oLocation.lng));
			app.markerLocation.setMap(app.currentMap.map);
			var marker = app.markerLocation;
		}
		else{
			var marker = app.currentMap.addMarker( $.extend({
				flat: true,
				//optimized: false,
				visible: true,
				title: 'Ubicación Actual',
				icon: new google.maps.MarkerImage(
					'images/map/location'+(app.retina ? '@2' : '')+'.png',
					new google.maps.Size(17,17),
					new google.maps.Point(0,0),
					new google.maps.Point(9,9),
					new google.maps.Size(17,17)
				)
			}, oLocation) ); //addMarker
		}
		app.markerLocation = marker;

		//app.activatePulse();
		return marker;
	};

	app.activatePulse = function(){
		var dom1 = $.mobile.activePage.find('.mapContainer map area[title="Ubicación Actual"]:first');
		var dom2 = $.mobile.activePage.find('.mapContainer div[title="Ubicación Actual"]:first');
		var dom3 = $.mobile.activePage.find('.mapContainer img[src="images/map/location.png"]:first');
		if(dom1.length){
			$dom = dom1.parent().parent();
			$dom.addClass('pulseDOM');
			if($.support.touch){
				$dom.addClass('mobile');
			}
			//$dom.parent().css({'z-index':2});

		}else if(dom2.length){
			$dom = dom2;
			$dom.addClass('pulseDOM');
			if($.support.touch){
				$dom.addClass('mobile');
			}
			//$dom.parent().css({'z-index':2});
		}else if(dom3.length){
			$dom = dom3.parent();
			$dom.addClass('pulseDOM');
			if($.support.touch){
				$dom.addClass('mobile');
			}
			//$dom.parent().css({'z-index':2});
		}else{
			setTimeout( app.activatePulse, 1500);
		}
	}


	app.placesLoad = function(options) {
		if( app.placesLoading ) return;

		$.info('[placesLoad] init');
		app.placesLoading = true;

		app.loader.abort();

		app.jqXHR = null;
    app.placesLoading = false;

    filtered_places = [];

    _places = [];

    for(i in window.places['lima']){
      for(j in window.places['lima'][i].places){
        var p = window.places['lima'][i].places[j];
        _places.push(p);
      }
    }

    for(i in window.places['provincias']){
      for(j in window.places['provincias'][i].places){
        var p = window.places['provincias'][i].places[j];
        _places.push(p);
      }
    }

    for(i in _places){
      p = _places[i];
      if(p.services_ids){
        for(s in p.services_ids){
          if(arrayContains(options.services, p.services_ids[s]) && !arrayContains(filtered_places, p))
           filtered_places.push(p);
        }
      }
    }

    app.places = _places;

    app.placeNearest = null;
    if( options.services && options.services.length > 0){
			app.places = filtered_places;
		}

    if( options && options.success ){
      options.success.apply(window, options.successParams || []);
    }

    delete _places;
    delete filtered_places;
	};

	app.addPlacesInMap = function(data){
		//$.info('[addPlacesInMap]\n', places);
		$.info('[addPlacesInMap]');
		if($.mobile.activePage.attr('id') == 'page-main')
      var mcOptions = {gridSize: 50, maxZoom: 15};
    else
      var mcOptions = {gridSize: 150, maxZoom: 15};
		
		$.each(data, function(){
      // Add Marker
      var marker = app.currentMap.addMarker({
        lat: this.lat,
        lng: this.lng,
        title: this.name,
        address: this.address,
        station: this,
        icon: new google.maps.MarkerImage(
          'images/map/pin-primax' +(app.retina ? '@2x' : '')+'.png',
          new google.maps.Size(27,31),
            new google.maps.Point(0,0),
            new google.maps.Point(2,29),
            (app.retina ? new google.maps.Size(27,31) : null)
        ),
        click: function(e){
          if( e.preventDefault )
            e.preventDefault();

          if( app.overlayItem )
            app.currentMap.removeOverlay(app.overlayItem);
          //end
          app.markerSelected = e;
          //app.currentMap.setCenter(lat, lng);

          app.setOverlayItem();

          $('#page-result-back').show();

        } //click
      }); //addMarker

			/*
			this.marker.shadow = new google.maps.MarkerImage(
				'images/map/pin-shadow'+(app.retina ? '@2x' : '')+'.png',
				new google.maps.Size(38,37),
				new google.maps.Point(0,0),
				new google.maps.Point(8,37),
				(app.retina ? new google.maps.Size(38,37) : null)
			);
			*/
			/*
			this.marker.shape = {
				coord: [16,1,12,4,9,8,9,13,12,18,5,22,1,25,1,30,2,35,9,35,11,30,10,25,16,23,24,21,28,18,30,13,30,8,27,3,23,1],
	  			type: 'poly'
			};
			*/
			// END
		}); //each

	};

	app.setOverlayItem = function(opts){
		var marker = app.markerSelected;
		var lat = marker.position.lat();
		var lng = marker.position.lng();

		var right = (opts == null || opts.right) == true;
		opts && delete opts['right'];

		app.overlayItem = app.currentMap.drawOverlay( $.extend({
			lat: lat,
			lng: lng,
			content: [
				'<div class="overlay">',
					'<div class="overlay-btn-left"></div>',
					'<div class="overlar-text-container">',
						'<div class="overlay-title">' + marker.title + '</div>',
						'<div class="overlay-subtitle">' + marker.address + '</div>',
					'</div>',
					(right ? '<div class="overlay-btn-right"></div>' : ''),
				'</div>'
			].join(''),
			verticalAlign: 'top',
        	horizontalAlign: 'center',
        	verticalOffset: -38,
        	horizontalOffset: -8,
        	layer:'floatPane',
        	clickButtonLeft:function(e){
        		app.placeNearest = app.markerSelected.station;
        		app.placeNearest.marker = app.markerSelected;
						$.mobile.changePage('#page-route');
        	},
        	clickButtonRight:function(e){
						app.stationSelected = app.markerSelected.station;
						$.mobile.changePage('#page-station-details');
        	}
		}, opts)); //drawOverlay
	}; //app.setOverlayItem

	app.setLocation = function(options){
		$.info('[setLocation]');

		app.geolocate({
			success: function(position){
				//alert('[setLocation] success');
				$.info('[setLocation] success');
				app.location = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					title: 'Ubicación Actual',
					address: ''
				};
				
				// GET address with GeoCode (reverse)
				app.geocode({
					lat: app.location.lat,
					lng: app.location.lng,
					callback: function(results, status){
						switch(status) {
							case google.maps.GeocoderStatus.OK:
								app.location.address = (results.length ? results[0].formatted_address : '');
								break;
							default:
								app.location.address = '...';
								break;
						}
						
						if(options && options.success){
							options.success.apply(window, options.successParams || []);
						}
						
					} //callback
				}); //geocode

			},
			error: function(error){
				app.alert('Geolocation failed: ' + error.message);
				if(options && options.error){
					options.error(error.message);
				}
			},
			not_supported: function(){
				app.alert("Your browser does not support geolocation :(");
				if(options && options.error){
					options.error('No Soportado.');
				}
			},
			always: function(){
				if(options && options.always){
					options.always.apply(window, options.alwaysParams || []);
				}
			}
		});
	};

	app.alert = function(message, callback){
		if(callback==undefined) callback = function(){}

		if(!navigator.notification)
			navigator.notification = {}
		
		if(navigator.notification.alert){
			navigator.notification.alert(message, callback, 'PRIMAX', 'Aceptar');
		}else{
			alert(message);
			if(console)
				console.log(message);
			callback();
		}
		
	}

	// Wait for PhoneGap to load
	//document.addEventListener("deviceready", app.onDeviceReady, false);
	//$(document).ready(app.ready);

	app.ready();

	return app;
	
}(jQuery));

$('.search_promos').live('submit', function(e){
  e.preventDefault();

	term = new RegExp($.mobile.activePage.find('.ui-input-text').val(), 'i');
	$.mobile.activePage.find('div:jqmData(role="content")')
	.find('ul[data-role="listview"]:first')
	.find('li').each(function(index, item){
		if ($(item).attr('data-name').search(term) > -1)
			$(item).show();
		else
			$(item).hide();
	});
});


$('.search_stations').live('submit', function(e){
  e.preventDefault();

  app.zone = app.zone || 'lima';

  if($.mobile.activePage.find('.ui-input-text').val()==''){
  	app.stations = [window.places[app.zone][0], window.places[app.zone][1]];
  }
  else{
  	filtered_places = [];
  	term = new RegExp($.mobile.activePage.find('.ui-input-text').val(), 'i');
	  for(i in window.places[app.zone]){
	    p = window.places[app.zone][i];
	    if(p.places){
	      for(j in p.places){
	        if((p.places[j].address.search(term) > -1 || p.places[j].name.search(term) > -1 || p.name.search(term) > -1) && !arrayContains(filtered_places, p)){
	          p.internal_index = i;
	          filtered_places.push(p);
	        }
	      }
	    }
	  }

	  for(i in filtered_places){
	    p = filtered_places[i];
	    if(p.places){
	      for(var j=0;j<p.places.length;j++){
	        if(p.places[j].address.search(term) == -1 && p.places[j].name.search(term) == -1){
	          p.places.splice(j, 1);
	          j--;
	        }
	      }
	    }
	  }
	  for(var i=0;i<filtered_places.length;i++){
	    p = filtered_places[i];
	    if(p.places && p.places.length == 0){
	      filtered_places.splice(i, 1);
	      i--;
	    }
	  }

	  app.stations = filtered_places;
  }

  var content = '';
      
  for(i in app.stations){
    places_by_district = app.stations[i];
    content += '<li data-role="list-divider">'+ places_by_district.name +'</li>';

    $.each(places_by_district.places, function(index){
      content += '<li><a href="#page-station-details" data-index="'+i+'" data-district="'+places_by_district.name+'" data-place="'+index+'" ><h3>'+ this.name +'</h3><p>'+this.address+'</p></a></li>';
    });
  };

  $.mobile.activePage.find('div:jqmData(role="content")').find('ul:first').html(content);
  $.mobile.activePage.find('div:jqmData(role="content")').find('ul:first').listview("refresh");

  setTimeout(function () {
    app.scrolls[$.mobile.activePage.attr('id')].refresh();
  }, 0);
    
  $.mobile.fixedToolbars.show(true);

  $.mobile.activePage.find('a.ui-link-inherit').each(function(index){
    $(this).click(function(e){
      var i = $(this).attr('data-index');
      var district = $(this).attr('data-district');
      var place = $(this).attr('data-place');

      app.stationSelected = app.stations[i].places[place];
    });
  });
});

$('.load_more').live('click', function(e){
  e.preventDefault();

  if(app.current_loaded[app.zone] < window.places[app.zone].length){
    start_from = [window.places[app.zone][app.current_loaded[app.zone]], window.places[app.zone][app.current_loaded[app.zone]+1]];
    app.stations.push(window.places[app.zone][app.current_loaded[app.zone]]);
    app.stations.push(window.places[app.zone][app.current_loaded[app.zone]+1]);

    var content = '';
      
      for(i in start_from){
        places_by_district = start_from[i];
        content += '<li data-role="list-divider">'+ places_by_district.name +'</li>';

        $.each(places_by_district.places, function(index){
          content += '<li><a href="#page-station-details" data-index="'+(app.current_loaded[app.zone]+parseInt(i))+'" data-district="'+places_by_district.name+'" data-place="'+index+'" ><h3>'+ this.name +'</h3><p>'+this.address+'</p></a></li>';
        });
      };

    try{
      $(content).insertBefore('#page-list .ui-content .ui-listview .load_more');
      $('.ui-listview').listview("refresh");
      setTimeout(function () {
        app.scrolls[$.mobile.activePage.attr('id')].refresh();
        app.scrolls[$.mobile.activePage.attr('id')].scrollTo(0, app.scrolls[$.mobile.activePage.attr('id')].maxScrollY, 800);
      }, 0);
    }
    catch(e){
      alert(e);
    }

    app.current_loaded[app.zone] += 2;

    $('#page-list a.ui-link-inherit').each(function(index){
      $(this).click(function(e){
        var i = $(this).attr('data-index');
        var district = $(this).attr('data-district');
        var place = $(this).attr('data-place');

        if(i)
        	app.stationSelected = app.stations[i].places[place];
      });
    });
  }
});

window.places['lima'] = [{"name":"Asia Ca\u00f1ete","places":[{"address":"Av. Panam Sur km 97.5, Asia Ca\u00f1ete ","district_id":432,"id":628,"lat":"-12.762114","lng":"-76.600027","name":"Asia","short_address":"Av. Panam Sur km 97.","venue_id":null,"services_ids":[3]}]},{"name":"Ate","places":[{"address":"Nicolas Ayll\u00f3n 2570, Ate","district_id":492,"id":554,"lat":"-12.062677","lng":"-76.981571","name":"Ate","short_address":"Nicolas Ayll\u00f3n 2570,","venue_id":"4ed53f410039e8b92213da37","services_ids":[3]},{"address":"Av. Nicol\u00e1s Ayll\u00f3n 2162, Ate ","district_id":492,"id":572,"lat":"-12.008846","lng":"-76.863674","name":"Felverana","short_address":"Av. Nicol\u00e1s Ayll\u00f3n 2","venue_id":"4ed556210039e8b922167073","services_ids":[3,4,6,7]},{"address":"Av. V\u00edctor Ra\u00fal Haya de la Torre 1949","district_id":492,"id":663,"lat":"-12.037857","lng":"-76.931092","name":"Gamarra II - Est. Central","short_address":"Av. V\u00edctor Ra\u00fal Haya","venue_id":null,"services_ids":[3,4]},{"address":"Carretera Central Mz. A Lote 12 Fundo Pariache, ATE","district_id":492,"id":697,"lat":"-12.02216323","lng":"-76.90781784","name":"Grifo Nicole ","short_address":"Carretera Central Mz","venue_id":null,"services_ids":[3]},{"address":"Carretera Central ex fundo vista alegre Km 2.5, Ate","district_id":492,"id":686,"lat":"-12.032164","lng":"-76.926793","name":"Lubrigas","short_address":"Carretera Central ex","venue_id":null,"services_ids":[3,4,5]},{"address":"Av. San Alfonso Mza.Lote 58, Ate    ","district_id":492,"id":639,"lat":"-12.017851","lng":"-76.886058","name":"Santa Clara","short_address":"Av. San Alfonso Mza.","venue_id":null,"services_ids":[3]},{"address":"Victor Raul Haya De La Torre Km.5.2 ","district_id":492,"id":635,"lat":"-12.025255","lng":"-76.917585","name":"Vista Alegre","short_address":"V.Raul Haya De La To","venue_id":"","services_ids":[3,4,5]}]},{"name":"Barranco","places":[{"address":"Av. Bolognesi Esq. Tiravanti, Barranco","district_id":393,"id":558,"lat":"-12.142495","lng":"-77.018041","name":"Bolognesi","short_address":"Av. Bolognesi Esq. T","venue_id":"4e8f6a887beb8792c5993605","services_ids":[3,6,9]}]},{"name":"Bre\u00f1a","places":[{"address":"Av. Tingo Mar\u00eda 1711","district_id":602,"id":618,"lat":"-12.06627","lng":"-77.060755","name":"Bre\u00f1a","short_address":"Av. Tingo Mar\u00eda 1711","venue_id":null,"services_ids":[3,4]}]},{"name":"Callao","places":[{"address":"Av. Nestor Gambetta y Calle 6 s/n ex fundo oquendo (carretera ventanilla km 5.7)","district_id":410,"id":655,"lat":"-11.848094","lng":"-77.120461","name":"Alibru","short_address":"Av. Nestor Gambetta ","venue_id":null,"services_ids":[3]},{"address":"Av. Argentina 4247, Callao","district_id":410,"id":887,"lat":"-12.04718479","lng":"-77.08526551","name":"Argentina","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Bertello Mz. U Lt. 14, Urb. Albino Herrera","district_id":410,"id":657,"lat":"-11.989694","lng":"-77.11431","name":"Bertello","short_address":"Av. Bertello Mz. U L","venue_id":null,"services_ids":[3]},{"address":"Av. Colonial Cdra. 41","district_id":410,"id":681,"lat":"-12.053863","lng":"-77.100463","name":"Colonial","short_address":"Av. Colonial Cdra. 4","venue_id":"4e9f1311e5e8a6f879df1757","services_ids":[3]},{"address":"Av. Dominicos Boca negra mz A lt 20 urb. Sesquicentenario, Callao","district_id":410,"id":659,"lat":"-12.016529","lng":"-77.092963","name":"Dennis","short_address":"Av. Dominicos Boca n","venue_id":null,"services_ids":[3]},{"address":"Av. 2 de Mayo 285","district_id":410,"id":679,"lat":"-12.05966","lng":"-77.143089","name":"Dos de Mayo","short_address":"Av. 2 de Mayo 285","venue_id":"","services_ids":[3]},{"address":"Av. Los Dominicos, Lote 9-10, Manzana 63, Urb. Previ, Distrito y Provincia del Callao","district_id":410,"id":921,"lat":"-12.01759161","lng":"-77.09206893","name":"La Curva","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. La Paz Cdra 23 Esq. calle Huamachuco","district_id":410,"id":892,"lat":"-12.07559841","lng":"-77.11489988","name":"La Perla","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Argentina N.\u00b0 498 , Distrito y  Provincia del Callao, Lima","district_id":410,"id":592,"lat":"-12.05181689","lng":"-77.13546065","name":"Obelisco","short_address":"Av. Argentina N.\u00b0 49","venue_id":"4eb31d26754a5e8ee9b81801","services_ids":[3]},{"address":"Av.Quilca con Calle 10, Urb.San Alfonso Santa Irene Mz.A Lt.01 Y 02, Callao","district_id":410,"id":598,"lat":"-12.022154","lng":"-77.091236","name":"Quilca","short_address":"Av.Quilca con Calle ","venue_id":"4ed806874fc6a0235f358c4b","services_ids":[3,4,5]}]},{"name":"Carabayllo","places":[{"address":"Av. Tupac Amaru 3590 km 22, El progreso","district_id":596,"id":658,"lat":"-11.874887","lng":"-77.016059","name":"Carabayllo","short_address":"Av. Tupac Amaru 3590","venue_id":null,"services_ids":[3]},{"address":"Mz F lote 1 asociaci\u00f3n viv.caudivilla (alt.c Av Universitaria)","district_id":596,"id":644,"lat":"-11.873808","lng":"-77.023679","name":"Universitaria","short_address":"Mz F lote 1 asociaci","venue_id":null,"services_ids":[3]}]},{"name":"Chaclacayo","places":[{"address":"Av Nicolas Ayllon 1500 \u00d1a\u00f1a (km 19 y 1/2)","district_id":604,"id":613,"lat":"-12.0088465","lng":"-76.8636738","name":"Gamarra I","short_address":"Av Nicolas Ayllon 15","venue_id":null,"services_ids":[3]}]},{"name":"Chorillos","places":[{"address":"Av.Huaylas N.360, Chorrillos","district_id":579,"id":568,"lat":"-12.167872","lng":"-77.025672","name":"El Chorrillano","short_address":"Av.Huaylas N.360, Ch","venue_id":"4d0467b78620224bdd1ca940","services_ids":[3,6,9,10,11]},{"address":"Av. Guardia Civil 333 La Campi\u00f1a, Chorrillos ","district_id":579,"id":571,"lat":"-12.171524","lng":"-76.991992","name":"Escosa","short_address":"Av. Guardia Civil 33","venue_id":"4e922001c2eebfc9d6c7dd3f","services_ids":[3,7,8]},{"address":"Av. Huaylas 600, Chorrillos","district_id":579,"id":582,"lat":"-12.199716","lng":"-76.996857","name":"Huaylas","short_address":"Av. Huaylas 600, Cho","venue_id":"4ebaf9c3a17c5dccac535e3c","services_ids":[3]},{"address":"Av. Camino del Inca 110-134 S.J.B. de Villa, Chorrillos","district_id":579,"id":604,"lat":"-12.20384","lng":"-76.998625","name":"Tavirsa","short_address":"Av. Camino del Inca ","venue_id":"4ed809ec4fc6a0235f360296","services_ids":[3,6,7,9,10]},{"address":"Km 18.5  Panamericana Sur","district_id":579,"id":669,"lat":"-12.499599","lng":"-76.742077","name":"Ultragrifos","short_address":"Km 18.5  Panamerican","venue_id":null,"services_ids":[3,4,5]}]},{"name":"Comas","places":[{"address":"Av. Carabayllo 1318 ","district_id":470,"id":612,"lat":"-11.949985","lng":"-77.055544","name":"Cemoa","short_address":"Lima","venue_id":"","services_ids":[3]},{"address":"Av. Universitaria Esq Av. Mexico Esq calle L, Comas","district_id":470,"id":685,"lat":"-11.955666","lng":"-77.059382","name":"Collique","short_address":"Av. Universitaria Es","venue_id":null,"services_ids":[3,5,7]},{"address":"Av. Trapiche Esq. Calle 4, Comas","district_id":470,"id":910,"lat":"-11.91910587","lng":"-77.06051173","name":"El Pinar","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Trapiche Esq. Calle 4","district_id":470,"id":698,"lat":"-11.933333","lng":"-77.066666","name":"El Pinar","short_address":"Av. Trapiche Esq. Ca","venue_id":null,"services_ids":[3]},{"address":"Av. Universitaria Norte 9957 Urb.  La Alborada, Comas","district_id":470,"id":671,"lat":"-11.906149","lng":"-77.042806","name":"Gruppe AR","short_address":"Av. Universitaria No","venue_id":null,"services_ids":[3]},{"address":"Av. Prolongaci\u00f3n Revoluci\u00f3n 3501 Collique Comas, Lima","district_id":470,"id":693,"lat":"-11.914852","lng":"-77.030092","name":"Roan Inversiones","short_address":"Av. Prolongaci\u00f3n Rev","venue_id":null,"services_ids":[3]},{"address":"Av. Trapiche Lt 9c ex-fundo Chacra cerro","district_id":470,"id":662,"lat":"-11.911561","lng":"-77.056721","name":"Trapiche","short_address":"Av. Trapiche Lt 9c e","venue_id":null,"services_ids":[3]}]},{"name":"Huachipa","places":[{"address":"Carretera Ramiro Prial\u00e9 Int 8.2, Huachipa","district_id":487,"id":691,"lat":"-12.018156","lng":"-76.911896","name":"MIJ (remij)","short_address":"Carretera Ramiro Pri","venue_id":null,"services_ids":[3]},{"address":"Av. Los Cisnes Sub lote 2  (altura Km 4.5 de Av. Ramiro Prial\u00e9) Centro Poblado Santa Maria de Huachipa","district_id":487,"id":677,"lat":"-12.019168","lng":"-76.943457","name":"Priale","short_address":"Av. Los Cisnes Sub l","venue_id":null,"services_ids":[3,4]}]},{"name":"Huarochiri","places":[{"address":"Av. Bolivar Mza s/n lote s/n, Santa Eulalia ","district_id":592,"id":632,"lat":"-12.153778","lng":"-76.955795","name":"Arzapalo","short_address":"Av. Bolivar Mza s/n ","venue_id":null,"services_ids":[3]},{"address":"Av. Union Jicamarca Mza J, L 23 Com.Camp Jicamarca San Antonio","district_id":592,"id":674,"lat":"-11.968973","lng":"-76.937111","name":"Danny","short_address":"Av. Union Jicamarca ","venue_id":null,"services_ids":[3,5]},{"address":"Carretera central km 37.5 s/n santa erulalia Huarochiri - cruce av,. Simon Bolivar ","district_id":592,"id":673,"lat":"-12.214502","lng":"-76.932857","name":"Hytek","short_address":"Carretera central km","venue_id":null,"services_ids":[3]}]},{"name":"Independencia","places":[{"address":"Av. Gerardo Unger N 3301","district_id":466,"id":653,"lat":"-12.006738","lng":"-77.054511","name":"Gasocentro Norte","short_address":"Av. Gerardo Unger N ","venue_id":null,"services_ids":[3,4,5]},{"address":"Av Guardia Civil sur Mz B lote1-2-3 urb santa Rosa de Surco","district_id":466,"id":675,"lat":"-12.171645","lng":"-76.991833","name":"Gasocentro Surco","short_address":"Av Guardia Civil sur","venue_id":null,"services_ids":[3]},{"address":"Av. Chinchaysuyo 315 Urb. Tupac Amaru","district_id":466,"id":660,"lat":"-11.97686","lng":"-77.059259","name":"Payet","short_address":"Av. Chinchaysuyo 315","venue_id":"","services_ids":[3]},{"address":"Panamericana Norte Km. 15.2 (Av. Mendieta s/n), Independencia","district_id":466,"id":666,"lat":"-11.99044","lng":"-77.064135","name":"Sol de Oro","short_address":"Panamericana Norte K","venue_id":null,"services_ids":[3,4,5,7]}]},{"name":"Jesus Mar\u00eda","places":[{"address":"Av. Gregorio Escobedo 410-416, Jesus Mar\u00eda","district_id":405,"id":583,"lat":"-12.086591","lng":"-77.054889","name":"Huiracocha","short_address":"Av. Gregorio Escobed","venue_id":"4c807d562f1c236af2822743","services_ids":[3,5,6,7,8,9,10,11]},{"address":"Av. Jos\u00e9 Faustino S\u00e1nchez Carri\u00f3n No. 471, Jesus Mar\u00eda","district_id":405,"id":595,"lat":"-12.08883129","lng":"-77.06010145","name":"Pershing","short_address":"Av. Jos\u00e9 Faustino S\u00e1","venue_id":"4d2e62c379dd6ea846ea88d3","services_ids":[3,6,7,9]}]},{"name":"La Molina","places":[{"address":"Av. Javier Prado Este 4885, La Molina","district_id":394,"id":559,"lat":"-12.084509","lng":"-76.974624","name":"Camacho","short_address":"Av. Javier Prado Est","venue_id":"4cf8607701568cfa3be11fe7","services_ids":[3,6,9]},{"address":"Av. Prol. Javier Prado Este 4885, Esq. Tiamos","district_id":394,"id":687,"lat":"-12.081556","lng":"-76.967686","name":"Eco","short_address":"Av. Prol. Javier Pra","venue_id":null,"services_ids":[3]},{"address":"Av. Alameda del Corregidor 1195, La Molina","district_id":394,"id":574,"lat":"-12.091843","lng":"-76.952845","name":"Ferrero","short_address":"Av. Alameda del Corr","venue_id":"4ed557520039e8b9221696ff","services_ids":[3,6,7,9,10,11]},{"address":"Av. Los Frutales esq con La Fontana, La Molina","district_id":394,"id":576,"lat":"-12.073021","lng":"-76.964968","name":"Frutales","short_address":"Av. Los Frutales esq","venue_id":"4e922b7fc2eebfc9d6c94b69","services_ids":[3,5,6,7,9]},{"address":"Av.  Javier Prado Este 6310, La Molina","district_id":394,"id":587,"lat":"-12.08436544","lng":"-76.97457594","name":"La Molina","short_address":"Av.  Javier Prado Es","venue_id":"4ed7bb2c4fc6a0235f2ac305","services_ids":[3,6,7,9,11]},{"address":"Av. La Molina 580, La Molina","district_id":394,"id":590,"lat":"-12.086144","lng":"-76.90558","name":"Monterrico","short_address":"Av. La Molina 580, L","venue_id":"4e28fd7918384dd0a0e6f015","services_ids":[3,4,5,6,7,9,10,11]},{"address":"Av. La Molina 1595, La Molina","district_id":394,"id":668,"lat":"-12.085931","lng":"-76.901523","name":"Top Service","short_address":"Av. La Molina 1595, ","venue_id":null,"services_ids":[3]},{"address":"Av. La Universidad 1275, La Molina","district_id":394,"id":606,"lat":"-12.075164","lng":"-76.93621","name":"Universidad","short_address":"Av. La Universidad 1","venue_id":"4eb41bada17cab6127fc7ffd","services_ids":[3,6,7,8,9,10,11]}]},{"name":"La Victoria","places":[{"address":"Av. 28 de Julio 2200, La Victoria","district_id":578,"id":551,"lat":"-12.062389","lng":"-77.023413","name":"28 de Julio","short_address":"Av. 28 de Julio 2200","venue_id":"4ed537dd0039e8b92212f8c4","services_ids":[3,4,5]},{"address":"Jr. Abtao 784 (esq. Hip\u00f3lito Unanue) La Victoria","district_id":578,"id":888,"lat":"-12.06630814","lng":"-77.02224333","name":"Abtao","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Jr. Abtao 784 (esq. Hip\u00f3lito Unanue), La Victoria","district_id":578,"id":610,"lat":"-12.066372","lng":"-77.022336","name":"Abtao","short_address":"Lima","venue_id":"","services_ids":[3]},{"address":"Av. Bauzate y Meza 568, La Victoria","district_id":578,"id":611,"lat":"-12.063833","lng":"-77.023449","name":"Bauzate","short_address":"Lima","venue_id":"","services_ids":[3]},{"address":"Av. Bauzate y Meza 568, La Victoria","district_id":578,"id":889,"lat":"-12.06492063","lng":"-77.03265333","name":"Bauzate y Meza","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Canada Cdra. 11 Esq. Alzamora,  S. Catalina, La Victoria ","district_id":578,"id":560,"lat":"-12.084001","lng":"-77.012355","name":"Canad\u00e1","short_address":"Av. Canada Cdra. 11 ","venue_id":"4c55c3b6a724e21eece4a0f8","services_ids":[3,4,5,6,7,8,9,10,11]},{"address":"Av. Nicol\u00e1s Arriola 295","district_id":578,"id":619,"lat":"-12.087185","lng":"-77.016435","name":"Castilla","short_address":"Av. Nicol\u00e1s Arriola ","venue_id":null,"services_ids":[3,4,5]},{"address":"Av. Javier Prado 1059, La Victoria","district_id":578,"id":585,"lat":"-12.08985948","lng":"-77.0183791","name":"Javier Prado","short_address":"Av. Javier Prado 105","venue_id":"4e923aa8c2eebfc9d6cb3c31","services_ids":[3,6,7,9]}]},{"name":"Lima","places":[{"address":"Calle Sargento Enrique Villar 316, Lima","district_id":577,"id":894,"lat":"-12.07622942","lng":"-77.03300115","name":"Bemcho","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Bolognesi Esq. Tiravanti","district_id":577,"id":818,"lat":"-12.142495","lng":"-77.018044","name":"Bolognesi / Barranco","short_address":null,"venue_id":null,"services_ids":[3]},{"address":"Av. T\u00fapac Amaru N\u00ba 10200 \u2013 10202 (antes N\u00ba 2252) Lotizaci\u00f3n Las Flores (Km. 18,5), Distrito de Carabayllo, Lima","district_id":577,"id":904,"lat":"-11.8904759","lng":"-77.02704821","name":"Carabayllo II","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Venezuela 2600","district_id":577,"id":650,"lat":"-12.057598","lng":"-77.068797","name":"Centauro Venezuela","short_address":"Av. Venezuela 2600","venue_id":"","services_ids":[3,4]},{"address":"Av. Argentina 1815, Lima","district_id":577,"id":566,"lat":"-12.04531284","lng":"-77.06455735","name":"Due\u00f1as","short_address":"Av. Argentina 1815, ","venue_id":"4e921c1cc2eebfc9d6c7642e","services_ids":[3,6,7]},{"address":"Av. Venezuela 2600, Lima","district_id":577,"id":570,"lat":"-12.057577","lng":"-77.068824","name":"Elio","short_address":"Av. Venezuela 2600, ","venue_id":"4c4ba061959220a136cacb0f","services_ids":[3,6,9]},{"address":"Av. Colonial 871, Lima ","district_id":577,"id":603,"lat":"-12.052122","lng":"-77.090507","name":"Sudamericano","short_address":"Av. Colonial 871, Li","venue_id":"4eb418bfa17cab6127fc2692","services_ids":[3,4,5,6,7,9]},{"address":"Av. Tingo Mar\u00eda N\u00b0 1194 esquina con calle Ra\u00fal Porras Barrenechea, Lima","district_id":577,"id":605,"lat":"-12.060662","lng":"-77.058985","name":"Tingo Mar\u00eda","short_address":"Av. Tingo Mar\u00eda N\u00b0 1","venue_id":"4eb41b1fa17cab6127fc6ce8","services_ids":[3,4,5]},{"address":"Calle Baquero 498 esq. con Av. Zorritos, Lima","district_id":577,"id":609,"lat":"-12.050306","lng":"-77.046862","name":"Zorritos","short_address":"Calle Baquero 498 es","venue_id":"4eb41e3ca17cab6127fcd51f","services_ids":[3]}]},{"name":"Lince","places":[{"address":"Av. Arenales 2100","district_id":412,"id":625,"lat":"-12.079699","lng":"-77.03631","name":"Risso","short_address":"Av. Arenales 2100","venue_id":null,"services_ids":[3,4,5]},{"address":"Av. Gral. Cesar Canevaro 1598, Lince","district_id":412,"id":600,"lat":"-12.085181","lng":"-77.048455","name":"Salaverry","short_address":"Av. Gral. Cesar Cane","venue_id":"4c1844104ff90f4701420e49","services_ids":[3,6,7,9,10,11]}]},{"name":"Los Olivos","places":[{"address":"Av. 02 de Octubre (antes Confraternidad), Mza. LL-.1, Lote 17 Pueblo Joven PMV Confraternidad, Los Olivos","district_id":475,"id":929,"lat":"-11.93355618","lng":"-77.07549252","name":"Carolina Rojas","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Angelica Gamarra , cuadra 9 , Manzana B, lotes 3 y 4 , Calle 36 , III Etapa, Urb. El Trebol ","district_id":475,"id":683,"lat":"-12.006413","lng":"-77.074891","name":"Kamagi","short_address":"Av. Angelica Gamarra","venue_id":null,"services_ids":[3]},{"address":"Av. Universitaria Mza A Lote 6, Los Olivos ","district_id":475,"id":676,"lat":"-12.0162348","lng":"-77.07810448","name":"Los Olivos","short_address":"Av. Universitaria Mz","venue_id":null,"services_ids":[3]},{"address":"Av. Universitaria Esq con Av.Naranjal","district_id":475,"id":646,"lat":"-11.978056","lng":"-77.077761","name":"Naranjal","short_address":"Av. Universitaria Es","venue_id":null,"services_ids":[3]}]},{"name":"Lurigancho","places":[{"address":"Av. Lima sur 895 Chosica, Lurigancho","district_id":433,"id":629,"lat":"-11.940376","lng":"-76.698818","name":"Estaci\u00f3n 715","short_address":"Av. Lima sur 895 Cho","venue_id":"","services_ids":[3]},{"address":"Avenida Los Proceres Manzana A Lote 40, Asentamiento Humano Los Jazmines","district_id":433,"id":690,"lat":"-11.97673","lng":"-76.90785","name":"Oto\u00f1o","short_address":"Avendida Los Procere","venue_id":null,"services_ids":[3]}]},{"name":"Lur\u00edn","places":[{"address":"Mza. A Lote 1 Huertos de Villena, Lurin, Lima","district_id":409,"id":652,"lat":"-12.248802","lng":"-76.88653","name":"Lurin","short_address":"Mza. A Lote 1 Huerto","venue_id":null,"services_ids":[3,5]},{"address":"Panamericana Sur Km 30, Lur\u00edn","district_id":409,"id":594,"lat":"-12.263469","lng":"-76.909624","name":"Pansur","short_address":"Panamericana Sur Km ","venue_id":"4ed8029f4fc6a0235f35005d","services_ids":[3,6,7]}]},{"name":"Magdalena","places":[{"address":"Av. del Ej\u00e9rcito 101 (cruce con la brasil)","district_id":601,"id":623,"lat":"-12.097088","lng":"-77.071956","name":"Magdalena ","short_address":"Av. del Ej\u00e9rcito 101","venue_id":null,"services_ids":[3]},{"address":"Av. del Ej\u00e9rcito Esq. Gabriel Cossio 965","district_id":601,"id":624,"lat":"-12.100324","lng":"-77.061882","name":"Orrantia","short_address":"Av. del Ej\u00e9rcito Esq","venue_id":null,"services_ids":[3,5]}]},{"name":"Miraflores","places":[{"address":"Av. Benavides Esq. Ciro Alegr\u00eda","district_id":581,"id":617,"lat":"-12.127624","lng":"-77.010518","name":"Alegr\u00eda","short_address":"Av. Benavides Esq. C","venue_id":"","services_ids":[3,7]},{"address":"Av. Armendariz 575, Miraflores","district_id":581,"id":553,"lat":"-12.134988","lng":"-77.025238","name":"Armend\u00e1riz","short_address":"Av. Armendariz 575, ","venue_id":"4c264b5ef1272d7f294e86c5","services_ids":[3,6,7,9,10,11]},{"address":"Av. General C\u00f3rdova 1025 Santa Cruz","district_id":581,"id":699,"lat":"-12.109509","lng":"-77.048315","name":"Bel\u00e9n","short_address":"Av. General C\u00f3rdova ","venue_id":null,"services_ids":[3]},{"address":"Esq. Av. Benavides y Av. Rep\u00fablica de Panam\u00e1,  Miraflores ","district_id":581,"id":557,"lat":"-12.12602518","lng":"-77.01830644","name":"Benavides","short_address":"Esq. Av. Benavides y","venue_id":"4c56cb1230d82d7f8446d862","services_ids":[3,6,7,8,9,11,4]},{"address":"Av. del Ej\u00e9rcito Esq. calle Tovar","district_id":581,"id":620,"lat":"-12.116348","lng":"-77.044888","name":"Ej\u00e9rcito","short_address":"Av. del Ej\u00e9rcito Esq","venue_id":null,"services_ids":[3,5]},{"address":"Av. Paseo de la Rep\u00fablica 5789, Miraflores ","district_id":581,"id":601,"lat":"-12.124257","lng":"-77.02476","name":"San Antonio","short_address":"Av. Paseo de la Rep\u00fa","venue_id":"4ccd1f09aa25a35d5f6a190f","services_ids":[3,6,7,9,10,11]}]},{"name":"Pachacamac","places":[{"address":"Av. Lima 2205 (Tablada de Lur\u00edn al final Av. Pacahacutec)","district_id":593,"id":664,"lat":"-12.229939","lng":"-76.909801","name":"Gesa","short_address":"Av. Lima 2205 (Tabla","venue_id":null,"services_ids":[3,4,5]},{"address":"Av Victor Malasquez s/n Comunidad Campesino de Collanac Manchay, Lotes 130 - 131","district_id":593,"id":651,"lat":"-12.23211","lng":"-76.863951","name":"Manchay","short_address":"Av Victor Malasquez ","venue_id":null,"services_ids":[3]},{"address":"Av. Pachacutec 5295","district_id":593,"id":667,"lat":"-12.20137","lng":"-76.93099","name":"Tablada","short_address":"Av. Pachacutec 5295","venue_id":null,"services_ids":[3,4,5]}]},{"name":"Pucusana","places":[{"address":"Carretera Panamericana Sur Km. 57 Predio Comunal Chutana Pampa Patita","district_id":603,"id":614,"lat":"-12.457362","lng":"-76.752548","name":"Pucusana","short_address":"Carretera Panamerica","venue_id":"4ed813bb4fc6fb124c5e0359","services_ids":[3]}]},{"name":"Pueblo Libre","places":[{"address":"AV. La Marina 892 ","district_id":591,"id":694,"lat":"-12.081383","lng":"-77.070851","name":"Caminos del Inca","short_address":"AV. La Marina 892 ","venue_id":null,"services_ids":[3]},{"address":"Av. del R\u00edo 106","district_id":591,"id":637,"lat":"-12.071704","lng":"-77.055431","name":"Maria Auxiliadora","short_address":"Av. del R\u00edo 106","venue_id":null,"services_ids":[3,5]},{"address":"Av. Sucre 1070","district_id":591,"id":627,"lat":"-12.20062","lng":"-76.925304","name":"Sucre","short_address":"Av. Sucre 1070","venue_id":null,"services_ids":[3,4,5]}]},{"name":"Puente Piedra","places":[{"address":"Panam. Norte km 27.5 Puente Piedra (a 330 mts de escuela policia)","district_id":594,"id":665,"lat":"-11.815694","lng":"-77.127902","name":"Puente Piedra","short_address":"Panam. Norte km 27.5","venue_id":null,"services_ids":[3,4]}]},{"name":"San Borja","places":[{"address":"Av. Javier Prado Este 2500","district_id":599,"id":626,"lat":"-12.088003","lng":"-76.999698","name":"San Borja","short_address":"Av. Javier Prado Est","venue_id":"","services_ids":[3,5,7]},{"address":"Av. San Luis Esq. Av. San Borja Sur Mz. A173 Lt. 25","district_id":599,"id":638,"lat":"-12.100781","lng":"-76.994247","name":"San Luis II / Diesel Corporation","short_address":"Av. San Luis Esq. Av","venue_id":null,"services_ids":[3]}]},{"name":"San Isidro","places":[{"address":"Esq Aramburu con Rep\u00fablica de Panama 3690","district_id":580,"id":616,"lat":"-12.102648","lng":"-77.027818","name":"Acosa San Isidro","short_address":"Esq Aramburu con Rep","venue_id":"4d36818d3612a0933cc97f5d","services_ids":[3,4]},{"address":"Av Javier Prado Este 311, San Isidro","district_id":580,"id":615,"lat":"-12.09201","lng":"-77.031198","name":"Anegada","short_address":"Av Javier Prado Este","venue_id":"4bfb08bfab180f471e52b3ce","services_ids":[3]},{"address":"Av. Arequipa 3325, San Isidro","district_id":580,"id":552,"lat":"-12.09875025","lng":"-77.03223292","name":"Arequipa","short_address":"Av. Arequipa 3325, S","venue_id":"4ed53b680039e8b92213638b","services_ids":[3,5,6,7,8,9,10,11]},{"address":"Av. Petit thouars 3929, San Isidro","district_id":580,"id":656,"lat":"-12.112871","lng":"-77.028864","name":"Bela","short_address":"Av. Petit thouars 39","venue_id":null,"services_ids":[3]},{"address":"Av. Javier Prado Oeste 1895, San Isidro","district_id":580,"id":561,"lat":"-12.095","lng":"-77.050214","name":"Casta\u00f1os","short_address":"Av. Javier Prado Oes","venue_id":"4c6c7d76e13db60c6558d6b1","services_ids":[3,5,6,7,8,9,10,11]},{"address":"Av. Enrique Canaval Moreyra 202","district_id":580,"id":645,"lat":"-12.097059","lng":"-77.024071","name":"C\u00f3rpac","short_address":"Av. Enrique Canaval ","venue_id":null,"services_ids":[3]},{"address":"Av. Javier Prado Oeste 2504, San Isidro","district_id":580,"id":575,"lat":"-12.09354","lng":"-77.04198","name":"Flora Trist\u00e1n","short_address":"Av. Javier Prado Oes","venue_id":"4baeda6ef964a5203add3be3","services_ids":[3,6,7,8,9]},{"address":" Av. Augusto Perez Aranibar 2199, San Isidro ","district_id":580,"id":588,"lat":"-12.100353","lng":"-77.061914","name":"Marbella","short_address":" Av. Augusto Perez A","venue_id":"4c7bd7b63badb1f7b1055654","services_ids":[3,6,7,8,9,10,11,3]},{"address":"Av. Paseo de la Rep\u00fablica 3890, San Isidro ","district_id":580,"id":599,"lat":"-12.10542","lng":"-77.027799","name":"Rep\u00fablica","short_address":"Av. Paseo de la Rep\u00fa","venue_id":"4ba8c15cf964a5206bec39e3","services_ids":[3,6,7,11]}]},{"name":"San Juan de Lurigancho","places":[{"address":"Av.Pr\u00f3ceres de la Independencia Mz.K1 Ltes.33-34-35 Urb. San Carlos, San Juan Lurigancho","district_id":416,"id":555,"lat":"-11.972208","lng":"-76.996484","name":"Auly","short_address":"Av.Pr\u00f3ceres de la In","venue_id":"","services_ids":[3,7,8]},{"address":"Av. Cajarmarquilla San Juan de Lurigancho","district_id":416,"id":924,"lat":"-12.00382312","lng":"-76.90560444","name":"Cajamarquilla","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Canto Grande 401 San Juan de Lurigancho","district_id":416,"id":672,"lat":"-11.983932","lng":"-77.014343","name":"Canto Grande","short_address":"Av. Canto Grande 401","venue_id":null,"services_ids":[3]},{"address":"","district_id":416,"id":923,"lat":"-12.003141","lng":"-76.87539204","name":"Carapongo","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. El Sol 527, San Juan de Lurigancho","district_id":416,"id":634,"lat":"-11.985392","lng":"-77.003753","name":"El Aventurero","short_address":"Av. El Sol 527, San ","venue_id":null,"services_ids":[3,5]},{"address":"Sector 2 Nro. Mz K Int. Lt 7 A.H. Enrique Montenegro Lima, San Juan De Lurigancho","district_id":416,"id":695,"lat":"-11.936261","lng":"-76.968927","name":"Ensul","short_address":"Sector 2 Nro. Mz K I","venue_id":null,"services_ids":[3]},{"address":"Av. Procederes de la Independencia Mz 1 Lote 10 Esq. Jr Los Ciruelos","district_id":416,"id":684,"lat":"-11.983","lng":"-77.005963","name":"Los Ciruelos","short_address":"Av. Procederes de la","venue_id":null,"services_ids":[3]},{"address":"Av. Proceres de la Independencia N.\u00b0 104 Urb.Zarate, San Juan de Lurigancho","district_id":416,"id":608,"lat":"-12.028124","lng":"-77.011328","name":"Z\u00e1rate ","short_address":"Av. Proceres de la I","venue_id":"4ed80c2a4fc6a0235f365673","services_ids":[3,4,5,7,8]}]},{"name":"San Juan de Miraflores","places":[{"address":"Av.Miguel Iglesias Mz E Lot 14 A.H Heroes De San Juan de Miraflores ","district_id":408,"id":649,"lat":"-12.182677","lng":"-76.961417","name":"El Chalan","short_address":"Av.Miguel Iglesias M","venue_id":null,"services_ids":[3]},{"address":"Av. Defensores de Lima, esquina con Torres Paz, San Juan de Miraflores, Lima","district_id":408,"id":933,"lat":"-12.14721782","lng":"-76.97010808","name":"San Juan de Miraflores (Pachacutec)","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Benavides 5594 esq. Defensores de Lima (SJM)","district_id":408,"id":696,"lat":"-12.151388","lng":"-76.97","name":"Sur Export","short_address":"Av. Benavides 5594 e","venue_id":null,"services_ids":[3,4]}]},{"name":"San Luis","places":[{"address":"Jr.Manuel Echeandia 586 Urb El Pino San Luis","district_id":414,"id":648,"lat":"-12.072791","lng":"-76.990214","name":"El Pino","short_address":"Jr.Manuel Echeandia ","venue_id":"","services_ids":[3]},{"address":"Av. Nicol\u00e1s Ayll\u00f3n N\u00b0 1340 - Urb. El Pino, San Luis","district_id":414,"id":602,"lat":"-12.062383","lng":"-77.00326","name":"San Luis","short_address":"Av. Nicol\u00e1s Ayll\u00f3n N","venue_id":"4eb4180ea17cab6127fc126f","services_ids":[3,4,5,6,7,8]}]},{"name":"San Mart\u00edn de Porres","places":[{"address":"Av. Tomas Valle 1981, San Mart\u00edn de Porres","district_id":406,"id":584,"lat":"-12.007967","lng":"-77.057372","name":"Igarza","short_address":"Av. Tomas Valle 1981","venue_id":"4ed6c0ff754ae824a4716a48","services_ids":[3,4,5,6,7,9]},{"address":"Av. Jos\u00e9 Granda Cuadra 32","district_id":406,"id":680,"lat":"-12.025464","lng":"-77.076441","name":"Jose Granda","short_address":"Av. Jos\u00e9 Granda Cuad","venue_id":null,"services_ids":[3,4]},{"address":"autopista Canta Callao Mz. G lote.4 urbanizaci\u00f3n los Huertos del Naranjal, San Martin de Porres","district_id":406,"id":932,"lat":"-11.97546527","lng":"-77.09041021","name":"Naranjal II","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Carlos Izaguirre Mz. D Lote 4 Urb. California, San Martin de Porres","district_id":406,"id":633,"lat":"-11.98782624","lng":"-77.11419773","name":"Tio Sam","short_address":"Av. Carlos Izaguirre","venue_id":null,"services_ids":[3]},{"address":"Av. Alfredo Mendiola  Nro 6800, San Martin de Porres","district_id":406,"id":901,"lat":"-12.01096475","lng":"-77.06044297","name":"Trailer Gas","short_address":null,"venue_id":"","services_ids":[3]}]},{"name":"San Miguel","places":[{"address":"Av. La Marina 3112 Urb. Maranga, San Miguel","district_id":397,"id":567,"lat":"-12.077638","lng":"-77.093618","name":"El Carmelo","short_address":"Av. La Marina 3112 U","venue_id":"4ed54efa0039e8b92215aa19","services_ids":[3,5,6,7,9]},{"address":"Elmer Faucett 384","district_id":397,"id":621,"lat":"-12.067178","lng":"-77.097067","name":"Faucett","short_address":"Elmer Faucett 384","venue_id":null,"services_ids":[3,4,5]},{"address":"Av. La Marina Esq. Riva Ag\u00fcero, La Marina","district_id":397,"id":586,"lat":"-12.07848","lng":"-77.084265","name":"La Marina","short_address":"Av. La Marina Esq. R","venue_id":"4d2bc71e915fa093f21e1a0a","services_ids":[3,5,6,7,8,9,11]},{"address":"Av. La Paz 925, San Miguel","district_id":397,"id":897,"lat":"-12.0832195","lng":"-77.09850603","name":"La Paz","short_address":null,"venue_id":"","services_ids":[3,5]}]},{"name":"Santa Anita","places":[{"address":"Av. Los Chancas 629 Coop. Andahuaylas, Santa Anita, Lima","district_id":598,"id":640,"lat":"-12.037038","lng":"-76.962681","name":"Encalada","short_address":"Av. Los Chancas 629 ","venue_id":null,"services_ids":[3]},{"address":"Av Encalada con Av Huancarama es ferrocarriil mz 3 lote12 y 13","district_id":598,"id":642,"lat":"-12.03287","lng":"-76.964652","name":"Pradera","short_address":"Av Encalada con Av H","venue_id":"","services_ids":[3]},{"address":"Carretera Lima-Canta Km 23 Parcela 283 ex fundo huanco (1km)","district_id":598,"id":643,"lat":"-11.482296","lng":"-76.647781","name":"Torreblanca","short_address":"Carretera Lima-Canta","venue_id":null,"services_ids":[3,5]}]},{"name":"Santiago de Surco","places":[{"address":"Prol. Angamos Este 1695","district_id":403,"id":630,"lat":"-12.10883714","lng":"-76.97090171","name":"Blue Gas","short_address":"Prol. Angamos Este 1","venue_id":"","services_ids":[3]},{"address":"Av. Santiago de Surco 3291, Chama, Surco ","district_id":403,"id":562,"lat":"-12.131026","lng":"-76.999435","name":"Chama","short_address":"Av. Santiago de Surc","venue_id":"4e8f5e5cc2ee0d7f4f513ea6","services_ids":[3,5,6,7,9]},{"address":"Av. Tom\u00e1s Marsano 5010, Surco","district_id":403,"id":573,"lat":"-12.14793412","lng":"-76.9868695","name":"Ferrari","short_address":"Av. Thomas Marzano 5","venue_id":"4e922226c2eebfc9d6c8223f","services_ids":[3,7]},{"address":"Av. Mariscal Castilla 905, Surco","district_id":403,"id":577,"lat":"-12.134394","lng":"-77.010959","name":"Granada","short_address":"Av. Mariscal Castill","venue_id":"4c5e337d7f661b8d0ac54d1c","services_ids":[3,5,6,7,8,9,10,11]},{"address":"Av. Benavides 4295, Santiago de Surco ","district_id":403,"id":578,"lat":"-12.127955","lng":"-76.991922","name":"Higuereta","short_address":"Av. Benavides 4295, ","venue_id":"4b6c3735f964a520f5292ce3","services_ids":[3,6,7,9]},{"address":"Av. Javier Prado este S/N Cdra. 44 Urb. Fundo Monterrico Chico Surco","district_id":403,"id":579,"lat":"-12.084457","lng":"-76.974742","name":"Hip\u00f3dromo","short_address":"Av. Javier Prado est","venue_id":"4bb6bd1a6edc76b0d377311c","services_ids":[3,6,7,8,9]},{"address":"Av. Camino del Inca 2017, Santiago de Surco ","district_id":403,"id":591,"lat":"-12.130278","lng":"-76.981772","name":"Montreal","short_address":"Av. Camino del Inca ","venue_id":"4bc3dadc74a9a5937336d5f6","services_ids":[3,6,7,9,10,11]},{"address":"Av. Angamos Este N.\u00b02398, Surquillo","district_id":403,"id":596,"lat":"-12.112278","lng":"-77.005824","name":"Primavera","short_address":"Panamericana Sur KM ","venue_id":"4bb2a85b35f0c9b6f89ebb83","services_ids":[3,6,7,9,3]},{"address":"Av. Caminos del Inca 194 Urb Tambo de Monterrico","district_id":403,"id":688,"lat":"-12.113086","lng":"-76.992831","name":"Shenandoa","short_address":"Av. Caminos del Inca","venue_id":null,"services_ids":[3]},{"address":"Av. Primavera 1159 V. Hermoso, Surco ","district_id":403,"id":607,"lat":"-12.10914107","lng":"-76.97701648","name":"Valle Hermoso","short_address":"Av. Primavera 1159 V","venue_id":"4bdf661fbe5120a1d9b5fe70","services_ids":[3,5,6,9,10,11]}]},{"name":"Surquillo","places":[{"address":"Av. Tomas Marzano 1008, Surquillo","district_id":399,"id":569,"lat":"-12.11247524","lng":"-77.01208853","name":"El Rosario","short_address":"Av. Tomas Marzano 10","venue_id":"4dafbe8e4df00ee01d40b09b ","services_ids":[3,4,5,6,7,9,10,11]},{"address":"Av Rep\u00fablica de Panama 5160, Surquillo","district_id":399,"id":689,"lat":"-12.115469","lng":"-77.018371","name":"Surquillo ","short_address":"Av Rep\u00fablica de Pana","venue_id":null,"services_ids":[3]}]},{"name":"Ventanilla","places":[{"address":"Carretera Ventanilla Km. 5.5.","district_id":600,"id":636,"lat":"-11.918862","lng":"-77.128767","name":"Altagracia","short_address":"Carretera Ventanilla","venue_id":null,"services_ids":[3,5]},{"address":"Av. Prinicpal N\u00b0 B1 Int. Lt. 15, Ventanilla","district_id":600,"id":926,"lat":"-11.8766768","lng":"-77.10763148","name":"Labarthe","short_address":null,"venue_id":"","services_ids":[3]}]},{"name":"Villa Mar\u00eda del Triunfo","places":[{"address":"Av. Villa Mar\u00eda del Triunfo 1938, esq. Calle Independencia, Mz. H 19, Lt. 15, Villa Mar\u00eda del Triunfo","district_id":488,"id":911,"lat":"-12.15566629","lng":"-76.93512483","name":"El Incomprendido","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Villa Mar\u00eda del Triunfo 1938, esq. Calle Independencia, Mz. H 19, Lt. 15, Villa Mar\u00eda del Triunfo","district_id":488,"id":890,"lat":"-12.15565052","lng":"-76.93505642","name":"El Incomprendido","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Jr. General Vidal, N\u00b0 679, Distrito de Villa Mar\u00eda del Triunfo","district_id":488,"id":654,"lat":"-12.198355","lng":"-76.924483","name":"Grifo Andino","short_address":"Jr. General Vidal, N","venue_id":null,"services_ids":[3]},{"address":"Av. Defensores de Lima N\u00b0 1091, Villa Mar\u00eda del Triunfo","district_id":488,"id":692,"lat":"-12.173496","lng":"-76.944138","name":"San Gabriel","short_address":"Av. Defensores de Li","venue_id":null,"services_ids":[3]}]},{"name":"Villa el Salvador","places":[{"address":"Grupo 20 Mza N LOTE 5 sector 1","district_id":444,"id":641,"lat":"-12.207007","lng":"-76.933565","name":"Euromaxx","short_address":"Grupo 20 Mza N LOTE ","venue_id":null,"services_ids":[3]},{"address":"Av. Micaela Bastidas, esquina 200 millas, Villa El Salvador","district_id":444,"id":682,"lat":"-12.231119","lng":"-76.932691","name":"Jevaro","short_address":"Av. Micaela Bastidas","venue_id":null,"services_ids":[3,5]},{"address":"Av. Jose Carlos Mariategui esq. Av. Revoluci\u00f3n Sector 3 Grupo 15 Mz. A Lts. 13 14 15 y 16, Villa El Salvador, Lima","district_id":444,"id":589,"lat":"-12.220754","lng":"-76.932487","name":"Mariategui","short_address":"Av. Jose Carlos Mari","venue_id":"","services_ids":[3]},{"address":"Parcela 2 N Mz E Interior lote 1 parque industrial, Villa el Salvador","district_id":444,"id":593,"lat":"-12.19567006","lng":"-76.93996971","name":"Pachacutec","short_address":"Parcela 2 N Mz E Int","venue_id":"4eb410d1a17cab6127fb418a","services_ids":[3,4,6,3,5]},{"address":"Av Maria Reiche Mza A Lote 06 Urb Pachacamac Barrio 4","district_id":444,"id":647,"lat":"-12.246401","lng":"-76.923759","name":"Percy Car","short_address":"Av Maria Reiche Mza ","venue_id":"","services_ids":[3]},{"address":"Av. Micaela Bastidas, Sector 2, Grupo 19, Mz. I, Lote 15","district_id":444,"id":670,"lat":"-12.21809","lng":"-76.940517","name":"Villa","short_address":"Av. Micaela Bastidas","venue_id":null,"services_ids":[3,4]}]}];
window.places['provincias'] = [{"name":"Arequipa","places":[{"address":"Carretera Panamericana Sur Km. 610, P.J. La Aguadita, distrito Chala, Provincia Caravel\u00ed, Arequipa","district_id":582,"id":914,"lat":"-16.66461959","lng":"-71.87136479","name":"Aeropuerto 610","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Urb. Industrial Cayro Av. Jes\u00fas Nro. 1400 Mz.A Lt.1, Arequipa","district_id":582,"id":700,"lat":"-16.4034","lng":"-71.516522","name":"Angelito","short_address":"Urb. Industrial Cayr","venue_id":null,"services_ids":[3,5]},{"address":"Urb. Las Begonias E-14. Jose Luis Bustamante y Rivero, Arequipa","district_id":582,"id":701,"lat":"-16.395825","lng":"-71.532755","name":"Beneton","short_address":"Urb. Las Begonias E-","venue_id":null,"services_ids":[3,5]},{"address":"Calle San Agustin 400","district_id":582,"id":702,"lat":"-16.397476","lng":"-71.53889","name":"Cane la Marina","short_address":"Calle San Agustin 40","venue_id":null,"services_ids":[3]},{"address":"Av La Paz 516, Arequipa","district_id":582,"id":703,"lat":"-16.399465","lng":"-71.528463","name":"Cane la Paz","short_address":"Av La Paz 516, Arequ","venue_id":null,"services_ids":[3]},{"address":"Prolongaci\u00f3n Av. Ejercito N.\u00b0 508 ","district_id":582,"id":902,"lat":"-16.38557889","lng":"-71.55458322","name":"Cerro Colorado","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Car. Variante de Uchumayo Km. 06, Arequipa","district_id":582,"id":704,"lat":"-16.404306","lng":"-71.571175","name":"Characato","short_address":"Car. Variante de Uch","venue_id":null,"services_ids":[3]},{"address":" Variante de Uchumayo, Km.1, Sachaca","district_id":582,"id":705,"lat":"-16.404337","lng":"-71.571164","name":"Corrales","short_address":" Variante de Uchumay","venue_id":null,"services_ids":[3]},{"address":"Mz C Lote 11 Villa Hermosa Paucarpata, Arequipa","district_id":582,"id":706,"lat":"-16.407275","lng":"-71.480538","name":"Evitamiento","short_address":"Mz C Lote 11 Villa H","venue_id":null,"services_ids":[3]},{"address":"Av. Parra 222-A, Arequipa ","district_id":582,"id":707,"lat":"-16.481375","lng":"-71.501165","name":"Italia","short_address":"Av. Parra 222-A, Are","venue_id":null,"services_ids":[3]},{"address":"Urb. Industrial Cayro\u00a0 D-3, distrito Paucarpata, provincia y departamento de Arequipa","district_id":582,"id":931,"lat":"-16.41728158","lng":"-71.51015144","name":"Kennedy","short_address":null,"venue_id":"","services_ids":[3,5]},{"address":"Coo. Lanificio Av. Peru Mz C lt. 1 Esq. Con A Caceres, Arequipa","district_id":582,"id":708,"lat":"-16.42562","lng":"-71.5332","name":"Lanificio","short_address":"Coo. Lanificio Av. P","venue_id":"4ed697d0d5fbccc4273c9885","services_ids":[3,6]},{"address":"Panamericana Sur Km 957","district_id":582,"id":709,"lat":"-16.664752","lng":"-71.871126","name":"Maring\u00e1","short_address":"Panamericana Sur Km ","venue_id":null,"services_ids":[3]},{"address":"Av. Progreso 393, Miraflores","district_id":582,"id":710,"lat":"-16.394152","lng":"-71.521447","name":"Montecarlo","short_address":"Av. Progreso 393, Mi","venue_id":null,"services_ids":[3]},{"address":"Av. Dolores 197 y Av. Estados Unidos, Arequipa","district_id":582,"id":711,"lat":"-16.429188","lng":"-71.523778","name":"Monterrey","short_address":"Av. Dolores 197 y Av","venue_id":null,"services_ids":[3]},{"address":"Av. Parra N.\u00b0 371 Disto.Arequipa,  Arequipa","district_id":582,"id":712,"lat":"-16.480617","lng":"-71.500762","name":"Parra","short_address":"Av. Parra N.\u00b0 371 Di","venue_id":"","services_ids":[3]},{"address":"Av. Pizarro N.\u00b0 141 Disto.Jose Luis Bustamante y Rivero, Arequipa","district_id":582,"id":713,"lat":"-16.418822","lng":"-71.51668","name":"Reservorio","short_address":"Av. Pizarro N.\u00b0 141 ","venue_id":null,"services_ids":[3]},{"address":"Av. Fernandini, Arequipa, Peru","district_id":582,"id":908,"lat":"-16.4123051","lng":"-71.5602717","name":"Sachaca","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Carretera Panamericana Sur KM 982, La Joya","district_id":582,"id":714,"lat":"-16.707289","lng":"-71.870268","name":"Sahara ","short_address":"Carretera Panamerica","venue_id":null,"services_ids":[3]},{"address":" Carretera Panamerica Sur, Km.48, La Joya, Arequipa","district_id":582,"id":715,"lat":"-16.707335","lng":"-71.870284","name":"San Juan","short_address":" Carretera Panameric","venue_id":null,"services_ids":[3]},{"address":"Av. Caracas / Av. Saband\u00eda, Jos\u00e9 Luis Bustamante y Rivero","district_id":582,"id":716,"lat":"-16.443435","lng":"-71.513612","name":"Santa Fe","short_address":"Av. Caracas / Av. Sa","venue_id":null,"services_ids":[3]},{"address":"Car Yura km 11, Arequipa","district_id":582,"id":717,"lat":"-16.29758137","lng":"-71.64437389","name":"Santa Monica","short_address":"Car Yura km 11, Areq","venue_id":null,"services_ids":[3]},{"address":"Urb. Vallecito Av Salaverry 608-610, Arequipa","district_id":582,"id":718,"lat":"-16.404838","lng":"-71.541833","name":"Sao Paulo","short_address":"Urb. Vallecito Av Sa","venue_id":null,"services_ids":[3]},{"address":"Av. Venezuela N\u00b0 219, Arequipa","district_id":582,"id":903,"lat":"-16.4101156","lng":"-71.53274419","name":"Sedapar","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Urb San Martin de Socabaya Cal. Quebrada de Coscollo 794, Arequipa","district_id":582,"id":719,"lat":"-16.444122","lng":"-71.527755","name":"Socabaya","short_address":"Urb San Martin de So","venue_id":null,"services_ids":[3]},{"address":"Av.Venezuela N.\u00b02515 Parque Industrial, Arequipa","district_id":582,"id":720,"lat":"-16.410666","lng":"-71.533446","name":"Sur Per\u00fa","short_address":"Av.Venezuela N.\u00b02515","venue_id":null,"services_ids":[3]},{"address":"Urb. Juan El Bueno Av Venezuela 2200, Arequipa","district_id":582,"id":721,"lat":"-16.413722","lng":"-71.540098","name":"Venezuela","short_address":"Urb. Juan El Bueno A","venue_id":null,"services_ids":[3]},{"address":"Carretera Panamerica Sur, Km.48, La Joya, Arequipa","district_id":582,"id":873,"lat":"-16.707109","lng":"-71.870456","name":"Victoria","short_address":null,"venue_id":null,"services_ids":[3]},{"address":"Av. Ej\u00e9rcito 504 Dto. Yanahuara Dpto., Arequipa","district_id":582,"id":874,"lat":"-16.392325","lng":"-71.540107","name":"Yanahuara","short_address":null,"venue_id":null,"services_ids":[3,6,7]},{"address":"Calle Haiti 102 urb.Satelite piso 2 Jose Luis B.Riero","district_id":582,"id":724,"lat":"-16.40123134","lng":"-71.52013397","name":"Yura","short_address":"Calle Haiti 102 urb.","venue_id":null,"services_ids":[3]}]},{"name":"Barranca","places":[{"address":"Av. Ramon Castilla N.\u00b0 921; Distrito y Provincia de Barranca, Lima","district_id":575,"id":556,"lat":"-10.75536","lng":"-77.764792","name":"Barranca","short_address":"Av. Ramon Castilla N","venue_id":"","services_ids":[3]},{"address":"Jr. Castilla 940","district_id":575,"id":725,"lat":"-10.749826","lng":"-77.76299","name":"Las Palmeras","short_address":"Jr. Castilla 940","venue_id":"","services_ids":[3,5]},{"address":"Carretera Panamericana Norte Km. 196, Barranca","district_id":575,"id":909,"lat":"-10.73877601","lng":"-77.77100779","name":"San Jos\u00e9","short_address":null,"venue_id":"","services_ids":[3]}]},{"name":"Cajamarca","places":[{"address":"Av. Los Heroes 681 San Sebastian, Cajamarca","district_id":505,"id":726,"lat":"-7.16170621","lng":"-78.51277402","name":"Mi amigo","short_address":"Av. Los Heroes 681 S","venue_id":"","services_ids":[3]}]},{"name":"Ca\u00f1ete","places":[{"address":"Carretera Panam Sur km 143, San Vicente de Ca\u00f1ete","district_id":590,"id":727,"lat":"-13.285344","lng":"-76.268247","name":"Hupesa","short_address":"Carretera Panam Sur ","venue_id":null,"services_ids":[3]},{"address":"Autopista San Vicente Imperial 2433","district_id":590,"id":728,"lat":"-13.074211","lng":"-76.370344","name":"San Vicente","short_address":"Autopista San Vicent","venue_id":"","services_ids":[3]}]},{"name":"Cerro De Pasco","places":[{"address":"Av. El Minero Nro. 100, San Juan, Yanacancha","district_id":605,"id":875,"lat":"-12.205476","lng":"-75.390072","name":"Ecoserm Rancas","short_address":null,"venue_id":"","services_ids":[3]}]},{"name":"Chancay","places":[{"address":"Carretera Panamericana Norte Km. 84.90 , Dist. de Chancay, Prov.de Huaura, Lima","district_id":576,"id":565,"lat":"-11.567847","lng":"-77.264593","name":"Don Mariano","short_address":"Carretera Panamerica","venue_id":"","services_ids":[3]},{"address":"Panamericana Norte Km. 85","district_id":576,"id":730,"lat":"-11.541252","lng":"-77.281332","name":"Serpentin","short_address":"Panamericana Norte K","venue_id":null,"services_ids":[3]}]},{"name":"Chiclayo","places":[{"address":"Av. Andr\u00e9s Avelino C\u00e1ceres 550, Ferre\u00f1afe","district_id":515,"id":731,"lat":"-6.642559","lng":"-79.789249","name":"Autocentro / Ferre\u00f1afe","short_address":"Av. Andr\u00e9s Avelino C","venue_id":null,"services_ids":[3]},{"address":"Av. Jose Balta N\u00b03000, Chiclayo, Peru","district_id":515,"id":907,"lat":"-6.76669496","lng":"-79.83781841","name":"Balta","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Lote del Fundo La Esperanza (esquina sur Oeste) cruce V. Evitamiento y Prolongaci\u00f3n Av. Bolognesi, Chiclayo","district_id":515,"id":925,"lat":"-6.78649013","lng":"-79.86785139","name":"Gascop 2","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Salaverry 595","district_id":515,"id":732,"lat":"-6.770725","lng":"-79.850077","name":"Hermanos Jara ","short_address":"Av. Salaverry 595","venue_id":null,"services_ids":[3]},{"address":"Calle Sta. Isabel s/n, Entrada C.A.A., Cayalt\u00ed, Dist. Za\u00f1a","district_id":515,"id":733,"lat":"-6.92451","lng":"-79.584317","name":"Kelly Cayalti ","short_address":"Calle Sta. Isabel s/","venue_id":null,"services_ids":[3]},{"address":"Av. Nacionalismo N.\u00b0 540 Urb. Las Brisa, Chiclayo, Lambayeque","district_id":515,"id":734,"lat":"-6.779483","lng":"-79.867709","name":"Las Brisas","short_address":"Av. Nacionalismo N.\u00b0","venue_id":"4ed6bc0e754ae824a4709ada","services_ids":[3,5,6]},{"address":"Av. Francisco Bolognesi 390 ","district_id":515,"id":885,"lat":"-6.776785","lng":"-79.845956","name":"Merino Chiclayo","short_address":null,"venue_id":"","services_ids":[]},{"address":"Esq. Av. Bolognesi y Av. Grau s/n, Chiclayo Lambayeque","district_id":515,"id":735,"lat":"-6.77667","lng":"-79.844398","name":"Palmeras","short_address":"Esq. Av. Bolognesi y","venue_id":"4ed6bb3d754ae824a47078f8","services_ids":[3,5,6,7]},{"address":"Carretera Panamericana Norte Km. 779.4, Chiclayo","district_id":515,"id":736,"lat":"-6.694231","lng":"-79.903843","name":"Quiola","short_address":"Carretera Panamerica","venue_id":"4ed6bae1754ae824a4706bed","services_ids":[3]},{"address":"Panamericana Norte Km 3 Carretera Chiclayo, Lambayeque","district_id":515,"id":737,"lat":"-6.808148","lng":"-79.829386","name":"San Antonio ","short_address":"Panamericana Norte K","venue_id":null,"services_ids":[3]},{"address":"Av. Juan Tomis Stack 205, Chiclayo","district_id":515,"id":738,"lat":"-6.770836","lng":"-79.861349","name":"Santa Elena","short_address":"Av. Juan Tomis Stack","venue_id":null,"services_ids":[3,5,6,7]},{"address":"Av. Jose Balta N.\u00b0 012 y Calle Las Casuarinas N.\u00b0 120,  Chiclayo, Lambayeque","district_id":515,"id":739,"lat":"-6.778761","lng":"-79.839004","name":"Santa Victoria","short_address":"Av. Jose Balta N.\u00b0 0","venue_id":"4ed6bba3754ae824a47088ce","services_ids":[3,5,6,7]}]},{"name":"Chimbote","places":[{"address":"Urb.Las Casuarinas,sector 72,parcela 04-A108, Chimbote","district_id":518,"id":930,"lat":"-9.07333329","lng":"-78.60653991","name":"Casuarinas","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Haya de la Torre, Zona Industrial P.J 1ro Mayo Mz. D","district_id":518,"id":740,"lat":"-9.073998","lng":"-78.593517","name":"Chimbote Corp","short_address":"Haya de la Torre, Zo","venue_id":null,"services_ids":[3]},{"address":"Av. Enrique Meiggs cuadra 12 s/n PJ Florida Baja Chimbote, Santa","district_id":518,"id":678,"lat":"-9.055667","lng":"-78.577226","name":"Santa Rosa","short_address":"Av. Enrique Meiggs c","venue_id":"","services_ids":[3,3]},{"address":"Urb.Las Casuarinas,sector 72,parcela 04-A108, Chimbote","district_id":518,"id":741,"lat":"-9.074192","lng":"-78.604023","name":"Servicentro Casuarinas","short_address":"Urb.Las Casuarinas,s","venue_id":"","services_ids":[3]}]},{"name":"Chincha","places":[{"address":"Panamericana Sur, Km. 202","district_id":588,"id":742,"lat":"-13.413738","lng":"-76.149834","name":"Medalla Milagrosa","short_address":"Panamericana Sur, Km","venue_id":null,"services_ids":[3]}]},{"name":"Cusco","places":[{"address":"Mz. A Lt. 20 Urb. Parque Industrial , Distr. de Wanchaq, Cusco","district_id":520,"id":743,"lat":"-13.53411","lng":"-71.955621","name":"Aeropuerto","short_address":"Mz. A Lt. 20 Urb. Pa","venue_id":"","services_ids":[3]},{"address":"Carretera Cusco-Urcos km 10.5 Distrito de Oropeza, Quispicanchi","district_id":520,"id":751,"lat":"-13.67430217","lng":"-71.66977978","name":"E/SPacifico","short_address":"Carretera Cusco-Urco","venue_id":null,"services_ids":[3]},{"address":"Prolongaci\u00f3n Av. de la Cultura 2338, B Cuzco, Prov.San Sebasti\u00e1n","district_id":520,"id":744,"lat":"-13.527455","lng":"-71.915538","name":"Grifo Servimas","short_address":"Prolongaci\u00f3n Av. de ","venue_id":"","services_ids":[3]},{"address":"Prolongaci\u00f3n Av. de la Cultura Km. 6.0, distrito de San Jer\u00f3nimo, Cusco","district_id":520,"id":745,"lat":"-13.534048","lng":"-71.911161","name":"Loayza's Grifo","short_address":"Prolongacio Av. de l","venue_id":"","services_ids":[3]},{"address":"Mz.D Sub Lote 5-6 Urb. Bancopata, Dsto. de Wanchaq, Cusco","district_id":520,"id":746,"lat":"-13.52672","lng":"-71.971661","name":"Ovalo","short_address":"Mz.D Sub Lote 5-6 Ur","venue_id":null,"services_ids":[3]},{"address":"Carretera Cusco-Urcos km 10.5 Distrito de Oropeza, Quispicanchi","district_id":520,"id":819,"lat":"-13.63660324","lng":"-71.69557572","name":"Pacifico","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Km 10 Carretera Cusco Abancay, Sector Huampar, Poroy Cusco","district_id":520,"id":747,"lat":"-13.515216","lng":"-71.98639","name":"Poroy","short_address":"Km 10 Carretera Cusc","venue_id":null,"services_ids":[3]},{"address":"Urb. La Campi\u00f1a Lote 7 Mza A Distrito de Urubamba","district_id":520,"id":748,"lat":"-13.309522","lng":"-72.113957","name":"Urubamba","short_address":"Urb. La Campi\u00f1a Lote","venue_id":null,"services_ids":[3]},{"address":"Carretera Cusco-Abancay km 13.5, Distrito de Poroy","district_id":520,"id":749,"lat":"-13.515216","lng":"-71.98639","name":"Urubamba II","short_address":"Carretera Cusco-Aban","venue_id":null,"services_ids":[3]},{"address":"Carretera Urubamba \u2013 Ollantaytambo, lote 01, Sector Yanahuara","district_id":520,"id":723,"lat":"-13.279627","lng":"-72.205842","name":"Yanahuara","short_address":"Carretera Urubamba \u2013","venue_id":"4ed69a19d5fbccc4273ce45b","services_ids":[3,6,7,3]},{"address":"Jiron Junin s/n distrito y provincia de Anta","district_id":520,"id":750,"lat":"-13.53432853","lng":"-71.97481155","name":"Yzcuchaca","short_address":"Jiron Junin s/n dist","venue_id":null,"services_ids":[3]}]},{"name":"Huacho","places":[{"address":"Jos\u00e9 Ausejo Salas 150","district_id":529,"id":752,"lat":"-11.103692","lng":"-77.606753","name":"Alegre","short_address":"Jos\u00e9 Ausejo Salas 15","venue_id":null,"services_ids":[3]},{"address":"Calle Domingo Coloma N.\u00b0 152, Distrito de Huacho, Provincia de Huaura, Lima","district_id":529,"id":564,"lat":"-11.104568","lng":"-77.606134","name":"Coloma","short_address":"Calle Domingo Coloma","venue_id":"","services_ids":[3]},{"address":"Carretera Tupac Amaru No 598 Santa Maria, Huaura, Lima","district_id":529,"id":580,"lat":"-11.981958","lng":"-77.058808","name":"Huacho","short_address":"Carretera Tupac Amar","venue_id":"4e923681c2eebfc9d6cab0dc","services_ids":[3]},{"address":"Panamericana norte km 138 Santa Maria, Huacho","district_id":529,"id":753,"lat":"-11.127918","lng":"-77.594359","name":"Peaje","short_address":"Panamericana norte k","venue_id":null,"services_ids":[3]},{"address":"Av. San Mart\u00edn S/N Huara, Huacho, Lima","district_id":529,"id":597,"lat":"-11.105031","lng":"-77.602165","name":"Proagro","short_address":"Av. San Mart\u00edn S/N H","venue_id":"4ed805144fc6a0235f35592b","services_ids":[3]},{"address":"Panamericana Norte Km. 145","district_id":529,"id":754,"lat":"-11.161614","lng":"-77.590578","name":"Santa Maria","short_address":"Panamericana Norte K","venue_id":null,"services_ids":[3]}]},{"name":"Huancayo","places":[{"address":"Carretera Central Huancayo Km. 7 Sector Bellavista","district_id":532,"id":755,"lat":"-12.113477","lng":"-75.219586","name":"Bellavista","short_address":"Carretera Central Hu","venue_id":null,"services_ids":[3]},{"address":"Av Huancavelica 1655, El Tambo, Huancayo","district_id":532,"id":756,"lat":"-12.064665","lng":"-75.218106","name":"El Yagus","short_address":"Av Huancavelica 1655","venue_id":null,"services_ids":[3,5]},{"address":"Av. Huancavelica 1655, El Tambo, Huancayo","district_id":532,"id":896,"lat":"-12.06085883","lng":"-75.22039126","name":"Elyagu","short_address":null,"venue_id":"","services_ids":[3,5]},{"address":"Av. Mariscal Castilla 4788, El Tambo","district_id":532,"id":757,"lat":"-12.031834","lng":"-75.233586","name":"Estaci\u00f3n Si","short_address":"Av. Mariscal Castill","venue_id":null,"services_ids":[3]},{"address":"Av. Palian 465, Huancayo","district_id":532,"id":758,"lat":"-12.066666","lng":"-75.216666","name":"Precision","short_address":"Av. Palian 465, Huan","venue_id":null,"services_ids":[3]},{"address":"Carretera Central km 16 - Barrio 2 de Mayo - Distrito de San Jer\u00f3nimo, Huancayo","district_id":532,"id":913,"lat":"-12.04417771","lng":"-75.25266831","name":"San Jeronimo","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Mariscal Castilla 2699-A, El Tambo","district_id":532,"id":759,"lat":"-12.031823","lng":"-75.233588","name":"Santa Cecilia","short_address":"Av. Mariscal Castill","venue_id":null,"services_ids":[3,5]},{"address":"Av. Mariscal Castilla 4788, El Tambo, Huancayo","district_id":532,"id":900,"lat":"-12.0319807","lng":"-75.23343243","name":"Sisac","short_address":null,"venue_id":"","services_ids":[3]}]},{"name":"Huaral","places":[{"address":"Car. Panamericana Norte Km. SM 91 Huaral, Chancay, Lima","district_id":536,"id":563,"lat":"-11.56093","lng":"-77.266449","name":"Chancay","short_address":"Car. Panamericana No","venue_id":"","services_ids":[3]},{"address":"Av. Chancay 513","district_id":536,"id":761,"lat":"-11.497888","lng":"-77.214144","name":"Daniela","short_address":"Av. Chancay 513","venue_id":null,"services_ids":[3]},{"address":"Esquina de calle derecha (cuadra 9) y camal viejo s/n, Huaral","district_id":536,"id":762,"lat":"-11.496878","lng":"-77.209806","name":"Daniela Calle Derecha","short_address":"Esquina de calle der","venue_id":null,"services_ids":[3]},{"address":"Av. Chancay S/N Esquina con Calle 3 de Octubre , Distrito y Provincia de Huaral, Lima","district_id":536,"id":581,"lat":"-11.498229","lng":"-77.215551","name":"Huaral","short_address":"Av. Chancay S/N Esqu","venue_id":"","services_ids":[3]},{"address":"Carretera Huaral Pasamayo km 8.16","district_id":536,"id":763,"lat":"-11.50076","lng":"-77.209061","name":"Makaton","short_address":"Carretera Huaral Pas","venue_id":null,"services_ids":[3]},{"address":"Esq. Circunvalaci\u00f3n norte y prolong. Castilla B 11-12","district_id":536,"id":764,"lat":"-11.488394","lng":"-77.202516","name":"San Martin","short_address":"Esq. Circunvalaci\u00f3n ","venue_id":null,"services_ids":[3,5]}]},{"name":"Huarmey","places":[{"address":"Panamericana Norte Km. 294","district_id":587,"id":765,"lat":"-10.058419","lng":"-78.157728","name":"Servicentro Huarmey","short_address":"Panamericana Norte K","venue_id":null,"services_ids":[3]}]},{"name":"Huaura","places":[{"address":"Panamericana Norte Km. 145","district_id":607,"id":877,"lat":"-11.065802","lng":"-77.598367","name":"Huaura","short_address":null,"venue_id":null,"services_ids":[3]},{"address":"Carretera Panamericana Norte Km 166 + 033, sub lote 2, parcela 43, Centro Poblado Menor Medio Mundo","district_id":607,"id":878,"lat":"-11.065838","lng":"-77.598356","name":"Servikya","short_address":null,"venue_id":null,"services_ids":[3]}]},{"name":"Hu\u00e1nuco","places":[{"address":"Carret. Hu\u00e1nuco Tingo Mar\u00eda km 1.5, Urb Los Portales de Mitopampa, Amarilis","district_id":606,"id":876,"lat":"-9.910072","lng":"-76.22904","name":"Pastor","short_address":null,"venue_id":null,"services_ids":[3]}]},{"name":"Ica","places":[{"address":"Av. Panamericana Sur Km. 299","district_id":542,"id":768,"lat":"-14.083366","lng":"-75.732907","name":"Daniela ","short_address":"Av. Panamericana Sur","venue_id":null,"services_ids":[3]},{"address":"Av.Oscar R.Benavides N\u00b0711 Chincha, Ica","district_id":542,"id":769,"lat":"-13.416953","lng":"-76.137099","name":"Estrella","short_address":"Av.Oscar R.Benavides","venue_id":null,"services_ids":[3,5,7]},{"address":"Av. Panamericana Sur, N\u00b0 100 Urb. El Carmen, Ica, Peru","district_id":542,"id":905,"lat":"-13.41626695","lng":"-76.14030877","name":"Gas Peru","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Las Americas Km. 7, Pisco peru","district_id":542,"id":906,"lat":"-13.71703206","lng":"-76.20696634","name":"Las Americas","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Arenales 1234, Ica","district_id":542,"id":770,"lat":"-10.058419","lng":"-78.157728","name":"Lisseth / Virgen Santa Mar\u00eda","short_address":"Av. Arenales 1234, I","venue_id":null,"services_ids":[3]},{"address":"Av. Oscar Benavides 711, Ica ","district_id":542,"id":898,"lat":"-13.40093067","lng":"-76.12620147","name":"Montecarlo","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Panamericana Sur KM 307 CP Garganto Dist. Los Aquijes","district_id":542,"id":879,"lat":"-13.413739","lng":"-76.149834","name":"Primavera","short_address":null,"venue_id":null,"services_ids":[3,5]},{"address":"Av. Finlandia s/n, Sector Las Lunas","district_id":542,"id":771,"lat":"-14.057055","lng":"-75.724404","name":"San Roque","short_address":"Av. Finlandia s/n, S","venue_id":null,"services_ids":[3,5]},{"address":"Av. Venezuela 2600, Lima Peru","district_id":542,"id":899,"lat":"-12.05703264","lng":"-77.06496385","name":"Santa Margherita","short_address":null,"venue_id":"","services_ids":[3,4]},{"address":"Prolongaci\u00f3n Grau s/n cuadra 9, Parcona ","district_id":542,"id":772,"lat":"-12.0","lng":"-77.0","name":"Servicentro Rc","short_address":"Prolongaci\u00f3n Grau s/","venue_id":null,"services_ids":[3]},{"address":"Av. Jos\u00e9 Mat\u00edas Manzanilla 200","district_id":542,"id":773,"lat":"-14.064733","lng":"-75.733564","name":"Trive\u00f1o","short_address":"Av. Jos\u00e9 Mat\u00edas Manz","venue_id":null,"services_ids":[3,5]}]},{"name":"Jaen","places":[{"address":"Av. Pakamuros Mz S Lote 1 Urb.Bellavista, Jaen","district_id":548,"id":775,"lat":"-3.7322801","lng":"-73.2685572","name":"Pakamuros","short_address":"Av. Pakamuros Mz S L","venue_id":null,"services_ids":[3]}]},{"name":"Junin","places":[{"address":"Av Peru #552 Urb Pampa del Carmen, La Merced, Chancahamayo, Junin","district_id":583,"id":781,"lat":"-11.0546406","lng":"-75.32522639","name":"Chrismar","short_address":"Av Peru #552 Urb Pam","venue_id":"","services_ids":[3,5]},{"address":"Esquina de la Carretera Central Margen Izquierda Km.21 con la Av. 8 de Diciembre, Distrito y Provincia de Concepcion, Junin","district_id":583,"id":778,"lat":"-11.915188","lng":"-75.324642","name":"Concepci\u00f3n","short_address":"Esquina de la Carret","venue_id":null,"services_ids":[3,5]},{"address":"Av Huancayo 200, Jauja Junin","district_id":583,"id":776,"lat":"-11.775444","lng":"-75.500139","name":"Cruz de Mayo","short_address":"Av Huancayo 200, Jau","venue_id":null,"services_ids":[3,5]},{"address":"Av. Miguel Grau cdra 1 N.\u00b0 1320, Dsto. Santa Rosa de Sacco, Prov.de Yauli, Junin","district_id":583,"id":779,"lat":"-11.667871","lng":"-76.086845","name":"Marcavalle","short_address":"Av. Miguel Grau cdra","venue_id":null,"services_ids":[3]},{"address":"Av. Marisacal Castilla N. \u00b0 1810 Esq. Jr. Aguirre Morales., El Tambo, Huancayo, Junin ","district_id":583,"id":780,"lat":"-12.052011","lng":"-75.220642","name":"Santa Isabel","short_address":"Av. Marisacal Castil","venue_id":null,"services_ids":[3]},{"address":"Carretera Central 538, Sausa, Jauja, Junin","district_id":583,"id":777,"lat":"-11.178191","lng":"-75.977647","name":"Santa Teresa","short_address":"Carretera Central 53","venue_id":null,"services_ids":[3]}]},{"name":"Moquegua","places":[{"address":"Av.28 de julio 605","district_id":586,"id":774,"lat":"-17.64668","lng":"-71.344487","name":"Estaci\u00f3n Dilcoser","short_address":"Av.28 de julio 605","venue_id":null,"services_ids":[3]},{"address":"Carr.Binacional s/n Calaluna Mariscal Nieto","district_id":586,"id":782,"lat":"-17.183384","lng":"-70.90386","name":"Montalvo","short_address":"Carr.Binacional s/n ","venue_id":null,"services_ids":[3]}]},{"name":"Pasamayo","places":[{"address":"Panamericana Norte Km 66","district_id":585,"id":783,"lat":"-11.613137","lng":"-77.232854","name":"Servicentro Pasamayo","short_address":"Panamericana Norte K","venue_id":null,"services_ids":[3]}]},{"name":"Pisco","places":[{"address":"Av. Genaro Medrano S/N, Pisco","district_id":555,"id":927,"lat":"-13.73773842","lng":"-76.22558967","name":"Ayalette","short_address":null,"venue_id":"","services_ids":[]},{"address":"Panamericana Sur KM 232","district_id":555,"id":784,"lat":"-13.67381","lng":"-76.157717","name":"Pincel","short_address":"Panamericana Sur KM ","venue_id":null,"services_ids":[3]},{"address":"Av. Las Americas Km. 7, Pisco","district_id":555,"id":785,"lat":"-13.717089","lng":"-76.207081","name":"Servicentro Las Americas","short_address":"Av. Las Americas Km.","venue_id":null,"services_ids":[3]},{"address":"Av. Fermin Tanguis 220, Pisco","district_id":555,"id":786,"lat":"-13.710712","lng":"-76.199016","name":"Tizon","short_address":"Av. Fermin Tanguis 2","venue_id":null,"services_ids":[3,5]}]},{"name":"Piura","places":[{"address":"Av. San Pedro 339, Castilla, Piura, Peru","district_id":584,"id":895,"lat":"-5.20042093","lng":"-80.61960715","name":"Castilla","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. San Pedro 339, Castilla","district_id":584,"id":787,"lat":"-5.200445","lng":"-80.619645","name":"Castilla ","short_address":"Av. San Pedro 339, C","venue_id":null,"services_ids":[3]},{"address":"Mz. \u201cA\u201d lote A \u2013 1 \u2013 A \u00a0Sector Parcela \u201cJ\u201d de la Zona Industrial, Distrito, provincia y departamento de Piura. Altura Km 2 Panamericana Norte\u00a0 - Ex Peaje Sullana","district_id":584,"id":928,"lat":"-5.20330085","lng":"-80.64648855","name":"Gascop 1","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av.Grau N.\u00b01308 Distrito de Piura, Provincia de Piura, Dpto.Piura","district_id":584,"id":788,"lat":"-5.195709","lng":"-80.652969","name":"Grau","short_address":"Av.Grau N.\u00b01308 Dist","venue_id":"4ed6ba13754ae824a4704a6a","services_ids":[3,6,7]},{"address":"Panamericana Norte KM 1136 El Alto, Talara","district_id":584,"id":789,"lat":"-5.204826","lng":"-80.647502","name":"Holga Per\u00fa","short_address":"Panamericana Norte K","venue_id":null,"services_ids":[3]},{"address":"Jr Apurimac 312 Chulucana provincia Morropon, Piura","district_id":584,"id":916,"lat":"-5.19785248","lng":"-80.62875657","name":"Los Cocos","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Sanchez Cerro 1120, Piura","district_id":584,"id":790,"lat":"-5.181463","lng":"-80.651","name":"Lukas","short_address":"Av. Sanchez Cerro 11","venue_id":"4ed6b487754ae824a46f60ea","services_ids":[3,6]},{"address":"Zona Industrial Mz. 251 (Mz.235 Lote 11-12), Piura ","district_id":584,"id":791,"lat":"-4.8","lng":"-80.6333333","name":"Macarena","short_address":"Zona Industrial Mz. ","venue_id":"4ed6b873754ae824a47007fb","services_ids":[3,5]},{"address":"Av. Andres A. C\u00e1ceres/Ram\u00f3n Mujica, Piura","district_id":584,"id":792,"lat":"-5.2","lng":"-80.633333","name":"Mega","short_address":"Av. Andres A. C\u00e1cere","venue_id":"4ed6b3fa754ae824a46f4921","services_ids":[3,6]},{"address":"Mz. 248 lte. 1 A Zona Industrial, Piura ","district_id":584,"id":793,"lat":"-4.1","lng":"-77.0363325","name":"Per\u00fa","short_address":"Mz. 248 lte. 1 A Zon","venue_id":"4ed6b591754ae824a46f90eb","services_ids":[3,5,6]},{"address":"Av. Sanchez Cerro N.\u00b0825 Centro, Piura","district_id":584,"id":794,"lat":"-5.18914","lng":"-80.636523","name":"Piura","short_address":"Av. Sanchez Cerro N.","venue_id":"4ed6b8ef754ae824a4701af0","services_ids":[3,5,6,7]},{"address":"Av. Panamericana Norte Interior 1 Paita, Piura ","district_id":584,"id":922,"lat":"-4.78752141","lng":"-80.95067635","name":"STL C","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Carretera a Sullana Km. 4.38 Zona Industrial","district_id":584,"id":795,"lat":"-5.00017101","lng":"-80.69975185","name":"San Miguel","short_address":"Carretera a Sullana ","venue_id":null,"services_ids":[3]},{"address":"Av. Champagnat No. 1200 Urb.Santa Rosa Sullana, Piura","district_id":584,"id":796,"lat":"-4.90683","lng":"-80.69551","name":"Sullana","short_address":"Av. Champagnat No. 1","venue_id":"4ed6b72d754ae824a46fd44a","services_ids":[3,5,6]},{"address":"Av. Progreso N\u00b0 U interior 1 pueblo joven El Tablazo, Paita","district_id":584,"id":884,"lat":"-5.09835","lng":"-81.108606","name":"Super Grifo","short_address":null,"venue_id":null,"services_ids":[3]},{"address":"Esquina Av. B y B S/N Distrito de Pari\u00f1as , Provincia de Talara, Piura","district_id":584,"id":798,"lat":"-4.589569","lng":"-81.258756","name":"Talara","short_address":"Esquina Av. B y B S/","venue_id":"4ed6b981754ae824a4703335","services_ids":[3]}]},{"name":"Supe","places":[{"address":"Panamericana Norte Km. 180","district_id":564,"id":799,"lat":"-10.795917","lng":"-77.717801","name":"Alex","short_address":"Panamericana Norte K","venue_id":"","services_ids":[3]},{"address":"Panamericana Norte Km 185, SUPE","district_id":564,"id":800,"lat":"-10.79810909","lng":"-77.71050539","name":"Supe","short_address":"Panamericana Norte K","venue_id":"","services_ids":[3]}]},{"name":"Tacna","places":[{"address":"Av. Von Humbolt (antes V\u00eda de Evitamiento), Sub Lote 2-4,Sector Vi\u00f1ani, distrito Coronel Gregorio Albarrac\u00edn Lanchipa","district_id":595,"id":661,"lat":"-18.025517","lng":"-70.263394","name":"La Paz","short_address":"Av. Von Humbolt (ant","venue_id":"","services_ids":[3,5,3,5]},{"address":"Av. Cristo Rey con Av. Collpa nro. S/N Sub Lote A2 (antes Av. Tarapac\u00e1) Tacna","district_id":595,"id":917,"lat":"-18.03446279","lng":"-70.26328631","name":"Melsa","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av. Collpa S.N.C.P Augusto B. Leguia, Tacna","district_id":595,"id":918,"lat":"-18.01082661","lng":"-70.25832899","name":"Motorgas","short_address":null,"venue_id":"","services_ids":[3]}]},{"name":"Trujillo","places":[{"address":"Interseccion Av. Am\u00e8rica Norte No 1902 con Av. Tupac Amaru, Trujillo","district_id":566,"id":801,"lat":"-8.097515","lng":"-79.029669","name":"Am\u00e9rica Norte","short_address":"Interseccion Av. Am\u00e8","venue_id":"4ed6aa8b754ae824a46da9db","services_ids":[3,5,6]},{"address":"Av.Victor Larco N.\u00b01224 Urb.California, Trujillo","district_id":566,"id":802,"lat":"-8.12011","lng":"-79.034998","name":"California","short_address":"Av.Victor Larco N.\u00b01","venue_id":"4ed6ac31754ae824a46de902","services_ids":[3,6,7]},{"address":"Av. Victor Raul Mza 2 Lote 10 A H Puente Chao","district_id":566,"id":803,"lat":"-8.1","lng":"-79.0","name":"Chao","short_address":"Av. Victor Raul Mza ","venue_id":null,"services_ids":[3]},{"address":"Av.Manuel Vera Enriquez N.\u00b0326, Urb.Las Quintanas, Dist. Prov. Trujillo, Dpto.La Libertad","district_id":566,"id":804,"lat":"-8.103437","lng":"-79.032061","name":"Chimu","short_address":"Av.Manuel Vera Enriq","venue_id":"4ed6afa7754ae824a46e9345","services_ids":[3,6,7]},{"address":"Mz. C Lote 01 Urb. Las Flores del Golf etapa 2, Trujillo","district_id":566,"id":805,"lat":"-8.11898036","lng":"-79.00407696","name":"El Golf","short_address":"Mz. C Lote 01 Urb. L","venue_id":null,"services_ids":[3,5]},{"address":"Av. Espa\u00f1a No 2625 Esquina con Av. 28 de Julio, Trujillo","district_id":566,"id":806,"lat":"-8.114788","lng":"-79.02473","name":"Espa\u00f1a","short_address":"Av. Espa\u00f1a No 2625 E","venue_id":"4ed6a92c754ae824a46d7a39","services_ids":[3,5,6,7]},{"address":"Cruce Carretera Huanchaco y V\u00eda de Evitamiento Valdivia Baja, Hunchaco","district_id":566,"id":808,"lat":"-7.452451","lng":"-79.493208","name":"Huanchaco","short_address":"Cruce Carretera Huan","venue_id":null,"services_ids":[3]},{"address":"Av. Am\u00e9rica Sur 1411, Santo Dominguito","district_id":566,"id":809,"lat":"-8.126355","lng":"-79.028855","name":"Juan C Jumer","short_address":"Av. Am\u00e9rica Sur 1411","venue_id":null,"services_ids":[3]},{"address":"Av.Larco N.\u00b0 1132 Urb.Covirt Ovalo Larco La Libertas, Trujillo","district_id":566,"id":810,"lat":"-8.140278","lng":"-79.057405","name":"Larco","short_address":"Av.Larco N.\u00b0 1132 Ur","venue_id":"4ed69ae2d5fbccc4273cfe02","services_ids":[3,6,7]},{"address":"Av. Prolongacion Uni\u00f3n N.\u00b0 1450, Urb. Razuri 1era Etapa, Trujillo, La Libertad","district_id":566,"id":811,"lat":"-8.141534","lng":"-79.046657","name":"Lazarte","short_address":"Av. Prolongacion Uni","venue_id":"4ed6b316754ae824a46f2269","services_ids":[3,5]},{"address":"Esquina de la Avenida America Norte y Avenida Salvador Lara, Trujillo, La Libertad","district_id":566,"id":812,"lat":"-8.094443","lng":"-79.022352","name":"Los Jardines","short_address":"Esquina de la Avenid","venue_id":"4ed6b228754ae824a46efb71","services_ids":[3]},{"address":"Caretera Panamericana km. 556, Trujillo","district_id":566,"id":919,"lat":"-8.13668372","lng":"-79.05872752","name":"Moche","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Av.Nicolas de Pierola 1390 Urb.Chimu, Trujillo","district_id":566,"id":813,"lat":"-8.099758","lng":"-79.036911","name":"Mochica","short_address":"Av.Nicolas de Pierol","venue_id":"4ed6ade1754ae824a46e407f","services_ids":[3,6,7]},{"address":"Panamericana norte Km. 558, Trujillo","district_id":566,"id":912,"lat":"-8.13666779","lng":"-79.05872376","name":"Panamericana","short_address":null,"venue_id":"","services_ids":[3]},{"address":"Panamericana norte Km. 558, Trujillo","district_id":566,"id":814,"lat":"-8.139499","lng":"-79.054224","name":"Panamericana","short_address":"Panamericana norte K","venue_id":null,"services_ids":[3]},{"address":"Av. Juan Tomis N\u00b01045 Urb El Paraiso ","district_id":566,"id":893,"lat":"-6.7706799","lng":"-79.8609388","name":"Senati (Juan Tomis)","short_address":null,"venue_id":"","services_ids":[3,5]},{"address":"Av. Larco Esq. Av. Huam\u00e1n, V\u00edctor Larco Herrera","district_id":566,"id":815,"lat":"-8.133997","lng":"-79.046904","name":"Servicentro Larco","short_address":"Av. Larco Esq. Av. H","venue_id":null,"services_ids":[3]},{"address":"Av. Gonzalo Ugaz Salcedo s/n Cercado Cuadra 1","district_id":566,"id":816,"lat":"-7.403675","lng":"-79.573685","name":"Servicentro Libertad","short_address":"Av. Gonzalo Ugaz Sal","venue_id":null,"services_ids":[3]},{"address":"Prolongaci\u00f2n Uni\u00f2n 1914 , Trujillo","district_id":566,"id":817,"lat":"-8.093673","lng":"-79.008873","name":"Uni\u00f3n","short_address":"Prolongaci\u00f2n Uni\u00f2n 1","venue_id":"4ed6ad2f754ae824a46e1a6d","services_ids":[3,5]},{"address":"Av. Per\u00fa 1550, Trujillo","district_id":566,"id":722,"lat":"-8.09653","lng":"-79.011553","name":"Victoria","short_address":"Av. Per\u00fa 1550, Truji","venue_id":"","services_ids":[3,3,6]}]}];