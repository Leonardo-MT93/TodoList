// const { Category, Product } = require('../models');
const User = require('../models/user');


const emailExist = async(email = '') => {
    const existEmail = await User.findOne({ email });
    if(existEmail){
        throw new Error(`El correo  ${email} ya esta registrado en la DB`);
    }
} 
const existIDinUser = async(id) => {
    const existeID = await User.findById(id);
    if(!existeID){
        throw new Error(`El ID  ${id} no existe `);
    }
}

// const existeCategoria = async(id) => {
//     const existeCat = await Category.findById(id);
//     if(!existeCat){
//         throw new Error(`La Categoria con id:  ${id} no existe `);
//     }
// }

// const existeProducto = async(id) => {
//     const existeProd = await Product.findById(id);
//     if(!existeProd){
//         throw new Error(`El producto con id: ${id} no existe `);
//     }
// }

// const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
//     if(!colecciones.includes(coleccion)){
//         throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
//     }
//     return true; // Hay que agregar un return TRUE porque estamos enviando una funcion con argumentos.
// }




module.exports = {
    emailExist,
    existIDinUser,
    // existeCategoria,
    // existeProducto,
    // coleccionesPermitidas
}