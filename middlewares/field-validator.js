const { validationResult } = require("express-validator");
const Task = require("../models/task");
const getErrorMessages = (errors) => {
  return errors.map((error) => error.msg);
};

const fieldValidator = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const errorMessages = getErrorMessages(error.array());
    return res.status(400).json({ errors: errorMessages });
  }
  //Si esta todo ok, sigue con el siguiente middleware o validador
  next();
};

const fileValidator = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //tiene de nombre archivo porque asi lo tenia en mi backend
    return res.status(400).json({ msg: "No hay archivos por subir - archivo" });
  }
  next();
};

const identityValidator = (req, res, next) => {
  const { id } = req.params;

  const userActive = req.user.id; //User logueado

  if (id !== userActive) {
    return res
      .status(401)
      .json({ error: "No estás autorizado para ingresar a esta cuenta" });
  }
  next();
};

const taskIdentityValidator = async(req, res, next) => {
  const { id } = req.params;
  const task = await Task.findById(id)
  const userTask = task.user.toString(); //user creador de la tarea
  const userActive = req.user.id; //User logueado
  if (userTask !== userActive) {
    return res
      .status(401)
      .json({ error: "No estás autorizado para actualizar en esta cuenta" });
  }
  next();
};
module.exports = {
  fieldValidator,
  fileValidator,
  identityValidator,
  taskIdentityValidator
};
