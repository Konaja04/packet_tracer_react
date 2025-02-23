import DeviceClass from "./DeviceClass";
import InterfaceClass from "./InterfaceClass";
class SwitchClass extends DeviceClass {
  constructor(nombre) {
    super(nombre);
    this.interfaces = {
      "FastEthernet0/1": new InterfaceClass("FastEthernet0/1"),
      "FastEthernet0/2": new InterfaceClass("FastEthernet0/2"),
      "FastEthernet0/3": new InterfaceClass("FastEthernet0/3"),
      "FastEthernet0/4": new InterfaceClass("FastEthernet0/4"),
      "FastEthernet0/5": new InterfaceClass("FastEthernet0/5"),
      "FastEthernet0/6": new InterfaceClass("FastEthernet0/6"),
      "FastEthernet0/7": new InterfaceClass("FastEthernet0/7"),
      "FastEthernet0/8": new InterfaceClass("FastEthernet0/8"),
      "FastEthernet0/9": new InterfaceClass("FastEthernet0/9"),
      "FastEthernet0/10": new InterfaceClass("FastEthernet0/10"),
      "FastEthernet0/11": new InterfaceClass("FastEthernet0/11"),
      "FastEthernet0/12": new InterfaceClass("FastEthernet0/12"),
      "FastEthernet0/13": new InterfaceClass("FastEthernet0/13"),
      "FastEthernet0/14": new InterfaceClass("FastEthernet0/14"),
      "FastEthernet0/15": new InterfaceClass("FastEthernet0/15"),
      "FastEthernet0/16": new InterfaceClass("FastEthernet0/16"),
      "FastEthernet0/17": new InterfaceClass("FastEthernet0/17"),
      "FastEthernet0/18": new InterfaceClass("FastEthernet0/18"),
      "FastEthernet0/19": new InterfaceClass("FastEthernet0/19"),
      "FastEthernet0/20": new InterfaceClass("FastEthernet0/20"),
      "FastEthernet0/21": new InterfaceClass("FastEthernet0/21"),
      "FastEthernet0/22": new InterfaceClass("FastEthernet0/22"),
      "FastEthernet0/23": new InterfaceClass("FastEthernet0/23"),
      "FastEthernet0/24": new InterfaceClass("FastEthernet0/24"),
      "GigabitEthernet0/1": new InterfaceClass("GigabitEthernet0/1"),
      "GigabitEthernet0/2": new InterfaceClass("GigabitEthernet0/2"),
    };
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
    info["Interfaces"] = Object.fromEntries(
      Object.entries(this.interfaces).map(([nombre, interfaz]) => [
        nombre,
        interfaz.getInfo(),
      ])
    );
    return info;
  }

  buscarDispositivo(origen, destinationIp) {
    let response = ["No reply for destinationIp", false]
    for (let interfaz of Object.values(this.interfaces)) {
      if (interfaz.ocupada && origen !== this.vecinos[interfaz.nombre]) {
        let dispositivoConectado = this.vecinos[interfaz.nombre];
        const [mensaje, state] = dispositivoConectado.buscarDispositivo(this, destinationIp);
        if (state === true) {
          return [mensaje, state]
        }
      }
    }
    return response;
  }

  toString() {
    let interfacesStr = Object.values(this.interfaces)
      .map((interfaz) => interfaz.toString())
      .join("\n    ");
    return `Switch(\n    nombre=${this.nombre
      }\n    Interfaces:\n    ${interfacesStr}\n)   Dispositivos_Conectados:${this.vecinos
      }\n Distancias:\n    ${JSON.stringify(this.distancias)}`;
  }
  getConfig() {
    return [];
  }
}
export default SwitchClass;
