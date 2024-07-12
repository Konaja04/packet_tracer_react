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
  }

  configurarInterface(nombre, ip, mascara) {
    if (nombre in this.interfaces) {
      this.interfaces[nombre].configurar(ip, mascara, null);
    } else {
      throw new Error(`Interface ${nombre} no existe`);
    }
  }

  liberarInterface(nombre) {
    if (nombre in this.interfaces) {
      this.interfaces[nombre].liberar();
    } else {
      throw new Error(`Interface ${nombre} no existe`);
    }
  }

  addVecino(interfaz, dispositivo, distancia = 1) {
    if (interfaz in this.interfaces && !this.interfaces[interfaz].ocupada) {
      super.addVecino(interfaz, dispositivo, distancia);
      this.interfaces[interfaz].ocupada = true;
    } else {
      throw new Error(`Interface ${interfaz} no existe o ya está ocupada`);
    }
  }

  agregarRutaEstatica(redDestino, mascara, nextHop) {
    this.routingTable[redDestino] = {
      mascara: mascara,
      nextHop: nextHop,
    };
  }

  buscarRuta(ipDestino) {
    for (let red in this.routingTable) {
      if (this.ipEnSubred(ipDestino, red, this.routingTable[red].mascara)) {
        return this.routingTable[red].nextHop;
      }
    }
    return null;
  }

  buscarDispositivo(origen, destinationIp) {
    let response = [`Request timeout for ${destinationIp}`, false]
    for (let interfaz of Object.values(this.interfaces)) {
      if (interfaz.ip && interfaz.mascara) {
        console.log("encontre redes", this.obtenerRed(interfaz.ip, interfaz.mascara))
        if (interfaz.ip === destinationIp) {
          return [`Reply from device ${this.nombre}: bytes=32 time<1ms TTL=128 `, true];
        } else if (this.obtenerRed(interfaz.ip, interfaz.mascara) === destinationIp) {
          return [`Reply from network ${destinationIp}: bytes=32 time<1ms TTL=128 `, true];
        } else if (
          this.ipEnSubred(
            destinationIp,
            this.obtenerRed(interfaz.ip, interfaz.mascara),
            interfaz.mascara
          )
        ) {
          let dispositivoConectado = this.vecinos[interfaz.nombre];
          if (origen !== dispositivoConectado) {
            const [respuesta, state] = dispositivoConectado.buscarDispositivo(this, destinationIp);
            if (state === true) {
              return [respuesta, state]
            }
          }
        }
      }
    }

    let nextHop = this.buscarRuta(destinationIp);
    if (nextHop !== null) {
      console.log(nextHop)
      console.log('interfaz salida nombre', this.obtenerInterfazPorRed(nextHop))
      let interfazSalida = this.obtenerInterfazPorRed(nextHop);
      if (interfazSalida !== null) {
        console.log(interfazSalida)
        if (interfazSalida.ocupada === true) {
          let dispositivoConectado = this.vecinos[interfazSalida.nombre];
          if (dispositivoConectado !== null) {
            console.log('dispositivo conectado', dispositivoConectado)
            return dispositivoConectado.buscarDispositivo(this, destinationIp);
          }
        }
      }
    }
    console.log('ya fue')
    return response
  }

  obtenerInterfazPorRed(nextHop) {
    for (let interfaz of Object.values(this.interfaces)) {
      if (interfaz.ip !== null & interfaz.mascara !== null) {
        if (this.ipEnSubred(nextHop, interfaz.ip, interfaz.mascara) === true) {
          return interfaz;
        }
      }
    }
    return null;
  }

  obtenerRed(ip, mascara) {
    let ipBin = this.ipToBinary(ip);
    let redBin = this.ipToBinary(this.obtenerRedDesdeIpYMascara(ip, mascara));
    return this.binaryToIp(redBin);
  }

  ipEnSubred(ip, red, mascara) {
    let ipBin = this.ipToBinary(ip);
    let redBin = this.ipToBinary(red);
    let mascaraBin = this.ipToBinary(mascara);
    return (ipBin & mascaraBin) === (redBin & mascaraBin);
  }



  ipToBinary(ip) {
    let octetos = ip.split(".").map((number) => {
      return parseInt(number, 10);
    });

    return (octetos[0] << 24) | (octetos[1] << 16) | (octetos[2] << 8) | octetos[3];
  }


  binaryToIp(binary) {
    let octeto1 = (binary >>> 24) & 0xff;
    let octeto2 = (binary >>> 16) & 0xff;
    let octeto3 = (binary >>> 8) & 0xff;
    let octeto4 = binary & 0xff;
    return `${octeto1}.${octeto2}.${octeto3}.${octeto4}`;
  }

  obtenerRedDesdeIpYMascara(ip, mascara) {
    let ipBin = this.ipToBinary(ip);
    let mascaraBin = this.ipToBinary(mascara);
    let redBin = ipBin & mascaraBin;
    return this.binaryToIp(redBin);
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