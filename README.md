SOBRE LA APLICACIÓN WEB
------------------------
La aplicación esta desarrollada con el MERN Stack y autenticación con JWT. 
Este proyecto nació con el curso de Master en React de Victor Robles.

La estructura basica del backend esta desarrollada mediante el curso con modificaciones hechas por mi,
añadidiendo funcionalidades a los diferentes controladores, validacion de datos con la libreria ZOD, almacenamiento del token en cookies, etc...

La maquetación basica esta de hecha por el instructor Victor Robles, he ido añadiendo codigo de HTML y CSS a medida que he ido desarrollando el frontend.

Y por ultimo todo el desarrollo del frontend esta hecho enteramente por mi.


PASOS PARA EL FUNCIONAMIENTO
----------------------------

1. git clone https://github.com/AlfonsoAguor/redSocial
2. cd redSocial
3. npm install
4. touch .env
5. npm run start
6. cd client
7. npm install
8. npm start o npm run dev


CONFIGURACIÓN DEL FICHERO .ENV
------------------------------

EL fichero .en debera contener la siguiente configuración
MONGODB_URI="Direccion de MongoDBs"
PORT="Puerto"
SECRET_TOKEN="Contraseña para byscript"
CORS_ORIGIN="Direccion del Frontend"

EJEMPLO -->

MONGODB_URI=mongodb://127.0.0.1:27017/red_social
PORT=4000
SECRET_TOKEN=ClaveSuperMegaSecretaParaMiRedSocial@1234
CORS_ORIGIN=http://localhost:5173 


CONFIGURACION AXIOS
---------------------
El fichero a modificar estaria en client/src/helpers/axios.js

En el tendremos la variable baseURL, añadiremos nuestra direccion del mongoDB con el puerto asignado 
para poder hacer las consultas necesarias y añadir "/api". Quedando de la siguiente manera "direccion:puerto/api"
Si queremos eliminar "/api" lo haremos en el fichero src/index.js

Ejemplo:
En mi caso lo tengo en el puerto 4000, por lo que quedaria baseURL: 'http://localhost:4000/api'


FUNCIONALIDADES DE LA APLIACIÓN WEB
-------------------------------------
En ella podremos crear un nuevo usuario o loguearnos con el. En el formulario encontraremos datos opcionales y obligatorios, 
por ejemplo la contraseña que nos pedira un minimo de 6 caracters, tambien sera obligatorio introducir un caracter y un numero.

Gracias a la autenticación con JWT tendremos una parte publica, donde estara el login y el registro. 
Y un parte privada para cada usuario, a la cual no podra acceder nadie.

El usuario podra ver un listado de todos los usuarios registrados y seguirlos.
Cada uno de ellos tendra una pagina de usuarios seguidos y seguidores, que podremos ver.
Un feed con todas las publicaciones de los usuarios a los que seguimos, ademas de poder publicar nuestras proppias publicaciones.
Estas ultimas podremos eliminarlas.
El usuario tambien podrá modificar su perfil, contraseña y avatar. 
Tambien podrá eliminar su usuario, eliminando todos sus follows y publicaciones con ello.
En el caso de que el usuario cambie el avatar o elimine una publicación con imagen, estas seran eliminadas del servidor.