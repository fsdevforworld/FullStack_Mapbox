import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "./Map.css";

import { getRequest } from "./services";
import { GET_BOUND, GET_CODNT } from "./constant";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-89);
  const [lat, setLat] = useState(43);
  const [zoom, setZoom] = useState(12);
  const [map, setMap] = useState(null);
  const [region, setRegion] = useState([
    [-89.3, 43.3],
    [-89.25, 43.35],
  ]);
  const [isready, setIsready] = useState(false);
  // Initialize map when component mounts

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    //Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });
    map.on("load", () => {
      setIsready(true);
    });
    map.fitBounds(region);
    // disable map zoom when using scroll
    map.scrollZoom.disable();
    setMap(map);
    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const testMapInit = () => {
    if (map.getLayer("layerID_circle")) {
      map.removeLayer("layerID_circle");
    }
    if (map.getLayer("layerID_symbol")) {
      map.removeLayer("layerID_symbol");
    }
    if (map.getSource("allPoints")) {
      map.removeSource("allPoints");
    }
  };
  const addPosMap = (posArr) => {
    map.addSource("allPoints", {
      type: "geojson",
      data: posArr,
    });
    map.addLayer({
      id: "layerID_circle",
      type: "circle",
      source: "allPoints",
      paint: {
        "circle-radius": 3,
        "circle-color": "red",
      },
    });
    map.addLayer({
      id: "layerID_symbol",
      type: "symbol",
      source: "allPoints",
      layout: {
        "text-field": ["get", "description"],
        "text-variable-anchor": ["top", "bottom", "left", "right"],
        "text-radial-offset": 0.5,
        "text-justify": "auto",
      },
    });
  };
  const getRandomReg = async () => {
    getRequest(GET_BOUND)
      .then(({ data }) => {
        map.setCenter(data.center);
        map.fitBounds(data.bound);
        setRegion(data.bound);
      })
      .catch((err) => {
        alert("Faild API");
      });
  };
  const getRandomPos = async () => {
    const params = {
      longitude1: region[0][0],
      latitude1: region[0][1],
      longitude2: region[1][0],
      latitude2: region[1][1],
    };
    getRequest(GET_CODNT, params)
      .then(({ data }) => {
        const allPoints = {
          type: "FeatureCollection",
          features: data.result.map((point) => ({
            type: "Feature",
            properties: {
              description: `(x:${point[0]}, y:${point[1]})`,
            },
            geometry: {
              type: "Point",
              coordinates: point,
            },
          })),
        };
        testMapInit();
        addPosMap(allPoints);
      })
      .catch((err) => {
        alert("Faild API");
      });
  };
  return (
    <div>
      <div className="map-container" ref={mapContainerRef}>
        <div className="sidebarStyle">
          <div>
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          </div>
        </div>
        <div className="btnGroup">
          <button id="btn-reg" onClick={() => getRandomReg()} disabled={!isready}>
            Get Random region
          </button>
          <button id="btn-cor" onClick={() => getRandomPos()} disabled={!isready}>
            Get Random coordinates
          </button>
        </div>
      </div>
    </div>
  );
};

export default Map;
