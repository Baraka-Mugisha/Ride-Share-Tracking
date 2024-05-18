import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import myMarker from "../assets/myMarker.gif";
import { useGeolocation } from "../hooks/geolocation";
import { stops } from "../constants/stops";
import Header from "./Header";

const MapContainer = () => {
  const map = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [selectedStop, setSelectedStop] = useState(null);
  const [route, setRoute] = useState(null); // State to hold route data
  const [showRoute, setShowRoute] = useState(true); // State to toggle DirectionsRenderer

  const { distance, isMoving, time } = useGeolocation(currentStopIndex, stops);

  const apiKey = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.current.panTo(currentPosition);
      });
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  };

  useEffect(() => {
    if (scriptLoaded) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: stops[0],
          destination: stops[stops.length - 1],
          waypoints: stops.slice(1, -1).map((stop) => ({ location: stop })),
          travelMode: "DRIVING",
        },
        (result, status) => {
          if (status === "OK") {
            setRoute(result);
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    }
  }, [scriptLoaded]);

  return (
    <div>
      <Header
        distance={distance}
        time={time}
        stops={stops}
        currentStopIndex={currentStopIndex}
      />
      <LoadScript
        googleMapsApiKey={apiKey}
        onLoad={() => setScriptLoaded(true)}
      >
        {scriptLoaded && (
          <GoogleMap
            mapContainerStyle={{ height: "75vh", width: "100%" }}
            center={stops[0]}
            zoom={15}
            options={{
              gestureHandling: "greedy",
              rotateControl: true,
              fullscreenControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              scaleControl: true,
              clickableIcons: false,
              mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT,
              },
              zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER,
              },
              fullscreenControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
              },
              streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
              },
              rotateControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
              },
              compassOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
              },
            }}
            onLoad={(mapInstance) => {
              map.current = mapInstance;
              handleGeolocation();
            }}
          >
            {showRoute && route && <DirectionsRenderer directions={route} />}
            {/* {stops.map((stop, index) => (
              <Marker
                key={index}
                position={{ lat: stop.lat, lng: stop.lng }}
                icon={
                  index === 0
                    ? undefined
                    : {
                        url: myMarker,
                        scaledSize: new window.google.maps.Size(10, 10),
                      }
                }
                onClick={() => setSelectedStop(stop)}
              >
                {selectedStop === stop && (
                  <InfoWindow onCloseClick={() => setSelectedStop(null)}>
                    <div>{stop.name}</div>
                  </InfoWindow>
                )}
              </Marker>
            ))} */}
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
};

export default MapContainer;
