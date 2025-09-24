const User = require('../../models/user');
const mongoose = require("mongoose");
const { ResultsTests: ResultadoTest } = require('../../models/resultsTests');
const { MoodState: EstadoDeAnimo } = require('../../models/moodState');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

// Asignar la clave secreta desde las variables de entorno
const secret = process.env.SECRET;

if (!secret) {
  throw new Error('La clave secreta (SECRET) no está definida en las variables de entorno.');
}

// Controlador para obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    if (req.auth.role !== "administrador") {
      return res.status(403).json({ error: "Acceso denegado. Solo administradores." });
    }

    const data = await User.find({});
    res.send({ status: "Ok", data });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};


// Controlador para actualizar un usuario
// Falta probar
const updateUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        await User.updateOne(
            { email: email },
            {
                $set: {
                    name,
                    password
                },
            }
        );
        res.send({ status: "Ok", data: "Updated" });
    } catch (error) {
        return res.send({ error: error });
    }
};

// Controlador para eliminar un usuario
// Falta probar

const deleteUser = async (req, res) => {
  try {
    const userFromToken = req.auth;

    // Solo administrador puede ejecutar la acción
    if (userFromToken.role !== "administrador") {
      return res
        .status(403)
        .json({ error: "No tienes permiso para eliminar usuarios." });
    }

    const userId = req.params.id;

    // Buscar usuario a eliminar
    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Evitar eliminar administradores
    if (userToDelete.role === "administrador") {
      return res
        .status(403)
        .json({ error: "No puedes eliminar a un administrador." });
    }

    // Eliminar dependencias
    await ResultadoTest.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
    await EstadoDeAnimo.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });

    // Eliminar usuario
    await User.findByIdAndDelete(userId);

    res.send({
      status: "Ok",
      data: "Usuario y todos sus registros relacionados eliminados",
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};


// Controlador para obtener un usuario aleatorio
const getRandomUser = async (req, res) => {
    try {
        const data = await User.aggregate([
            { $sample: { size: 1 } },
            { $project: { name: 1 } }
        ]);
        if (data.length > 0) {
            res.send({ status: "Ok", name: data[0].name });
        } else {
            res.send({ status: "Error", message: "No users found" });
        }
    } catch (error) {
        return res.send({ status: "Error", error: error.message });
    }
};

const getUserData = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrae el token después de 'Bearer'

    if (!token) {
        return res.status(400).send({ error: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, secret);
        const { email, role, userId } = decoded;

        // 🔹 Si no es administrador y quiere ver un usuario distinto al suyo => denegar
        if (role !== "administrador" && req.params.id && req.params.id !== userId) {
            return res.status(403).send({ error: "Acceso denegado. Solo puedes ver tus propios datos." });
        }

        // Calcular el hash del email (asegúrate de que coincida con el pre-save)
        const emailHash = crypto.createHash('sha256')
            .update(email.toLowerCase())
            .digest('hex');

        // Buscar usando el emailHash
        const data = await User.findOne({ emailHash });

        if (!data) {
            return res.status(404).send({ status: "Error", message: "Usuario no encontrado" });
        }

        res.status(200).send({ status: "Ok", data });
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).send({ error: "Token inválido" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).send({ error: "Token expirado" });
        }
        res.status(500).send({ error: error.message });
    }
};

const testUser = (req, res) => {
    if (req.user) {
        res.status(200).json({ message: 'Usuario autenticado', user: req.user });
    } else {
        res.status(401).json({ message: 'No se encontró el usuario' });
    }
};



module.exports = { getUserData, getAllUsers, updateUser, deleteUser, getRandomUser, testUser  };
