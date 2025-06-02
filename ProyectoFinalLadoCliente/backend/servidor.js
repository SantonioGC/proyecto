const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

// Configuración básica de CORS
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['POST', 'GET'],
  credentials: true
}));

app.use(express.json());

// Conexión básica a MongoDB
mongoose.connect("mongodb://localhost:27017/Usuarios", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Conectado a MongoDB"))
.catch(err => console.error("Error de conexión a MongoDB:", err));

// Esquemas mínimos para MongoDB
const usuarioSchema = new mongoose.Schema({
  nombre: String,
  apellidos: String,
  correo: { type: String, unique: true },
  fecha: Date,
  contrasena: String
});

const contactoSchema = new mongoose.Schema({
  correo: String,
  contacto: String
});

// Modelos básicos
const Usuario = mongoose.model("Usuario", usuarioSchema);
const Contacto = mongoose.model("Contacto", contactoSchema);

// Ruta de contacto (sin cambios)
app.post("/contacto", async (req, res) => {
  const { correo, contacto } = req.body;

  try {
    const usuarioExistente = await Usuario.findOne({ correo });
    if (!usuarioExistente) {
      return res.status(404).json({ status: "fail", mensaje: "El correo no está registrado" });
    }

    const nuevoContacto = new Contacto({ correo, contacto });
    await nuevoContacto.save();
    
    return res.status(200).json({ status: "ok", mensaje: "Contacto guardado correctamente" });
  } catch (err) {
    console.error("Error al guardar contacto:", err);
    return res.status(500).json({ status: "fail", mensaje: "Error al guardar el contacto" });
  }
});

// Ruta de registro (solo cambio en el modelo)
app.post("/registrar", async (req, res) => {
  const { nombre, apellidos, correo, fecha, contrasena } = req.body;

  try {
    const hash = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = new Usuario({
      nombre,
      apellidos,
      correo,
      fecha,
      contrasena: hash
    });

    await nuevoUsuario.save();
    return res.status(200).json("Exito, yay!");
  } catch (err) {
    console.error("Error al registrar:", err);
    if (err.code === 11000) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }
    return res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// Ruta de acceso (sin cambios)
app.post("/acceder", async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ status: "fail", mensaje: "Correo no encontrado" });
    }

    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    if (match) {
      return res.status(200).json({
        status: "ok",
        mensaje: "Exito, yay!",
        nombre: usuario.nombre
      });
    } else {
      return res.status(401).json({ status: "fail", mensaje: "Contraseña incorrecta" });
    }
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json("Error interno en el servidor");
  }
});

// Inicio del servidor (sin cambios)
app.listen(8082, () => {
  console.log("Servidor backend en puerto 8082 (MongoDB)");
});