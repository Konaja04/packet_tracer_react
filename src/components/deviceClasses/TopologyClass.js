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
  obtenerRedDesdeIpYMascara(ip, mascara) {
    let ipBin = this.ipToBinary(ip);
    let mascaraBin = this.ipToBinary(mascara);
    let redBin = ipBin & mascaraBin;
    return this.binaryToIp(redBin);
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
