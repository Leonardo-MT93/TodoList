const path = require("path");
const { v4: uuidv4 } = require("uuid");

const defaultImg = "no-image.jpg";

const uploadFile = (
  files,
  extensionesPermitidas = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {
  //Trabajamos con promesa cuando queremos saber si sale bien o si sale mal

  return new Promise((resolve, reject) => {
    if (!files || Object.keys(files).length === 0) {
      // No se envió ninguna imagen, utilizar la imagen predefinida
      resolve(defaultImg);
    } else {
      const { archivo } = files;
      const nombreCortado = archivo.name.split(".");
      const extension = nombreCortado[nombreCortado.length - 1];
      //Entensiones permitidas -* Vienen como argumento

      if (!extensionesPermitidas.includes(extension)) {
        return reject(
          `La extension ${extension} no es válida. Extensiones permitidas: ${extensionesPermitidas}`
        );
      }

      const nombreTemp = uuidv4() + "." + extension;
      const uploadPath = path.join(
        __dirname,
        "../uploads/",
        carpeta,
        nombreTemp
      );

      archivo.mv(uploadPath, function (err) {
        if (err) {
          reject(err);
        }

        resolve(nombreTemp);
      });
    }
  });
};

module.exports = {
  uploadFile,
};
