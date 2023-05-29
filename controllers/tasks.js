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

const updateTask = async(req, res = response) => {
    const {id} = req.params;
    const {date, user, ...data} = req.body;
    data.name = data.name.toUpperCase();
    const newName = data.name;
    const repeatedTask = await Task.findOne({name: newName})

    if(repeatedTask){
        return res.status(400).json({
            msg: `El producto ${data.name}, ya existe.`
        });
    }
    data.name = newName;

    const updatedTask = await Task.findByIdAndUpdate(id, data, {new:true});
    
    res.json({
        updatedTask
    });
}

const deleteTask = async(req, res = response) => {
    const {id} = req.params;
    const deletedTask = await Task.findByIdAndDelete(id, {new:true} );
    
    res.json(deletedTask);
}


module.exports = {
    createTask,
    getTasks,
    // obtenerProducto,
    updateTask,
    deleteTask
}