import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoid2ViY29kZXJ6IiwiYSI6ImNrcjZ1N3oxeDB0cHoyd3FsYjk0am9kY3MifQ.lw9n5DtqV-PjMyL4k6jwQA';
class App extends React.Component {

    componentDidMount() {
  
      // Creates new map instance
      const map = new mapboxgl.Map({
        container: this.mapWrapper,
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [-122.4376, 37.7577],
        zoom: 12
      });
  
      // Creates new directions control instance
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
      });
  
      // Integrates directions control with map
      map.addControl(directions, 'top-left');
    
    var geocoder = new MapboxGeocoder({ // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: false, // Do not use the default marker style
      });
   

    // Add geolocate control to the map.
    map.addControl(
            new mapboxgl.GeolocateControl({
                    positionOptions: {
                    enableHighAccuracy: true
                           },
                        trackUserLocation: true
                }), "bottom-right"
            );
    //nav controls
    map.addControl(new mapboxgl.NavigationControl(),"bottom-right");     
    
    
    // Add the geocoder to the map
    map.addControl(geocoder,"bottom-left");
    
     }  
    render() {
      return (
        // Populates map by referencing map's container property
        <div ref={el => (this.mapWrapper = el)} className="mapWrapper" />
        
      );
    }
  }
  
  export default App;

  