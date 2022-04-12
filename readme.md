# Presentación

Juego de tablero desarrolado en NodeJS para el backend y Bootstrap + Jquery para el frontend.

Incluye una pasarela de registro y login.

Seleccion de Avatar y Sala de juego.

Almacenamiento en memoria de los datos de usuario, ademas de almacenamiento del resto, inluyendo datos de usuario, en localStorage.

Posteriormente se realizara el juego propiamente dicho usando el framework Express y todo el almacenamiento ira a una
base de datos noSQL de tipo MongoDB.

# Instrucciones para el servidor Nodejs.

## Instalar dependencias (Express) - Escribir en terminal dentro de la ruta "G6_CodersTeam" o carpeta principal proyecto

npm install

## Iniciar servidor Nodejs/Express - Escribir en terminal dentro de la ruta "G6_CodersTeam\backend".

npm run dev

### Cerrar ese proceso desde la terminal que lo tiene activo.

Win/linux: CTRL + C

Mac: CMD + .

# Punto de entrada de la aplicación.

http://localhost:3001/

## Flujo de la aplicación

home-> registro o login -> login -> avatar -> salas -> juego
