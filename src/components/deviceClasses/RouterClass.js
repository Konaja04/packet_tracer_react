import InterfaceClass from "./Interface/InterfaceClass";
import DeviceClass from "./DeviceClass";

class RouterClass extends DeviceClass {
  constructor(nombre) {
    super(nombre);
    this.interfaces = {
      "GigabitEthernet0/0": new InterfaceClass("GigabitEthernet0/0"),
      "GigabitEthernet0/1": new InterfaceClass("GigabitEthernet0/1"),
      "GigabitEthernet0/2": new InterfaceClass("GigabitEthernet0/2"),
    };
    this.routingTable = {};
    this.tablaRT={};
  }

  configurarInterface(nombre, ip, mascara) {
    if (nombre in this.interfaces) {
      this.interfaces[nombre].configurar(ip, mascara);
    } else {
      throw new Error(`Interface ${nombre} no existe`);
    }
  }

  ipEnSubred(ip, red, mascara) {
    const ipBin = this.ipToBinary(ip);
    const redBin = this.ipToBinary(red);
    const mascaraBin = this.ipToBinary(mascara);
    return (ipBin & mascaraBin) === (redBin & mascaraBin);
  }

  ipToBinary(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) | parseInt(octet, 10), 0);
  }

  dijkstra(distancias, visitados, distAcum, predecesor, predecesores) {
    visitados.add(this.nombre);
    for (let [interfaz, vecino] of Object.entries(this.vecinos)) {
      if (vecino instanceof RouterClass && vecino !== predecesor && this.estanConectados(vecino)) {
        if (!distancias.hasOwnProperty(vecino.nombre)) {
          distancias[vecino.nombre] = distAcum + this.distancias[vecino.nombre];
          predecesores[vecino.nombre] = this.nombre;
        } else if (distancias[vecino.nombre] > distAcum + this.distancias[vecino.nombre]) {
          distancias[vecino.nombre] = distAcum + this.distancias[vecino.nombre];
          predecesores[vecino.nombre] = this.nombre;
        }
        if (!visitados.has(vecino.nombre)) {
          vecino.dijkstra(distancias, new Set(visitados), distAcum + this.distancias[vecino.nombre], this, predecesores);
        }
      }
    }

    for (let router in predecesores) {
      this.routingTable[router] = {
        nextHop: predecesores[router]
      };
    }
  }

  calcularRutasOptimasDijkstra() {
    let distancias = { [this.nombre]: 0 };
    let visitados = new Set();
    let predecesores = {};

    this.dijkstra(distancias, visitados, 0, null, predecesores);

    let rutasOptimas = {};
    for (let router in this.routingTable) {
      if (router !== this.nombre) {
        let rutaOptima = [];
        let destino = router;
        while (destino in predecesores) {
          rutaOptima.push(destino);
          destino = predecesores[destino];
        }
        rutaOptima.push(this.nombre);
        rutaOptima.reverse();
        rutasOptimas[router] = rutaOptima;
      }
    }
    this.tablaRT=rutasOptimas;
    return rutasOptimas;
  }

  bellmanFord(distancias, predecesores, relaxations) {
    if (relaxations === 0) {
      return;
    }
    for (let [interfaz, vecino] of Object.entries(this.vecinos)) {
      if (vecino instanceof RouterClass && this.estanConectados(vecino)) {
        if (!distancias.hasOwnProperty(vecino.nombre)) {
          distancias[vecino.nombre] = Infinity;
        }
        if (distancias[this.nombre] + this.distancias[vecino.nombre] < distancias[vecino.nombre]) {
          distancias[vecino.nombre] = distancias[this.nombre] + this.distancias[vecino.nombre];
          predecesores[vecino.nombre] = this.nombre;
        }
      }
    }

    for (let [interfaz, vecino] of Object.entries(this.vecinos)) {
      if (vecino instanceof RouterClass) {
        vecino.bellmanFord(distancias, predecesores, relaxations - 1);
      }
    }
  }

  calcularRutasOptimasBellmanFord(numRouters) {
    let distancias = { [this.nombre]: 0 };
    let predecesores = { [this.nombre]: null };

    this.bellmanFord(distancias, predecesores, numRouters - 1);

    let rutasOptimas = {};
    for (let router in distancias) {
      if (router !== this.nombre) {
        let rutaOptima = [];
        let destino = router;
        while (destino in predecesores && predecesores[destino] !== null) {
          rutaOptima.push(destino);
          destino = predecesores[destino];
        }
        rutaOptima.push(this.nombre);
        rutaOptima.reverse();
        rutasOptimas[router] = rutaOptima;
      }
    }
    return rutasOptimas;
  }

  estanConectados(otroRouter) {
    for (let [interfaz1, vecino1] of Object.entries(this.vecinos)) {
      if (vecino1 === otroRouter) {
        for (let [interfaz2, vecino2] of Object.entries(otroRouter.vecinos)) {
          if (vecino2 === this) {
            return true;
          }
        }
      }
    }
    return false;
  }

  tieneIpConfigurada(interfaz) {
    return this.interfaces[interfaz].ip !== null && this.interfaces[interfaz].mascara !== null;
  }



  getInfo() {
    let info = super.getInfo();
    info["Interfaces"] = Object.fromEntries(
      Object.entries(this.interfaces).map(([nombre, interfaz]) => [
        nombre,
        interfaz.getInfo(),
      ])
    );
    info["Routing Table"] = this.routingTable;
    return info;
  }

  toString() {
    let interfacesStr = Object.values(this.interfaces)
      .map((interfaz) => interfaz.toString())
      .join("\n    ");
    return `Router(\n    nombre=${this.nombre}\n    Interfaces:\n    ${interfacesStr}\n)   Dispositivos_Conectados:${this.vecinos}\n Distancias:\n    ${this.distancias}`;
  }
}
export default RouterClass;
