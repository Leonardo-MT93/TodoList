const { response } = require("express");
const { uploadFile } = require("../helpers");
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL); //Autenticacion en cloudinary
const { User } = require("../models");

const updateImgCloudinary = async (req, res = response) => {
    const { id } = req.params;
  
    let model;
    model = await User.findById(id);
        if (!model) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${id}`,
          });
        }
  
    //Limpieza de imagenes previas:
  
    if(model.img){
      //Hay que borrar la imagen del servidor de CLOUDINARY - Extraemos el ID de la imagen
      const nombreArr = model.img.split('/');
      const nombre = nombreArr[nombreArr.length-1];
      const [public_id] = nombre.split('.');
       cloudinary.uploader.destroy(public_id)
      
    }
    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)//Le enviamos el filetemporalpath de nuestra imagen
  
    model.img = secure_url;
  
    await model.save();
  
    res.json(model);
  };

  const cargarArchivo = async (req, res = response) => {


    //Quiero subir extensiones txt o md
  
    try {
      // const path = await uploadFile(req.files, ['txt', 'md'], 'textos');
      const path = await uploadFile(req.files, undefined, "imgs"); //No envio extensiones porque voya subir imagenes = undefined, y la subcarpeta sera = imgs
      res.json({
        nombre: path,
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  };

  module.exports = {
    updateImgCloudinary,
    cargarArchivo
  }