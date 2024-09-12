import React from "react";
import { MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Container } from "react-bootstrap";
import styles from "./MapComponent.module.css";
import { useMapContext } from "./MapContext";
import * as d3 from "d3";

interface MapComponentProps {
  center: [number, number];
  zoom: number;
}

function setMarkerColorScale() {
  const colors = [
    "blue",
    "teal",
    "green",
    "chartreuse",
    "yellow",
    "orange",
    "red",
  ];

  const scale = d3
    .scaleLinear<string>()
    .domain([0, 1 / 6, (1 / 6) * 2, (1 / 6) * 3, (1 / 6) * 4, (1 / 6) * 5, 1])
    .range(colors);

  return scale;
}

function setPolylineColorScale() {
  const colors = ["green", "red"];
  const scale = d3.scaleLinear<string>().domain([0, 1]).range(colors);
  return scale;
}

function setColor(value: number, type: string) {
  if (type === "marker") {
    const markerScale = setMarkerColorScale();
    if (value <= 1) {
      return markerScale(value);
    } else {
      return "darkred";
    }
  } else if (type === "polyline") {
    const polylineScale = setPolylineColorScale();
    if (value <= 1) {
      return polylineScale(value);
    } else {
      return "red";
    }
  } else {
    return "grey";
  }
}

export function createColorLegend() {
  const colorScale = setMarkerColorScale();
  const colorLegend = L.control({ position: "bottomleft" });

  colorLegend.onAdd = function (map: L.Map) {
    const div = L.DomUtil.create("div", "legend");

    // Create and append colorBar div
    const colorBar = L.DomUtil.create("div", "", div);
    colorBar.id = "colorBar";
    colorBar.style.backgroundImage = `linear-gradient(to right, ${colorScale(0)}, ${colorScale(1 / 6)}, ${colorScale((1 / 6) * 2)}, ${colorScale((1 / 6) * 3)}, ${colorScale((1 / 6) * 4)}, ${colorScale((1 / 6) * 5)}, ${colorScale(1)})`;
    colorBar.style.width = "${310-20}px";
    colorBar.style.height = "10px";
    colorBar.style.position = "relative";

    // Add triangles outside the colorBar
    const leftTriangle = L.DomUtil.create("div", "", div);
    leftTriangle.style.position = "absolute";
    leftTriangle.style.top = "15px";
    leftTriangle.style.left = `${10}px`;
    leftTriangle.style.width = "0";
    leftTriangle.style.height = "10px";
    leftTriangle.style.borderTop = "5px solid transparent";
    leftTriangle.style.borderBottom = "5px solid transparent";
    leftTriangle.style.borderRight = "5px solid grey";

    const rightTriangle = L.DomUtil.create("div", "", div);
    rightTriangle.style.position = "absolute";
    rightTriangle.style.top = "15px";
    rightTriangle.style.right = `${10}px`;
    rightTriangle.style.width = "0";
    rightTriangle.style.height = "0";
    rightTriangle.style.borderTop = "5px solid transparent";
    rightTriangle.style.borderBottom = "5px solid transparent";
    rightTriangle.style.borderLeft = "5px solid darkred";

    // Create and append legendMarker div
    const legendMarker = L.DomUtil.create("div", "", div);
    legendMarker.id = "legendMarker";
    legendMarker.style.width = "300px";
    legendMarker.style.textAlign = "center";
    legendMarker.style.fontSize = "12px";
    legendMarker.style.position = "relative";
    legendMarker.style.marginTop = "5px";
    legendMarker.style.padding = "0 20px";

    // Add labels for each tick mark
    for (let i = 0; i <= 6; i++) {
      const value = (i / 6).toFixed(1);
      const p = L.DomUtil.create("p", "", legendMarker);
      p.innerText = value;
      p.style.display = "inline-block";
      p.style.width = `${(i / 6) * 100}%`;
      p.style.textAlign = "center";
      p.style.position = "absolute";
      p.style.left = `${(i / 6) * 100}%`;
      p.style.transform = "translateX(-50%)";
      p.style.marginBottom = "10px";
      p.style.fontSize = "0.9em";
    }

    // Create line indicating the color scale from blue to red
    const gradientLine = L.DomUtil.create("div", "", div);
    gradientLine.style.backgroundImage = `linear-gradient(to right, rgb(0, 255, 0), rgb(255, 0, 0))`;
    gradientLine.style.width = "310px";
    gradientLine.style.height = "10px";
    gradientLine.style.marginTop = "25px";

    // Add labels for the start and end of the gradient line
    const labels = L.DomUtil.create("div", "", div);
    labels.style.display = "flex";
    labels.style.justifyContent = "space-between";
    labels.style.width = "310px";
    labels.style.marginTop = "5px";
    labels.innerHTML = `<span>Start</span><span>End</span>`;

    div.style.padding = "15px";
    div.style.backgroundColor = "white";
    div.style.borderRadius = "5px";
    div.style.fontSize = "0.8em";
    div.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.5)";
    div.style.textAlign = "center";

    return div;
  };

  return colorLegend;
}

const CustomMapLayer: React.FC = () => {
  const map = useMap();
  const { setMap } = useMapContext();

  React.useEffect(() => {
    if (!map) return;

    // Function to remove all controls from the map
    const removeAllControls = () => {
      map.eachLayer((layer: L.Layer) => {
        if (layer instanceof L.Control) {
          map.removeControl(layer);
        }
      });
    };

    const basemapUrl =
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    const basemapLayer = L.tileLayer(basemapUrl, {
      noWrap: true,
      tileSize: 256,
      errorTileUrl: "",
      errorTileTimeout: 5000,
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    });

    var Stadia_StamenTonerLabels = L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.{ext}",
      {
        noWrap: true,
        minZoom: 0,
        maxZoom: 20,
        ext: "png",
      },
    );

    map.addLayer(basemapLayer);
    map.addLayer(Stadia_StamenTonerLabels);

    createColorLegend().addTo(map);

    map.setMinZoom(1);
    map.setMaxZoom(19);
    map.setMaxBounds([
      [-400, -400],
      [400, 400],
    ]);

    // Project control
    const githubControl = L.control({ position: "bottomright" });
    githubControl.onAdd = () => {
      const div = L.DomUtil.create("div", "github-link");
      div.innerHTML = `
    <a href="https://github.com/rell/man" target="_blank" style="display: flex; align-items: center; background: white; padding: 5px; border-radius: 5px;">
      <img src="https://github.githubassets.com/assets/GitHub-Logo-ee398b662d42.png" alt="GitHub" style="width: auto; height: 10px; margin-right: 8px;">
      MAN Download Project
    </a>
  `;
      div.style.marginBottom = "10px";
      return div;
    };

    const attributionControl = L.control
      .attribution({ position: "bottomright" })
      .addAttribution(" ")
      .setPrefix('<a href="https://leafletjs.com/">Leaflet</a>')
      .addTo(map);

    githubControl.addTo(map);
    setMap(map);

    return () => {
      map.removeLayer(basemapLayer);
      map.removeLayer(Stadia_StamenTonerLabels);
      removeAllControls();
    };
  }, [map, setMap]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom }) => {
  return (
    <Container fluid style={{ padding: "0" }} className={styles.mapContainer}>
      <MapContainer
        // @ts-ignore
        center={center}
        zoom={zoom}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <CustomMapLayer />
      </MapContainer>
    </Container>
  );
};

export default MapComponent;