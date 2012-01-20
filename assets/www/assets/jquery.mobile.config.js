$(document).bind('mobileinit',function(){
	
	$.extend($.mobile, {
		metaViewportContent: "width=device-width, height=device-height, minimum-scale=1, maximum-scale=1",
		
		// solo si no fnucionan bien las transiciones
		defaultPageTransition: 'none',

		loadingMessage: 'Cargando...',
		pageLoadErrorMessage: 'No se pudo cargar la página, por favor vuelva a intentarlo.',

		// http://jquerymobile.com/test/docs/pages/touchoverflow.html
		touchOverflowEnabled: false, //default: false

		// optimization for PhoneGap
		allowCrossDomainPages: true //,
		//pushStateEnabled: false
	});

	$.mobile.page.prototype.options.domCache = true;

	// http://jquerymobile.com/test/docs/toolbars/bars-fixed.html
	$.mobile.fixedToolbars.setTouchToggleEnabled(false);
	$.mobile.fixedToolbars.show(true);
	// --
});