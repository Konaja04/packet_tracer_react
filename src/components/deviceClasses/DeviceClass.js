
class DeviceClass {
  constructor(nombre) {
    this.nombre = nombre;
    this.vecinos = {};
    this.distanciasDipositivos = {}
  }

  addVecino(interfaz, dispositivo, distancia = 0) {
    this.vecinos[interfaz] = dispositivo;
    this.distanciasDipositivos[dispositivo.nombre] = distancia;
    this.interfaces[interfaz].ocupada = true;
  }

  getInfo() {
    return {
      Nombre: this.nombre,
      Vecinos: this.vecinos,
      Distancias: this.distanciasDipositivos,
    };
  }

}

export default DeviceClass;
