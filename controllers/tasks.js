const {response} = require('express');
const Task = require('../models/task');



const getTasks = async(req, res = response) => {
    const { id } = req.params;
    try {
      const tasks = await Task.find({ user: id });
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las tareas' });
    }
}


const createTask = async(req ,res = response) => {
    const name = req.body.name.toUpperCase();

    const taskDB = await Task.findOne({name})

    if(taskDB){
        return res.status(400).json({
            msg: `La tarea ${taskDB.name}, ya existe `
        });
    }

    const description = req.body.description;

    //Generar la data a guardar
    const data = {
        name, 
        user: req.user._id,
        description
    }
    const newTask = new Task(data);
    //Guardar db

    await newTask.save();

    res.status(200).json(newTask);
}

// const actualizarProducto = async(req, res = response) => {
//     const {id} = req.params;
//     const {estado, usuario, ...data} = req.body;
//     data.nombre = data.nombre.toUpperCase();
//     const name = data.nombre;
//     data.usuario = req.user._id; //ID DEL USUARIO QUE ESTA ACTUALIZANDO
//     const producto = await Product.findOne({nombre: name})

//     if(producto){
//         return res.status(400).json({
//             msg: `El producto ${producto.nombre}, ya existe.`
//         });
//     }
//     const categoria = data.categoria.toUpperCase();
//     const categoriaDB = await Category.findOne({nombre: categoria})
//     if(!categoriaDB){
//         return res.status(400).json({
//             msg: `La categoria ${categoria} no existe.`
//         });
//     }
//     data.categoria = categoriaDB._id;
//     //AGREGAMOS {new:true} para que nos devuelva el valor actualziado
//     const productoUpdated = await Product.findByIdAndUpdate(id, data, {new:true} ).populate('user', 'nombre');
    
//     res.json({
//         productoUpdated
//     });
// }

// const borrarProducto = async(req, res = response) => {
//     const {id} = req.params;
//     //AGREGAMOS {new:true} para que nos devuelva el valor actualziado
//     const productoBorrado = await Product.findByIdAndUpdate(id, {estado: false}, {new:true} );
    
//     res.json(productoBorrado);
// }


module.exports = {
    createTask,
    getTasks,
    // obtenerProducto,
    // actualizarProducto,
    // borrarProducto
}