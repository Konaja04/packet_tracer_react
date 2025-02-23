import InterfaceClass from "./InterfaceClass";
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
    this.distanciasRedes = {}
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
      let interfazSalida = this.obtenerInterfazPorRed(nextHop);
      if (interfazSalida !== null) {
        if (interfazSalida.ocupada === true) {
          let dispositivoConectado = this.vecinos[interfazSalida.nombre];
          if (dispositivoConectado !== null) {
            return dispositivoConectado.buscarDispositivo(this, destinationIp);
          }
        }
      }
    }
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
  devolverInterfazEntrada(vecino, origen) {
    for (let interfaz of Object.values(vecino.interfaces)) {
      console.log(interfaz)
      if (vecino.vecinos[interfaz.nombre] === origen) {
        return interfaz
      }
    }
    return null
  }
  dijkstra(distancias, visitados, distAcum, salida, tabla) {
    visitados.add(this.nombre);
    let iteraciones = 0;
    try {
      for (let interfaz of Object.values(this.interfaces)) {
        if (interfaz.ip && interfaz.mascara) {
          const red = this.obtenerRed(interfaz.ip, interfaz.mascara);
          const vecino = this.vecinos[interfaz.nombre];
          iteraciones++;

          if (distAcum === 0) {
            if (vecino !== null && vecino !== undefined) {
              salida = this.devolverInterfazEntrada(vecino, this);
            }
          }

          if (!distancias.hasOwnProperty(red)) {
            distancias[red] = distAcum;
            tabla[red] = {
              mascara: interfaz.mascara,
              nextHop: salida.ip
            };
          }

          if (distancias[red] > distAcum) {
            distancias[red] = distAcum;
            tabla[red] = {
              mascara: interfaz.mascara,
              nextHop: salida.ip
            };
          }
          if (vecino !== undefined && vecino !== null) {
            if (!visitados.has(vecino.nombre) && vecino instanceof RouterClass) {
              iteraciones += vecino.dijkstra(
                distancias,
                new Set(visitados),
                distAcum + this.distanciasDipositivos[vecino.nombre],
                salida,
                tabla
              );
            }
          }
        }
      }
    } catch (error) {
      console.log(this.nombre, "ERORRRRRR ", error)
    }

    return iteraciones;
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
  getConfig() {
    let mappedRoutingTable = Object.entries(this.routingTable).map(([ip, route]) => ({
      destino: ip,
      destinoMascara: route.mascara,
      salto: route.nextHop,
    }))

    return {
      interfaces: Object.values(this.interfaces).map((iface) => ({
        nombre: iface.nombre,
        ip: iface.ip ?? "",
        mascara: iface.mascara ?? "",
        gateway: iface.gateway ?? ""
      })).filter(x => x.ip !== null || x.mascara !== null || x.gateway !== null),
      tabla: mappedRoutingTable
    }
  }
}
export default RouterClass;
