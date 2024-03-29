import React from 'react';
import './App.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import  { ArcLayer,ContourLayer} from 'deck.gl';
import {COORDINATE_SYSTEM} from '@deck.gl/core';
import { Deck } from "@deck.gl/core";
import GL from '@luma.gl/constants';
import maplibregl from 'maplibre-gl';

import { ScatterplotLayer} from "@deck.gl/layers";
import { MapboxLayer } from "@deck.gl/mapbox";
import {TerrainLayer} from '@deck.gl/geo-layers';
import {PointCloudLayer} from '@deck.gl/layers';

import {GeoJsonLayer, PolygonLayer} from '@deck.gl/layers';
import {LightingEffect, AmbientLight, _SunLight as SunLight} from '@deck.gl/core';
import {scaleThreshold} from 'd3-scale';



mapboxgl.accessToken = 'pk.eyJ1Ijoid2ViY29kZXJ6IiwiYSI6ImNrcjZ1N3oxeDB0cHoyd3FsYjk0am9kY3MifQ.lw9n5DtqV-PjMyL4k6jwQA';




 // eslint-disable-line


export const COLOR_SCALE = scaleThreshold()
  .domain([-0.6, -0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2])
  .range([
    [65, 182, 196],
    [127, 205, 187],
    [199, 233, 180],
    [237, 248, 177],
    // zero
    [255, 255, 204],
    [255, 237, 160],
    [254, 217, 118],
    [254, 178, 76],
    [253, 141, 60],
    [252, 78, 42],
    [227, 26, 28],
    [189, 0, 38],
    [128, 0, 38]
  ]);


class App extends React.Component {

    componentDidMount() {
      

      // Creates new map instance
      const map = new maplibregl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/streets/style.json?key=Z2xVIwqvxK06NnhO6lTM', // stylesheet location - https://api.maptiler.com/maps/streets/style.json?key=Z2xVIwqvxK06NnhO6lTM
       center: [-122.5233, 37.6493], // starting position [lng, lat]
        zoom: 9 // starting zoom
        });
        //https://api.maptiler.com/maps/eec8273f-d9d8-4d03-883a-cb9c35cc27d8/style.json?key=Z2xVIwqvxK06NnhO6lTM
        //http://64.227.67.107:8080/styles/basic-preview/style.json for self hosted
        //http://64.227.67.107/styles/osm-bright/style.json
        //http://mapserver.webi.ai/styles/osm-bright/style.json
  
      // Creates new directions control instance
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
      });
  
      // Integrates directions control with map
    
    var geocoder = new MapboxGeocoder({ // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl, // Set the mapbox-gl instance
        marker: false, // Do not use the default marker style
      });

    const ambientLight = new AmbientLight({
        color: [255, 255, 255],
        intensity: 1.0
      });
      
    const dirLight = new SunLight({
        timestamp: Date.UTC(2019, 7, 1, 22),
        color: [255, 255, 255],
        intensity: 1.0,
        _shadow: true
      });


   
      const lightingEffect = new LightingEffect({ambientLight, dirLight});
        lightingEffect.shadowColor = [0, 0, 0, 0.5];

        
    
    



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
    //map.addControl(new MapboxTraffic(),"top-right"); //requires mapbox-gl map
    map.addControl(directions, 'top-left');


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

    const landCover = [[[-123.0, 49.196], [-123.0, 49.324], [-123.306, 49.324], [-123.306, 49.196]]];

    const polygonLayer = new PolygonLayer({
      id: 'ground',
      data: landCover,
      stroked: false,
      getPolygon: f => f,
      getFillColor: [0, 0, 0, 0]
    });

    const geoJSONLayer = new GeoJsonLayer({
      id: 'geojson',
      data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json',
      opacity: 0.8,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: true,
      getElevation: f => Math.sqrt(f.properties.valuePerSqm) * 10,
      getFillColor: f => COLOR_SCALE(f.properties.growth),
      getLineColor: [255, 255, 255],
      pickable: true
    }); 


      
      //arc layer


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

      // contour layer
      const contourLayer = new ContourLayer({
        id: 'contourLayer',
        data:
          'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/screen-grid/ca-transit-stops.json',
        getPosition: d => d,
        contours: [
          {threshold: 1, color: [255, 0, 0], strokeWidth: 4},
          {threshold: 5, color: [0, 255, 0], strokeWidth: 2},
          {threshold: [6, 10], color: [0, 0, 255, 128]}
        ]});

        //point cloud layer

      const pointCloudLayer = new PointCloudLayer({
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        coordinateOrigin: [-122.4004935, 37.7900486, 100],  // anchor point in longitude/latitude/altitude
        data: [
          {position: [33.22, 109.87, 1.455]}, // meter offsets from the coordinate origin

        ],

      })  

    

      //deck integration
    const deck = new Deck({
        gl: map.painter.context.gl,
        layers: [geoJSONLayer],//scatterLayer, terrainLayer, arclayer, contourLayer, pointCloudLayer ,geoJSONLayer, polygonLayer,
        effects: [lightingEffect],
        initialViewState: {
          latitude: 37.6493,
          longitude: -122.5233,
          zoom: 15
        },
        controller: true
      });
    // Add the geocoder to the map
   // map.addControl(geocoder, "bottom-left");


    //add deck layer
    const deckLayers= new MapboxLayer({ id: "deck-gl-layer", deck });
    map.on("load", () => {
        map.addLayer(deckLayers);




  //loads 3d building layer on map loading
      //const firstLabelLayerId = map.getStyle().layers.find(layer => layer.type === 'symbol').id;
  
      
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
            'fill-extrusion-opacity': .2
        }
      }); //firstLabelLayerId before parentheses close to add buildings back in 

      });




    
     } 
     


     
    render() {
      return (
        
        // Populates map by referencing map's container property
        <div ref={el => (this.mapWrapper = el)} className="mapWrapper" />
        
      );
    }
  }
  
  export default App;

  