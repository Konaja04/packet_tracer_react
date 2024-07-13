import React, { useState, useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from "react";
import { useDrop } from "react-dnd";
import "./Canvas.css";
import Cable from "./Cable";
import PCComponent from "./PcComponent";
import RouterComponent from "./RouterComponent";
import SwitchComponent from "./SwitchComponent";
import Topology from "./deviceClasses/TopologyClass";
import TopologyManager from "./deviceClasses/TopologyManager";
import { height, width } from "@mui/system";
const Canvas = forwardRef(({ cableMode }, ref) => {
  let topology = new Topology();
  let topologyManager = new TopologyManager();
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
      ref.current.guardarTopo();
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

      ref.current.guardarTopo();
    },
  });
  const createDevice = (deviceType, count) => {
    let device;
    switch (deviceType) {
      case "router":
        device = topologyManager.createDevice(topology, "router", `Router${count}`);
        break;
      case "pc":
        device = topologyManager.createDevice(topology, "pc", `PC${count}`);
        break;
      case "switch":
        device = topologyManager.createDevice(topology, "switch", `Switch${count}`);
        break;
      default:
        throw new Error("Tipo de dispositivo desconocido");
    }
    return device;
  };


  const addDeviceToCanvas = (device, position) => {

    const countMap = {
      router: [lastRouterCount, setLastRouterCount],
      pc: [lastPcCount, setLastPCCount],
      switch: [lastSwitchCount, setLastSwitchCount],
    };
    const [count, setCount] = countMap[device.type];
    const newDevice = createDevice(device.type, count);
    setCount(count + 1)
    setDevices((prevDevices) => [
      ...prevDevices,
      {
        deviceClass: newDevice,
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
    ref.current.guardarTopo();
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
  // SAVE TOPO XD
  useImperativeHandle(ref, () => ({
    guardarTopo(download = false) {
      sessionStorage.clear()
      const dispositivos = devices.map((device) => {
        return {
          id: device.id,
          width: device.width,
          height: device.height,
          image: device.image,
          type: device.type,
          x: device.x,
          y: device.y,
          configuraciones: device.deviceClass.getConfig(),
        };
      });

      const topoData = {
        dispositivos,
        cables,
      };
      console.log(topoData)
      const jsonTopoData = JSON.stringify(topoData);
      sessionStorage.setItem("TOPO", jsonTopoData)
      if (download === true) {
        const blob = new Blob([jsonTopoData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "topologia.json";
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    cargarTopo(archivo = null) {
      let topoData
      if (archivo !== null) {
        const data = archivo
        topoData = data
        sessionStorage.setItem("TOPO", topoData)
      } else {
        const data = sessionStorage.getItem("TOPO");
        topoData = JSON.parse(data);
      }
      if (topoData !== null) {
        const devices2 = topoData.dispositivos
        const cableados = topoData.cables
        let contaPC = 0;
        let contaRouter = 0;
        let contaSwitch = 0;

        let max = 0
        const newDevices = [];
        devices2.forEach((device) => {
          max = Math.max(max, device.id);
          let newDevice
          if (device.type === "pc") {
            newDevice = createDevice("pc", contaPC)
            const pcIp = device.configuraciones.ip
            newDevice.setIp(pcIp)
            const pcMascara = device.configuraciones.mascara
            newDevice.setMascara(pcMascara)
            const pcGateway = device.configuraciones.gateway
            newDevice.setGateway(pcGateway)
            contaPC = contaPC + 1
          }
          else if (device.type === "router") {
            newDevice = createDevice("router", contaRouter)
            const configuracionesInterfaces = device.configuraciones.interfaces
            configuracionesInterfaces.forEach((config) => {
              newDevice.configurarInterface(config.nombre, config.ip, config.mascara)
            })
            const configuracionesTabla = device.configuraciones.tabla
            configuracionesTabla.forEach((row) => {
              newDevice.agregarRutaEstatica(row.destino, row.destinoMascara, row.salto)
            })
            contaRouter = contaRouter + 1
          }
          else {
            newDevice = createDevice("switch", contaSwitch)
            contaSwitch = contaSwitch + 1
          }
          newDevices.push({
            deviceClass: newDevice,
            image: device.image,
            width: device.width,
            height: device.height,
            type: device.type,
            x: device.x,
            y: device.y,
            id: device.id,
          });
        });

        setDevices(newDevices);  // Actualiza el estado de los dispositivos
        setLastID(max + 1)
        setLastPCCount(devices2.filter(x => x.type === "pc").length)
        setLastRouterCount(devices2.filter(x => x.type === "router").length)
        setLastSwitchCount(devices2.filter(x => x.type === "switch").length)
        setCables(cableados);  // Actualiza el estado de los cables

        cableados.forEach((conexion) => {
          const fromDevice = newDevices.find((d) => d.id === conexion.from.id);
          const toDevice = newDevices.find((d) => d.id === conexion.to.id);
          topologyManager.connectDevices(
            conexion.from.interface,
            fromDevice.deviceClass,
            conexion.to.interface,
            toDevice.deviceClass
          );
        });
      }

    },
    borrarTodo() {
      sessionStorage.clear()
    },
    runDijkstra() {
      console.log("XDDDDDD")
      topology.runDijkstra()
    }
  }));
  return (
    <div ref={combinedRef} className="canvas" >
      {
        devices.map((device) => {
          const renderDeviceComponent = (device) => {
            switch (device.type) {
              case "router":
                return (
                  <RouterComponent
                    key={device.id}
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
                    key={device.id}
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
                    key={device.id}
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
        })
      }

      < svg
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {
          cables.map((cable, index) => (
            <Cable key={index} from={cable.from} to={cable.to} />
          ))
        }
      </svg >
    </div >
  );
});


export default Canvas;
