// const { Schema, model} = require('mongoose');

const { Schema, model } = require("mongoose");

const TaskSchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {type: String},
    date: {
        type: Date,
        default: Date.now
    }
});

TaskSchema.methods.toJSON = function(){
    const {__v, ...data} = this.toObject();
    return data;
}
const Task = model('Task', TaskSchema);
module.exports = Task;

