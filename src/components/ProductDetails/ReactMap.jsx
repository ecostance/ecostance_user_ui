import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";
import { useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

function MyComponent({ location }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.MAP_KEY,
  });

  const [map, setMap] = React.useState(null);
  const [zoom, setZoom] = useState(8);

  const onLoad = React.useCallback(function callback(map) {
    // const bounds = new window.google.maps.LatLngBounds(null);
    // // map.setZoom(zoom);

    // location.forEach((each) => {
    //   bounds.extend(each);
    // });

    // map.fitBounds(bounds);
    // map.panToBounds(bounds);
    map.setZoom(8);

    setMap(map);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setZoom(8);
    }, 300);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  // .location[0]?.degreeDecimal?.coordinates

  const OPTIONS = {
    minZoom: 4,
    maxZoom: 18,
  };

  return isLoaded ? (
    location.length > 0 && (
      <GoogleMap
        // options={OPTIONS}
        defaultZoom={8}
        mapContainerStyle={containerStyle}
        center={location[0]}
        zoom={zoom}
        map={map}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {location?.map((each, index) => {
          return <Marker position={each} key={index} />;
        })}
        ,{/* Child components, such as markers, info windows, etc. */}
      </GoogleMap>
    )
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
