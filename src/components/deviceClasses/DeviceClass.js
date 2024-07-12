
class DeviceClass {
  constructor(nombre) {
    this.nombre = nombre;
    this.vecinos = {};
    this.distancias = {};
  }

  addVecino(interfaz, dispositivo, distancia = 0) {
    this.vecinos[interfaz] = dispositivo;
    this.distancias[dispositivo.nombre] = distancia;
  }

  getInfo() {
    return {
      Nombre: this.nombre,
      Vecinos: this.vecinos,
      Distancias: this.distancias,
    };
  }

}

export default DeviceClass;
