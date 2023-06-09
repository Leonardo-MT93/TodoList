const { response } = require("express");
const bcryptjs = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL); //Autenticacion en cloudinary
const User = require("../models/user");
const { uploadFile } = require("../helpers/upload-file");
const fs = require("fs");
const path = require("path");


const getUser = async (req, res = response) => {
    const {id} = req.params;
    const user = await User.findById(id);
    res.json( user )

};

const postUser = async (req, res = response) => {
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

const putUser = async (req, res = response) => {
  //PARAMETROS Y NOMBRE DE LA RUTA = :id
  const { id } = req.params;

  const { _id, password, google, email, ...resto } = req.body;
  //TODO VALDIAR CONTRA LA BASE DE DATOS

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  try {
    const userDB = await User.findById(id);
    if (req.files && req.files.archivo) {
      // Subir nueva imagen a Cloudinary y obtener URL
      const { tempFilePath } = req.files.archivo;
      const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

      // Extraer el ID de la imagen anterior de la URL
      const public_id = userDB.img.split("/").pop().split(".")[0];
      // Eliminar la imagen anterior de Cloudinary
      await cloudinary.uploader.destroy(public_id);

      resto.img = secure_url;
    }
    const updatedUser = await User.findByIdAndUpdate(id, resto, { new: true }); // Agrega { new: true } para obtener el documento actualizado

    res.json({ user: updatedUser }); // Envia el usuario actualizado en la respuesta
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

const deleteUser = async (req, res = response) => {
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
  getUser,
  putUser,
  postUser,
  deleteUser,
};
