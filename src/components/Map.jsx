import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useConsumeContext } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import useURLPosition from "../hooks/useURLPosition";

function Map() {
  const { cities } = useConsumeContext();
  const [mapPosition, setMapPosition] = useState([40, 0]);

  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useURLPosition();

  useEffect(
    function () {
      if (!mapLat || !mapLng) return;
      setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition) setMapPosition(geolocationPosition);
    },
    [geolocationPosition]
  );
  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button
          type="position"
          onClick={() => {
            getPosition();
          }}
        >
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
        key={1}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cities.map((city) => {
          return (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={city.id}
            >
              <Popup>
                <span>{city.emoji} </span>
                <span>{city.cityName} </span>
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
