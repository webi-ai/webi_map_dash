import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import  { ArcLayer} from 'deck.gl';

import { Deck } from "@deck.gl/core";
import GL from '@luma.gl/constants';
import { ScatterplotLayer, } from "@deck.gl/layers";
import { MapboxLayer } from "@deck.gl/mapbox";
import {TerrainLayer} from '@deck.gl/geo-layers';

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
                }), "top-right"
            );
    //nav controls
    map.addControl(new mapboxgl.NavigationControl(),"top-right");     
    map.addControl(new MapboxTraffic(),"top-right");


    //deck layers

    //scatterplot
    const scatterLayer = new ScatterplotLayer({
        id: "scatter-plot",
        data:
          "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scatterplot/manhattan.json", //will take json geo json etc
        radiusScale: 40,
        radiusMinPixels: 0.5,
        getPosition: d => [d[0], d[1]],
        getFillColor: [255, 0, 0, 100],
      parameters: {
          depthMask: true,
          depthTest: true,
          blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA, GL.ONE, GL.ONE_MINUS_SRC_ALPHA],
          blendEquation: GL.FUNC_ADD
        }
      });

    //terrain

    const terrainLayer = new TerrainLayer({
        elevationDecoder: {
          rScaler: 2,
          gScaler: 0,
          bScaler: 0,
          offset: 0
        },
        // Digital elevation model from https://www.usgs.gov/
        elevationData: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/terrain.png',
        texture: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/terrain-mask.png',
        bounds: [-122.5233, 37.6493, -122.3566, 37.8159],
      });

    const arclayer =  new ArcLayer({
        id: 'deckgl-arc',
        type: ArcLayer,
        data: [
          {source: [-122.3998664, 37.7883697], target: [-122.400068, 37.7900503]}
        ],
        getSourcePosition: d => d.source,
        getTargetPosition: d => d.target,
        getSourceColor: [255, 208, 0],
        getTargetColor: [0, 128, 255],
        getWidth: 8
      });


      //deck integration
    const deck = new Deck({
        gl: map.painter.context.gl,
        layers: [arclayer],
        initialViewState: {
          latitude: 37.6493,
          longitude: -122.5233,
          zoom: 15
        },
        controller: true
      });

    //add deck layer
    const deckLayers= new MapboxLayer({ id: "deck-gl-layer", deck });
    map.on("load", () => {
        //map.addLayer(deckLayers);




      const firstLabelLayerId = map.getStyle().layers.find(layer => layer.type === 'symbol').id;
    //loads 3d building layer on map loading
      map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': .6
        }
      }, firstLabelLayerId);







      });



    // Add the geocoder to the map
    //map.addControl(geocoder, "bottom-left");
    
     } 
     
    render() {
      return (
        // Populates map by referencing map's container property
        <div ref={el => (this.mapWrapper = el)} className="mapWrapper" />
        
      );
    }
  }
  
  export default App;

  