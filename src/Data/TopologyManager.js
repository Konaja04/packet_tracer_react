import Router from "../Domain/Entities/RouterClass";
import Switch from "../Domain/Entities/SwitchClass";
import Pc from "../Domain/Entities/PcClass";
class TopologyManager {
  constructor() { }
  createDevice(deviceType, nombre) {
    let device;
    if (deviceType === "router") {
      device = new Router(nombre);
    } else if (deviceType === "switch") {
      device = new Switch(nombre);
    } else if (deviceType === "pc") {
      device = new Pc(nombre);
    } else {
      throw new Error("Dispositivo desconocido");
    }
    return device;
  }

  connectDevices = (interfaz1, device1, interfaz2, device2, distancia = 1) => {
    device1.addVecino(interfaz1, device2, distancia);
    device2.addVecino(interfaz2, device1, distancia);
  };

  deleteDevice = (topology, nombre) => {
    topology.deleteDevice(nombre);
  };
}
export default TopologyManager;
