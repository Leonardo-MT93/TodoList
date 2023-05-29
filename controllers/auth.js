const { response, json } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
// const { googleVerify } = require("../helpers/google-verify");
const { generateJWT } = require("../helpers/generateJWT");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    //Verificar si el email existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "El email no corresponde a un usuario existente",
      });
    }
    //Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "La contraseña es incorrecta no son validos",
      });
    }
    //Generar el JWT

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el admin.",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { email, name, img } = await googleVerify(id_token);
    let user = await User.findOne({ email });
    if (!user) {
      //tengo que crearlo
      const data = {
        name,
        email,
        contraseña: "LT",
        img,
        google: true,
      };
      user = new User(data);
      await user.save();
    } //else si el user ya existe

    //Generar el JWT
    const token = await generarJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token de Google no es válido",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
