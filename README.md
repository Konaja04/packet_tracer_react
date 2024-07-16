# packet tracer en react

Este proyecto es un simulador de red interactivo creado con React y Javascript y MUI. permite a los usuarios diseñar, configurar y visualizar redes de computadoras de manera intuitiva.
Esta herramienta se creó con la final de obtener una mayor compresión de como funcionan los algoritmos de enrutamiento (Dijkstra) e ir un poco más allá tratando de implementarlo como funciona en la vida real.
El algoritmo de Dijkstra implementado funciona de manera recursiva directamente dentro de un router. Este algoritmo juega un papel crucial al ayudar al router a descubrir y optimizar la ruta más corta hacia todas sus redes conectadas. La recursividad permite explorar eficientemente todas las posibles rutas de red, asegurando una conectividad óptima y eficiente para todos los dispositivos conectados en la topología.

## características
- Diseño de red: arrastra y suelta dispositivos de red como routers, switches y computadoras en el área de trabajo.
- Configuración de dispositivos: permite configurar direcciones ip, máscaras y gateways asi como tablas de enrutamiento.
- Simulación de red: ejecuta simulaciones para observar el tiempo de ejecución por router para encontrar las diversas redes en la topologia.
- Asimismo, tienes acceso a un terminal tanto en PC (para hacer ping) como en Router (para configurar rutas estáticas e interfaces)
- interfaz amigable: interfaz de usuario intuitiva y fácil de usar, desarrollada con react y material-ui.
## Comandos disponibles:
En router:
  - en
  - configure terminal
  - ip route
  - interface gigabitethernet0/0 (ej.) 
  - ip address
##
En PC:
  - ping


## scripts disponibles
 https://konaja04.github.io/packet_tracer_react/
en el directorio del proyecto, puedes ejecutar:

### `npm start`

ejecuta la aplicación en modo de desarrollo.\
abre [http://localhost:3000](http://localhost:3000) para verla en tu navegador.

la página se recargará cuando hagas cambios.\
también puedes ver cualquier error de lint en la consola.
