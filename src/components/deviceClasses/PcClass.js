import InterfaceClass from "./Interface/InterfaceClass";
import DeviceClass from "./DeviceClass";
class PcClass extends DeviceClass {
  constructor(nombre) {
    super(nombre);
    this.interfaces = {
      "FastEthernet0/1": new InterfaceClass("FastEthernet0/1"),
    };
  }

  setGateway(gateway) {
    this.interfaces["FastEthernet0/1"].gateway = gateway;
  }

  setMascara(mascara) {
    this.interfaces["FastEthernet0/1"].mascara = mascara;
  }

  setIp(ip) {
    this.interfaces["FastEthernet0/1"].ip = ip;
  }

  addVecino(interfaz, dispositivo, distancia = 0) {
    if (interfaz in this.interfaces && !this.interfaces[interfaz].ocupada) {
      super.addVecino(interfaz, dispositivo, distancia);
      this.interfaces[interfaz].ocupada = true;
    } else {
      throw new Error(`Interface ${interfaz} no existe o ya está ocupada`);
    }
  }

  getInfo() {
    let info = super.getInfo();
    info["Interfaz"] = this.interfaces[0].getInfo();
    return info;
  }
  buscarDispositivo(origen, destinationIp) {
    if (this.interfaces["FastEthernet0/1"].ip === destinationIp) {
      console.log(`En ${this.nombre}`);
      const replyMessage = `Reply from pc ${this.nombre} ${this.interfaces["FastEthernet0/1"].ip}: bytes=32 time<1ms TTL=128`;
      return [replyMessage, true];
    } else {
      try {
        let dispositivoConectado = this.vecinos[this.interfaces["FastEthernet0/1"].nombre];
        if (dispositivoConectado) {
          if (origen !== dispositivoConectado) {
            return dispositivoConectado.buscarDispositivo(this, destinationIp);
          } else {
            return ["No se puede buscar en el mismo dispositivo", false];
          }
        } else {
          return [`Request timeout for ${destinationIp}`, false];
        }
      } catch (error) {
        console.log(`ERROR 1 en ${this.nombre}`);
        return [`Error: ${error.message}`, false];
      }
    }
  }


  ping(destinationIp) {
    return this.buscarDispositivo(this, destinationIp);
  }

  toString() {
    let interfacesStr = Object.values(this.interfaces)
      .map((interfaz) => interfaz.toString())
      .join("\n    ");
    return `PC(\n    nombre=${this.nombre},\n    ${interfacesStr}\n)   Dispositivo_Conectado: ${this.vecinos}\n Distancias:\n    ${this.distancias}`;
  }
}
export default PcClass;
