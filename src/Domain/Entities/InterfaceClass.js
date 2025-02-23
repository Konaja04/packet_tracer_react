class InterfaceClass {
  constructor(nombre) {
    this.nombre = nombre;
    this.ip = null;
    this.mascara = null;
    this.gateway = null;
    this.ocupada = false;
  }

  configurar(ip, mascara, gateway) {
    this.ip = ip;
    this.mascara = mascara;
    this.gateway = gateway;
  }

  liberar() {
    this.ip = null;
    this.mascara = null;
    this.gateway = null;
    this.ocupada = false;
  }

  getInfo() {
    return {
      IP: this.ip,
      Máscara: this.mascara,
      Gateway: this.gateway,
      Ocupada: this.ocupada,
    };
  }

  toString() {
    return `Interface(nombre=${this.nombre}, IP=${this.ip}, Máscara=${this.mascara}, Gateway=${this.gateway}, Ocupada=${this.ocupada})`;
  }
}
export default InterfaceClass;
