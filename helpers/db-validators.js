// const { Category, Product } = require('../models');
const Task = require('../models/task');
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


const existTask = async(id) => {
    const task = await Task.findById(id);
    if(!task){
        throw new Error(`La tarea con id: ${id} no existe `);
    }
}

module.exports = {
    emailExist,
    existIDinUser,
    existTask,
}
