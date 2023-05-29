const { response } = require("express");
const bcryptjs = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL); //Autenticacion en cloudinary
const User = require("../models/user");
const { uploadFile } = require("../helpers/upload-file");
const fs = require("fs");
const path = require("path");

//Definimos que hace cada una de las rutas
const usuariosGet = async (req, res = response) => {
  // const query = req.query;
  // const {q, nombre = 'No name', apikey, page, limit} = req.query;
  const { limite = 5, desde = 0 } = req.query;
  //USUARIOS ACTIVOS CON EL ESTADO EN TRUE
  // const query = {estado : true};
  // const users = await User.find(query)
  // .skip(desde)
  // .limit(limite);

  // const total = await User.countDocuments(query);

  // SE EJECUTAN AMBAS PROMESAS EN SIMULTANEO ----- y utilizamos la DESESTRUCUTRACION ------- SUPER UTIL YA QUE SIMPLIFICAMOS EL TIEMPO A LA MITAD
  // const [total, users] = await Promise.all([
  //     User.countDocuments(query),
  //     User.find(query)
  //         .skip(desde)
  //         .limit(limite)
  // ])
  // res.json({
  //     total,
  //     users
  // });
};

const userPost = async (req, res = response) => {
  try {
    const { name, email, password } = req.body;
    const { archivo } = req.files || {}; // Verificar si req.files existe y asignar un objeto vacío por defecto

    let img;
    if (archivo) {
      // Subir imagen a Cloudinary y obtener URL
      const { tempFilePath } = archivo;
      const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
      img = secure_url;
    } else {
      // Utilizar imagen de prueba en caso de no haber enviado una imagen
      const imagePath = path.join(__dirname, "../assets/no-image.jpg");
      if (fs.existsSync(imagePath)) {
        img = imagePath;
      } else {
        throw new Error("No se encontró la imagen de prueba");
      }
    }

    const user = new User({ name, email, password, img });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB
    await user.save();

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error al procesar la solicitud" });
  }
};

const userPut = async (req, res = response) => {
  //PARAMETROS Y NOMBRE DE LA RUTA = :id
  const { id } = req.params;
  const { _id, password, google, email, ...resto } = req.body;
  //TODO VALDIAR CONTRA LA BASE DE DATOS

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const userDB = await User.findByIdAndUpdate(id, resto);

  res.json({
    userDB,
  });
};

const userDelete = async (req, res = response) => {
  try {
    const { id } = req.params; //User recibido como parametro

    const userActive = req.user.id; //User logueado

    if (id !== userActive) {
      return res
        .status(401)
        .json({ error: "No estás autorizado para eliminar esta cuenta" });
    }

    const user = await User.findByIdAndDelete(id); // NO DEBEMOS ELIMINAR COMPLETAMENTE AL USUARIO DE NUESTRA BD

    res.json({
      usereliminado: user,
    });
  } catch (error) {
    throw new error(error);
  }
};
module.exports = {
  // usuariosGet,
  userPut,
  userPost,
  userDelete,
};
