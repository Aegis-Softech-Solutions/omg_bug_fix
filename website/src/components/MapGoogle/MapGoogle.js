import React from "react";
import Link from "next/link";
import styled, { keyframes } from "styled-components";
import GoogleMapReact from "google-map-react";

import { device } from "../../utils";
import iconPin from "../../assets/image/svg/map-marker.svg";

const keyBounce = keyframes`

  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-20px);
  }

`;

const MapStyled = styled.div`
  width: 100%;
  height: 500px;
  margin-bottom: 50px;

  .pin {
    display: flex;
    align-items: center;
    width: 20px;
    color: var(--main-blue);
    // animation: ${keyBounce} 0.5s infinite alternate;
  }

  @media ${device.lg} {
    margin-top: 0px;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 47%;
  }
`;

const LocationPin = () => (
  <div className="pin">
    <img src={iconPin} className="pin-icon" alt="" width="20px" />
    <span style={{ fontSize: "18px", fontWeight: "600" }}>Crystal Plaza</span>
  </div>
);

const MapGoogle = () => {
  const location = {
    lat: 19.140693,
    lng: 72.832954,
  };

  return (
    <>
      <MapStyled>
        <GoogleMapReact
          bootstrapURLKeys={{ key: `AIzaSyC0xaav_uODTCXzFJ7pH4tHaaYCYkj8EX8` }}
          defaultCenter={location}
          defaultZoom={12}
          className="h-100 w-100"
        >
          <Link href="/" target="_blank">
            <a href="https://goo.gl/maps/2SwXNP7pkdJdkthB9" target="_blank">
              <LocationPin lat={location.lat} lng={location.lng} />
            </a>
          </Link>
        </GoogleMapReact>
      </MapStyled>
    </>
  );
};

export default MapGoogle;
