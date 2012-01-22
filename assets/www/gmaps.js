GMaps = function(options){
  var self = this;
  var context_menu_style = 'position:absolute;display:none;min-width:100px;background:white;\
  list-style:none;padding:8px;box-shadow:2px 2px 6px #ccc';
  window.context_menu = {};

  this.geocoder = new google.maps.Geocoder();
  this.div = $(options.div)[0];
  this.overlays = [];
  this.markers = [];
  this.polylines = [];
  this.routes = [];
  this.polygons = [];
  this.infoWindow = null;
  this.overlay_div = null;
  this.zoom = options.zoom || 15;

  //'Hybrid', 'Roadmap', 'Satellite' or 'Terrain'
  if(options.mapType)
    var mapType = google.maps.MapTypeId[options.mapType.toUpperCase()]
  else
    var mapType = google.maps.MapTypeId.ROADMAP;

  var map_center = new google.maps.LatLng(options.lat, options.lng);

  delete options['lat'];
  delete options['lng'];
  delete options['mapType'];

  var map_base_options = {
    zoom: this.zoom,
    center: map_center,
    mapTypeId: mapType
  };

  var map_options = $.extend(map_base_options, options);

  this.map = new google.maps.Map(this.div, map_options);

  // BEGIN: @otakurzo
    // Determine if we are on a touch-based device and if is on iOS
    var userAgent = navigator.userAgent.toLowerCase();
    var isiOS = (userAgent.match(/(iphone|ipod|ipad)/) != null);
    var hasTouch = (userAgent.match(/(iphone|ipod|ipad|android)/) != null);
    var clickEvent = (hasTouch ? 'touchend' : 'click');
  // END: @otakurzo


  // Context menus

  var buildContextMenuHTML = function(control, e){
    var html = '';
    for(i in window.context_menu[control]){
      option = window.context_menu[control][i];
      html += '<li><a id="'+control+'_'+i+'" href="#">'+option.title+'</a></li>';
    }
    $('#gmaps_context_menu').html(html);
    $('#gmaps_context_menu li a').die();
    $('#gmaps_context_menu li a').live(clickEvent, function(ev){
      ev.preventDefault();
      window.context_menu[control][$(this).attr('id').replace(control+'_', '')].action.call(self, e);
      self.hideContextMenu();
    });

    var left = $(self.div).offset().left + e.pixel.x - 15;
    var top = $(self.div).offset().top + e.pixel.y - 15;
    $('#gmaps_context_menu').css({
      left: left,
      top: top
    }).fadeIn(200);
  };

  var buildContextMenu = function(control, e){
    if(control=='marker'){
      e.pixel = {};
      overlay = new google.maps.OverlayView();
      overlay.setMap(self.map);
      overlay.draw = function() {
        projection = overlay.getProjection();
        position = e.getPosition();
        e.pixel = projection.fromLatLngToContainerPixel(position);

        buildContextMenuHTML(control, e);
      };
    }
    else{
      buildContextMenuHTML(control, e);
    }
  };

  this.setContextMenu = function(options){
    window.context_menu[options.control] = {};
    var html = '<ul id="gmaps_context_menu" style="'+context_menu_style+'"></ul>';
    for(i in options.options){
      option = options.options[i];
      window.context_menu[options.control][option.name] = {title: option.title, action: option.action};
    }
    $('body').append(html);
    $('#gmaps_context_menu').live('mouseleave', function(){
      $(this).delay(100).fadeOut(200);
    });
  };

  this.hideContextMenu = function(){
    $('#gmaps_context_menu').fadeOut(200);
  };

  //Events
  if(options.bounds_changed){
    google.maps.event.addListener(this.map, 'bounds_changed', function(e){
      options.bounds_changed(e);
      self.hideContextMenu();
    });
  }
  if(options.center_changed){
    google.maps.event.addListener(this.map, 'center_changed', function(e){
      options.center_changed(e);
      self.hideContextMenu();
    });
  }
  if(options.click){
    google.maps.event.addListener(this.map, 'click', function(e){
      options.click(e);
      self.hideContextMenu();
    });
  }
  if(options.dblclick){
    google.maps.event.addListener(this.map, 'dblclick', function(e){
      options.dblclick(e);
      self.hideContextMenu();
    });
  }
  if(options.drag){
    google.maps.event.addListener(this.map, 'drag', function(e){
      options.drag(e);
      self.hideContextMenu();
    });
  }
  if(options.dragend){
    google.maps.event.addListener(this.map, 'dragend', function(e){
      options.dragend(e);
      self.hideContextMenu();
    });
  }
  if(options.dragstart){
    google.maps.event.addListener(this.map, 'dragstart', function(e){
      options.dragstart(e);
      self.hideContextMenu();
    });
  }
  if(options.idle){
    google.maps.event.addListener(this.map, 'idle', function(e){
      options.idle(e);
      self.hideContextMenu();
    });
  }
  if(options.maptypeid_changed){
    google.maps.event.addListener(this.map, 'maptypeid_changed', function(e){
      options.maptypeid_changed(e);
      self.hideContextMenu();
    });
  }
  if(options.mousemove){
    google.maps.event.addListener(this.map, 'mousemove', function(e){
      options.mousemove(e);
    });
  }
  if(options.mouseout){
    google.maps.event.addListener(this.map, 'mouseout', function(e){
      options.mouseout(e);
    });
  }
  if(options.mouseover){
    google.maps.event.addListener(this.map, 'mouseover', function(e){
      options.mouseover(e);
    });
  }
  if(options.projection_changed){
    google.maps.event.addListener(this.map, 'projection_changed', function(e){
      options.projection_changed(e);
      self.hideContextMenu();
    });
  }
  if(options.resize){
    google.maps.event.addListener(this.map, 'resize', function(e){
      options.resize(e);
      self.hideContextMenu();
    });
  }
  if(options.rightclick){
    google.maps.event.addListener(this.map, 'rightclick', function(e){
      options.rightclick(e);
      
      buildContextMenu('map', e);
    });
  }
  if(options.tilesloaded){
    google.maps.event.addListener(this.map, 'tilesloaded', function(e){
      options.tilesloaded(e);
      self.hideContextMenu();
    });
  }
  if(options.zoom_changed){
    google.maps.event.addListener(this.map, 'zoom_changed', function(e){
      options.zoom_changed(e);
      self.hideContextMenu();
    });
  }
  
  this.fixResize = function(){
    google.maps.event.trigger(this.map, 'resize');
  };


  this.fitBounds = function(listLatLng){
    //new google.maps.LatLng(lat, lng);

    var total = listLatLng.length;
    var bounds = new google.maps.LatLngBounds();

    for (var i=0; i < total; ++i) {
      bounds.extend (listLatLng[i]);
    }
    this.map.fitBounds (bounds);

  };




  // Geolocation (Modern browsers only)

  this.geolocate = function(options){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
        options.success(position);
        if(options.always)
          options.always();
      }, function(error){
        options.error(error);
        if(options.always)
          options.always();
      }, options.options);
    }
    else{
      options.not_supported();
      if(options.always)
        options.always();
    }
  };

  // Map methods

  this.setCenter = function(lat, lng, callback){
    this.map.panTo(new google.maps.LatLng(lat, lng));
    if(callback)
      callback();
  };
  this.getCenter = function(){
    return this.map.getCenter();
  };
  this.getDiv = function(){
    return this.div;
  };
  this.setZoom = function(value){
    this.map.setZoom(value);
  };
  this.zoomIn = function(value){
    this.map.setZoom(this.map.getZoom()+value);
  };
  this.zoomOut = function(value){
    this.map.setZoom(this.map.getZoom()-value);
  };

  // Markers

  this.createMarker = function(options){
    if(options.lat && options.lng){
      var self = this;
      var details = options.details;
      var fences = options.fences;
      var outside = options.outside;
      var base_options = {
        position: new google.maps.LatLng(options.lat, options.lng),
        map: null
      };
      delete options.lat;
      delete options.lng;
      delete options.fences;
      delete options.outside;

      var marker_options = $.extend(base_options, options);
      
      var marker = new google.maps.Marker(marker_options);

      marker['fences'] = fences;

      if(options.infoWindow)
        marker.infoWindow = new google.maps.InfoWindow(options.infoWindow);

      if(options.click){
        google.maps.event.addListener(marker, 'click', function(){
          this['details'] = details;
          
          options.click.apply(this, [this]);

          if(marker.infoWindow){
            self.hideInfoWindows();
            marker.infoWindow.open(self.map, marker);
          }
        });
      }
      if(options.dragend){
        google.maps.event.addListener(marker, 'dragend', function(){
          options.dragend(this);
          
          if(marker.fences)
            self.checkMarkerGeofence(marker, function(m, f){
              outside(m, f);
            });
        });
      }
      if(options.mouseout){
        google.maps.event.addListener(marker, 'mouseout', function(){
          options.mouseout(this);
        });
      }
      if(options.mouseover){
        google.maps.event.addListener(marker, 'mouseover', function(){
          options.mouseover(this);
        });
      }
      if(options.mouseover){
        google.maps.event.addListener(marker, 'mouseover', function(){
          options.mouseover(this);
        });
      }
      if(options.position_changed){
        google.maps.event.addListener(marker, 'position_changed', function(){
          options.position_changed(this);
        });
      }

      return marker;
    }
    else{
      throw 'No latitude or longitude defined';

      return null;
    }
  };

  this.addMarker = function(options){
    if(options.lat && options.lng){
      marker = this.createMarker(options);

      marker.setMap(this.map);

      this.markers.push(marker);

      return marker;
    }
    else{
      throw 'No latitude or longitude defined';

      return null;
    }
  };
  this.addMarkers = function(array){
    for(marker in array)
      this.addMarker(marker);
    
    return this.markers;
  };
  this.hideInfoWindows = function(){
    for(index in this.markers){
      marker = this.markers[index];
      if(marker.infoWindow)
        marker.infoWindow.close();
    }
  };
  this.removeMarker = function(marker){
    marker.setMap(null);
  };
  this.removeMarkers = function(){
    for(index in this.markers){
      this.removeMarker( this.markers[index] );
    }
    this.markers = [];
  };



//
this.removePolylines = function(){
  for(index in this.polylines){
    this.removePolyline( this.polylines[index] );
  }
  this.polylines = [];
};

this.removePolyline = function(polyline){
  polyline.setMap(null);
};


  // Overlays

  this.drawOverlay = function(options){
    var overlay = new google.maps.OverlayView();
    overlay.setMap(self.map);
    overlay.onAdd = function(){
      var div = document.createElement('div');
      div.style.borderStyle = "none";
      div.style.borderWidth = "0px";
      div.style.position = "absolute";
      div.innerHTML = options.content;

      self.overlay_div = div;

      var panes = this.getPanes();
      if(!options.layer)
        options.layer = 'overlayLayer';
      var overlayLayer = panes[options.layer];
      
      overlayLayer.appendChild(div);
    };
    overlay.draw = function() {
      projection = this.getProjection();
      pixel = projection.fromLatLngToDivPixel(new google.maps.LatLng(options.lat, options.lng));

      options.horizontalOffset = options.horizontalOffset || 0;
      options.verticalOffset = options.verticalOffset || 0;

      div = self.overlay_div;
      content = div.children;
      
      //-- @otakurzo
        $content = $(content);

        $btnLeft = $content.find('.overlay-btn-left');
        if( $btnLeft.length > 0){
          $btnLeft.css({opacity:0.5,cursor:'auto'});

          if( options.clickButtonLeft ) {
            $btnLeft.bind(clickEvent, function(e){
              e.preventDefault();
              e.stopPropagation();
              
              options.clickButtonLeft(e);
            });

            $btnLeft.css({opacity:1.0,cursor:'pointer'});
          }
        }

        $btnRight = $content.find('.overlay-btn-right');
        if( $btnRight.length > 0 ){
          $btnRight.css({opacity:0.5,cursor:'auto'});

          if( options.clickButtonRight ) {
            $btnRight.bind(clickEvent, function(e){
              e.preventDefault();
              e.stopPropagation();
              
              options.clickButtonRight(e);
            });

            $btnRight.css({opacity:1.0,cursor:'pointer'});
          }
        }

        
        var excerptMax = 235;
        
        $title = $content.find('.overlay-title');
        if($title.length > 0) $title.excerpt(excerptMax);

        $subtitle = $content.find('.overlay-subtitle');
        if($subtitle.length > 0) $subtitle.excerpt(excerptMax);

        textContainerWidth = $content.find('.overlar-text-container').width();
        $(content).width( textContainerWidth + (32 * ($btnRight.length > 0 ? 2 : 1)) );

      
        // Para la animación de entrada
          //options.verticalOffset -= 20;
          div.style.opacity = 0.0;
        //--

      //-- @otakurzo


      switch(options.verticalAlign){
        case 'top':
          div.style.top = (pixel.y - $(content).height() + options.verticalOffset) +'px';
        break;
        default:
        case 'middle':
          div.style.top = (pixel.y - ($(content).height()/2) + options.verticalOffset) + 'px';
        break;
        case 'bottom':
          div.style.top = (pixel.y + options.verticalOffset) + 'px';
        break;
      }

      switch(options.horizontalAlign){
        case 'left':
          div.style.left = (pixel.x - $(content).width() + options.horizontalOffset) + 'px';
        break;
        default:
        case 'center':
          div.style.left = (pixel.x - ($(content).width()/2) + options.horizontalOffset) + 'px';
        break;
        case 'right':
          div.style.left = (pixel.x + options.horizontalOffset) + 'px';
        break;
      }

      // @otakurzo
      // Animación de entrada
      $(div).animate({
        opacity: 1.0 //,
        //top: '+=20',
      },'fast');
      // @otakurzo

    };
    overlay.onRemove = function(){
      self.overlay_div.parentNode.removeChild(self.overlay_div);
      self.overlay_div = null;
    };
    self.overlays.push(overlay);
    return overlay;
  };

  this.removeOverlay = function(overlay){
    overlay.setMap(null);
  };

  this.removeOverlays = function(){
    for(i in self.overlays){
      item = self.overlays[i];
      item.setMap(null);
    }
    self.overlays = []
  };

  this.drawPolyline = function(options){
    var path = [];
    if(options.path.length){
      if(options.path[0][0]==undefined){
        path = options.path;
      }
      else{
        points = options.path;
        for(i in points){
          latlng = points[i];
          path.push(new google.maps.LatLng(latlng[0], latlng[1]));
        }
      }
    }

    var polyline = new google.maps.Polyline({
      map: this.map,
      path: path,
      strokeColor: options.strokeColor,
      strokeOpacity: options.strokeOpacity,
      strokeWeight: options.strokeWeight
    });

    this.polylines.push(polyline);

    return polyline;
  };

  this.drawCircle = function(options){
    options = $.extend({
      map: this.map,
      center: new google.maps.LatLng(options.lat, options.lng)
    }, options);

    delete options['lat'];
    delete options['lng'];
    var polygon = new google.maps.Circle(options);

    google.maps.event.addListener(polygon, 'click', function(e){
      if(options.click)
        options.click(e);
    });
    google.maps.event.addListener(polygon, 'dblclick', function(e){
      if(options.dblclick)
        options.dblclick(e);
    });
    google.maps.event.addListener(polygon, 'mousedown', function(e){
      if(options.mousedown)
        options.mousedown(e);
    });
    google.maps.event.addListener(polygon, 'mousemove', function(e){
      if(options.mousemove)
        options.mousemove(e);
    });
    google.maps.event.addListener(polygon, 'mouseout', function(e){
      if(options.mouseout)
        options.mouseout(e);
    });
    google.maps.event.addListener(polygon, 'mouseover', function(e){
      if(options.mouseover)
        options.mouseover(e);
    });
    google.maps.event.addListener(polygon, 'mouseup', function(e){
      if(options.mouseup)
        options.mouseup(e);
    });
    google.maps.event.addListener(polygon, 'rightclick', function(e){
      if(options.rightclick)
        options.rightclick(e);
    });

    return polygon;
  };

  this.drawPolygon = function(options){
    options = $.extend({map: this.map}, options);
    var polygon = new google.maps.Polygon(options);

    google.maps.event.addListener(polygon, 'click', function(e){
      if(options.click)
        options.click(e);
    });
    google.maps.event.addListener(polygon, 'dblclick', function(e){
      if(options.dblclick)
        options.dblclick(e);
    });
    google.maps.event.addListener(polygon, 'mousedown', function(e){
      if(options.mousedown)
        options.mousedown(e);
    });
    google.maps.event.addListener(polygon, 'mousemove', function(e){
      if(options.mousemove)
        options.mousemove(e);
    });
    google.maps.event.addListener(polygon, 'mouseout', function(e){
      if(options.mouseout)
        options.mouseout(e);
    });
    google.maps.event.addListener(polygon, 'mouseover', function(e){
      if(options.mouseover)
        options.mouseover(e);
    });
    google.maps.event.addListener(polygon, 'mouseup', function(e){
      if(options.mouseup)
        options.mouseup(e);
    });
    google.maps.event.addListener(polygon, 'rightclick', function(e){
      if(options.rightclick)
        options.rightclick(e);
    });

    this.polygons.push(polygon);

    return polygon;
  };

  // Services

  this.getRoutes = function(options){
    switch(options.travelMode){
      case 'bicycling':
        travelMode = google.maps.TravelMode.BICYCLING;
      break;
      case 'driving':
        travelMode = google.maps.TravelMode.DRIVING;
      break;
      case 'walking':
      default:
        travelMode = google.maps.TravelMode.WALKING;
      break;
    }
    var self = this;
    var service = new google.maps.DirectionsService();
    service.route({
      origin: new google.maps.LatLng(options.origin[0], options.origin[1]),
      destination: new google.maps.LatLng(options.destination[0], options.destination[1]),
      travelMode: travelMode
    }, function(result, status){
      if(status == google.maps.DirectionsStatus.OK){
        for(i in result.routes){
          route = result.routes[i];
          self.routes.push(route);
        }
      }
      if(options.callback)
        options.callback(self.routes);
    });
  };

  this.drawRoute = function(options){
    var self = this;
    this.getRoutes({
      origin: options.origin,
      destination: options.destination,
      travelMode: options.travelMode,
      callback: function(e){
        if(e.length>0){
          path = e[e.length-1].overview_path;
          self.drawPolyline({
            path: path,
            strokeColor: options.strokeColor,
            strokeOpacity: options.strokeOpacity,
            strokeWeight: options.strokeWeight
          });
          if(options.callback)
            options.callback(e[e.length-1]);
        }
      }
    });
  };

  this.travelRoute = function(options){
    if(options.origin && options.destination){
      this.getRoutes({
        origin: options.origin,
        destination: options.destination,
        travelMode: options.travelMode,
        callback: function(e){
          if(e.length>0 && options.step){
            route = e[e.length-1];
            if(route.legs.length>0)
              for(i in route.legs[0].steps){
                step = route.legs[0].steps[i];
                step['step_number'] = i;
                options.step(step);
              }
          }
        }
      });
    }
    else if(options.route){
      if(options.route.legs.length>0){
        for(i in options.route.legs[0].steps){
          step = options.route.legs[0].steps[i];
          step['step_number'] = i;
          options.step(step);
        }
      }
    }
  };

  this.drawSteppedRoute = function(options){
    if(options.origin && options.destination){
      this.getRoutes({
        origin: options.origin,
        destination: options.destination,
        travelMode: options.travelMode,
        callback: function(e){
          if(e.length>0 && options.step){
            route = e[e.length-1];
            if(route.legs.length>0)
              for(i in route.legs[0].steps){
                step = route.legs[0].steps[i];
                step['step_number'] = i;
                self.drawPolyline({
                  path: step.path,
                  strokeColor: options.strokeColor,
                  strokeOpacity: options.strokeOpacity,
                  strokeWeight: options.strokeWeight
                });
                options.step(step);
              }
          }
        }
      });
    }
    else if(options.route){
      if(options.route.legs.length>0){
        for(i in options.route.legs[0].steps){
          step = options.route.legs[0].steps[i];
          step['step_number'] = i;
          self.drawPolyline({
            path: step.path,
            strokeColor: options.strokeColor,
            strokeOpacity: options.strokeOpacity,
            strokeWeight: options.strokeWeight
          });
          options.step(step);
        }
      }
    }
  };

  // Geocoding

  this.geocode = function(options){
    var callback = options.callback;
    if(options.lat && options.lng)
      options['latLng'] = new google.maps.LatLng(options.lat, options.lng);
    
    delete options.lat;
    delete options.lng;
    delete options.callback;
    this.geocoder.geocode(options, function(results, status){
      callback(results, status);
    });
  };

  // Geofence

  this.checkGeofence = function(lat, lng, fence){
    return fence.containsLatLng(new google.maps.LatLng(lat, lng));
  };

  this.checkMarkerGeofence = function(marker, outside_callback){
    if(marker.fences){
      for(i in marker.fences){
        fence = marker.fences[i];
        if(!self.checkGeofence(marker.getPosition().lat(), marker.getPosition().lng(), fence))
          outside_callback(marker, fence);
      }
    }
  };
};

GMaps.Route = function(options){
  this.map = options.map;
  this.route = options.route;
  this.path = this.route.overview_path;
  this.steps = this.path.length;

  this.map.drawPolyline({
    path: new google.maps.MVCArray(),
    strokeColor: options.strokeColor,
    strokeOpacity: options.strokeOpacity,
    strokeWeight: options.strokeWeight
  });

  this.polyline = this.map.polylines[this.map.polylines.length - 1].getPath();
  this.polyline.push(this.route.overview_path[0]);
  this.path_length = this.polyline.getLength();

  this.back = function(){
    if(this.path_length > 0){
      this.polyline.pop();
      this.path_length--;
    }
  };
  this.forward = function(){
    if(this.path_length < this.steps){
      this.polyline.push(this.path[this.path_length]);
      this.path_length++;
    }
  };
};



//==========================
// Polygon containsLatLng
// https://github.com/tparkin/Google-Maps-Point-in-Polygon

// Poygon getBounds extension - google-maps-extensions
// http://code.google.com/p/google-maps-extensions/source/browse/google.maps.Polygon.getBounds.js
if (!google.maps.Polygon.prototype.getBounds) {
  google.maps.Polygon.prototype.getBounds = function(latLng) {
    var bounds = new google.maps.LatLngBounds();
    var paths = this.getPaths();
    var path;
    
    for (var p = 0; p < paths.getLength(); p++) {
      path = paths.getAt(p);
      for (var i = 0; i < path.getLength(); i++) {
        bounds.extend(path.getAt(i));
      }
    }

    return bounds;
  }
};

// Polygon containsLatLng - method to determine if a latLng is within a polygon
google.maps.Polygon.prototype.containsLatLng = function(latLng) {
  // Exclude points outside of bounds as there is no way they are in the poly
  var bounds = this.getBounds();

  if(bounds != null && !bounds.contains(latLng)) {
    return false;
  }

  // Raycast point in polygon method
  var inPoly = false;

  var numPaths = this.getPaths().getLength();
  for(var p = 0; p < numPaths; p++) {
    var path = this.getPaths().getAt(p);
    var numPoints = path.getLength();
    var j = numPoints-1;

    for(var i=0; i < numPoints; i++) { 
      var vertex1 = path.getAt(i);
      var vertex2 = path.getAt(j);

      if (vertex1.lng() < latLng.lng() && vertex2.lng() >= latLng.lng() || vertex2.lng() < latLng.lng() && vertex1.lng() >= latLng.lng())  {
        if (vertex1.lat() + (latLng.lng() - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < latLng.lat()) {
          inPoly = !inPoly;
        }
      }

      j = i;
    }
  }

  return inPoly;
};

google.maps.LatLngBounds.prototype.containsLatLng = function(latLng){
  return this.contains(latLng);
};

google.maps.Marker.prototype.setFences = function(fences){
  this.fences = fences;
};

google.maps.Marker.prototype.addFence = function(fence){
  this.fences.push(fence);
};