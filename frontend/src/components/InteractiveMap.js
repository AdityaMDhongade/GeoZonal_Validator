import React, { useState } from 'react';
import axios from 'axios';
import * as turf from '@turf/turf';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
  FeatureGroup,
  useMapEvents
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import styles from './InteractiveMap.module.css'; // Assuming you use this CSS file
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Use a local icon definition
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

function SearchBar() {
  const map = useMap();
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: query, format: 'json', limit: 1 },
      });
      if (res.data && res.data.length > 0) {
        const { lat, lon } = res.data[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 18);
      } else {
        alert('Location not found.');
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch}>🔍</button>
    </div>
  );
}

const InteractiveMap = ({ onDataFetch }) => {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [buildingPolygon, setBuildingPolygon] = useState(null);
  const [drawnPlotArea, setDrawnPlotArea] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false); // ✅ NEW state to track drawing mode

  const handleDrawCreated = (e) => {
    setIsDrawing(false); // ✅ exit drawing mode when finished
    const layer = e.layer;
    const latlngs = layer.getLatLngs()[0];
    const turfCoords = latlngs.map((p) => [p.lng, p.lat]);
    const polygon = turf.polygon([[...turfCoords, turfCoords[0]]]);
    const area = turf.area(polygon);
    setDrawnPlotArea(area.toFixed(2)); // Store area in local state
  };

  const handleDrawStart = () => {
    setIsDrawing(true); // ✅ prevent map clicks from firing
  };

  const fetchOsmData = async (lat, lng) => {
    const query = `
      [out:json];
      (
        way(around:100,${lat},${lng})[building];
        way(around:100,${lat},${lng})[highway];
      );
      out body; >; out skel qt;
    `;

    try {
      const { data } = await axios.get(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
      );

      const nodes = {};
      data.elements.forEach((el) => {
        if (el.type === 'node') nodes[el.id] = [el.lon, el.lat];
      });

      const ways = data.elements.filter((el) => el.type === 'way');

      let clickedBuilding = null;
      let buildingCoordsForState = null;

      for (let way of ways) {
        const coords = way.nodes.map((id) => nodes[id]).filter(Boolean);
        if (coords.length >= 3 && way.tags?.building) {
          const polygon = turf.polygon([[...coords, coords[0]]]);
          const point = turf.point([lng, lat]);
          if (turf.booleanPointInPolygon(point, polygon)) {
            clickedBuilding = polygon;
            buildingCoordsForState = coords; // store [lng, lat] coords
          }
        }
      }

      if (!clickedBuilding) {
        setBuildingPolygon(null);
        return onDataFetch({ error: 'No building found at this location.' });
      }

      setBuildingPolygon(buildingCoordsForState);

      let nearestRoad = null;
      let shortestDistance = Infinity;

      for (let way of ways) {
        if (way.tags?.highway) {
          const coords = way.nodes.map((id) => nodes[id]).filter(Boolean);
          if (coords.length < 2) continue;

          const line = turf.lineString(coords);
          let minDist = Infinity;
          const buildingPerimeter = clickedBuilding.geometry.coordinates[0];
          buildingPerimeter.forEach(([pLng, pLat]) => {
            const pt = turf.point([pLng, pLat]);
            const d = turf.pointToLineDistance(pt, line, { units: 'meters' });
            if (d < minDist) minDist = d;
          });

          if (minDist < shortestDistance) {
            shortestDistance = minDist;
            nearestRoad = way;
          }
        }
      }

      let roadData = null;
      if (nearestRoad) {
        const estimates = {
          motorway: 24,
          primary: 15,
          secondary: 12,
          tertiary: 9,
          residential: 7,
          service: 5,
        };
        const roadType = nearestRoad.tags.highway || 'Unknown';
        roadData = {
          type: roadType,
          width: nearestRoad.tags.width || estimates[roadType] || 'Unknown',
          distance: shortestDistance.toFixed(2),
        };
      } else {
        roadData = { type: 'Not found', width: 'Not found', distance: 'N/A' };
      }

      const payload = {
        location: { lat, lng },
        building: {
          area: turf.area(clickedBuilding).toFixed(2),
          coordinates: clickedBuilding.geometry.coordinates[0],
        },
        road: roadData,
        plot: drawnPlotArea ? { area: drawnPlotArea } : null,
      };

      onDataFetch(payload);
    } catch (error) {
      console.error('Error fetching OSM data:', error);
      onDataFetch({ error: 'Could not fetch map data.' });
    }
  };

  const handleMapClick = (latlng) => {
    if (isDrawing) return; // ✅ prevent fetch when drawing
    setClickedLocation(latlng);
    setBuildingPolygon(null);
    onDataFetch(null);
    fetchOsmData(latlng.lat, latlng.lng);
  };

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={[19.9975, 73.7898]}
        zoom={18}
        className={styles.mapContainer}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <SearchBar />
        <ClickHandler onClick={handleMapClick} />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleDrawCreated}
            onDrawStart={handleDrawStart}
            draw={{
              rectangle: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
            }}
          />
        </FeatureGroup>
        {clickedLocation && (
          <Marker position={clickedLocation} icon={DefaultIcon}>
            <Popup>Selected Location</Popup>
          </Marker>
        )}
        {buildingPolygon && (
          <Polygon
            positions={buildingPolygon.map(([lng, lat]) => [lat, lng])}
            pathOptions={{ color: 'red' }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
