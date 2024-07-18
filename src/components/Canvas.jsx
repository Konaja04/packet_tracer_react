import React, { useState, useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from "react";
import { useDrop } from "react-dnd";
import "./Canvas.css";
import Cable from "./Cable";
import PCComponent from "./PcComponent";
import RouterComponent from "./RouterComponent";
import SwitchComponent from "./SwitchComponent";
import TopologyManager from "./deviceClasses/TopologyManager";
import { Box, Button } from "@mui/material";
import RouterClass from "./deviceClasses/RouterClass";
const Canvas = forwardRef(({ cableMode }, ref) => {
  let topologyManager = new TopologyManager();
  const [lastID, setLastID] = useState(1);
  const [lastPcCount, setLastPCCount] = useState(0);
  const [lastRouterCount, setLastRouterCount] = useState(0);
  const [lastSwitchCount, setLastSwitchCount] = useState(0);
  const [scale, setScale] = useState(1);
  const [devices, setDevices] = useState([]);

  const [statistics, setStatistics] = useState({})
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
        device = topologyManager.createDevice("router", `Router${count}`);
        break;
      case "pc":
        device = topologyManager.createDevice("pc", `PC${count}`);
        break;
      case "switch":
        device = topologyManager.createDevice("switch", `Switch${count}`);
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
    const peso = Math.floor(Math.random() * 4) + 1;
    topologyManager.connectDevices(
      selectedPortFrom.fromInterface,
      fromDevice.deviceClass,
      to.toInterface,
      toDevice.deviceClass,
      peso
    );

    const fromCable = {
      id: selectedPortFrom.fromID,
      interface: selectedPortFrom.fromInterface,
      x: selectedPortFrom.fromX + 25,
      y: selectedPortFrom.fromY + 25,
    };
    const toCable = {
      id: to.toID,
      interface: to.toInterface,
      x: to.toX + 25,
      y: to.toY + 25,
    };
    addCable(fromCable, toCable, peso);
    setSelectedPortFrom(null);
    ref.current.guardarTopo();
  };

  const addCable = (from, to, peso) => {
    setCables((prevCables) => [...prevCables, { from, to, peso }]);
  };

  const combinedRef = useCallback(
    (node) => {
      canvasRef.current = node;
      listDrop(node);
      canvasDrop(node);
    },
    [listDrop, canvasDrop]
  );
  const ipToBinary = (ip) => {
    let octetos = ip.split(".").map((number) => {
      return parseInt(number, 10);
    });

    return (octetos[0] << 24) | (octetos[1] << 16) | (octetos[2] << 8) | octetos[3];
  }


  const binaryToIp = (binary) => {
    let octeto1 = (binary >>> 24) & 0xff;
    let octeto2 = (binary >>> 16) & 0xff;
    let octeto3 = (binary >>> 8) & 0xff;
    let octeto4 = binary & 0xff;
    return `${octeto1}.${octeto2}.${octeto3}.${octeto4}`;
  }
  const obtenerRedDesdeIpYMascara = (ip, mascara) => {
    let ipBin = ipToBinary(ip);
    let mascaraBin = ipToBinary(mascara);
    let redBin = ipBin & mascaraBin;
    return binaryToIp(redBin);
  }
  // SAVE TOPO XD
  useImperativeHandle(ref, () => ({
    guardarTopo(download = false) {
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
      if (dispositivos.length > 0) {
        console.log(topoData)
        const jsonTopoData = JSON.stringify(topoData);
        sessionStorage.clear()
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
      }
      console.log("GUARDAAAAAR")
    },
    cargarTopo(archivo = null) {
      let topoData
      if (archivo !== null) {
        const data = archivo
        topoData = JSON.parse(data)
        sessionStorage.setItem("TOPO", data)
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


        setDevices(newDevices);
        setLastID(max + 1)
        setLastPCCount(devices2.filter(x => x.type === "pc").length)
        setLastRouterCount(devices2.filter(x => x.type === "router").length)
        setLastSwitchCount(devices2.filter(x => x.type === "switch").length)
        const newCables = [];

        cableados.forEach((conexion) => {
          const peso = Math.floor(Math.random() * 4) + 1;
          const fromDevice = newDevices.find((d) => d.id === conexion.from.id);
          const toDevice = newDevices.find((d) => d.id === conexion.to.id);
          topologyManager.connectDevices(
            conexion.from.interface,
            fromDevice.deviceClass,
            conexion.to.interface,
            toDevice.deviceClass,
            peso
          );
          const fromCable = {
            id: conexion.from.id,
            interface: conexion.from.interface,
            x: conexion.from.x,
            y: conexion.from.y,
          };
          const toCable = {
            id: conexion.to.id,
            interface: conexion.to.interface,
            x: conexion.to.x,
            y: conexion.to.y,
          };

          newCables.push({ from: fromCable, to: toCable, peso });
        });

        setCables(newCables);
      }
    },
    borrarTodo() {
      sessionStorage.clear()
    },
    runDijkstra() {
      let iteraciones = 0
      let dijkstraTimes = {}
      let dijkstraIteraciones = {}

      for (let dispositivo of devices) {
        let classDevice = dispositivo.deviceClass
        const dijsktraStartTime = performance.now()
        classDevice.distanciasRedes = {}
        if (classDevice instanceof RouterClass) {
          for (let interfaz of Object.values(classDevice.interfaces)) {
            if (interfaz.ip !== null && interfaz.mascara !== null) {
              const red = obtenerRedDesdeIpYMascara(interfaz.ip, interfaz.mascara)
              console.log("========", red)
              classDevice.distanciasRedes[red] = 0
            }
          }
          classDevice.distanciasDipositivos[classDevice.nombre] = 0
          classDevice.routingTable = {}
          iteraciones = classDevice.dijkstra(classDevice.distanciasRedes, new Set(), 0, null, classDevice.routingTable)

          const dijsktraFinishTime = performance.now()
          dijkstraTimes[classDevice.nombre] = dijsktraFinishTime - dijsktraStartTime
          dijkstraIteraciones[classDevice.nombre] = iteraciones
        }
      }

      return {
        iteraciones: dijkstraIteraciones,
        times: dijkstraTimes
      }
    }
  }
  ));

  return (
    <div>
      <div
        ref={combinedRef}
        className="canvas"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
          width: `${100 / scale}%`,
          height: `800px`,
        }}
      >
        {" "}
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
            <Cable key={index} from={cable.from} to={cable.to} peso={cable.peso} />
          ))}
        </svg>
      </div>
    </div>
  );
});


export default Canvas;
