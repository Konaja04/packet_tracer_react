import Router from "./RouterClass";

class Topology {
  constructor() {
    this.dispositivos = {};
  }

  addDevice(dispositivo) {
    if (dispositivo.nombre in this.dispositivos) {
      console.log(`El dispositivo ${dispositivo.nombre} ya existe.`);
    } else {
      console.log("Anadiendo", dispositivo.nombre)
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
  obtenerRedDesdeIpYMascara(ip, mascara) {
    let ipBin = this.ipToBinary(ip);
    let mascaraBin = this.ipToBinary(mascara);
    let redBin = ipBin & mascaraBin;
    return this.binaryToIp(redBin);
  }
  runDijkstra() {
    console.log("RUNNING DIJKSTRA")
    console.log(Object.values(this.dispositivos))
    for (let dispositivo of Object.values(this.dispositivos)) {
      console.log("XDDQDDW")
      if (dispositivo instanceof Router) {
        for (let interfaz in Object.values(dispositivo.interfaces)) {
          if (interfaz.ip && interfaz.mascara) {
            const red = this.obtenerRedDesdeIpYMascara(interfaz.ip, interfaz.mascara)
            dispositivo.distanciasRedes[red] = 0
          }
        }
        dispositivo.distanciasDipositivos[dispositivo.nombre] = 0
        dispositivo.dijkstra(dispositivo.distanciasRedes, new Set(), 0, null, dispositivo.routingTable)
        console.log(dispositivo.routingTable)
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
        console.log(dispositivo.routingTable);
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
