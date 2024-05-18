import { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
export const useGeolocation = (currentStopIndex, stops) => {
  const [distance, setDistance] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [time, setTime] = useState(null);

  const calculateTime = (distance) => {
    const speed = 60; // km/h
    const hours = Math.floor(distance / speed);
    const minutes = Math.floor(((distance % speed) * 60) / speed);
    const seconds = Math.floor((((distance % speed) * 3600) / speed) % 60);
    return `${hours} hours ${minutes} minutes ${seconds} seconds`;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const geoOptions = {
        maximumAge: 500,
        timeout: 500,
        enableHighAccuracy: true,
      };
      let watcher = null;

      const updatePosition = (position) => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const nextStopPosition = stops[currentStopIndex];

        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(currentPosition),
          new google.maps.LatLng(nextStopPosition)
        );
        setDistance(distance / 1000);

        if (distance < 50) {
          setCurrentStopIndex((currentStopIndex + 1) % stops.length);
        }

        setIsMoving(distance >= 0.05); 
        setTime(calculateTime(distance / 1000));
      };

      watcher = navigator.geolocation.watchPosition(
        updatePosition,
        null,
        geoOptions
      );

      return () => watcher && navigator.geolocation.clearWatch(watcher);
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  }, [currentStopIndex, stops]);

  return { distance, isMoving, time };
};
