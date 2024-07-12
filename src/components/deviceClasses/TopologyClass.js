import Router from "./RouterClass";

class Topology {
  constructor() {
    this.dispositivos = {};
  }

  addDevice(dispositivo) {
    if (dispositivo.nombre in this.dispositivos) {
      console.log(`El dispositivo ${dispositivo.nombre} ya existe.`);
    } else {
      this.dispositivos[dispositivo.nombre] = dispositivo;
    }
  }

  deleteDevice(nombre) {
    if (nombre in this.dispositivos) {
      delete this.dispositivos[nombre];
    } else {
      throw new Error("Dispositivo no encontrado en la topología.");
    }
  }

  getTopology() {
    let topo = {
      dispositivos: Object.fromEntries(
        Object.entries(this.dispositivos).map(([nombre, dispositivo]) => [
          nombre,
          dispositivo.getInfo(),
        ])
      ),
    };
    return topo;
  }

  runDijkstra() {
    for (let dispositivo of Object.values(this.dispositivos)) {
      if (dispositivo instanceof Router) {
        console.log("==============================", dispositivo.nombre);
        dispositivo.distancias[dispositivo.nombre] = 0;
        dispositivo.dijkstra(dispositivo.distancias, new Set(), 0, null);
        console.log(dispositivo.distancias);
      }
    }
  }

  runBellmanFord() {
    for (let dispositivo of Object.values(this.dispositivos)) {
      if (dispositivo instanceof Router) {
        console.log("==============================", dispositivo.nombre);
        dispositivo.distancias[dispositivo.nombre] = 0;
        const predecesores = {};
        Object.keys(this.dispositivos).forEach((dispositivo) => {
          predecesores[dispositivo] = null;
        });
        let longitud =
          Object.values(this.dispositivos).filter((d) => d instanceof Router)
            .length - 1;
        dispositivo.bellmanFord(dispositivo.distancias, predecesores, longitud);
        console.log(dispositivo.distancias);
      }
    }
  }

  toString() {
    let result = ["Topology:"];
    for (let dispositivo of Object.values(this.dispositivos)) {
      result.push(dispositivo);
    }
    return result.join("\n");
  }
}
export default Topology;
