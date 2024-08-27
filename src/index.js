const { connectDB } = require("./database/connection");
const express = require("express");
const morgan= require('morgan');
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes"); 
const publiRoutes = require("./routes/publication.routes"); 
const followRoutes = require("./routes/follow.routes"); 

//Conexion de la BBDD
connectDB();

//Crear servidor node
const app = express();
const port = process.env.PORT || 4000;

//configuracion del cors
app.use(cors({
	origin: process.env.CORS_ORIGIN,
	credentials: true
}));

//Convertir los datos de raw a app/json y form-urlencoded, respectivamente
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan('dev'));


app.listen(port, () => {
	console.log('Server listening');
});


//Cargar Rutas
app.use("/api/user", userRoutes);
app.use("/api/publication", publiRoutes);
app.use("/api/follow", followRoutes);
