
import {StaticMap, MapContext, NavigationControl,GeolocateControl} from 'react-map-gl';
import DeckGL, {GeoJsonLayer, ArcLayer} from 'deck.gl';
import React, {useState,useRef, useCallback} from 'react';
import Geocoder from 'react-map-gl-geocoder';
import MapGL from "react-map-gl";
import Directions from './directions'



// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoid2ViY29kZXJ6IiwiYSI6ImNrcjZ1N3oxeDB0cHoyd3FsYjk0am9kY3MifQ.lw9n5DtqV-PjMyL4k6jwQA';



const NAV_CONTROL_STYLE = {
  position: 'fixed',
  bottom: 30,
  right :10
};


function GeoLocate() {
  const geolocateControlStyle= {
    position: 'fixed',
    right: 10,
    bottom: 118
  };
  const {map} = React.useContext(MapContext)
  return (
    
    <GeolocateControl
      style={geolocateControlStyle}
      positionOptions={{enableHighAccuracy: true}}
      trackUserLocation={true}
      auto = {false}
    />
  );
}



function Map() {
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      });
    },
    [handleViewportChange]
  );

  return (
    <div style={{ height: "100vh" }}>
      <MapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={handleViewportChange}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      > 
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          position = "top-left"
        />
      <NavigationControl style={NAV_CONTROL_STYLE} />
     <GeoLocate/>
     <Directions mapRef={mapRef} mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} overflow-x = "scroll"/>
      </MapGL>
    </div>
  );
};







export default Map




