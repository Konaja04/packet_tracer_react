// src/components/DeviceList.js
import React from "react";
import DeviceListItem from "./DeviceListItem";
import "./DeviceList.css";

// Import images for devices
import pcImage from "./images/PC.png";
import routerImage from "./images/Router.png";
import switchImage from "./images/Switch.png";

const DeviceList = () => {
  const devices = [
    { type: "pc", name: "", image: pcImage, width: 67, height: 52 },
    { type: "router", name: "", image: routerImage, width: 72, height: 54 },
    { type: "switch", name: "", image: switchImage, width: 90, height: 35 },
  ];

  return (
    <div className="device-list">
      {devices.map((device, index) => (
        <DeviceListItem key={index} {...device} />
      ))}
    </div>
  );
};

export default DeviceList;
