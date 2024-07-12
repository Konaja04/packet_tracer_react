import React, { useState, useRef, useCallback } from "react";
import { useDrop } from "react-dnd";
import "./Canvas.css";
import Cable from "./Cable";
import PCComponent from "./PcComponent";
import RouterComponent from "./RouterComponent";
import SwitchComponent from "./SwitchComponent";
import Topology from "./deviceClasses/TopologyClass";
import TopologyManager from "./deviceClasses/TopologyManager";
const Canvas = ({ cableMode }) => {
  const topology = new Topology();
  const topologyManager = new TopologyManager();
  const [lastID, setLastID] = useState(1);
  const [lastPcCount, setLastPCCount] = useState(0);
  const [lastRouterCount, setLastRouterCount] = useState(0);
  const [lastSwitchCount, setLastSwitchCount] = useState(0);

  const [devices, setDevices] = useState([]);

  //Cable handlers
  const [cables, setCables] = useState([]);
  const [selectedPortFrom, setSelectedPortFrom] = useState(null);

  const canvasRef = useRef(null);

  const [, listDrop] = useDrop({
    accept: "LIST_DEVICE",
    drop: (item, monitor) => {
      const canvas = canvasRef.current.getBoundingClientRect();
      const offset = monitor.getClientOffset();
      const x = offset.x - canvas.left;
      const y = offset.y - canvas.top;
      addDeviceToCanvas(item, { x, y });
    },
  });

  const [, canvasDrop] = useDrop({
    accept: "CANVAS_DEVICE",
    drop: (item, monitor) => {
      const canvas = canvasRef.current.getBoundingClientRect();
      const offset = monitor.getClientOffset();
      const x = offset.x - canvas.left;
      const y = offset.y - canvas.top;
      moveDeviceOnCanvas(item, { x, y });
    },
  });
  const addDeviceToCanvas = (device, position) => {
    let newDevice;
    switch (device.type) {
      case "router":
        const newRouter = topologyManager.createDevice(
          topology,
          "router",
          `Router${lastRouterCount}`
        );
        newDevice = {
          deviceClass: newRouter,
        };
        setLastRouterCount(lastRouterCount + 1);
        break;

      case "pc":
        const newPc = topologyManager.createDevice(
          topology,
          "pc",
          `PC${lastPcCount}`
        );
        newDevice = {
          deviceClass: newPc,
        };
        setLastPCCount(lastPcCount + 1);
        break;

      case "switch":
        const newSwitch = topologyManager.createDevice(
          topology,
          "switch",
          `Switch${lastSwitchCount}`
        );
        newDevice = {
          deviceClass: newSwitch,
        };
        setLastSwitchCount(lastSwitchCount + 1);
        break;

      default:
        console.error(`Unknown device type: ${device.type}`);
        return;
    }
    setDevices((prevDevices) => [
      ...prevDevices,
      {
        ...newDevice,
        image: device.image,
        width: device.width,
        height: device.height,
        type: device.type,
        x: position.x,
        y: position.y,
        id: lastID,
      },
    ]);
    setLastID(lastID + 1);
  };

  const moveDeviceOnCanvas = (device, position) => {
    setDevices((prevDevices) =>
      prevDevices.map((d) =>
        d.id === device.id
          ? { ...d, x: position.x - 20, y: position.y - 20 }
          : d
      )
    );

    setCables((prevCables) =>
      prevCables.map((cable) => {
        if (cable.from.id === device.id) {
          return {
            ...cable,
            from: {
              ...cable.from,
              x: position.x + device.width / 2 - 20,
              y: position.y + device.height / 2 - 20,
            },
          };
        }
        if (cable.to.id === device.id) {
          return {
            ...cable,
            to: {
              ...cable.to,
              x: position.x + device.width / 2 - 20,
              y: position.y + device.height / 2 - 20,
            },
          };
        }
        return cable;
      })
    );
  };

  const handleConection = (to) => {
    const fromDevice = devices.find((d) => d.id === selectedPortFrom.fromID);
    const toDevice = devices.find((d) => d.id === to.toID);
    console.log(to)
    topologyManager.connectDevices(
      selectedPortFrom.fromInterface,
      fromDevice.deviceClass,
      to.toInterface,
      toDevice.deviceClass
    );

    const fromCable = {
      id: selectedPortFrom.fromID,
      interface: selectedPortFrom.fromInterface,
      x: selectedPortFrom.fromX,
      y: selectedPortFrom.fromY,
    };
    const toCable = {
      id: to.toID,
      interface: to.toInterface,
      x: to.toX,
      y: to.toY,
    };
    addCable(fromCable, toCable);
    setSelectedPortFrom(null);
  };

  const addCable = (from, to) => {
    setCables((prevCables) => [...prevCables, { from, to }]);
  };

  const combinedRef = useCallback(
    (node) => {
      canvasRef.current = node;
      listDrop(node);
      canvasDrop(node);
    },
    [listDrop, canvasDrop]
  );

  return (
    <div ref={combinedRef} className="canvas">
      {devices.map((device) => {
        const renderDeviceComponent = (device) => {
          switch (device.type) {
            case "router":
              return (
                <RouterComponent
                  id={device.id}
                  type={device.type}
                  x={device.x}
                  y={device.y}
                  device={device.deviceClass}
                  image={device.image}
                  width={device.width}
                  height={device.height}
                  cableMode={cableMode}
                  handleConection={handleConection}
                  selectedPortFrom={selectedPortFrom}
                  setSelectedPortFrom={setSelectedPortFrom}
                  style={{
                    position: "absolute",
                    left: device.x,
                    top: device.y,
                  }}
                />
              );
            case "pc":
              return (
                <PCComponent
                  id={device.id}
                  type={device.type}
                  x={device.x}
                  y={device.y}
                  device={device.deviceClass}
                  image={device.image}
                  width={device.width}
                  height={device.height}
                  cableMode={cableMode}
                  handleConection={handleConection}
                  selectedPortFrom={selectedPortFrom}
                  setSelectedPortFrom={setSelectedPortFrom}
                  style={{
                    position: "absolute",
                    left: device.x,
                    top: device.y,
                  }}
                />
              );
            case "switch":
              return (
                <SwitchComponent
                  id={device.id}
                  type={device.type}
                  x={device.x}
                  y={device.y}
                  device={device.deviceClass}
                  image={device.image}
                  width={device.width}
                  height={device.height}
                  cableMode={cableMode}
                  handleConection={handleConection}
                  selectedPortFrom={selectedPortFrom}
                  setSelectedPortFrom={setSelectedPortFrom}
                  style={{
                    position: "absolute",
                    left: device.x,
                    top: device.y,
                  }}
                />
              );
            default:
              return <></>;
          }
        };
        return renderDeviceComponent(device);
      })}

      <svg
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {cables.map((cable, index) => (
          <Cable key={index} from={cable.from} to={cable.to} />
        ))}
      </svg>
    </div>
  );
};

export default Canvas;
